---
title: 高可用配置准备
slug: /high-availability/prepare-for-high-availability
---

本文档介绍了推荐的、最低限度要求的高可用配置。

## 获取安装包

请[联系API7专家](https://api7.ai/contact)，以获取适合您的安装包。

## 准备主机

要部署 API7企业版高可用性架构，至少需要4台主机（2台用于控制面高可用，2台用于数据面高可用）。

请注意，虽然数据库高可用也是一个需要考虑的重要方面，但本文档并未涵盖。建议您单独处理这个问题，以确保数据存储系统的弹性和容错性。有关如何为PostgreSQL 配置高可用的详细信息，请参阅[PostgreSQL 文档](https://www.postgresql.org/docs/current/high-availability.html)。

Prometheus 是一个可选组件，仅当您希望使用 API7 企业版自带的监控功能时才使用。如果您不需要此功能（已经自建监控系统），则 Prometheus 不是部署必需的。有关如何为 Prometheus 配置高可用的详细信息，请参阅[Prometheus 文档](https://prometheus.io/docs/introduction/faq/#can-prometheus-be-made-highly-available).

在实际场景中，高可用性架构可能会因具体情况而异。请[联系API7专家](https://api7.ai/contact)，我们将很高兴为您量身定制满足您需求的高可用解决方案。

## 最低硬件要求

| 主机        | 处理器 |  CPU     | RAM | Free Disk Space | 部署组件 |
| ----------- | ----------| -------- | --- | --------------- | ------------------- |
| CP Host1       | x86_64    |  2 Cores | 4G  | 80 GB           |  API7 Dashboard, DP Manager   |
| CP Host2       | x86_64    |  2 Cores | 4G  | 80 GB           |  API7 Dashboard  DP Manager   |
| DP Host3       | x86_64    |  2 Cores | 4G  | 80 GB           |  API7 Gateway                 |
| DP Host4       | x86_64    |  2 Cores | 4G  | 80 GB           |  API7 Gateway                 |

## 最低软件要求

对于每台主机，必须满足以下要求：

- **操作系统**：推荐使用 Linux CentOS 7.6 或更高版本。已知 Linux CentOS 7.2 或更早版本可能存在不兼容的情况。

- **Docker**： 推荐使用 3.10.0-927 或更高版本。已知 3.10.0-327 或更早版本可能存在不兼容的情况。

注意：在实际配置环境中，务必核实并确保您的系统和应用软件版本都符合官方的支持和兼容要求。特别是像Docker这样的关键组件，安装不正确或不兼容的版本可能会导致系统不稳定或应用运行失败。

## 安全设置

由于每个组件都需要对外暴露节点，因此您应该在这些主机上配置 SELinux 和防火墙。

解释：SELinux（Security-Enhanced Linux）是一个Linux内核的安全模块，用于提供强制访问控制。防火墙则是用于监控和控制网络流量的系统，可以帮助保护主机免受未经授权的访问和攻击。在配置高可用性系统时，确保这些安全设置正确配置是非常重要的，以保护系统的各个组件和数据的安全。

| 组件     | 暴露端口 | 说明 |
| -------------- | ------| ------------------------------ |
| API7 Gateway   | 9080  | 接收 HTTP 请求  |
| API7 Gateway   | 9443  | 接收 HTTPs 请求 |
| API7 Dashboard | 7080  | 管理员入口 |
| DP Manager     | 7900  | 管理数据面节点，包括配置下发、心跳检查，上报监控指标等|
| Prometheus     | 9090  | 收集并展示监控指标  |
| PostgreSQL     | 5432  | 存储网关配置数据，可以替换为其他关系型数据库|
