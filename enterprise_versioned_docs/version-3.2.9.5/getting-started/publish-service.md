---
title: 以服务维度发布 API
slug: /getting-started/publish-service
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

设计、开发和部署 API 后，你可以在 API7 企业版中发布这些 API，以便进行访问。你可以将其发布到测试环境、预生产环境、生产环境，或多个区域。

本教程以 `Swagger Petstore` 为例，介绍如何将 API 发布到测试环境。通常情况下，开发人员根据后端服务组织 API，因此 API7 以服务维度管理 API。特定后端的 API 共享配置，并在后端发生变化时一起更新。

## 前提条件

1. [安装 API7 企业版](install-api7-ee.md)。
2. 获取一个具有**超级管理员** 或 **API 提供者** 角色的用户账户。
3. 将默认网关组重命名为`测试网关组`并配置网络。该网关组将作为测试环境的 API 网关。
4. [在网关组中至少新增一个网关实例](add-gateway-instance.md)。

## 新增服务和路由

<Tabs
defaultValue="manually"
values={[
{label: '手动新增', value: 'manually'},
{label: '导入 OpenAPI 3.0', value: 'openapi'},
]}>
<TabItem value="manually">

1. 从左侧导航栏中选择 **服务**， 然后单击**新增服务**。
2. 选择 **手动新增**。
3. **名称**填写`Swagger Petstore`。
4. 单击**新增**。
5. 在服务详情页面中，单击**新增路由**。
6. 在**新增路由** 对话框中, 执行以下操作:
   1. **名称**填写`getPetById`。
   2. **路径**填写`/pet/*`。
   3. **HTTP 方法**选择`GET`。
7. 单击**新增**。

</TabItem>
<TabItem value="openapi">

1. 从左侧导航栏中选择**服务**，然后单击**新增服务**。
2. 选择**导入 OpenAPI**。
3. 上传 YAML/JSON 文件，然后选择`HTTP`作为**上游 Scheme**。
4. 单击**下一步**。
5. 确认以下信息都无误后单击**下一步**：
   1. **名称**：来自 OpenAPI 文件中的`title`。
   2. **标签**：来自 OpenAPI 文件中的`tag`。
   3. **描述**：来自 OpenAPI 文件中的`description`。
   4. **路由**：来自 OpenAPI 文件中的`Paths`。
6. 单击**新增**。

 </TabItem>
</Tabs>

## 使用上游节点发布服务

<Tabs
defaultValue="single"
values={[
{label: '发布单个服务', value: 'single'},
{label: '批量发布服务', value: 'batch'},
]}>

<TabItem value="single">

1. 从左侧导航栏中选择 **服务**， 然后选择目标服务`Swagger Petstore`，然后单击**立刻发布**。
2. 选择`测试网关组`，然后单击**下一步**。
3. 在**服务发布** 对话框中, 执行以下操作:
   1. **新版本**填写`1.0.0`。
   2. **如何找到上游**选择`使用节点`。
4. 单击**新增节点**，在对话框中, 执行以下操作:
   1. **主机**和**端口**，填写 API 在测试环境的后端服务地址。
   2. **权重**使用默认值`100`。
   3. 单击**新增**。
5. 确认信息都无误后，单击**发布**。

</TabItem>
<TabItem value="batch">

1. 从左侧导航栏中选择 **服务**， 单击**批量发布服务**。
2. 选择`测试网关组`，然后单击**下一步**。
3. 按照发布单个服务的类似步骤，添加多个待发布的服务。
4. 批量发布服务要求操作者同时具有所选的所有服务的操作权限（API Provider 授权范围），且多个服务之间不可以有重复路径的路由，以免发布后引起冲突。
5. 确认信息都无误后，单击**发布**。

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

1. 从左侧导航栏中选择 **网关组**， 然后选择`测试网关组`。
2. 从左侧导航栏中选择**服务注册中心**，然后单击**新增服务注册中心连接**。
3. 在**新增服务注册中心连接** 对话框中, 执行以下操作:
   1. **名称**填写`测试 Kubernetes 注册中心`。
   2. **发现类型**选择`Kubernetes`。
   3. 填写**API 服务器地址**和**令牌**。
   4. 单击**新增**。
   5. 等待连接，确保注册中心连接状态为`健康`。
   6. 从左侧导航栏中选择 **服务**， 然后选择目标服务`Swagger Petstore`，然后单击**立刻发布**。
4. 选择`测试网关组`，然后单击**下一步**。
5. 在**服务发布** 对话框中, 执行以下操作:
   1. **新版本**填写`1.0.0`。
   2. **如何找到上游**选择`使用服务发现`。
   3. **服务注册中心**选择`测试 Kubernetes 注册中心`，并选择好对应的命名空间和服务名称。
   4. 单击**发布**。

</TabItem>
<TabItem value="Nacos">

1. 从左侧导航栏中选择 **网关组**， 然后选择`测试网关组`。
2. 从左侧导航栏中选择**服务注册中心**，然后单击**新增服务注册中心连接**。
3. 在**新增服务注册中心连接** 对话框中, 执行以下操作:
   1. **名称**填写`测试 Nacos 注册中心`。
   2. **发现类型**选择`Nacos`。
   3. 填写**主机地址**和**端口号**。
   4. 单击**新增**。
   5. 等待连接，确保注册中心连接状态为`健康`。
   6. 从左侧导航栏中选择 **服务**， 然后选择目标服务`Swagger Petstore`，然后单击**立刻发布**。
4. 选择`测试网关组`，然后单击**下一步**。
5. 在**服务发布** 对话框中, 执行以下操作:
   1. **新版本**填写`1.0.0`。
   2. **如何找到上游**选择`使用服务发现`。
   3. **服务注册中心**选择`测试 Nacos 注册中心`，并选择好对应的命名空间和服务名称。
   4. 单击**发布**。

</TabItem>
<TabItem value="Nacos">

1. 从左侧导航栏中选择 **网关组**， 然后选择`测试网关组`。
2. 从左侧导航栏中选择**服务注册中心**，然后单击**新增服务注册中心连接**。
3. 在**新增服务注册中心连接** 对话框中, 执行以下操作:
   1. **名称**填写`测试 Nacos 注册中心`。
   2. **发现类型**选择`Nacos`。
   3. 填写**主机地址**和**端口号**。
   4. 单击**新增**。
   5. 等待连接，确保注册中心连接状态为`健康`。
   6. 从左侧导航栏中选择 **服务**， 然后选择目标服务`Swagger Petstore`，然后单击**立刻发布**。
4. 选择`测试网关组`，然后单击**下一步**。
5. 在**服务发布** 对话框中, 执行以下操作:
   1. **新版本**填写`1.0.0`。
   2. **如何找到上游**选择`使用服务发现`。
   3. **服务注册中心**选择`测试 Nacos 注册中心`，并选择好对应的命名空间、分组和服务名称。
   4. 单击**发布**。

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
