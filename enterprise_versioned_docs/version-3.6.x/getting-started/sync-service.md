---
title: 将已发布的服务版本同步到其他网关组
slug: /getting-started/sync-service
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

网关组之间同步已发布的服务版本是 API 版本控制的一个很有用的功能。例如：

1. 当使用网关组来分隔环境（如测试和生产）时，你可以在测试后将服务版本从测试环境同步到生产环境。
2. 或者，如果你使用网关组来划分区域或团队，同步服务可以帮助在它们之间分发服务。

:::note

* 同步使服务版本在网关组之间保持一致，而发布则每次创建一个新的服务版本。

:::

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 配置两个网关组： 一个用于初始测试环境，另一个作为最终的目的地环境（例如生产环境）。每个网关组至少[包含一个网关实例](./add-gateway-instance.md)。
3. 在初始测试环境的网关组中[发布一个服务版本](./publish-service.md)。

## 步骤

* “无版本”状态的服务也可以同步到其他网关组，同步之后将同时在两个网关组上都拥有一个相同版本号。
* 你只能同步当前运行的服务版本，不能同步旧的服务版本。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. 从侧边导航栏中选择你的初始网关组的 **已发布服务**，然后点击要同步的服务版本，例如，版本为 `1.0.0` 的 `httpbin`。
2. 点击页面标题中 **启用/禁用** 旁边的按钮，然后选择 **同步到其他网关组**。
3. 在表单中执行以下操作：

* **网关组** 字段中，选择你的目标网关组，例如，`生产网关组`。
* 如果服务处于“无版本”状态，请在 **版本** 字段中输入版本号（例如，“2.0.0”）。否则，将自动复制现有版本号，且无法编辑。
* 点击 **同步**。

:::Note

首次同步服务后，请配置必要的[服务运行时配置](../key-concepts/services.md#service-runtime-configurations)并**启用**该服务以激活你的 API。对于后续的同步和发布，服务状态和运行时配置将继承先前版本。

:::

</TabItem>

<TabItem value="adc">

为了通过 ADC 将 [对应的配置](./publish-service.md#use-adc-to-publish-the-api) 同步到 `Production Group`，需要运行：  

```shell
adc sync -f adc.yaml --gateway-group "Production Group"
```

</TabItem>
</Tabs>

## 配置服务运行时配置

1. 同步成功后，你将被重定向到目的地网关组上的已发布服务。
2. 从侧边导航栏中选择 **上游**。
3. 点击 **新增节点**。
4. 在表单中执行以下操作：

* **主机** 字段中，输入 `httpbin.org`。
* **端口** 字段中，输入 `80`。
* **权重** 字段中，输入 `100`。
* 点击 **新增**。

5. 从已发布服务的顶部标题栏中点击 **启用** 并确认。

## 验证同步之后的 API

发送一个请求来验证同步到 `生产网关组` 上的 API：

```bash
# 替换成生产网关组对应的地址
curl "http://127.0.0.1:9080/ip"
```

你应该能看到如下类似的响应：

```text
{
  "origin": "127.0.0.1"
}
```

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services.md)
* 快速入门
  * [发布服务版本](publish-service.md)
  * [回滚已发布的服务](rollback-service.md)
* 最佳实践
  * [API 版本控制](../best-practices/api-version-control.md)
