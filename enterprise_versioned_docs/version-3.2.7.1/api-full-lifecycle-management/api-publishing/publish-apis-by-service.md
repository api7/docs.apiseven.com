---
title: 以服务维度发布 API
slug: /api-full-lifecycle-management/api-publishing/publish-apis-by-service
---

设计、开发和部署 API 后，你可以在 API7 企业版中发布这些 API，以便进行访问。你可以将其发布到测试环境、预生产环境、生产环境，或多个区域。

本教程以 `Swagger Petstore` 为例，介绍如何将 API 发布到测试环境。通常情况下，开发人员根据后端服务组织 API，因此 API7 以服务维度管理 API。特定后端的 API 共享配置，并在后端发生变化时一起更新。

## 前提条件

1. 安装 [API7 企业版](../../getting-started/install-api7-ee.md)。
2. [设计 API](../design-apis.md)。
3. 在你的测试环境中[构建 API 端点](../build-api-endpoints.md)。
4. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
5. 将缺省网关组重命名为`测试网关组`并配置网络。该网关组将作为测试环境的 API 网关。

## 通过导入 OpenAPI 规范添加服务

:::info

目前仅支持 OpenAPI 3.0。

:::

如需通过导入 OpenAPI 规范添加服务，遵循以下步骤：

1. 从左侧导航栏中选择**服务**，然后单击**添加服务**。
2. 选择**导入 OpenAPI**。
3. 上传 YAML/JSON 文件，并选择 `HTTP` 作为上游 Scheme。
4. 单击**下一步**。
5. 确认以下信息，然后单击**下一步**： 
   
    - **名称**：OpenAPI 规范中的 `Title` 字段
    - **标签**：OpenAPI 规范中的 `Tags` 字段
    - **描述**：OpenAPI 规范中的 `Description` 字段
    - **路由**：OpenAPI 规范中的 `Paths` 字段

6. 单击**添加**。

## 向测试网关组发布服务

### 发布单个服务

1. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**立即发布**。
2. 选择 `测试网关组`，然后单击**下一步**。
3. 在弹出的对话框中，执行以下操作：
    - 在**新版本**字段中，输入 `1.0.0`。
    - 在**如何找到上游**字段中，选择`使用节点`。
    <br />
    <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2024/01/24/Tkc4kaLa_publish-service-openAI_node_zh.png" alt="发布服务" width="95%" />
    </div>
    <br /><br />
5. 单击**新增节点**。在对话框中，执行以下操作：
    - 在**主机**和**端口**字段中，输入测试环境中的后端节点地址或模拟服务器地址。
    - 在**权重**字段中，使用默认值 `100`。
    - 单击**添加**。
6. 确认服务信息，然后单击**发布**。

### 批量发布服务

1. 从左侧导航栏中选择**服务**，然后单击**发布服务**。
2. 在**网关组**字段中，选择`测试网关组`，然后单击**下一步**。
3. 单击**添加服务**。在对话框中，执行以下操作：
    - 在**服务**字段中，选择 `Swagger Petstore`。
    - 在**新版本**字段中，输入 `1.0.0`。
    - 单击**添加**。

    ![由 OpenAI 发布服务](https://static.apiseven.com/uploads/2024/01/24/Tkc4kaLa_publish-service-openAI_node_zh.png)

4. 确认服务信息，然后单击**下一步**。
5. 在**如何查找上游**字段中，选择`使用节点`。
7. 单击**添加节点**。在对话框中，执行以下操作：
    - 在**主机**和**端口**字段中，输入测试环境中的后端节点地址或模拟服务器地址。
    - 在**权重**字段中，使用默认值 `100`。
    - 单击**添加**。
6. 确认服务信息，然后单击**发布**。


## 使用服务发现发布服务

Consul、Eureka、Nacos 或 Kubernetes Service Discovery 等服务发现机制可以动态检测后端节点。因此，用户无需手动输入多个上游节点。

:::info

发布后，服务无法在使用定义的上游节点和使用服务发现之间直接切换。不过，可以通过流量灰度在上游节点和服务发现之间进行切换。

:::

1. 从左侧导航栏中选择**网关组**，然后单击**测试网关组**。
2. 从左侧导航栏中选择**服务注册中心**，然后单击**连接服务注册中心**。

    ![连接服务注册中心](https://static.apiseven.com/uploads/2023/12/15/j6jTU5Vb_connect-service-registry_zh.png)

3. 在**连接服务注册中心**对话框中，执行以下操作：
    - 在**名称**字段中，输入`测试服务注册中心`。
    - 填写 **API 服务器地址**和**令牌**字段。
    - 单击**连接**。
4. 等待以确保服务注册中心的状态为健康。
5. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**立即发布**。
6. 选择 `测试网关组`，然后单击**下一步**。
7. 在弹出的对话框中，执行以下操作：
    - 在**新版本**字段中，输入 `1.0.0`。
    - 在**如何找到上游**字段中，选择`使用服务发现`。
    <br />
    <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2024/01/24/01dfz0H0_publish-service-openAI_zh.png" alt="发布服务" width="95%" />
    </div>
    <br /><br />

    - 在**服务注册中心**字段中，选择`测试服务注册中心`。
    - 填写**注册中心中的名称空间**和**注册中心中的服务名称**字段。
8. 确认服务信息，然后单击**发布**。

## 在测试环境中验证 API

```bash
curl "http://127.0.0.1:9080/pet/1" # 将 127.0.0.1 替换为测试网关组的地址。
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