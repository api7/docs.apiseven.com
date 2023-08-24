---
title: Consumers
slug: /key-concepts/consumers
---

在本文档中，您将学习 API7 企业版中消费者的基本概念以及为何需要它们。您将了解一些相关的概念，包括如何将消费者信息传递给服务上游、消费者访问限制，以及消费者身份验证和授权。

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## 概述

在 API7 企业版中，_消费者（consumer）_ 对象代表发送请求到 API 网关并使用后端服务的用户、应用程序或主机。它与身份验证系统一起使用；也就是说，每个消费者应至少配置一个身份验证插件。

消费者对象在以下情况场景中非常有用：如果您有不同的消费者向您的系统发送请求，并且您需要 API7 企业版根据消费者执行某些功能，例如基于消费者的速率限制。这些功能是通过在消费者中配置的 API7 企业版插件提供的。

以下示意图演示了一个 API7 企业版的示例，其中有一个路由和两个消费者。其中一个消费者是机器人 `FetchBot`，另一个是人类终端用户 `JohnDoe`。路由和消费者都配置了插件 `key-auth`，以便通过 API 密钥对请求进行身份验证。要访问内部服务，`FetchBot` 将使用 `bot-key` 发送其请求，而 `JohnDoe` 将使用 `john-key` 发送请求。

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/DssdTBuA_29ddc334cc6f872c71bbe04fe5319d4.png" alt="consumers diagram example" width="95%"/>
</div>
<br />

这个配置确保只有经过身份验证的请求可以与暴露在 `internal` 上的内部服务进行交互。如果将请求发送到 API7 企业版：

* 没有任何密钥或使用错误的密钥，请求将被拒绝。
* 使用 `bot-key`，请求将进行身份验证，并被视为由 `FetchBot` 发送以从内部服务获取数据。消费者上的速率限制插件 `limit-count` 生效，限制在 5 秒窗口内的请求次数为 2 次。如果速率限制阈值尚未达到，请求将被转发到上游服务；否则，请求将被拒绝。
* 使用 `john-key`，请求将进行身份验证，并被视为由 `JohnDoe` 发送，随后被转发到上游服务。

请注意，在这种情况下，身份验证插件在速率限制插件之前执行，符合[插件执行阶段](./plugins.md#plugins-execution-lifecycle)的规定。

<!-- 

TODO: move to getting started

## 将消费者信息传递给服务上游

对于某些用例，例如日志记录、分析和审计，您可能希望将消费者信息传递给上游服务。默认情况下，消费者信息不会暴露给上游服务；但是，您可以使用 `proxy-rewrite` 插件将所需信息包含在标头中：

```json
{
  "plugins":{
    ...,
    "proxy-rewrite":{
      "headers":{
        "set":{
          "X-Consumer-Name":"$consumer_name"
        }
      }
    }
  }
}
```
-->

<!-- 

TODO: move to getting started

## 消费者访问限制

您可以通过在 `consumer-restriction` 插件中基于消费者名称、HTTP 方法或其他参数施加限制，来控制对您的 API 的请求访问。

例如，如果您希望在不更改[概述](#overview)示例中的任何消费者配置的情况下，将 `FetchBot` 列入黑名单，以阻止其访问您的内部服务，您可以更新路由中插件的配置如下：

```json
{
  "plugins":{
    "key-auth":{},
    "consumer-restriction":{
      "blacklist":["FetchBot"]
    }
  }
}
```

或者，如果您希望严格限制 `FetchBot` 只能通过 HTTP GET 方法进行访问，您可以更新插件的配置（无论是在路由还是消费者中），如下所示：

```json
{
  "plugins":{
    ...,
    "consumer-restriction":{
      "allowed_by_methods":[
        {
          "user":"FetchBot",
          "methods":["GET"]
        }
      ]
    }
  }
}
```

`consumer-restriction` 插件也可以与 [服务（services）](./services.md) 和 [插件全局规则（plugin global rules）](./plugin-global-rules.md) 一起使用。有关插件使用的更多详细信息，请参阅插件参考指南（即将推出）。

[//]: <TODO: Point to the consumer-restriction reference doc> 
-->

## 身份验证与授权

在基于 API7 企业版的架构中，有两种主要的身份验证和授权设计模式。

第一种，也是最常采用的方法是通过第三方[身份提供者（IdP）](https://en.wikipedia.org/wiki/Identity_provider)，如[Keycloak](https://www.keycloak.org)来对请求进行身份验证和授权：

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/0jjIIcpU_973af4aae16e6f046ea53a1e2d57560.png" alt="API7 Enterprise Edition integration with an IdP" width="60%"/>
</div>
<br />

在某些环境中，一个请求可能需要经过一个以上的 IdP 才能被转发到上游服务。在这种情况下，您可以在一个消费者上配置多个身份验证插件，每个插件对应一个 IdP；只有当所有的 IdP 都同意授权一个请求时，API7 企业版才会显示成功响应。

有了多个身份验证插件，[插件执行顺序](./plugins.md#plugins-execution-order)由插件的优先级决定，可以使用 `_meta.priority` 来覆盖优先级。

第二种更基本的方法是在 API 网关本身上执行身份验证和授权，使用 `key-auth`、`basic-auth`、`jwt-auth`、`hmac-auth` 插件：

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/YZGWXwhV_425f15685d20cf6de50c23de747c53b.png" alt="API7 Enterprise Edition performs auth without IdP" width="59%"/>
</div>
<br />

有关如何根据您的具体需求配置身份验证和授权的详细信息，请参阅操作指南中的身份验证章节（即将推出）。

## 其他参考资源

* 入门指南 - [配置密钥身份验证](../../getting-started/key-authentication.md)
[//]: <TODO: consumer-restriction plugin>
[//]: <TODO: API - Consumers>
