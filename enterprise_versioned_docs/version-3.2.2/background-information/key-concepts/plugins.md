---
title: Plugins
slug: /key-concepts/plugins
---

在本文档中，您将了解 API7 企业版中插件的基本概念，以及为什么您需要插件。您将会介绍一些相关概念，包括插件的启用、插件的执行过滤和顺序，以及插件的开发。

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## Overview

API7 企业版中的**插件**扩展了 API7 企业版的功能，以满足组织或用户特定的流量管理、可观察性、安全性、请求/响应转换、无服务器计算等需求。

API7 企业版提供了许多现有的插件，可以根据您的需求进行定制和编排。这些插件可以全局启用，以在每个传入的请求上触发，也可以局部绑定到其他对象，例如[服务](./services.md)和[消费者](./consumers.md)。

如果现有的 API7 企业版插件不能满足您的需求，您还可以使用 Lua 或其他编程语言（如 Java、Python、Go 和 Wasm）编写自己的插件。

[//]: <TODO: PluginHub provides an inventory of plugins and their detailed usage. >

[//]: <TODO: Add link for orchestraiton. >

## 插件的执行生命周期

安装的插件首先会被初始化。然后会检查插件的配置与定义的 [JSON Schema](https://json-schema.org) 是否匹配，以确保插件配置的模式是正确的。

当请求通过 API7 企业版时，插件的对应方法会在以下一个或多个阶段中执行：`rewrite`、`access`、`before_proxy`、`header_filter`、`body_filter` 和 `log`。这些阶段在很大程度上受到 [OpenResty 指令](https://openresty-reference.readthedocs.io/en/latest/Directives/) 的影响。

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/03/09/ZsH5C8Og_plugins-phases.png" alt="Routes Diagram" width="50%"/>
</div>
<br />

要了解有关自定义插件开发的阶段更多信息，请参阅插件开发的操作指南（即将推出）。

## Plugins Execution Order

通常情况下，插件按照以下顺序执行：

1. [全局规则](./plugin-global-rules.md)中的插件
   1. 重写阶段中的插件
   2. 访问阶段中的插件

2. 绑定到其他对象的插件
   1. 重写阶段中的插件
   2. 访问阶段中的插件

在每个[阶段](#plugins-execution-lifecycle)内，您可以选择在插件的 `_meta.priority` 属性中定义一个新的优先级值，该优先级值将在执行过程中优先于默认的插件优先级。具有较高优先级值的插件将首先执行。有关示例，请参阅插件的[通用配置](../../plugins/common-configurations.md#_metapriority)。

## 插件合并优先级

当同一个插件在全局规则中和对象（例如路由）中同时配置时，两个插件实例会按顺序执行。

然而，如果同一个插件在多个对象（例如[服务](./services.md)和[消费者](./consumers.md)）中本地配置，每个非全局插件只会被执行一次，因此只使用一份配置。这是因为在执行过程中，针对特定的优先顺序，这些对象中配置的插件会合并：

`消费者（consumer）`  > `服务路由（service route）` > `服务（serivce）`

因此，如果同一个插件在不同对象中具有不同的配置，合并时使用的插件配置为具有最高优先级顺序的插件配置。

## 插件执行过滤器

默认情况下，所有插件都会被与服务路由中配置的规则匹配的请求所触发。然而，在某些情况下，您可能希望对插件的执行有更精细的控制；也就是说，有条件地确定哪些插件适用于请求。

API7 Enterprise Edition 允许通过将 `_meta.filter` 配置应用于插件来对插件进行动态控制。该配置支持评估各种[内置变量](../../reference/built-in-variables.md)和[API7 Enterprise Edition 表达式](../../reference/apisix-expressions.md)。

有关示例，请参阅插件的[通用配置](../../plugins/common-configurations.md#_metafilter)。

## 插件开发

API7 Enterprise Edition 支持在多种语言中扩展插件，包括 Lua、Java、Python、Go 和 Wasm。插件主要以三种方式运行：

* Lua 插件在 API7 Enterprise Edition 中本地运行。
* Java、Python 和 Go 插件在各自的 API7 Enterprise Edition 插件运行器中运行，通过[远程过程调用（RPC）](https://apisix.apache.org/docs/apisix/internal/plugin-runner/)进行通信。
* Wasm 插件在 API7 Enterprise Edition 的 Wasm 插件运行时中运行。

要了解更多关于插件开发的信息，请参阅插件开发指南（即将推出）。

[//]: <TODO: Link to plugins development doc. >

## 其他参考资源

* 入门指南 - [配置速率限制](../../getting-started/rate-limiting.md)
* 参考资料 - [插件通用配置](../../plugins/common-configurations.md)

[//]: <TODO: Lua Plugins>
[//]: <TODO: External Plugins>
[//]: <TODO: Plugin Orchestration>
[//]: <TODO: Plugin Hotloading>
[//]: <TODO: Plugin References/Hub>
