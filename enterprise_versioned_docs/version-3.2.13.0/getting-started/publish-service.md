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
3. 在表单中，执行如下操作：
  1. **名称** 填写 `httpbin API`。
  2. **服务类型** 选择 `HTTP （七层代理）`。
  3. **上游 Scheme** 选择 `HTTP`。
4. 点击 **新增**。
5. 进入服务内, 点击 **新增路由**。
6. 在表单中，执行以下操作：
   1. **名称** 填写 `getting-started-anything`.
   2. **路径** 填写 `/anything/*`。
   3. **HTTP 方法** 选择 `GET`。
7. 点击 **新增**。

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
3. 在表单中，执行以下操作：
  1. 上传你的 YAML/JSON 文件。
  2. **上游 Scheme** 选择 `HTTP`。
4. 点击 **下一步**。
5. 确认以下信息：
   1. **名称**：来自 OpenAPI 文件的 `title`。
   2. **标签**：来自 OpenAPI 文件的 `tag`。
   3. **描述**：来自 OpenAPI 文件的 `description`。
   4. **路由**: 来自 OpenAPI 文件的 `Paths`。
6. 点击 **新增**。

</TabItem>
</Tabs>

## 将服务版本发布到网关组

在 API7 网关中，你可以使用静态上游节点或动态服务发现来定义请求的目标。静态上游节点适用于地址固定的、定义明确的服务，而动态服务发现则更适合于服务实例可以动态添加或删除的微服务架构。

### 使用上游节点发布服务

1. 在左侧导航栏中选择 **服务中心**， 然后选择之前创建的 `httpbin API` 服务。
2. 点击 **立即发布**。
3. 在对话框中选择目标网关组，例如 `默认网关组`， 然后点击 **下一步**。
4. From the dialog box, do the following:
   - In the **New Version** field, enter `1.0.0`.
   - In the **How to find the upstream** field, choose `Use Nodes`.
   - Click **Add Node**. From the dialog box, do the following:
     - In the **Host** and **Port** fields, enter your backend node address in the test environment. For this tutorial, use `httpbin.org` as the host and `80` as the port.
     - In the **Weight** field, use the default value `100`.
     - Click **Add**.
5. Confirm the service information and then click **Publish**.

For publishing multiple services at the same time, select **Service Hub** from the side navigation bar and then click **Batch Publish Services**.

1. 从左侧导航栏中选择**服务中心**， 然后选择<code>Swagger Petstore</code>，然后单击<strong>立刻发布</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 在<strong>服务发布</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>新版本</strong>填写<code>1.0.0</code>。</li>
          <li><strong>如何找到上游</strong>选择<code>使用节点</code>。</li>
        </ol>
      </li>
      <li> 单击<strong>新增节点</strong>，在对话框中, 执行以下操作:
        <ol>
          <li><strong>主机</strong>和<strong>端口</strong>，填写 API 在测试环境的后端服务地址。</li>
          <li><strong>权重</strong>使用默认值<code>100</code>。</li>
          <li>单击<strong>新增</strong>。</li>
        </ol>
      </li>
      <li> 确认信息都无误后，单击<strong>发布</strong>。</li>
    </ol>
  </TabItem>
  <TabItem value="openapi">
    <ol>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 单击<strong>批量发布服务</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 按照发布单个服务的类似步骤，添加多个待发布的服务。</li>
      <li> 批量发布服务要求操作者同时具有所选的所有服务的操作权限（API Provider授权范围），且多个服务之间不可以有重复路径的路由，以免发布后引起冲突。</li>
      <li> 确认信息都无误后，单击<strong>发布</strong>。</li>
    </ol>
  </TabItem>
</Tabs>

## 使用服务发现发布服务

Consul、Eureka、Nacos 或 Kubernetes Service Discovery 等服务发现机制可以动态检测后端节点。因此，用户无需手动输入多个上游节点。

:::info

发布后，服务无法在使用定义的上游节点和使用服务发现之间直接切换。不过，可以通过流量灰度在上游节点和服务发现之间进行切换。

:::

<Tabs
  defaultValue="k8s"
  values={[
    {label: 'Kubernetes', value: 'k8s'},
    {label: 'Nacos', value: 'Nacos'},
  ]}>
  <TabItem value="k8s">
    <ol>
      <li> 从左侧导航栏中选择 <strong>网关组</strong>， 然后选择<code>测试网关组</code>。</li>
      <li> 从左侧导航栏中选择<code>服务注册中心</code>，然后单击<strong>新增服务注册中心连接</strong>。</li>
      <li> 在<strong>新增服务注册中心连接</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>名称</strong>填写<code>测试 Kubernetes 注册中心</code>。</li>
          <li><strong>发现类型</strong>选择<code>Kubernetes</code>。</li>
          <li>填写<strong>API 服务器地址</strong>和<strong>令牌</strong>。</li>
        </ol>
      </li>
      <li> 等待连接，确保注册中心连接状态为<code>健康</code>。</li>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 然后选择目标服务<code>Swagger Petstore</code>，然后单击<strong>立刻发布</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 在<strong>服务发布</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>新版本</strong>填写<code>1.0.0</code>。</li>
          <li><strong>如何找到上游</strong>选择<code>使用服务发现</code>。</li>
          <li><strong>服务注册中心</strong>选择<code>测试 Kubernetes 注册中心</code>，并选择好对应的命名空间和服务名称。</li>
        </ol>
      </li>
    </ol>
  </TabItem>
  <TabItem value="Nacos">
    <ol>
      <li> 从左侧导航栏中选择 <strong>网关组</strong>， 然后选择<code>测试网关组</code>。</li>
      <li> 从左侧导航栏中选择<code>服务注册中心</code>，然后单击<strong>新增服务注册中心连接</strong>。</li>
      <li> 在<strong>新增服务注册中心连接</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>名称</strong>填写<code>测试 Nacos 注册中心</code>。</li>
          <li><strong>发现类型</strong>选择<code>Nacos</code>。</li>
          <li>填写<strong>主机地址</strong>和<strong>端口号</strong>。</li>
        </ol>
      </li>
      <li> 等待连接，确保注册中心连接状态为<code>健康</code>。</li>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 然后选择目标服务<code>Swagger Petstore</code>，然后单击<strong>立刻发布</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 在<strong>服务发布</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>新版本</strong>填写<code>1.0.0</code>。</li>
          <li><strong>如何找到上游</strong>选择<code>使用服务发现</code>。</li>
          <li><strong>服务注册中心</strong>选择<code>测试 Nacos 注册中心</code>，并选择好对应的命名空间、分组和服务名称。</li>
        </ol>
      </li>
    </ol>
  </TabItem>
</Tabs>

## 验证 API

```bash
curl "http://127.0.0.1:9080/pet/1" 
```

你应该会看到以下输出：

```bash
{
  "name": "Dog",
  "photoUrls": [
    "https://example.com/dog-1.jpg",
    "https://example.com/dog-2.jpg"
  ],
  "id": 1,
  "category": {
    "id": 1,
    "name": "pets"
  },
  "tags": [
    {
      "id": 1,
      "name": "friendly"
    },
    {
      "id": 2,
      "name": "smart"
    }
  ],
  "status": "available"
}
```