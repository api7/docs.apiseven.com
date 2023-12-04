---
标题: 消费者
slug: /key-concepts/consumers
---

在本文档中，你将了解 API7 企业版中消费者的基本概念以及为什么需要消费者。你将了解一些相关概念，包括如何将消费者信息传递给上游服务、消费者访问限制以及消费者身份验证和授权。

## 概述

消费者对象指向 API 网关发送请求并使用后端服务的用户、应用程序或主机。与认证系统配合使用；也就是说，每个消费者都应该配置至少一个身份验证插件。

在下图中，API7 企业版配置了一条路由和两个消费者。消费者 “FetchBot“ 是数据获取机器人，消费者 “JohnDoe“ 是人类最终用户。路由和消费者使用 “key-auth“ 插件进行配置。因此，消费使用 API 密钥进行身份验证并发送请求。为了访问内部服务，“FetchBot“ 使用 “bot-key“ 发送其请求，“JohnDoe“ 使用 “john-key“ 发送其请求。

<br/>
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/28/i1WRGqop_3b96ecd9802cfb1546557bcb5256c3c.png" alt="消费者图表示例" width="95%"/>
</div>
<br/>

此配置确保只有经过身份验证的请求才能与 `/store/order` 上公开的内部服务进行交互。如果发送到 API7 企业版的请求：

* 没有任何密钥或密钥错误，拒绝该请求。
* 使用 “bot-key“。请求经过身份验证，并被视为由 “FetchBot“ 发送，以从内部服务获取数据。 消费者上的限速插件 `limit-count` 生效，将 5 秒窗口内的请求数量限制为 2。如果尚未达到限速阈值，则将请求转发到上游服务。否则，将被拒绝。
* 使用 “john-key“ ，请求经过身份验证并被视为由 “JohnDoe“ 发送，随后转发到上游服务。

请注意，在这种情况下，根据[插件执行阶段](./plugins.md#plugins-execution-lifecycle)，需要在速率限制插件之前启用身份验证插件。

<!--

TODO：合并到快安手册

## 将消费者信息传递给上游服务

对于某些用例，例如日志记录、分析和审计，你可能希望将消费者信息传递给上游服务。默认情况下，消费者信息不暴露给上游。但是，你可以使用“proxy-rewrite“ 插件在标头中包含所需的信息：

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

TODO：合并到快安手册

## 消费者访问限制

你可以通过根据消费者名称、HTTP 方法或 “consumer-restriction“ 插件中的其他参数施加限制来控制对 API 的请求访问。

例如，如果你想将 “FetchBot“ 列入黑名单，使其无法访问内部服务，而不更改[概述​​](#概述)示例中的任何消费者配置，则可以将插件的配置更新为以下内容：

```json
{
  "plugins":{
    "key-auth":{},
    "consumer-restriction":{
      "blacklist":["FetchBot"]
    }
  }
}
````

或者，如果你想严格允许 “FetchBot“ 通过 HTTP GET 方法进行访问，你可以将插件的配置（在路由或消费者中）更新为以下内容：

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

`consumer-restriction` 插件还可以与[服务](./services.md) 和 [插件全局规则](./plugin-global-rules.md) 一起使用。有关插件使用的更多详细信息，请参阅插件参考指南（即将推出）。

[//]: <TODO: 链接到消费者限制参考文档>
-->

## 身份验证和授权

在基于 API7 企业版的架构中构建身份验证和授权主要分为两种设计模式。

第一种也是最常用的方法是通过第三方[身份提供商(Identity Provider，IdP)](https://en.wikipedia.org/wiki/Identity_provider)，例如 [Keycloak](https:// /www.keycloak.org)， 对请求进行身份验证和授权：

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/0jjIIcpU_973af4aae16e6f046ea53a1e2d57560.png" alt="API7 企业版与 IdP 集成" width="60%"/>
</div>
<br/>

在某些环境中，请求可能需要经过多个 IdP，然后才能转发到上游服务。在这种情况下，你可以在一个消费者上配置多个身份验证插件，每个插件对应一个 IdP。只有当所有 IdP 都授予对请求的访问权限时，API7 企业版才会显示成功响应。

第二种也是更基本的方法是使用 “key-auth“、“basic-auth“、“jwt-auth“、“hmac-auth“ 插件在 API 网关本身上执行身份验证和授权：

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/23/YZGWXwhV_425f15685d20cf6de50c23de747c53b.png" alt="API7 企业版在没有 IdP 的情况下执行身份验证" width="59%"/>
</div>
<br/>
