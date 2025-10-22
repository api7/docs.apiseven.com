#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import COS from 'cos-nodejs-sdk-v5';

const __dirname = process.cwd();

interface ImageLinkInfo {
  url: string;
  file: string;
  line: number;
  context: string;
}

interface BrokenImageInfo extends ImageLinkInfo {
  error: string;
}

interface CheckReport {
  totalLinks: number;
  uniqueUrls: number;
  brokenImages: BrokenImageInfo[];
  checkedAt: string;
  summary: {
    totalFiles: number;
    scannedFiles: number;
  };
}

class ImageLinkChecker {
  private readonly imageUrlRegex: RegExp // = /https:\/\/static\.apiseven\.com\/uploads\/[^\s\)"\'\`\]\}>]+/g;
  private readonly projectRoot: string;
  private readonly cosClient: any;
  private readonly cosBucket: string;
  private readonly cosRegion: string;
  private readonly cosCdnUrl: string;
  private readonly ignorePatterns = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    '.nyc_output',
    'logs',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    'image-links-report.json',
    'image-links-report.md',
    'scripts'
  ];
  
  // Supported file extensions
  private readonly supportedExtensions = [
    '.md', '.mdx',           // Markdown files
    '.tsx', '.ts', '.jsx', '.js',  // React/TypeScript/JavaScript files
    '.json',                 // JSON configuration files
    '.html', '.htm',         // HTML files
    '.css', '.scss', '.sass', // CSS files
    '.yml', '.yaml'          // YAML files
  ];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    
    // Validate environment variables
    const requiredEnvVars = ['COS_SECRET_ID', 'COS_SECRET_KEY', 'COS_BUCKET', 'COS_REGION', 'COS_CDN_URL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars.join(', '));
      console.error('Please configure COS environment variables in GitHub secrets');
      process.exit(1);
    }

    this.cosBucket = process.env.COS_BUCKET!;
    this.cosRegion = process.env.COS_REGION!;
    this.cosCdnUrl = process.env.COS_CDN_URL!;
    const escapedCdnUrl = this.cosCdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    this.imageUrlRegex = new RegExp(`${escapedCdnUrl}uploads\\/[^\\s\)\"\'\`\\]\\}>]+`, 'g');
    
    // Initialize COS client
    this.cosClient = new COS({
      SecretId: process.env.COS_SECRET_ID,
      SecretKey: process.env.COS_SECRET_KEY,
    });
    
    console.log(`🔧 COS Configuration: Bucket=${this.cosBucket}, Region=${this.cosRegion}`);
  }

  /**
   * Check if file path should be ignored
   */
  private shouldIgnoreFile(filePath: string): boolean {
    const relativePath = path.relative(this.projectRoot, filePath);
    
    return this.ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath.includes(pattern);
    });
  }

  /**
   * Check if file extension is supported
   */
  private isSupportedFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    
    // Exclude generated report files
    if (fileName.includes('image-links-report')) {
      return false;
    }
    
    return this.supportedExtensions.includes(ext);
  }

  /**
   * Recursively get all files to scan
   */
  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (this.shouldIgnoreFile(fullPath)) {
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

  /**
   * Extract image links from file content
   */
  private extractImageLinks(content: string, filePath: string): ImageLinkInfo[] {
    const links: ImageLinkInfo[] = [];
    const lines = content.split('\n');
    const relativeFilePath = path.relative(this.projectRoot, filePath);
    
    lines.forEach((line, index) => {
      const matches = line.match(this.imageUrlRegex);
      if (matches) {
        matches.forEach(url => {
          // Clean URL, remove possible trailing symbols
          let cleanUrl = url.replace(/["\'\`\]\}>]+$/, '');
          
          // Validate URL format
          try {
            new URL(cleanUrl);
            console.log(`  🔗 Found link: ${relativeFilePath}:${index + 1} -> ${cleanUrl}`);
          } catch (error) {
            console.warn(`  ⚠️ Invalid URL: ${relativeFilePath}:${index + 1} - ${cleanUrl}`);
            return; // Skip invalid URLs
          }
          
          links.push({
            url: cleanUrl,
            file: relativeFilePath,
            line: index + 1,
            context: line.trim()
          });
        });
      }
    });
    
    return links;
  }

  /**
   * Extract COS object key from URL (remove domain and uploads prefix)
   */
  private extractCosKey(url: string): string {
    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;
      
      // Remove leading slash
      if (pathname.startsWith('/')) {
        pathname = pathname.substring(1);
      }
      
      // URL decode for special characters
      return decodeURIComponent(pathname);
    } catch (error) {
      // Fallback for URL parsing errors
      console.warn(`Warning: Failed to parse URL ${url}, using fallback method`);
      return url.replace(this.cosCdnUrl, '').replace(/^\//, '');
    }
  }

  /**
   * Check if single image exists using COS SDK
   */
  private async checkImageExists(url: string): Promise<{ exists: boolean; error?: string }> {
    try {
      const cosKey = this.extractCosKey(url);
      console.log(`  🔍 Checking file: ${cosKey}`);
      
      return new Promise((resolve) => {
        this.cosClient.headObject({
          Bucket: this.cosBucket,
          Region: this.cosRegion,
          Key: cosKey,
        }, (err: any, data: any) => {
          if (err) {
            if (err.statusCode === 404) {
              console.log(`    ❌ File not found: ${cosKey}`);
              resolve({ exists: false, error: `File not found: ${cosKey}` });
            } else if (err.statusCode === 403) {
              console.log(`    🚫 Access denied: ${cosKey}`);
              resolve({ exists: false, error: `Access denied: ${cosKey}` });
            } else {
              console.log(`    ⚠️ COS error (${err.statusCode}): ${err.message}`);
              resolve({ exists: false, error: `COS error (${err.statusCode}): ${err.message}` });
            }
          } else {
            console.log(`    ✅ File exists: ${cosKey}`);
            resolve({ exists: true });
          }
        });
      });
    } catch (error: any) {
      console.log(`    ❌ URL parsing error: ${error.message}`);
      return { exists: false, error: `URL parsing error: ${error.message}` };
    }
  }

  /**
   * Check multiple images concurrently in batches
   */
  private async checkImagesInBatches(links: ImageLinkInfo[], concurrency: number = 5): Promise<BrokenImageInfo[]> {
    const brokenImages: BrokenImageInfo[] = [];
    
    // Deduplicate URLs but keep occurrence information
    const uniqueUrls = new Map<string, ImageLinkInfo>();
    const urlOccurrences = new Map<string, ImageLinkInfo[]>();
    
    links.forEach(link => {
      if (!uniqueUrls.has(link.url)) {
        uniqueUrls.set(link.url, link);
        urlOccurrences.set(link.url, []);
      }
      urlOccurrences.get(link.url)!.push(link);
    });

    const uniqueLinks = Array.from(uniqueUrls.values());
    console.log(`\n🔍 Starting to check ${uniqueLinks.length} unique image links...`);
    console.log(`📊 Concurrency: ${concurrency}`);
    
    let checkedCount = 0;
    let foundBrokenCount = 0;

    // Process in batches to avoid overwhelming COS API
    for (let i = 0; i < uniqueLinks.length; i += concurrency) {
      const batch = uniqueLinks.slice(i, i + concurrency);
      console.log(`\n📦 Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(uniqueLinks.length / concurrency)} (${batch.length} links)`);
      
      const batchPromises = batch.map(async (link) => {
        const result = await this.checkImageExists(link.url);
        checkedCount++;
        
        // Update progress
        process.stdout.write(`\rProgress: ${checkedCount}/${uniqueLinks.length} (${((checkedCount / uniqueLinks.length) * 100).toFixed(1)}%)`);
        
        if (!result.exists) {
          foundBrokenCount++;
          // Create records for all occurrences of this URL
          const occurrences = urlOccurrences.get(link.url) || [link];
          console.log(`\n  ❌ Broken link found: ${link.url} (used in ${occurrences.length} places)`);
          return occurrences.map(occurrence => ({
            ...occurrence,
            error: result.error || 'Image not found'
          }));
        }
        return [];
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(result => {
        brokenImages.push(...result);
      });
      
      // Small delay between batches to avoid rate limiting
      if (i + concurrency < uniqueLinks.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n\n✅ Check completed!`);
    console.log(`📊 Total checked: ${uniqueLinks.length} unique links`);
    console.log(`❌ Broken links: ${foundBrokenCount}`);
    console.log(`📄 Affected references: ${brokenImages.length}\n`);
    
    return brokenImages;
  }

  /**
   * Generate JSON report for workflow consumption
   */
  private generateJsonReport(allLinks: ImageLinkInfo[], brokenImages: BrokenImageInfo[], totalFiles: number, scannedFiles: number): void {
    const uniqueUrls = new Set(allLinks.map(link => link.url)).size;
    
    const report: CheckReport = {
      totalLinks: allLinks.length,
      uniqueUrls: uniqueUrls,
      brokenImages: brokenImages,
      checkedAt: new Date().toISOString(),
      summary: {
        totalFiles: totalFiles,
        scannedFiles: scannedFiles
      }
    };
    
    const reportPath = path.join(this.projectRoot, 'image-links-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📄 JSON report generated:');
    console.log(`   File path: ${reportPath}`);
    console.log(`   Total links: ${allLinks.length}`);
    console.log(`   Unique URLs: ${uniqueUrls}`);
    console.log(`   Broken links: ${brokenImages.length}`);
  }

  /**
   * Execute the complete check workflow
   */
  public async run(): Promise<void> {
    console.log('🔍 Starting image link scan...');
    console.log(`Project root: ${this.projectRoot}`);
    
    // 1. Get all files
    const files = await this.getAllFiles(this.projectRoot);
    console.log(`📁 Found ${files.length} files to scan`);
    
    // 2. Extract all image links
    const allLinks: ImageLinkInfo[] = [];
    let processedFiles = 0;
    
    console.log('\n📖 Scanning files for image links...');
    
    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf8');
        const relativeFilePath = path.relative(this.projectRoot, file);
        console.log(`\n📄 Scanning: ${relativeFilePath}`);
        
        const links = this.extractImageLinks(content, file);
        allLinks.push(...links);
        processedFiles++;
        
        if (processedFiles % 50 === 0) {
          console.log(`\n📊 Progress: Processed ${processedFiles}/${files.length} files`);
        }
      } catch (error) {
        console.warn(`\n⚠️ Cannot read file ${file}:`, error);
      }
    }
    
    console.log(`\n📖 Scan complete: Found ${allLinks.length} image links in ${files.length} files`);
    
    if (allLinks.length === 0) {
      console.log('No image links found, check completed.');
      // Still generate report for consistency
      this.generateJsonReport([], [], files.length, processedFiles);
      return;
    }

    // Show statistics
    const uniqueUrls = new Set(allLinks.map(link => link.url));
    console.log(`🔗 Including ${uniqueUrls.size} unique URLs`);
    
    // 3. Check image link validity
    const brokenImages = await this.checkImagesInBatches(allLinks);
    
    // 4. Generate JSON report
    console.log('📝 Generating check report...');
    this.generateJsonReport(allLinks, brokenImages, files.length, processedFiles);
    
    if (brokenImages.length > 0) {
      console.log(`\n❌ Check completed: Found ${brokenImages.length} broken image references`);
      console.log('📄 Detailed report saved to image-links-report.json');
      process.exit(1);
    } else {
      console.log('\n✅ Check completed: All image links are valid!');
    }
  }
}

// Main program entry
async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const checker = new ImageLinkChecker(projectRoot);
  
  try {
    await checker.run();
  } catch (error) {
    console.error('❌ Program execution error:', error);
    process.exit(1);
  }
}

// Check if this is the directly executed module (tsx/esm compatible)
if (process.argv[1] && process.argv[1].endsWith('check-image-links.ts')) {
  main();
}

export default ImageLinkChecker;