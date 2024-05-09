---
title: 建立 API7 Gateway 性能基准
slug: /performance/benchmark
---

## 前置准备

在进行基准测试之前，要确保 API7 Gateway 的工作核心数配置正确，以下是一些建议：

- 使用单个 API7 Gateway 节点（配置 4 或 8 个 worker_processes），不要使用多个较小的 Gateway 节点；
- 先测试 1 个 API7 Gateway 节点并配置 1 个 worker_processes 场景下的结果，确认单核心的性能基线无误后再逐步增加 worker_processes；
- 确保上游服务器不是瓶颈，观测 API7 Gateway 代理和上游服务器的性能。
- 收集多组测试结果，确保每次数据结果之间的差异不大（标准差较低）。

完成上方的一些建议之后，就可以使用 API7 Gateway 继续进行其他场景的基准测试。在执行其他基准测试之前，请先阅读下方的一些优化和建议，并根据需要对配置进行更改。

## 优化 API7 Gateway 性能

### 检查最大打开文件数

检查当前系统总体最大打开文件数：

```shell
cat /proc/sys/fs/file-nr
3984 0 3255296
```

最后一个数字 `3255296` 是打开文件的最大数量。如果这个数字在您的机器上很小，您需要修改 `/etc/sysctl.conf` 文件以增加它。

```shell
fs.file-max = 1020000
net.ipv4.ip_conntrack_max = 1020000
net.ipv4.netfilter.ip_conntrack_max = 1020000

# 重启后生效
sudo sysctl -p /etc/sysctl.conf
```

### 检查 `ulimit`

每个用户请求对应一个文件句柄，而在压力测试时会产生大量请求，因此我们需要增大这个值。使用 `ulimit -n` 检查，如果是一个很小的值（默认为 1024），我们需要修改它增加为百万级，如：1024000。

临时修改：

```shell
ulimit -n 1024000
```

Linux 永久修改：

```shell
vim /etc/security/limits.conf

# 添加如下行
* hard nofile 1024000
* soft nofile 1024000
```

### 有效利用 CUP 核心数

通常设置 `worker_processes` 数应比当前部署的服务器的 CPU **少 2 个**。比如：在 8C 16G 的机器上，我们设置 API7 Gateway 的 `worker_processes` 为 6。确保不会有一些其它进程来和 API7 Gateway 争夺资源。

### 避免资源争夺

确保 wrk2、API7 Gateway、上游服务分别位于不同的机器上，并在同一本地网络上进行测试，降低网络延迟带来的开销。

如果这些资源都在 Kubernetes 集群中运行，请确保这三个系统的 Pod 调度在各自的节点上。避免它们之间产生资源争用（通常是 CPU 和网络）导致性能不佳。

### 上游服务器已达到极限

检查上游服务器是否达到极限，压测过程注意观测上游服务器的 CPU 和内存的使用情况来确定上游服务器是否已经达到了极限。如果增加 API7 Gateway 的 `worker_processes` 数之后的结果仍保持不变，那么上游服务器或者其他系统可能达到了瓶颈。

### 阻止访问日志 `I/O`

在进行性能基准测试时，我们应该尽量减少访问日志对性能的影响，尤其是高流量场景下的大量日志写入操作，我们可以禁用 `access_log` 减轻对磁盘 `I/O` 的压力。

### 云供应商的性能问题

避免使用云服务器提供的**可突发实例**，这种实例的可用 CPU 是可变的，这会对测试数据带来不必要的影响。

:::info
不同的实例类型提供的 vCPU 和 CPU 的对应关系并不都是 1:1 的。部分实例的 vCPU 是超线程的，实际的物理 CPU 为 vCPU 的一半。通常你可以在云供应商公开的文档中找到详细的信息。如 [AWS 实例信息](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cpu-options-supported-instances-values.html)。
:::

### API7 Gateway 中的内部错误

将 API7 Gateway 错误日志调整成 error 级别，确保错误日志中不存在内部错误后再开始进行性能基准测试。

### 使用 c1000k 检查并发连接

安装 [c1000k](https://github.com/ideawu/c1000k) 检查测试环境是否能够满足 100w 个并发连接的要求。

```
# 启动服务器，监听 7000
. /server 7000

# 运行客户端，模拟压力测试
. /client 127.0.0.1 7000
```

## API7 Gateway 配置示例

```yaml
# config.yaml
nginx_config:
  error_log_level: error
  worker_processes: auto

  http:
    enable_access_log: false
```


