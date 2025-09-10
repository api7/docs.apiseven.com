---
title: 备份和恢复
slug: /upgrade-guides/backup-and-restore
description: 学习如何备份和恢复您的 API7 Enterprise 数据，包含数据库备份、声明式配置备份和数据恢复程序的分步说明。
---

您可以使用以下两种方法来备份 API7 Enterprise 中使用的数据库数据。

1. 使用数据库提供的原生工具来备份数据。这允许您快速将备份的数据导入到新数据库中，以便立即恢复。
2. 使用 [ADC 工具](../reference/adc.md) 以声明式配置文件的形式备份您的网关配置（服务、路由、插件、消费者等）。

建议同时使用这两种方法，因为这在遇到以下问题时恢复数据时提供了更大的灵活性。

:::danger

如果数据损坏，**请先尝试数据库级恢复**，否则使用新数据库并使用存储的声明式配置文件更新您之前的配置。

:::

## 数据库备份

### 数据库原生备份

API7 Enterprise 默认使用 `PostgreSQL` 数据库。使用 PostgreSQL 的原生命令，您可以使用 `pg_dump` 命令以纯文本、目录和其他格式备份数据。例如，以目录格式备份的命令：

```shell
pg_dump -U api7ee -d api7ee -F d -f api7ee_backup_20250523
```

- `pg_dump`：PostgreSQL 的逻辑备份工具，用于导出数据库内容。
- `-U api7ee`：指定数据库连接用户名为 `api7ee`。
- `-d api7ee`：指定要备份的数据库名为 `api7ee`。
- `-F d`：指定备份格式为目录格式，适用于大型数据库和并行恢复。
- `-f api7ee_backup_20250523`：指定备份的输出目录名为 `api7ee_backup_20250523`。备份结果将存储在此目录中。

### 声明式文件备份

使用 [ADC 工具](../reference/adc.md) 以声明式配置文件的形式备份您的 API7 网关配置（服务、路由、插件、消费者等）。

1. 使用 ADC 执行服务验证，确保它可以正常连接到 API7 Enterprise：

   ```shell
   adc ping --backend api7ee --server "https://{DASHBOARD_ADDR}"
   ```

2. 使用 ADC `dump` 命令将每个网关组的数据本地存储：

   ```shell
   adc dump -o api7ee-dump.yaml --backend api7ee --server "https://{DASHBOARD_ADDR}"
   ```

这里有 [示例配置文件](../reference/configuration-adc.md#sample-configuration-file)。更多 ADC 命令，请参见 [ADC 命令参考](../reference/adc.md)。

## 数据恢复和回滚

### 从数据库恢复

要从数据库备份恢复 API7 Enterprise 数据，您需要首先准备一个新数据库，以 PostgreSQL 为例。

![data restore](https://static.api7.ai/uploads/2025/05/26/9AbDoxDQ_database-backup.png)

1. 在 CP（Dashboard 和 DP-Manager）配置文件中修改数据库连接地址到新数据库：

   ```yaml
   database:
     dsn: "postgres://api7ee:changeme@192.168.31.10:5432/api7ee"
   ```

   重启 CP。

2. 恢复之前备份的数据：

   ```shell
   pg_restore -U api7ee -C -d api7ee api7ee_backup_20250523/
   ```

   - `-U`：指定数据库连接用户名。此用户需要足够的权限来创建和恢复数据库。
   - `-C`：首先创建目标数据库，然后连接到数据库进行恢复。
   - `-d`：指定目标数据库名称。

3. 使用之前存储的本地部署脚本或网关实例的配置文件重新部署 DP 中的节点。

### 从声明式配置恢复

:::danger

如果您遇到问题需要回滚，**请先尝试数据库恢复**。只有在数据损坏时才将声明式配置恢复作为最后手段。

:::

首先，将您部署的 API7 Enterprise（CP & DP）恢复到原始版本的配置和镜像标签，并将其连接到您新准备的数据库。然后，使用 [ADC 工具](../reference/adc.md) 恢复您之前的配置。

1. 使用 ADC 验证服务连接性并确认它可以连接到 API7 Enterprise：

   ```shell
   adc ping --backend api7ee --server "https://{DASHBOARD_ADDR}"
   ```

2. 使用 ADC 同步每个网关组的数据：

   ```shell
   adc sync -f api7ee-dump.yaml --backend api7ee --server "https://{DASHBOARD_ADDR}"
   ```

## 其他文件

除了您在 API7 Enterprise 中创建的资源配置外，还有一些重要文件需要手动备份：

1. 为网关实例创建的 `conf.yaml` 文件。
2. 自定义插件的源代码。
3. 部署 [API7 网关实例](../getting-started/add-gateway-instance.md) 时使用的部署脚本和其他文件。

这些文件与您的业务和部署环境相关。缺少这些文件可能会在出现问题时影响数据恢复。

建议将这些文件存储在您部署 API7 Enterprise 的平台上，以便集中管理。
