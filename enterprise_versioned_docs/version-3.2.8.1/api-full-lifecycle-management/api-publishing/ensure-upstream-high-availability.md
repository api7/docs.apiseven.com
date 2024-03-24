---
title: 确保上游高可用性
slug: /api-full-lifecycle-management/api-publishing/ensure-upstream-high-availability
---

当 API7 企业版向上游发送 API 请求时，如果上游系统发生故障，就会出现可用性和可靠性问题。本文档介绍上游依赖系统的高可用性策略。

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
2. [以服务维度发布 API](../api-publishing/publish-apis-by-service.md)。

## 添加多个上游节点

使用多个上游节点可以防止单个节点失效。根据[运行时配置](../../key-concepts/services.md#运行时配置)，用户可以直接更改正在发布或已经发布的上游节点。对网关组上游节点的修改不会影响在其他网关组上发布的相同服务版本。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore** > **1.0.0**。
2. 从左侧导航栏中选择**上游**，然后单击**节点** > **新增节点**。
3. 在对话框中，执行以下操作：
    - 在**主机**和**端口**字段中，输入另一个 API 端点。
    - 在**权重**字段中，输入与第一个节点相同的 `100`。
3. 单击**新增**。

## 修改负载均衡类型

负载均衡将网络请求分配给多个节点。这对处理高流量的系统至关重要，可提高性能、可扩展性和可靠性。

API7 企业版支持多种负载均衡算法：

- 加权轮循
- 一致散列
- 指数加权移动平均法（Exponentially Weighted Moving Average，EWMA）
- 最少连接

默认情况下，API7 企业版使用加权轮循算法。该算法根据节点的权重以循环模式将收到的请求分配给一组节点。

由于负载均衡类型不属于[运行时配置](../../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后将新版本发布到网关组。**已发布的版本中**，无法修改负载均衡类型。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择**上游**。
3. 在**上游配置信息**字段中，单击**编辑**。
4. 在对话框中，将**负载均衡类型**更改为 `Least Connection`。
5. 单击**编辑**。
6. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**发布新版本**。
7. 在弹出的对话框中，选择`测试网关组`，然后单击**下一步**。
8. 在**新版本**字段中，输入 `1.0.1`。
9. 确认服务信息，然后单击**发布**。

## 启用健康检查

健康检查是一种根据上游节点的响应速度确定其健康与否的机制。启用健康检查后，API7 企业版将只向认为健康的上游节点转发请求，而不向认为不健康的节点转发请求。

健康检查一般有两种方法：

- 主动健康检查：通过主动探测节点来确定上游节点的健康状况。
- 被动健康检查：根据节点对用户请求的响应情况确定上游节点的健康状况，而不启动额外的探测。被动检查必须与主动检查一起使用。它们不能单独使用。

由于健康检查配置不属于[运行时配置](../../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后将新版本发布到网关组。**已发布的版本中**，无法更改健康检查配置。

:::info

在启用健康检查之前，请确保 API 后端已经实施了 API 端点的健康检查。

:::

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择**上游**。
3. 在**主动健康检查**字段中，单击**启用**。
4. 在对话框中，执行以下操作：
    - 在**协议**字段中，选择 `HTTP`。
    - 在 **HTTP 探测路径**字段中，输入 `/health`。
    - 其余字段使用默认值。
    - 单击**启用**。

5. 在**被动健康检查**字段中，单击**启用**。
6. 在对话框中，执行以下操作：
    - 在**协议**字段中，选择 `HTTP`。
    - 其余字段使用默认值。
    - 单击**启用**。
7. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**发布新版本**。
8. 在弹出的对话框中，选择`测试网关组`，然后单击**下一步**。
9. 在**新版本**字段中，输入 `1.0.1`。
10. 确认服务信息，然后单击**发布**。