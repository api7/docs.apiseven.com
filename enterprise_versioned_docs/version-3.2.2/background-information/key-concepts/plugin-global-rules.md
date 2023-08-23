---
title: Plugin Global Rules
slug: /key-concepts/plugin-global-rules
---

在本文档中，您将了解 API7 企业版中插件全局规则的基本概念，以及为什么您需要它们。

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## Overview

在 API7 企业版中，**全局规则**对象用于创建[插件](./plugins.md)，这些插件在每个传入的请求上触发，并在本地绑定到对象（例如[服务](./services.md)和[消费者](./consumers.md)）的其他插件之前执行。某些插件，例如速率限制和可观察性插件，通常会全局启用，以便为 API 提供一致和全面的保护。

以下示意图演示了一个示例，全局启用了密钥认证插件以适用于所有传入的请求，其中 `key-auth` 插件在全局规则和消费者中都进行了配置。`proxy-rewrite` 插件在路由上进行了配置，以修改请求的[HTTP 头部](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_header)，以演示[插件执行顺序](./plugins.md#plugins-execution-order)：

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/6gt7DiHr_97b9c486ce0fa336699dcbac2ff9e06.png" alt="diagram with a global rule, a consumer, and a route" width="95%"/>
</div>
<br />

此配置确保只有经过身份验证的请求被允许与上游服务进行交互。如果将请求发送到 API7 企业版：

* 没有任何密钥或使用错误的密钥，请求将被拒绝。
* 使用 `global-key` 但是发送到不存在的路由，请求将被身份验证，但 API7 企业版返回错误，警告用户找不到路由。
* 使用 `global-key` 发送到现有路由，请求首先被身份验证，然后由路由上的插件修改请求的标头，最后请求被转发到上游服务。

上述示例在全局规则和路由中使用了两个不同的插件。如果在两个对象中配置了相同的插件，两个插件实例将会[顺序执行](./plugins.md#plugins-execution-order)，而不是互相覆盖。

## 其他参考资源

* 关键概念
  * [插件](./plugins.md)
  * [消费者](./consumers.md)


