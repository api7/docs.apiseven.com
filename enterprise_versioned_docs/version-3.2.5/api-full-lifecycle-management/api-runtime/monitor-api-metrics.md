---
title: 监控 API 指标
slug: /api-full-lifecycle-management/api-runtime/monitor-api-metrics
---

API7 企业版支持以最小的延迟向监控系统公开一组全面的指标，从而促进持续的监控和诊断。API7 企业版的监控和报警框架基于广泛使用的系统监控和报警工具包 Prometheus 进行构建。Prometheus 收集并存储多维时间序列数据，包括用键值标签注释的指标。

本文档介绍了如何集成 `prometheus` 插件和监控系统，以便收集和可视化 HTTP 指标。

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#super-admin)或 [API 提供者](../../administration/role-based-access-control.md#api-provider)角色的用户账户。
2. [按服务发布 API](../api-publishing/publish-apis-by-service.md)。

## 监控所有服务

建议启用 `prometheus` 插件作为全局规则，确保所有服务和路线都得到一致的监控和跟踪。

如需监控所有服务，遵循以下步骤：

1. 从左侧导航栏中选择**网关组**，然后选择 **Test Group**。
2. 从左侧导航栏中选择**全局插件**。
3. 在**插件**字段中，搜索 `prometheus` 插件。
4. 单击**加号**图标 (+)，弹出对话框。

    ![启用插件](https://static.apiseven.com/uploads/2023/12/08/vcAd0YGv_promethus_plugin_zh.png)

5. 单击**启用**。
6. 发送 API 请求。
7. 从侧面导航栏中选择**监控**，检查指标。
