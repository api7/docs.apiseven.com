---
title: 上游使用服务发现
slug: /best-practice/service-discovery
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

除了直接配置上游，还可以使用 Consul、Eureka、Nacos 或 Kubernetes 服务发现等服务发现机制来动态检测上游节点。

:::info

一旦发布，服务不能直接在配置的上游节点和服务发现之间切换。如有需要，你必须通过[灰度部署](../getting-started/canary-upstream.md)来配置。

:::

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. 在你的网关组中[至少有一个网关实例](../getting-started/add-gateway-instance.md)。

## Kubernetes

### 添加服务注册中心连接

1. 从侧边栏选择网关组的 **服务注册表**，然后点击 **新增服务注册中心连接**。
2. 在对话框中，执行以下操作：
   * **名称** 输入 `测试环境注册中心`。
   * **发现类型** 选择 `Kubernetes`。
   * 填写 **API 服务器地址** 和 **令牌值** 字段。
   * 点击 **新增**。
3. 等待，确保服务注册中心的状态为 `健康`。

### 配置上游

1. 从侧边栏选择网关组下的 **已发布服务**，然后点击 **新增服务**。
2. 选择 **手动新增**。
3. 在对话框中，执行以下操作：
   * **名称** 输入 `httpbin`。
   * **服务类型** 选择 `HTTP (七层代理)`。
   * **上游 Scheme** 选择 `HTTP`。
   * **如何查找上游** 选择 `使用服务发现`。
   * **服务注册中心** 选择 `测试环境注册中心`，然后选择 **命名空间** 和 **服务名称**。
4. 点击 **新增**。这将创建一个“无版本”的新服务。

下面是一个互动演示，提供连接 Kubernetes 服务发现的实践入门。通过点击并按照步骤操作，你将更好地了解如何在 API7 网关中使用它：

<StorylaneEmbed src='https://app.storylane.io/demo/wf6vrqlk9knc' />


## Nacos

### 添加服务注册中心连接

1. 从侧边栏选择网关组的 **服务注册表**，然后点击 **新增服务注册中心连接**。
2. 在对话框中，执行以下操作：
   * **名称** 输入 `测试环境注册中心`。
   * **发现类型** 选择 `Nacos`。
   * **主机** 填写主机地址和端口。
   * **如何获取令牌** 选择一种获取令牌的方式并配置相关参数。
   * 点击 **新增**。
3. 等待，确保服务注册中心的状态为 `健康`。

### 配置上游

1. 从侧边栏选择网关组下的 **已发布服务**，然后点击 **新增服务**。
2. 选择 **手动新增**。
3. 在对话框中，执行以下操作：
   * **名称** 输入 `httpbin`。
   * **服务类型** 选择 `HTTP (七层代理)`。
   * **上游 Scheme** 选择 `HTTP`。
   * **如何查找上游** 选择 `使用服务发现`。
   * **服务注册中心** 选择 `测试环境注册中心`，然后选择 **命名空间**、**组**和**服务名称**。
4. 点击 **新增**。这将创建一个“无版本”的新服务。

下面是一个互动演示，提供连接 Nacos 服务发现的实践入门。通过点击并按照步骤操作，你将更好地了解如何在 API7 网关中使用它：

<StorylaneEmbed src='https://app.storylane.io/demo/9qhfqjk2mnxn' />

## 相关阅读

* 核心概念 
  * [服务](../key-concepts/services.md)
  * [上游](../key-concepts/upstreams.md)
