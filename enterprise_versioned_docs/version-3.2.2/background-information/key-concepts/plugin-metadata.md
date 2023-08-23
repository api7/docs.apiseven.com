---
title: Plugin Metadata
slug: /key-concepts/plugin-metadata
---

在本文档中，您将了解 API7 企业版中插件元数据的基本概念，以及为什么需要它们。

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## 概览

在 API7 企业版中，**插件元数据**对象用于配置共享相同插件名称的所有插件实例的公共元数据字段。当一个插件在多个对象之间启用，并且需要对它们的元数据字段进行统一更新时，是非常有用的。

以下示意图使用两个不同路由上的 `syslog` 插件实例以及一个插件元数据对象来说明插件元数据的概念，插件元数据对象设置了 `syslog` 插件的全局 `log_format`：

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/9vHDhmGj_e926ab3079e1d7696190ff095c29cc3.png" alt="Plugin Metadata diagram with two routes and one plugin metadata" width="95%" />
</div>

<br />

除非另有指定，插件元数据对象上的 `log_format` 应该统一应用于两个 `syslog` 插件。然而，由于 `/store/order` 路由上的 `syslog` 插件具有不同的 `log_format`，访问该路由的请求将生成遵循路由中插件指定的 `log_format` 的日志。

一般而言，如果插件的字段在插件元数据和另一个对象（例如路由）中都有定义，那么在另一个对象上的定义**优先于**插件元数据中的全局定义，以提供更细粒度的控制。

插件元数据对象应仅用于具有元数据字段的插件。有关哪些插件具有元数据字段的更多详细信息，请参阅插件参考指南（即将推出）。

[//]: <TODO: link to syslog doc>

## 其他参考资源

* 关键概念 - [插件](./plugins.md)

[//]: <TODO: plugin hub>
[//]: <TODO: API - Plugin metadata>
[//]: <TODO: Control API - plugin metadata reference>
