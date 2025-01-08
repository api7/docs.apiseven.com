---
title: 新增自定义插件
slug: /best-practices/custom-plugin
---

import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

API7 网关的一个关键特性是其通过插件的可扩展性。除了各种现有的插件之外，API7 网关还允许你构建自定义插件，以添加额外的功能并通过自定义流程管理 API 流量。通常，你可以使用 Lua 编程语言来实现新的插件。API7 网关分阶段处理请求，相关的插件逻辑会在请求路由过程中的每个阶段执行。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [用 Lua 编写自定义插件](https://docs.api7.ai/apisix/how-to-guide/custom-plugins/create-plugin-in-lua).

## 添加自定义插件

1. 从侧边栏选择 **网关设置**，然后选择 **自定义插件**。
2. 点击 **添加自定义插件**。
3. 在添加自定义插件对话框中，执行以下操作：

* **插件源代码文件**：上传用 Lua 编写的插件文件。
* **插件目录**：目录将用于过滤和搜索插件。例如，选择 `Traffic`。
* **插件描述**：例如 `使用规则拆分流量`。
* **插件文档链接**：例如 `https://docs.api7.ai/hub/traffic-split`。
* **插件作者**：例如 `Tom`。
* **部署的网关组**: 选择`全选`。

4. 点击**添加**。
5. 现在你的自定义插件已添加到插件列表中。可以在**启用插件**对话框中的服务/路由/消费者/插件的全局规则中选择它。

下面是一个交互式演示，提供了添加自定义服务的实践介绍。

<StorylaneEmbed src='https://app.storylane.io/demo/6mju6lch4tz8' />

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services.md)
  * [路由](../key-concepts/routes.md)
  * [插件](../key-concepts/plugins.md)
