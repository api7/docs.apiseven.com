#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import COS from 'cos-nodejs-sdk-v5';

const execFileAsync = promisify(execFile);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ImageLinkInfo {
  url: string;
  file: string;
  line: number;
}

interface BrokenImageInfo extends ImageLinkInfo {
  error: string;
  isTransient?: boolean;
  errorType?: '404' | '403' | '5xx' | 'timeout' | 'network' | 'unknown';
}

interface CheckReport {
  checkedAt: string;
  totalFiles: number;
  scannedFiles: number;
  totalLinks: number;
  uniqueUrls: number;
  checkedUrls: number;
  brokenCount: { total: number; missing: number; forbidden: number; transient: number };
  incomplete: boolean;
  incompleteReason?: string;
  brokenImages: BrokenImageInfo[];
}

class ImageLinkChecker {
  private readonly TIMEOUT = 15000;
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 1000;
  private readonly CONCURRENCY = 5;
  private readonly MAX_RUNTIME = 50 * 60 * 1000; // 50 minutes

  private readonly projectRoot: string;
  private readonly imageUrlRegex: RegExp;
  private readonly cosClient: any;
  private readonly cosBucket: string;
  private readonly cosRegion: string;
  private readonly cosCdnUrls: string[];
  private readonly ignoreDirs = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.nyc_output', 'logs', 'scripts'];
  private readonly supportedExtensions = ['.md', '.mdx'];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;

    const required = ['COS_SECRET_ID', 'COS_SECRET_KEY', 'COS_BUCKET', 'COS_REGION', 'COS_CDN_URL'];
    const missing = required.filter(v => !process.env[v]);
    if (missing.length > 0) {
      console.error('❌ Missing environment variables:', missing.join(', '));
      process.exit(1);
    }

    this.cosBucket = process.env.COS_BUCKET!;
    this.cosRegion = process.env.COS_REGION!;
    this.cosCdnUrls = process.env.COS_CDN_URL!.split(',').map(u => u.trim()).filter(Boolean);
    this.cosClient = new COS({ SecretId: process.env.COS_SECRET_ID, SecretKey: process.env.COS_SECRET_KEY });

    // Build regex to match CDN URLs
    const pattern = this.cosCdnUrls.map(u => u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    this.imageUrlRegex = new RegExp(`(${pattern})[^\\s)\"'\`\\]}>]+`, 'g');

    console.log(`🔧 Checking COS bucket: ${this.cosBucket}, CDN: ${this.cosCdnUrls.join(', ')}`);
  }

  private shouldIgnore(filePath: string): boolean {
    const rel = path.relative(this.projectRoot, filePath);
    return this.ignoreDirs.some(dir => rel.includes(dir));
  }

  private isSupportedFile(filePath: string): boolean {
    return this.supportedExtensions.includes(path.extname(filePath).toLowerCase());
  }

  /**
   * Recursively get all files to scan
   */
  private async getAllFiles(dir: string): Promise<string[]> {
    const rgFiles = await this.getAllFilesWithRipgrep(dir);
    if (rgFiles !== null) {
      return rgFiles;
    }

    const files: string[] = [];

    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (this.shouldIgnore(fullPath)) {
          continue;
        }

        if (entry.isDirectory()) {
          const subFiles = await this.getAllFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile() && this.isSupportedFile(fullPath)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Cannot read directory ${dir}:`, error);
    }

    return files;
  }

  private async getAllFilesWithRipgrep(dir: string): Promise<string[] | null> {
    const args = ['--files', '--hidden', '--no-ignore'];
    this.supportedExtensions.forEach(ext => args.push('-g', `*${ext}`));
    this.ignoreDirs.forEach(d => args.push('-g', `!**/${d}/**`));

    try {
      const { stdout } = await execFileAsync('rg', args, { cwd: dir, maxBuffer: 20 * 1024 * 1024 });
      return stdout.split('\n').filter(Boolean).map(f => path.resolve(dir, f.trim()));
    } catch {
      return null; // Fall back to directory walk
    }
  }

  private extractImageLinks(content: string, filePath: string): ImageLinkInfo[] {
    const links: ImageLinkInfo[] = [];
    const lines = content.split('\n');
    const file = path.relative(this.projectRoot, filePath);

    lines.forEach((line, index) => {
      const matches = line.match(this.imageUrlRegex);
      if (matches) {
        matches.forEach(url => {
          const cleanUrl = url.replace(/["\'\`\]\}>]+$/, '');
          try {
            new URL(cleanUrl);
            links.push({ url: cleanUrl, file, line: index + 1 });
          } catch { /* skip invalid URLs */ }
        });
      }
    });
    return links;
  }

  private extractCosKey(url: string): string {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.startsWith('/') ? pathname.slice(1) : pathname);
  }

  private classifyError(err: any): { errorType: BrokenImageInfo['errorType']; isTransient: boolean; message: string } {
    const status = err?.statusCode;
    const code = err?.code?.toLowerCase() || '';

    if (status === 404) return { errorType: '404', isTransient: false, message: 'Not found' };
    if (status === 403) return { errorType: '403', isTransient: false, message: 'Access denied' };
    if (status >= 500) return { errorType: '5xx', isTransient: true, message: `Server error ${status}` };
    if (['econnreset', 'econnrefused', 'enotfound', 'etimedout'].includes(code)) {
      return { errorType: 'network', isTransient: true, message: 'Network error' };
    }
    if (code === 'timeout' || err?.message?.includes('timeout')) {
      return { errorType: 'timeout', isTransient: true, message: 'Timeout' };
    }
    return { errorType: 'unknown', isTransient: true, message: err?.message || 'Unknown error' };
  }

  private checkImageExistsSingle(url: string): Promise<{ exists: boolean; error?: string; errorType?: BrokenImageInfo['errorType']; isTransient?: boolean }> {
    const cosKey = this.extractCosKey(url);
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => resolve({ exists: false, error: 'Timeout', errorType: 'timeout', isTransient: true }), this.TIMEOUT);
      this.cosClient.headObject({ Bucket: this.cosBucket, Region: this.cosRegion, Key: cosKey }, (err: any) => {
        clearTimeout(timeoutId);
        if (err) {
          const { errorType, isTransient, message } = this.classifyError(err);
          resolve({ exists: false, error: message, errorType, isTransient });
        } else {
          resolve({ exists: true });
        }
      });
    });
  }

  private async checkImageExists(url: string): Promise<{ exists: boolean; error?: string; errorType?: BrokenImageInfo['errorType']; isTransient?: boolean }> {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      const result = await this.checkImageExistsSingle(url);
      if (result.exists || !result.isTransient) return result;
      if (attempt < this.MAX_RETRIES) await sleep(this.RETRY_DELAY * Math.pow(2, attempt - 1));
    }
    return this.checkImageExistsSingle(url);
  }

  private summarizeIssues(brokenImages: BrokenImageInfo[]): { missing: number; transient: number; config: number } {
    return {
      missing: brokenImages.filter(img => img.errorType === '404').length,
      transient: brokenImages.filter(img => img.isTransient).length,
      config: brokenImages.filter(img => img.errorType === '403').length
    };
  }

  private async checkImagesInBatches(links: ImageLinkInfo[]): Promise<{
    brokenImages: BrokenImageInfo[];
    stats: { totalUniqueUrls: number; checkedUniqueUrls: number; incomplete: boolean; incompleteReason?: string };
  }> {
    // Deduplicate URLs
    const urlOccurrences = new Map<string, ImageLinkInfo[]>();
    links.forEach(link => {
      if (!urlOccurrences.has(link.url)) urlOccurrences.set(link.url, []);
      urlOccurrences.get(link.url)!.push(link);
    });

    const uniqueUrls = Array.from(urlOccurrences.keys());
    const brokenImages: BrokenImageInfo[] = [];
    let checkedCount = 0;
    let incomplete = false;
    let incompleteReason: string | undefined;
    const deadline = Date.now() + this.MAX_RUNTIME;

    console.log(`🔍 Checking ${uniqueUrls.length} unique URLs...`);

    for (let i = 0; i < uniqueUrls.length; i += this.CONCURRENCY) {
      if (Date.now() > deadline) {
        incomplete = true;
        incompleteReason = 'Timeout';
        break;
      }

      const batch = uniqueUrls.slice(i, i + this.CONCURRENCY);
      const results = await Promise.all(batch.map(async (url) => {
        const result = await this.checkImageExists(url);
        checkedCount++;
        if (!result.exists) {
          return urlOccurrences.get(url)!.map(occ => ({ ...occ, error: result.error || 'Not found', isTransient: result.isTransient, errorType: result.errorType }));
        }
        return [];
      }));
      brokenImages.push(...results.flat());

      // Progress every 10%
      if (checkedCount % Math.max(1, Math.floor(uniqueUrls.length / 10)) === 0) {
        console.log(`   Progress: ${checkedCount}/${uniqueUrls.length} (${Math.round(checkedCount / uniqueUrls.length * 100)}%)`);
      }
    }

    return { brokenImages, stats: { totalUniqueUrls: uniqueUrls.length, checkedUniqueUrls: checkedCount, incomplete, incompleteReason } };
  }

  /**
   * Generate JSON report for debugging/artifact
   */
  private generateJsonReport(
    allLinks: ImageLinkInfo[],
    brokenImages: BrokenImageInfo[],
    totalFiles: number,
    scannedFiles: number,
    stats: { totalUniqueUrls: number; checkedUniqueUrls: number; incomplete: boolean; incompleteReason?: string }
  ): void {
    const { missing, transient, config } = this.summarizeIssues(brokenImages);
    const report: CheckReport = {
      checkedAt: new Date().toISOString(),
      totalFiles,
      scannedFiles,
      totalLinks: allLinks.length,
      uniqueUrls: stats.totalUniqueUrls,
      checkedUrls: stats.checkedUniqueUrls,
      brokenCount: { total: brokenImages.length, missing, forbidden: config, transient },
      incomplete: stats.incomplete,
      incompleteReason: stats.incompleteReason,
      brokenImages
    };

    const reportPath = path.join(this.projectRoot, 'image-links-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved: ${reportPath}`);
  }

  /**
   * Build detailed message for broken links
   */
  private buildDetailedMessage(entries: [string, BrokenImageInfo[]][]): string {
    let message = '';
    entries.forEach(([url, occurrences], index) => {
      message += `${index + 1}. ${url}\n`;
      message += '    - Error: ' + occurrences[0].error + '\n\n';
      message += `    - Occurrences: ${occurrences.length}\n`;
      occurrences.forEach((occ) => {
        message += `        - ${occ.file} line ${occ.line}\n`;
      });
      message += '\n';
    });
    return message;
  }

  /**
   * Send webhook alert for broken links
   */
  private async sendWebhookAlert(brokenImages: BrokenImageInfo[]): Promise<void> {
    const webhookUrl = process.env.COS_ALERT_WEBHOOK;
    if (!webhookUrl) {
      console.log('ℹ️ COS_ALERT_WEBHOOK not configured, skipping alert');
      return;
    }

    const confirmedBroken = brokenImages.filter(img => img.errorType === '404' || img.errorType === '403');
    if (confirmedBroken.length === 0) {
      console.log('ℹ️ No confirmed broken links, skipping alert');
      return;
    }

    console.log(`\n📤 Sending webhook alert for ${confirmedBroken.length} broken links...`);

    const repo = process.env.GITHUB_REPOSITORY || 'unknown/repo';
    const runId = process.env.GITHUB_RUN_ID || '0';
    const runNumber = process.env.GITHUB_RUN_NUMBER || '0';
    const [orgName, repoName] = repo.split('/');
    const linkUrl = `https://github.com/${repo}/actions/runs/${runId}`;

    // Group broken links by URL, take first 10
    const brokenByUrl = new Map<string, BrokenImageInfo[]>();
    confirmedBroken.forEach(img => {
      if (!brokenByUrl.has(img.url)) brokenByUrl.set(img.url, []);
      brokenByUrl.get(img.url)!.push(img);
    });

    const MAX_DISPLAY = 10;
    const allEntries = Array.from(brokenByUrl.entries());
    const displayEntries = allEntries.slice(0, MAX_DISPLAY);
    const remainingCount = allEntries.length - displayEntries.length;

    // Build message content
    let content = `仓库 ${orgName}/${repoName} 中发现 ${confirmedBroken.length} 处损坏链接:\n\n`;
    content += this.buildDetailedMessage(displayEntries);
    if (remainingCount > 0) {
      content += `\n**还有 ${remainingCount} 个损坏链接，请前往 GitHub 查看完整报告。**\n`;
    }

    const webhookMessage = {
      msg_type: 'interactive',
      card: {
        schema: '2.0',
        config: { update_multi: true, enable_forward: true, width_mode: 'fill' },
        header: { title: { tag: 'plain_text', content: '图片链接检查失败' }, template: 'red' },
        body: {
          direction: 'vertical',
          elements: [
            { tag: 'markdown', content },
            { tag: 'button', text: { tag: 'plain_text', content: `查看 Run #${runNumber}` }, type: 'default', behaviors: [{ type: 'open_url', default_url: linkUrl }] }
          ]
        }
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookMessage)
      });
      const responseText = await response.text();
      if (!response.ok || !responseText.includes('"code":0')) {
        console.error(`❌ Failed to send alert: ${response.status} ${responseText}`);
      } else {
        console.log('✅ Alert sent successfully');
      }
    } catch (error) {
      console.error('❌ Error sending alert:', error);
    }
  }

  public async run(): Promise<void> {
    // 1. Get all files
    const files = await this.getAllFiles(this.projectRoot);
    console.log(`📁 Found ${files.length} markdown files to scan`);

    // 2. Extract all image links
    const allLinks: ImageLinkInfo[] = [];
    const scannedFiles: string[] = [];
    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf8');
        const links = this.extractImageLinks(content, file);
        if (links.length > 0) {
          scannedFiles.push(path.relative(this.projectRoot, file));
          allLinks.push(...links);
        }
      } catch { /* skip unreadable files */ }
    }

    console.log(`📄 Files with image links: ${scannedFiles.length}`);
    scannedFiles.forEach(f => console.log(`   - ${f}`));
    console.log(`🔗 Total image links: ${allLinks.length}`);

    if (allLinks.length === 0) {
      console.log('✅ No image links found');
      this.generateJsonReport([], [], files.length, files.length, { totalUniqueUrls: 0, checkedUniqueUrls: 0, incomplete: false });
      return;
    }

    // 3. Check image links
    const { brokenImages, stats } = await this.checkImagesInBatches(allLinks);

    // 4. Generate report
    this.generateJsonReport(allLinks, brokenImages, files.length, scannedFiles.length, stats);

    // 5. Show broken links
    const { missing, transient, config } = this.summarizeIssues(brokenImages);
    const confirmedBroken = missing + config;

    if (confirmedBroken > 0) {
      console.log(`\n❌ Broken links found (404: ${missing}, 403: ${config}):`);
      const byUrl = new Map<string, BrokenImageInfo[]>();
      brokenImages.filter(img => !img.isTransient).forEach(img => {
        if (!byUrl.has(img.url)) byUrl.set(img.url, []);
        byUrl.get(img.url)!.push(img);
      });
      byUrl.forEach((occurrences, url) => {
        console.log(`\n   ${url}`);
        console.log(`   Error: ${occurrences[0].error}`);
        console.log(`   Used in:`);
        occurrences.forEach(o => console.log(`     - ${o.file}:${o.line}`));
      });
    }

    if (transient > 0) {
      console.log(`\n⚠️ Transient errors: ${transient} (will retry on next run)`);
    }

    // 6. Send alert and exit
    const isComplete = !stats.incomplete && transient === 0;
    if (confirmedBroken > 0 && isComplete) {
      await this.sendWebhookAlert(brokenImages);
      console.log('\n📄 Report: image-links-report.json');
      process.exit(1);
    } else if (confirmedBroken === 0 && transient === 0) {
      console.log('\n✅ All image links are valid!');
    }
  }
}

// Main entry
new ImageLinkChecker().run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
