---
title: 消费者
slug: /key-concepts/consumers
---

在本文档中，你将学习 API7 企业版中消费者的基本概念以及为什么需要它们。你将了解一些相关概念，包括如何将消费者信息传递到上游，消费者访问限制以及消费者身份验证和授权。

## 概述

消费者对象指的是向 API 网关发送请求并使用后端服务的**用户**、**应用程序**或**主机**。它与身份验证系统一起使用。每个消费者都必须至少配置一个身份认证凭据或使用插件（如 **Authz Keycloak** 或 **OpenID Connect**）与外部身份验证系统集成。

下图说明了具有一个路由和两个消费者的 API7 网关示例。一个消费者 `FetchBot` 是一个数据获取机器人，另一个消费者 `JohnDoe` 是一个用户。路由和消费者都启用了 `key-auth` 插件。因此，请求将使用 API 密钥进行身份验证。要访问内部服务，`FetchBot` 使用 `bot-key` 发送其请求，`JohnDoe` 使用 `john-key` 发送其请求。

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/12/08/2FBuKtub_Consumer%20Concept.png" alt="消费者图表示例" width="95%"/>
</div>
<br />

此配置可确保只有经过身份验证的请求才能与 `/petstore` 上公开的内部服务进行交互。

* 如果向 API7 企业版发送的请求没有携带任何密钥或密钥错误，则该请求将被拒绝。
* 如果使用 `bot-key` 向 API7 企业版发送请求，则该请求将被验证并由 `FetchBot` 发送以从内部服务获取数据。`FetchBot` 消费者上的 `limit-count` 限速插件将生效，将 5 秒窗口内的请求数限制为 `2`。如果未达到限速阈值，则请求将转发到上游服务。否则，它将被拒绝。
* 如果使用 `john-key` 向 API7 企业版发送请求，则该请求将被验证并由 `JohnDoe` 发送，随后转发到上游端点。

在这种情况下，身份验证插件将根据[插件执行阶段](./plugins.md#plugins-execution-lifecycle)在 `limit-count` 限速插件之前执行。

## 消费者身份验证和授权

在基于 API7 企业版的架构中构建身份验证和授权有两种主要设计模式。

第一种也是最常用的方法是通过第三方[身份提供商 (IdP)](https://zh.wikipedia.org/wiki/%E8%BA%AB%E4%BB%BD%E6%8F%90%E4%BE%9B%E5%95%86)（例如 [Keycloak](https://www.keycloak.org)）对请求进行身份验证和授权：

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/0jjIIcpU_973af4aae16e6f046ea53a1e2d57560.png" alt="API7 企业版与 IdP 的集成" width="60%"/>
</div>
<br />

在某些环境中，请求可能需要经过多个 IdP 才能转发到上游端点。在这种情况下，您可以在一个消费者上配置多个身份验证插件，每个插件对应一个 IdP。在所有 IdP 都授予请求访问权限之前，API7 企业版不会显示成功的响应。

第二种也是更基本的方法是在 API 网关本身上使用内置凭据执行身份验证和授权。到目前为止，凭据包含密钥身份验证、基本身份验证、JWT 身份验证和 HMAC 身份验证。

与传统的用户登录类似，每个消费者可以创建多个凭据，所有凭据都链接到一个消费者身份。凭据应安全存储并定期更新。

:::note

消费者凭据通过允许多个凭据对应每个消费者来增强灵活性。它们取代了传统的身份验证插件，如 key-auth、basic-auth、JWT-auth 和 HMAC-auth，提供了更友好的用户体验。

:::

## 相关阅读

* API 安全
  * [设置 API 身份验证](../api-security/api-authentication.md)
* API 消费
  * [管理消费者认证凭据](../api-consumption/manage-consumer-credentials.md)。
  * [应用基于黑白名单的访问控制](../api-consumption/consumer-restriction.md)