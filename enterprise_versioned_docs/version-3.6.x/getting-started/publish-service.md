---
title: 发布服务版本
slug: /getting-started/publish-service
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

为了对已部署的 API 进行版本控制，可以利用 API7 企业版将可复用的服务模板发布到不同的[网关组](../key-concepts/gateway-groups.md)形成不同的服务版本，而不是在网关组上直接进行配置编辑。

通常，API 版本会在发布到生产环境之前，先发布到测试和暂存环境中。API7 Gateway 通过[网关组](../key-concepts/gateway-groups.md)管理这种环境隔离，其中 API 属于具有共享[上游](../key-concepts/upstreams.md)的单个[已发布服务](../key-concepts/services.md)。

本教程将指导你在 API7 企业版上将 [httpbin](https://httpbin.org/) 服务发布到网关组。你将学习如何：

1. 手动和通过 OpenAPI 文件创建服务。
2. 通过配置上游节点和使用服务发现机制发布服务。

## 前提条件

1. [安装 API7 企业版](install-api7-ee.md)。
2. 确保网关组中至少[有一个网关实例](add-gateway-instance.md)。

## 新增服务模板并添加路由

### 手动新增

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>

<TabItem value="dashboard">

1. 在左侧导航栏中选择 **服务中心**， 然后点击 **新增服务**。
2. 选择 **手动新增**。
3. 在表单中执行以下操作：

* **服务类型** 选择 `HTTP （七层代理）`。
* **名称** 填写 `httpbin`。
* 点击 **新增**。

4. 进入服务内，点击 **新增路由**。
5. 在表单中，执行以下操作：

* **名称** 填写 `get-ip`.
* **路径** 填写 `/ip`。
* **HTTP 方法** 选择 `GET`。
* 点击 **新增**。

</TabItem>

<TabItem value="adc">

创建一个 ADC 配置文件，包含服务及其上游和路由：

```yaml title="adc.yaml"
services:
  - name: httpbin
    upstream:
      name: httpbin upstream
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    routes:
      - uris:
          - /ip
        name: get-ip
        methods:
          - GET
```

</TabItem>

</Tabs>

### 导入 OpenAPI 文件

控制台和 ADC 都支持导入 [OpenAPI v3.0](https://swagger.io/specification/) 文件。

在 YAML/JSON 文件中定义你的 API，如下所示：

```yaml title="OpenAPI.yaml"
openapi: 3.1.0
info:
  title: httpbin
  description: "httpbin API for the API7 Enterprise Getting Started guides."
  version: 1.0.0
paths:
  "/anything/*":
    get:
      tags:
        - ip
      summary: Returns the ip of the request.
      operationId: get-ip
      responses:
        "200":
          description: Successful Response
          content:
            application/json:
              schema:
                type: string
tags:
  - name: ip
    description: Return the ip of the request.
```

然后在 API7 网关中使用：

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>

<TabItem value="dashboard">

1. 在左侧导航栏中选择 **服务中心**， 然后点击 **新增服务**。
2. 选择 **导入 OpenAPI**。
3. 在表单中执行以下操作：

* 上传你的 YAML/JSON 文件。
* 点击 **下一步**。

4. 确认以下信息：

* **名称**：来自 OpenAPI 文件的 `title`。
* **标签**：来自 OpenAPI 文件的 `tag`。
* **描述**：来自 OpenAPI 文件的 `description`。
* **路由**: 来自 OpenAPI 文件的 `Paths`。
* 点击 **新增**。

</TabItem>

<TabItem value="adc">

使用 ADC 将 OpenAPI 文件转换成 ADC 配置文件：

```shell
adc convert openapi -f openapi.yaml -o adc.yaml
```

</TabItem>

</Tabs>

## 将服务版本发布到网关组

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>

<TabItem value="dashboard">

1. 在左侧导航栏中选择 **服务中心**， 然后选择之前创建的 `httpbin` 服务。
2. 点击 **发布新版本**。
3. 在表单中执行以下操作：，

* **网关组** 中选择你要发布的目标网关组，例如 `默认网关组`。
* **新版本** 填写 `1.0.0`。
* 点击 **发布**。

:::Note

首次发布服务之后，请在网关组中配置必要的[服务运行时配置](../key-concepts/services.md#service-runtime-configurations)并**启用**该服务以激活你的 API。对于后续发布，服务状态和运行时配置将继承先前版本。

:::

</TabItem>

<TabItem value="adc">

将上一步中创建的配置文件同步到你的目标网关组，例如 `default`:

```shell
adc sync -f adc.yaml --gateway-group default
```

</TabItem>

</Tabs>

## 配置服务运行时配置

1. 发布后，你将被重定向到网关组上的已发布服务。
2. 从侧边导航栏中选择 **上游**。
3. 点击 **新增节点**。
4. 在表单中执行以下操作：

* **主机** 字段中，输入 `httpbin.org`。
* **端口** 字段中，输入 `80`。
* **权重** 字段中，输入 `100`。
* 点击 **添加**。

5. 从已发布服务的顶部标题栏中点击 **启用** 并确认。

## 验证 API

```bash
curl "http://127.0.0.1:9080/ip"
```

你应该会看到以下输出：

```text
{
  "origin": "127.0.0.1"
}
```

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services.md)
* 快速入门
  * [将已发布的服务版本同步到其他网关组](sync-service.md)
  * [回滚已发布的服务版本](rollback-service.md)
* 最佳实践
  * [API 版本控制](../best-practices/api-version-control.md)
