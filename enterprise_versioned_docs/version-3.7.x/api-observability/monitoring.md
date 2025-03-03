---
title: API 指标监控
slug: /api-observability/monitoring
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

API7 网关支持以最小的延迟向监控系统公开全面的指标，方便持续的监控和诊断。

API7 网关的监控和告警框架建立在 Prometheus 之上，这是一个广泛使用的系统监控和告警工具包。Prometheus 收集并存储多维时间序列数据，包括带有键值标签注释的指标。

本文档介绍了如何集成 `prometheus` 插件和监控系统，以便收集和可视化 HTTP 指标。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## 监控所有服务

建议启用 `prometheus` 插件作为全局规则，确保所有服务和路线都得到一致的监控和跟踪。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. 从侧边栏选择网关组的**插件设置**。
2. 选择**插件全局规则**选项卡，然后在**插件**字段中搜索 `prometheus` 插件。
3. 点击**新增插件**。
4. 在出现的对话框中，点击**新增**。
5. 进行一些 API 调用以测试监控。
6. 从侧边栏选择**监控**以查看指标。

</TabItem>

<TabItem value="adc">

要使用 ADC 启用监控，请创建以下配置：

```yaml title="adc.yaml"
global_rules:
  prometheus:
    _meta:
      disable: false
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。确保使用 `-f` 标志将所有配置文件传递给 `adc sync` 命令。

:::

在 API7 企业版控制台中，从侧边栏选择 **监控** 以查看指标。

</TabItem>
</Tabs>
