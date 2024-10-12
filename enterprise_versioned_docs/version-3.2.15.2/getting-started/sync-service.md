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

:::

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 配置两个网关组： 一个用于初始测试环境，另一个作为最终目的环境（例如生产环境）。每个网关组至少[包含一个网关实例](./add-gateway-instance.md)。
3. 在初始测试环境的网关组中[发布一个服务版本](./publish-service.md)。

## 步骤

* 同一个服务版本发布/同步到不同网关组时，可以使用不同的上游地址对应不同环境里的后端服务。
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

### 使用上游节点

1. 从侧边栏选择服务来源网关组的 **已发布服务**，然后点击你要同步的服务版本，例如版本为 `1.0.0` 的服务 `httpbin API`。
2. 点击页面标题中 **启用/禁用** 旁边的按钮，然后选择 `同步到其他网关组`。
3. 在表单中执行以下操作：

* **网关组** 选择要同步去的目的地网关组，例如 `生产网关组`。
* 点击 **下一步**。

4. 在表单中执行以下操作：

* **如何查找上游** 选择`使用节点`。
* 点击**拟增节点**。在表单中执行以下操作：
   * **主机**和**端口** 填写 `httpbin.org` 作为主机，`80` 作为端口。
   * **权重**使用默认值 `100`。
   * 点击**新增**。
* 确认服务信息，然后点击 **同步**。

### 使用服务发现

1. 从侧边栏选择服务来源网关组的 **已发布服务**，然后点击你要同步的服务版本，例如版本为 `1.0.0` 的服务 `httpbin API`。
2. 点击页面标题中 **启用/禁用** 旁边的按钮，然后选择 `同步到其他网关组`。
3. 在表单中执行以下操作：

 * **网关组** 选择要同步去的目的网关组，例如 `生产网关组`。
 * 点击 **下一步**。

4. 在表单中执行以下操作：

* **如何查找上游**，选择 `使用服务发现`。
* **服务注册表** 选择 `生产用注册中心`，以及注册表中的命名空间和服务名称。
* 确认服务信息，然后点击 **同步**。

</TabItem>

<TabItem value="adc">

为了通过 ADC 将 [对应的配置](./publish-service.md#use-adc-to-publish-the-api) 同步到 `Production Group`，需要运行：  

```shell
adc sync -f adc.yaml --gateway-group "Production Group"
```

</TabItem>
</Tabs>

## 验证同步之后的 API

发送一个请求来验证同步到 `生产网关组` 上的 API：

```bash
# 替换成生产网关组对应的地址
curl "http://127.0.0.1:9080/headers"
```

你应该能看到如下类似的响应：

```json
{
 "headers": {
   "Accept": "*/*",
   "Host": "httpbin.org",
   "User-Agent": "curl/7.74.0",
   "X-Amzn-Trace-Id": "Root=1-6650ab7e-32c90eba787abbeb4e3dbb0c",
   "X-Forwarded-Host": "127.0.0.1"
 }
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
