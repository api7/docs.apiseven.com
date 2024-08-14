---
title: 新增网关实例
slug: /getting-started/add-gateway-instance
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本教程介绍如何将网关实例添加到网关组。

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. [准备一个网关组](../getting-started/add-gateway-group.md)。

:::info

若使用 OpenShift 等平台，需事先授予 API7 企业版安全上下文约束 (SCC)。

:::

## 步骤

<Tabs>
<TabItem value="docker" label="Docker" default>

1. 从侧边栏导航选择你的目标网关组下的 **网关实例**，然后点击 **新增网关实例**。
2. 按页面说明进行以下操作：

* 分别设置 HTTP 端口 ID 和 HTTPS 端口 ID 为 `9080` 和 `9443`。
* (可选) 将网关实例名称设置为 `test`。

4. 点击 **生成** 获取用于将网关实例添加到网关组的命令。
5. 打开终端并运行生成的命令。

</TabItem>

<TabItem value="k8s" label="Kubernetes">

1. 从侧边栏导航选择你的目标网关组下的 **网关实例**（网关实例），然后点击 **新增网关实例**。
2. 按页面说明进行以下操作：

* 设置 **Helm 发布名称** 为 `api7-ee-3-gateway`。
* 设置 **命名空间**为 `api7-ee`。
* 设置 **副本数** 为 `1`。

4. 点击 **生成** 获取用于将网关实例添加到网关组的命令或 YAML 配置文件。
5. CLI 用户请打开终端运行生成的命令。
6. YAML 文件用户请更新并应用你的 YAML 配置文件。

</TabItem>
</Tabs>

## 相关阅读

* 核心概念
  * [网关组与网关实例](../key-concepts/gateway-groups.md)
* 快速入门
  * [新增网关组](add-gateway-group.md)
