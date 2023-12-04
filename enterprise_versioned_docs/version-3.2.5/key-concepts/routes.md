---
title: 路由
slug: /key-concepts/routes
---

## 概览

[服务](services.md) 对象中的路由定义了通往上游节点的路径。路由负责根据配置的规则匹配客户端请求，加载和执行相应的插件，并将请求转发到指定的上游节点。路由必须属于一个服务。它不能在多个服务间隔离或共享。

可以通过路径匹配 URI 和方法设置一个简单的路由。下图说明了用户如何向 API7 企业版发送两个 HTTP 请求，然后根据路由中配置的规则转发请求：

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/28/OjhsQvuK_ce57b0d7d4608a6edb50e3eb61767f3.png" alt="Routes Diagram" width="90%" />
</div>
<br /><br />

:::info

如果你熟悉 Apache APISIX，请注意路由和服务之间的关系与 API7 企业版中的不同。

:::

## 在路由上启用插件

路由通常也会配置插件。例如，在路由中配置 `rate-limit` 插件将开启速率限制功能。

## 版本控制

API7 企业版专门提供服务级别的版本控制。在发布到网关组时，对服务内任何路由所做的任何修改都会被视为新版本。