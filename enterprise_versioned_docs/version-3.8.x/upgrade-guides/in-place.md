---
title: 就地升级
slug: /upgrade-guides/in-place
description: API7 Enterprise 控制平面就地升级的分步指南，涵盖数据库重用、配置更新和验证程序。
---

您可以使用就地升级策略来升级 **控制平面 (CP)**。

就地升级策略重用现有数据库。在升级过程中，**禁止**通过 API 或持续的 CP 操作修改您的配置。

因此，这种升级方法将导致 CP 的一些停机时间，如下图所示：

![CP In-Place Upgrade](https://static.api7.ai/uploads/2025/05/26/uPmkawuz_upgrade-cp.png)

## 准备工作

1. 阅读 [升级指南](./upgrade.md) 并确保您了解整个升级过程的执行方式。
2. 注意此升级过程中的停机时间并确认合适的升级时机。
3. [备份](./backup-and-restore.md) 您的数据。

## 就地升级步骤

:::info

以下实施步骤仅供参考。实际执行可能会根据您的部署环境而有所不同。

:::

1. 在升级过程中，禁止通过 API 或其他方法修改您的数据。
2. 备份您当前的数据，参考 [备份指南](./backup-and-restore.md#database-backup)。
3. 阅读 [升级注意事项](./upgrade.md#upgrade-considerations)。
4. 检查当前版本和目标升级版本之间的所有变更。
    - [完整变更日志](/enterprise/release-notes)
    - [破坏性变更](./breaking-changes.md)
5. 根据您的 API7 Enterprise 安装方法（[Docker](../getting-started/install-api7-ee.md)、[Kubernetes](../deployment/k8s-openshift.md)），在相应的配置文件中修改 `api7-ee-dashboard` 和 `api7-ee-dp-manager` 的镜像版本（`docker-compose`、`helm chart`）。
6. 使用修改后的配置文件重启 CP。
7. 访问 Dashboard 检查是否正常运行。
8. 如果遇到任何问题，请参考 [回滚升级](./backup-and-restore#data-restore-and-rollback)。
9. 观察一段时间没有其他问题后，CP 升级完成。

## 后续步骤

完成 CP 升级后，您可以开始准备 [升级 DP](./rolling-upgrade.md)。
