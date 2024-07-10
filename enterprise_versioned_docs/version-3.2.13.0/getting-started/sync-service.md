---
title: 将已发布的服务版本同步到其他网关组
slug: /getting-started/sync-service
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

网关组之间同步已发布的服务版本是 API 版本控制的一个很有用的功能。例如：

1. 当使用网关组来分隔环境（如测试和生产）时，你可以在运行测试后将服务版本从测试同步到生产。
2. 或者，如果你使用网关组来划分区域或团队，同步服务可以帮助在它们之间分发服务。

:::note

* 同步使服务版本在网关组之间保持一致，而发布则每次创建一个新的服务版本。

* 你只能同步当前运行的服务版本，不能同步旧的服务版本。

:::

## 前提条件

1. 有两个[网关组](./add-gateway-group.md)用于测试和生产环境，每个组中至少有一个网关实例。
2. 在测试环境对应的网关组中[发布一个服务版本](./publish-service.md)。

## 将服务版本同步到生产网关组

同一个服务版本发布/同步到不同网关组时，可以使用不同的上游地址对应不同环境里的后端服务。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: 'Dashboard', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

你可以通过配置上游节点或使用[服务发现](../key-concepts/service-discovery.md)机制来发布服务。

### Using Upstream Nodes

1. 从侧边栏选择 **Published Services**，然后点击服务 `httpbin API` 下的版本 `1.0.0`。
2. 从 **Actions** 列表中点击 `Sync to Other Gateway Group`。
3. 在 **Gateway Group** 字段中，选择 `Production Group`，然后点击 **Next**。
4. 在 **How to find the upstream** 字段中，选择 `Use Nodes`。
5. 从 **Nodes** 表格中，编辑 **Host** 和 **Port** 字段，输入生产环境中的后端节点地址或模拟服务器地址。
6. 点击 **Sync**。

### Using Service Discovery

1. 从侧边栏选择 **Services**，然后点击服务 `httpbin API` 下的版本 `1.0.0`。
2. 从 **Actions** 列表中点击 `Sync to Other Gateway Group`。
3. 在 **Gateway Group** 字段中，选择 `Production Group`，然后点击 **Next**。
4. 在 **How to find the upstream** 字段中，选择 `Use Service Discovery`。
5. 在 **Service Registry** 字段中，选择 `Registry for Test`，以及 Registry 中的 Namespace 和服务名称。
6. 点击 **Sync**。

</TabItem>
