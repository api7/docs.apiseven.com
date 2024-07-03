---
title: 路由
slug: /key-concepts/routes
---

API7 网关有两种主要的工作模式：

1. 应用层代理，又称七层代理： 在此模式下，API7 网关 作为 HTTP 请求和响应的中介，在 OSI 模型的应用层（第7层）运作。路由用于定义如何处理这些 HTTP 请求。
2. 传输层代理，又称四层代理： API7 网关还可以作为传输层代理，在 OSI 模型的传输层（第4层）运作。此模式非常适合处理 TCP 和 UDP 等协议。对于四层代理，将使用四层路由来定义传入的 TCP/UDP 连接如何路由到后端服务。

路由或者四层路由将根据配置的规则匹配客户端请求，加载并执行相关插件，然后将请求转发到指定的上游节点。一个路由必须属于一个服务，不能孤立或在多个服务之间共享。

## 路由工作原理

你可以把 API7 网关想象成 API 的智能交通指挥。当请求到达时，API7 网关会检查其定义的路由，找到最佳匹配，并将请求定向到对应的后端服务。

假设现在你有一个 API，其中有一个 `/pet` 的路由。这个路由可能匹配诸如 `GET /pet` 或 `POST /pet/create` 等请求。在将请求转发到对应的后端服务器之前，还可以配置该路由以应用特定的插件（例如，用于速率限制或身份验证）。

该图展示了如何向 API7 发送两个 HTTP 请求，然后根据路由中配置的规则进行转发：

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2024/03/19/Gyk46ZXd_%E8%B7%AF%E7%94%B1%E6%A6%82%E5%BF%B5.png" alt="Routes Diagram" width="90%" />
</div>
<br /><br />

:::info

如果你熟悉 Apache APISIX，请注意路由和服务之间的关系与 API7 企业版中的不同。

:::

## 相关阅读

- 核心概念 - [服务](services.md), [上游](upstreams.md)
- 快速入门
  - [创建一个简单的 API](../getting-started/launch-your-first-api.md)
