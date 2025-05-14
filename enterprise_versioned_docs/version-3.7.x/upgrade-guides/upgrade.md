---
title: 升级至 API7 企业版 3.7.x
slug: /upgrade-guides/upgrade
description: 为 API7 企业版升级做好准备并确保稳定性。
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本指南将引导您完成从旧版本升级到 API7 企业版3.7.x 的推荐流程。为最大限度降低业务中断风险，在开始升级前需进行全面准备和影响评估。如有任何疑问或需要升级指导，请联系 API7。

API7 企业版采用结构化版本控制方案，区分主版本、次版本和补丁版本。通常推荐使用最新版本，因为它包含已知问题的修复并能最大限度降低风险。或者，也可以考虑最新的长期支持（LTS）版本，当前为 3.7.x。

:::note

最合适的升级策略很大程度上取决于部署模式、自定义插件、特定插件使用情况、技术能力、硬件容量、SLA 等多种因素。因此，在升级前与 API7 进行充分讨论至关重要。

:::

## 概述

升级 API7 企业版包含三个阶段：准备、测试与验证、生产部署。

* 在准备阶段，仔细查阅当前版本与 3.7.x 之间的[版本说明](../release-notes.md)。评估可能需要进行数据迁移或转换的[破坏性变更](breaking-changes.md)。
* 在测试与验证阶段，搭建测试环境并部署 3.7.x。评估新功能的适用性并验证已知问题的修复。
* 在生产部署阶段，考虑采用滚动或金丝雀升级策略，并准备应急回滚计划以降低潜在风险。

## 准备

### 从 3.6.X 升级

无需准备破坏性变更。

### 从 3.5.X 升级

* 升级时，服务模板中的现有服务运行时配置将被自动移除。
  * 已发布的服务配置将保持不变。
  * 此外，发布流程已简化并优化，发布过程中不再允许配置服务运行时。升级后请按照更新的[发布服务](../getting-started/publish-service.md)指南操作。

### 从 3.4.X 升级

* 升级时，服务模板中的现有服务运行时配置将被自动移除。
  * 已发布的服务配置将保持不变。
  * 此外，发布流程已简化并优化，发布过程中不再允许配置服务运行时。升级后请按照更新的[发布服务](../getting-started/publish-service.md)指南操作。
* 旧版**金丝雀规则**功能不再支持。
  * 使用旧版**金丝雀规则**功能完成所有进行中的金丝雀流程。升级后改用[流量分割](https://docs.api7.ai/hub/traffic-split)插件。
  * 升级前删除服务或路由上现有的[流量分割](https://docs.api7.ai/hub/traffic-split)插件。升级后重新配置该插件。

### 从 3.3.X 升级

* 升级时，服务模板中的现有服务运行时配置将被自动移除。
  * 已发布的服务配置将保持不变。
  * 此外，发布流程已简化并优化，发布过程中不再允许配置服务运行时。升级后请按照更新的[发布服务](../getting-started/publish-service.md)指南操作。
* 旧版**金丝雀规则**功能不再支持。
  * 使用旧版**金丝雀规则**功能完成所有进行中的金丝雀流程。升级后改用[流量分割](https://docs.api7.ai/hub/traffic-split)插件。
  * 升级前删除[流量分割](https://docs.api7.ai/hub/traffic-split)插件。升级后重新配置该插件。

## 测试与验证

* 按照[入门指南](../getting-started/install-api7-ee.md)在测试环境部署 3.7.x，并评估新功能。参考[版本说明](../release-notes.md)查看功能列表。
* 提前进行演练以避免意外情况。
* 如有自定义插件，根据版本说明检查代码，并在测试环境中使用新版本测试自定义插件。

## 生产部署

升级过程预计耗时 80 分钟以上。为便于有效升级，API7 企业版的[架构](../introduction/api7-ee-architecture.md)将控制平面节点与数据平面节点（网关实例）分离。因此，推荐升级流程中对控制平面和数据平面节点采用不同策略。

**强烈建议将控制平面和数据平面节点升级至相同版本以确保最大安全性。** 在特定场景或临时升级阶段，也建议检查数据平面节点的版本和兼容性。

控制平面与数据平面的分离使得在控制平面升级期间，数据平面节点仍能处理 API 请求，实现业务零停机。

### 升级控制平面

:::warning

升级的关键前提是先升级控制平面节点，再升级数据平面节点。控制平面升级过程设计为避免业务中断；但在此期间，所有配置变更均被限制，包括通过 Dashboard、ADC、Admin API、Ingress Controller 或直接数据库操作进行的变更。

:::

1. 备份数据库（10 分钟）。可按照自有备份流程备份数据库并生成相应文件，或使用以下流程：

  ```bash
  # 备份整个数据库（自定义格式）
  pg_dump -h <主机> -U <用户名> -d <数据库名> -F c -b -v -f /路径/备份.dump

  # 备份为 SQL 文件（输出为 SQL 文件）
  pg_dump -h <主机> -U <用户名> -d <数据库名> -F p -f /路径/备份.sql

  # 如遇问题需恢复之前备份的数据
  pg_restore -h <主机> -U <用户名> -d <新数据库名> -v /路径/备份.dump

  psql -h <主机> -U <用户名> -d <新数据库名> -f /路径/备份.sql
  ```

2. 备份配置文件，特别是修改过默认设置的（5 分钟）。

  ```text
  * api7-ee/dp_manager_conf/conf.yaml
  * api7-ee/dashboard_conf/conf.yaml
  * api7-ee/gateway_conf/config.yaml
  ```

3. 升级控制平面节点至 3.7.x（20 分钟）

* 部署新的 Dashboard、DP-Manager 及相关 Pod。
* 验证新控制平面节点升级成功。
* 对现有 Pod 执行滚动更新。

在 helm chart [values 文件](https://github.com/api7/api7-helm-chart/blob/main/charts/api7/values.yaml#L5-L13)中更新镜像名称：

  ```yaml title="values.yaml"
  dashboard:
    image:
      repository: api7/api7-ee-3-integrated
      pullPolicy: Always
      # 覆盖默认镜像标签（默认为 chart appVersion）。
      tag: "v3.7.3"
  ```

运行 helm 命令更新 release：

  ```bash
  helm upgrade api7ee3 api7/api7ee3
  ```

### 升级数据平面

:::note

升级过程中数据平面节点可能生成少量错误日志。这是预期行为，可安全忽略。

:::

1. 升级数据平面节点至 3.7.x（一个网关组需 30 分钟）

* 部署新网关 Pod。
* 验证新数据平面节点升级成功。
* 对现有 Pod 执行滚动更新。
* 如有多个网关组，对每个网关组重复上述步骤。

2. 进行验收测试确保升级无误（20 分钟）。

在 helm chart [values.yaml](https://github.com/api7/api7-helm-chart/blob/main/charts/gateway/values.yaml#L99-L106) 中更新镜像名称：

  ```yaml title="values.yaml"
    image:
      repository: api7/api7-ee-3-gateway
      pullPolicy: Always
      tag: 3.7.3
  ```

根据之前在 Dashboard 生成的安装命令，执行 helm 命令更新。只需修改镜像标签。例如：

  ```bash
  helm upgrade --install -n api7 --create-namespace api7-ee-3-gateway api7/gateway \
    --set "etcd.auth.tls.enabled=true" \
    --set "etcd.auth.tls.existingSecret=api7-ee-3-gateway-tls" \
    --set "etcd.auth.tls.certFilename=tls.crt" \
    --set "etcd.auth.tls.certKeyFilename=tls.key" \
    --set "etcd.auth.tls.sni=api7ee3-dp-manager" \
    --set "etcd.auth.tls.verify=true" \
    --set "gateway.tls.existingCASecret=api7-ee-3-gateway-tls" \
    --set "gateway.tls.certCAFilename=ca.crt" \
    --set "apisix.extraEnvVars[0].name=API7_GATEWAY_GROUP_SHORT_ID" \
    --set "apisix.extraEnvVars[0].value=default" \
    --set "etcd.host[0]=https://192.168.10.101:7943" \
    --set "apisix.replicaCount=1" \
    --set "apisix.image.repository=api7/api7-ee-3-gateway" \
    --set "apisix.image.tag=3.7."
  ```

### 回滚计划

1. 滚动升级策略便于在验证失败或其他问题时快速回滚至前一版本。
2. 从数据库备份恢复数据并重新部署是可行的恢复方案。

## 其他资源

* 介绍
  * [API7 企业版架构](../introduction/api7-ee-architecture.md)
* 升级指南
  * [破坏性变更](../best-practices/api-version-control.md)
