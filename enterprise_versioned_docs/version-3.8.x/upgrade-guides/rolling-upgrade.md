---
title: 滚动升级
slug: /upgrade-guides/rolling-upgrade
description: 执行 API7 企业版数据平面节点滚动升级的分步指南，确保零停机时间，同时保持API请求处理和服务连续性。
---

**数据平面（DP）** 中的节点将使用滚动升级方法进行升级。

滚动升级意味着在关闭旧版本 DP 节点的同时持续添加新版本 DP 节点，允许在过程中不间断地处理 API 请求。

![DP Upgrade](https://static.api7.ai/uploads/2025/05/26/2MeSFjf1_upgrade-dp.png)

## 准备工作

1. 阅读[升级指南](./upgrade.md)并确保您了解整个升级过程的执行方式。
2. [控制平面（CP）升级](./in-place)已完成。

## 滚动升级步骤

:::info

以下步骤仅供参考。实际步骤可能因您的部署环境而异。

:::

1. 在升级过程中，禁止通过 API 或其他方法修改您的数据。
2. 备份您当前的数据，请参考[备份指南](./backup-and-restore#database-backup)。
3. 阅读[升级注意事项](./upgrade.md#upgrade-considerations)。
4. 检查当前版本和目标升级版本之间的所有变更。
   - [完整变更日志](/enterprise/release-notes)
   - [破坏性变更](./breaking-changes.md)
5. 根据您的网关实例安装方法（[Docker](../getting-started/add-gateway-instance.md)、[Kubernetes](../getting-started/add-gateway-instance.md)），修改相应配置文件（`docker-compose`、`helm chart`）中 `api7-ee-3-gateway` 的镜像版本。
   - 如果版本更新记录包含其他配置的变更，请检查变更日志描述以确认是否需要相应地更新其他配置。
6. 使用修改后的配置文件重启网关实例。
   - 更新一个网关组中的实例后，您可以对该网关组进行一些测试以确保正常运行。
     如果结果不符合预期，请再次查看[变更日志](/enterprise/release-notes)以确认是否遗漏了什么。
   - 继续更新和替换您其他网关组中的网关实例。
7. 主动监控所有代理指标，并在升级后发送一些测试请求以验证正常运行。
8. 如果遇到任何问题，请参考[回滚升级](./backup-and-restore#restore-from-database)。
9. 观察一段时间后没有其他问题，DP 升级完成。

您现在可以继续使用 API、Dashboard 和 ADC 来更新和修改您的配置。
