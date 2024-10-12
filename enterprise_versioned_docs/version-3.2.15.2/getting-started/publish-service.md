---
title: 发布服务版本
slug: /getting-started/publish-service
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

当你的 API 设计、开发和部署完成后，如果有版本管理的场景和需求，可以使用 API7 网关将服务发布到不同的网关组，而非直接在网关组上对配置进行修改。 通常，API 会先发布到测试环境，然后再发布到生产环境。API7 企业版通过网关组来隔离不同的环境，在各个环境中，API 从属于一个服务（Service），服务内所有 API 拥有共享的上游 (Upstream)。 

本教程将指导你将 [httpbin](https://httpbin.org/) 服务发布到一个网关组。你将学习如何：

1. 手动创建服务模板以及通过 OpenAPI 文件创建服务模板。
2. 通过配置上游节点和使用服务发现机制来发布服务。

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

* **名称** 填写 `httpbin API`。
* **服务类型** 选择 `HTTP （七层代理）`。
* **上游 Scheme** 选择 `HTTP`。
* 点击 **新增**。

4. 进入服务内，点击 **新增路由**。
5. 在表单中，执行以下操作：

* **名称** 填写 `getting-started-anything`.
* **路径** 填写 `/anything/*`。
* **HTTP 方法** 选择 `GET`。

6. 点击 **新增**。

</TabItem>

<TabItem value="adc">

创建一个 ADC 配置文件，包含服务及其上游和路由：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: httpbin upstream
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    routes:
      - uris:
          - /anything/*
        name: getting-started-anything
        methods:
          - GET
```

</TabItem>

</Tabs>

### 导入 OpenAPI 文件

控制台和 ADC 都支持导入 [OpenAPI v3.0](https://swagger.io/specification/) 规范。

在 YAML/JSON 文件中定义你的 API，如下所示：

```yaml title="OpenAPI.yaml"
openapi: 3.1.0
info:
  title: httpbin API
  description: "httpbin API for the API7 Enterprise Getting Started guides."
  version: 1.0.0
paths:
  "/anything/*":
    get:
      tags:
        - Anything
      summary: Returns anything that is passed into the request.
      operationId: getting-started-anything
      responses:
        "200":
          description: Successful Response
          content:
            application/json:
              schema:
                type: string
tags:
  - name: Anything
    description: Return anything that is passed in on the request.
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
* **上游 Scheme** 选择 `HTTP`。
* 点击 **下一步**。

4. 确认以下信息：

* **名称**：来自 OpenAPI 文件的 `title`。
* **标签**：来自 OpenAPI 文件的 `tag`。
* **描述**：来自 OpenAPI 文件的 `description`。
* **路由**: 来自 OpenAPI 文件的 `Paths`。

5. 点击 **新增**。

</TabItem>

<TabItem value="adc">

使用 ADC 将 OpenAPI 文件转换成 ADC 配置文件：

```shell
adc convert openapi -f openapi.yaml -o adc.yaml
```

</TabItem>

</Tabs>

## 将服务版本发布到网关组

在 API7 网关中，你可以使用静态上游节点或动态服务发现来定义请求的目标。静态上游节点适用于地址固定的、定义明确的服务，而动态服务发现则更适合于服务实例可以动态添加或删除的微服务架构。

### 发布单个服务

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>

<TabItem value="dashboard">

1. 在左侧导航栏中选择 **服务中心**， 然后选择之前创建的 `httpbin API` 服务。
2. 点击 **发布新版本**。
3. 在对话框中选择目标网关组，例如 `默认网关组`， 然后点击 **下一步**。
4. 在表单中执行以下操作：

* **新版本** 填写 `1.0.0`。
* **如何找到上游** 选择 `使用节点`。
* 点击 **新增节点**。在表单中执行以下操作：
  * **主机** 和 **端口** 填写 `httpbin.org` 和 `80`。
  * **权重** 使用默认值 `100`。
  * 点击 **新增**。
* 确认服务信息，然后点击 **发布**。

</TabItem>

<TabItem value="adc">

将上一步中创建的配置文件同步到你的目标网关组，例如 `default`:

```shell
adc sync -f adc.yaml --gateway-group default
```

</TabItem>

</Tabs>

### 批量发布服务

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择 **服务中心**，然后点击 **批量发布服务**。
2. 选择你的目标网关组，例如，`default`，然后点击 **下一步**。
3. 点击 **新增服务**。
4. 在对话框中，执行以下操作：

   * 在 **服务** 下拉列表中，选择你要发布的服务。
   * **新版本** 输入 `1.0.0`。
   * 点击 **新增**。

5. 重复上述步骤以添加更多服务。
6. 点击 **下一步** 继续发布服务。
7. 在新窗口中，为每个服务执行以下操作：

   * 在**如何查找上游**字段中，选择 `使用节点`。
   * 点击 **新增节点**。在对话框中，执行以下操作：
      * **主机**和**端口** 输入 `httpbin.org` 作为主机，`80` 作为端口。
      * **权重** 使用默认值 `100`。
      * 点击 **新增**。

8. 确认信息，然后点击**发布**。

下面是一个交互式演示，提供了发布版本化服务的实践介绍。跟随演示，你将直观了解如何在 API7 企业版中使用这个功能。

<StorylaneEmbed src='https://app.storylane.io/demo/wqs2feuaqbyw' />

</TabItem>

<TabItem value="adc">

要发布多个服务，你可以更新你的 ADC 配置文件以包含其他服务，或者使用多个配置文件并将它们同步到你的目标网关组，例如 `default`，如下所示：


```shell
adc sync -f adc-1.yaml -f adc-2.yaml
```

</TabItem>

</Tabs>

## 验证 API

```bash
curl "http://127.0.0.1:9080/anything/publish"
```

你应该会看到以下输出：

```json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {},
  "headers": {
    "Accept": "*/*",
    "Host": "localhost",
    "User-Agent": "curl/7.88.1",
    "X-Amzn-Trace-Id": "Root=1-664cc6d6-10fe9f740ab1629e19cf85a2",
    "X-Forwarded-Host": "localhost"
  },
  "json": null,
  "method": "GET",
  "origin": "152.15.0.1, 116.212.249.196",
  "url": "http://localhost/anything/publish"
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
