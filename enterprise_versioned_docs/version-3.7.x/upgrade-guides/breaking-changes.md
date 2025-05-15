---
title: 历史破坏性变更
slug: /upgrade-guides/breaking-changes
description: 了解 API7 Enterprise 各版本的破坏性变更，包括已弃用功能及避免服务中断的升级注意事项。
---

## 3.6.0

**发布日期**: 2025-02-26

* 移除服务模板中的[服务运行时配置](../key-concepts/services.md#service-runtime-configurations)，以提升模板在网关组间的复用性。**服务模板中的现有运行时配置将被移除，但已发布的服务配置保持不变。** 此外还简化了发布流程，发布过程中不再允许变更服务运行时配置。详见更新后的[发布服务](../getting-started/publish-service.md)指南。

## 3.5.0

**发布日期**: 2025-01-27

* **服务多上游支持**：针对灰度发布、蓝绿部署或多集群管理等高级场景，服务现可配置多个上游。其中默认上游作为主请求目标，其他上游可用于特定用途（如将流量路由至灰度版本或次级集群）。详见新版[配置灰度流量迁移](../getting-started/canary-upstream.md)。

:::info

旧版**灰度规则**功能已不可用。

:::
