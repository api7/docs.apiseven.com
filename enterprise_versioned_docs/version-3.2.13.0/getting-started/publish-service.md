---
title: 发布服务版本
slug: /getting-started/publish-service
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

当你的 API 设计、开发和部署完成后，如果有版本管理的场景和需求，可以使用 API7 网关将服务发布到不同的网关组，而非直接在网关组上对配置进行修改。 通常，API 会先发布到测试环境，然后再发布到生产环境。API7 通过网关组来隔离不同的环境，在各个环境中，API 从属于一个服务（Service），服务内所有 API 拥有共享的上游 (Upstream)。 

本教程将指导你将 [httpbin](https://httpbin.org/) 服务发布到一个网关组。你将学习如何：

1. 手动创建服务以及通过 OpenAPI 文件创建服务。
2. 通过配置上游节点和使用服务发现机制来发布服务。

## 前提条件

1. [安装API7 企业版](install-api7-ee.md)。
2. 确保网关组中至少有一个[网关实例](../key-concepts/gateway-instances.md)。

## 新增服务模板并添加路由

<Tabs
defaultValue="manually"
values={[
{label: '手动新增', value: 'manually'},
{label: '导入 OpenAPI', value: 'openapi'},
]}>
<TabItem value="manually">

1. 在左侧导航栏中选择 **服务中心**， 然后点击 **新增服务**。
2. 选择 **手动新增**。
3. 在表单中执行以下操作：
  1. **名称** 填写 `httpbin API`。
  2. **服务类型** 选择 `HTTP （七层代理）`。
  3. **上游 Scheme** 选择 `HTTP`。
  4. 点击 **新增**。
4. 进入服务内, 点击 **新增路由**。
5. 在表单中，执行以下操作：
   1. **名称** 填写 `getting-started-anything`.
   2. **路径** 填写 `/anything/*`。
   3. **HTTP 方法** 选择 `GET`。
6. 点击 **新增**。

</TabItem>

<TabItem value="openapi">

API7 网关支持 [OpenAPI v3.0](https://swagger.io/specification/)。首先，请在 YAML/JSON 中定义你的 API，示例如下：

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

1. 在左侧导航栏中选择 **服务中心**， 然后点击 **新增服务**。
2. 选择 **导入 OpenAPI**。
3. 在表单中执行以下操作：
  1. 上传你的 YAML/JSON 文件。
  2. **上游 Scheme** 选择 `HTTP`。
  3. 点击 **下一步**。
4. 确认以下信息：
   1. **名称**：来自 OpenAPI 文件的 `title`。
   2. **标签**：来自 OpenAPI 文件的 `tag`。
   3. **描述**：来自 OpenAPI 文件的 `description`。
   4. **路由**: 来自 OpenAPI 文件的 `Paths`。
5. 点击 **新增**。

</TabItem>
</Tabs>

## 将服务版本发布到网关组

在 API7 网关中，你可以使用静态上游节点或动态服务发现来定义请求的目标。静态上游节点适用于地址固定的、定义明确的服务，而动态服务发现则更适合于服务实例可以动态添加或删除的微服务架构。

### 使用上游节点发布服务

1. 在左侧导航栏中选择 **服务中心**， 然后选择之前创建的 `httpbin API` 服务。
2. 点击 **发布新版本**。
3. 在对话框中选择目标网关组，例如 `默认网关组`， 然后点击 **下一步**。
4. 在表单中执行以下操作：
  1. **新版本** 填写 `1.0.0`。
  2. **如何找到上游** 选择 `使用节点`。
  3. 点击 **新增节点**。在表单中执行以下操作：
    1. **主机** 和 **端口** 填写 `httpbin.org` 和 `80`。
    2. **权重** 使用默认值 `100`。
  4. 点击 **新增**。
5. 确认服务信息，然后点击 **发布**。

如需同时批量发布多个服务，在左侧导航栏中选择 **服务中心**， 然后点击 **批量发布服务**。

## 使用服务发现发布服务

Consul、Eureka、Nacos 或 Kubernetes Service Discovery 等服务发现机制可以动态检测后端节点。因此，用户无需手动输入多个上游节点。

:::info

发布后，服务无法在使用定义的上游节点和使用服务发现之间直接切换。不过，可以通过流量灰度在上游节点和服务发现之间进行切换。

:::

<Tabs
defaultValue="kubernetess"
values={[
{label: 'Kubernetes', value: 'kubernetess'},
{label: 'Nacos', value: 'Nacos'},
]}>
<TabItem value="kubernetess">

1. 在左侧导航栏选择 **网关组**，然后选择你的目标网关组，例如 `默认网关组`。
2. 在左侧子菜单选择 **服务注册中心**，然后点击 **新增服务注册中心连接**。
3. 在表单中执行以下操作：
  1. **名称** 填写 `测试用注册中心`。
  2. **发现类型** 选择 `Kubernetes`。
  3. 填写注册中心的 **API 服务器地址** 和 **令牌**。
  4. 点击 **新增**。
4. 等待注册中心的状态变为 `健康`。
5. 在左侧导航栏选择 **服务中心**，然后点击 `httpbin API` 服务下面的 **发布新版本**。
6. 选择你的目标网关组，例如 `默认网关组`，然后点击 **下一步**。
7. 在表单中执行以下操作：
   1. **新版本** 填写 `1.0.0`。
   2. **如何找到上游** 选择 `使用服务发现`。
   3. **服务注册中心** 选择 `测试用注册中心`，然后选择对应的 **命名空间** 和 **服务名称**。
   4. 确认服务信息，然后点击 **发布**。

下面是一个互动演示，提供连接 Kubernetes 服务发现的实践入门。通过点击并按照步骤操作，你将更好地了解如何在 API7 网关中使用它：

<StorylaneEmbed src='https://app.storylane.io/demo/wf6vrqlk9knc' />

</TabItem>
<TabItem value="Nacos">

1. 在左侧导航栏选择 **网关组**，然后选择你的目标网关组，例如 `默认网关组`。
2. 在左侧子菜单选择 **服务注册中心**，然后点击 **新增服务注册中心连接**。
3. 在表单中执行以下操作：
  1. **名称** 填写 `测试用注册中心`。
  2. **发现类型** 选择 `Nacos`。
  3. **主机名** 填写注册中心的主机名和端口。
  4. **如何找到令牌** 选择获取令牌和配置其他必要参数的方式。
  5. 点击 **新增**。
4. 等待注册中心的状态变为 `健康`。
5. 在左侧导航栏选择 **服务中心**，然后点击 `httpbin API` 服务下面的 **发布新版本**。
6. 选择你的目标网关组，例如 `默认网关组`，然后点击 **下一步**。
7. 在表单中执行以下操作：
   1. **新版本** 填写 `1.0.0`。
   2. **如何找到上游** 选择 `使用服务发现`。
   3. **服务注册中心** 选择 `测试用注册中心`，然后选择对应的 **命名空间** ， **分组** 和 **服务名称**。
   4. 确认服务信息，然后点击 **发布**。

下面是一个互动演示，提供连接 N啊从事 服务发现的实践入门。通过点击并按照步骤操作，你将更好地了解如何在 API7 网关中使用它：

<StorylaneEmbed src='https://app.storylane.io/demo/9qhfqjk2mnxn' />

</TabItem>
</Tabs>

## 使用 ADC 发布服务

你还可以使用 ADC 来声明式配置 API7 企业版。完整的配置如下：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    routes:
      - uris:
          - /anything/*
        name: getting-started-anything
        description: Return anything that is passed in on the request.
        methods:
          - GET
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc.yaml
```

[//]: <TODO: document adc convert openapi>

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

- Key Concepts
  - [Services](../key-concepts/services.md)
- Getting Started
  - [Synchronize Published Service Version between Gateway Groups](sync-service.md)
  - [Rollback a Published Service](rollback-service.md)
- Best Practices
  - [API Version Control](../best-practices/api-version-control.md)
