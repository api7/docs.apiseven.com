---
title: 回滚 API
slug: /api-full-lifecycle-management/api-publishing/rollback-apis
---

当变更带来问题时，回滚 API 可以将其恢复到历史稳定版本。由于 API 是以服务维度进行发布，所以也应当以服务维度回滚 API。

注意，历史版本不包含[运行时配置](../../key-concepts/services.md#运行时配置)。它们的当前值将保持不变。

:::info

不能回滚到从未在网关组中发布但已在其他网关组中发布的版本。

:::

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#API提供者)角色的用户账户。
2. [以服务维度发布 API](../api-publishing/publish-apis-by-service.md)。

## 作为 API 提供者回滚服务

1. 从左侧导航栏中选择**服务**。

2. 选择 `Swagger Petstore` 服务，单击**查看历史版本**。

3. 选择版本 `1.0.0`，然后单击**回滚**。
4. 输入服务名称，然后单击**回滚**。

## 作为运行时管理员回滚服务

1. 从左侧导航栏中选择**网关组**，然后单击**测试网关组**。
2. 从左侧导航栏中选择**已发布服务**。
3. 展开服务 `Swagger Petstore` 的历史版本。
4. 选择版本 `1.0.0`，然后单击**回滚**。
5. 输入服务名称，然后单击**回滚**。