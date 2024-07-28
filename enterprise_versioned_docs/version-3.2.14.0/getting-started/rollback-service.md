---
title: 回滚已发布的服务版本
slug: /getting-started/rollback-service
---

回滚允许你在新版本出现问题时将服务恢复到当前网关组之前发布过的旧版本。

:::note

* 旧的服务版本不包含任何[服务运行时配置](../key-concepts/services.md#service-runtime-configurations)。回滚后将继续使用同样的运行时配置。

* 你只能回滚到在同一网关组上发布过的服务版本。

:::

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 在网关组上有一个服务的旧版本。

## 步骤

1. 从侧边栏选择网关组的**已发布服务**，然后点击要回滚的服务版本，例如版本为 `1.2.0` 的 `httpbin API`。
2. 点击页面标题中 **启用/禁用** 旁边的按钮，然后选择 **查看历史版本**。
3. 选择版本 `1.0.0`，然后点击 **回滚**。

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services.md)
  * [网关组](../key-concepts/gateway-groups.md)
* 快速入门
  * [发布服务版本](publish-service.md)
  * [在网关组之间同步已发布的服务版本](sync-service.md)
* 最佳实践
  * [API 版本控制](../best-practices/api-version-control.md)
