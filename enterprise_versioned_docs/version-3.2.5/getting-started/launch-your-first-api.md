---
title: 启动你的 API
slug: /getting-started/launch-your-first-api
---

本教程介绍如何创建一个简单的 API 并对其进行验证。你将完成以下步骤：

1. 在[路由](../key-concepts/routes)和[上游](../key-concepts/upstreams)中创建指向 `httpbin.org` 的[服务](../key-concepts/services)。
2. 将服务发布到默认的[网关组](../key-concepts/gateway-groups)。
3. 使用 `cURL` 向代理发送 API 请求，并将请求转发到上游。

## 前提条件

1. 安装 [API7 企业版](./install-api7-ee.md)。
2. 获取具有[超级管理员](../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../administration/role-based-access-control.md#api-提供者)角色的用户账户。
3. 确保默认网关组中至少有一个[网关实例](../key-concepts/gateway-instances)。

## 步骤 1：创建服务

如需创建服务，请遵循以下步骤：

1. 从左侧导航栏中选择**服务**，然后单击**新增服务**。
2. 选择**手动添加**，弹出**新增服务**对话框，如下所示：

    ![新增服务](https://static.apiseven.com/uploads/2023/12/07/0JZ2RX5E_add-service_zh.png)

3. 在**新增服务**对话框中执行以下操作：
    - 在**名称**字段中，输入 `httpbin`。
    - 在**上游 Scheme** 字段中，选择 `HTTP`。
4. 单击**添加**。

## 步骤 2：创建路由

如需创建路由，请遵循以下步骤：

1. 单击上一步中刚刚创建的服务，然后单击**添加路由**。弹出**新增路由**对话框，如下所示：

    ![新增路由](https://static.apiseven.com/uploads/2023/12/07/KI3qHN3j_add-route_zh.png)

2. 在**新增路由**对话框中，执行以下操作：
    - 在**路由名称**字段中，输入 `getting-started-ip`。
    - 在**路径**字段中，输入 `/ip`。
    - 在 **HTTP 方法**字段中，选择 `GET`。
3. 单击**新增**。

## 步骤 3：发布服务

如需发布服务，请遵循以下步骤：

1. 从左侧导航栏中选择**服务**，然后单击**发布服务**。
2. 在**网关组**字段中，选择 `default`。
3. 单击**添加服务模板**，弹出**添加服务**对话框，如下所示：

    ![添加服务模板](https://static.apiseven.com/uploads/2023/12/07/SqTtXOFa_publish-service_zh.png)
    
4. 在**添加服务**对话框中，执行以下操作：
    - 在**服务模板**字段中，选择 `httpbin`。
    - 在**新版本**字段中，输入 `1.0.0`。
3. 单击**添加**。
4. 确认服务信息，然后单击**下一步**。
5. 单击**添加节点**，弹出**添加节点**对话框，如下所示：

    ![添加节点](https://static.apiseven.com/uploads/2023/12/07/dXEfZ4gS_add-node_zh.png)

6. 在**添加节点** 对话框中执行以下操作：
    - 在**主机** 字段中，输入 `httpbin.org`。
    - 在**端口** 字段中，输入 `80`。
    - 在**权重** 字段中，使用默认值 `100`。
4. 单击**添加**。
7. 确认服务信息，然后单击**发布**。

## 步骤 4：验证 API

发送 API 请求：

```bash
curl "http://127.0.0.1:9080/ip" # 将 127.0.0.1 替换为默认网关组的地址。
```

你应该会看到以下输出：

```bash
{
  "origin": "127.0.0.1"
}
```

恭喜你。你的第一个 API 可以正常运行了。