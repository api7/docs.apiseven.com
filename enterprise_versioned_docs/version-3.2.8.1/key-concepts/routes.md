---
title: 路由
slug: /key-concepts/routes
---

[服务](services.md)对象中的路由定义了通往[上游](./upstreams.md)节点的路径。路由负责根据配置的规则匹配客户端请求，加载和执行相应的插件，并将请求转发到指定的上游节点。路由不能脱离服务单独存在，也不能同时存在多个服务中。

可以通过路径匹配 URI 和方法设置一个简单的路由。下图说明了用户如何向 API7 企业版发送两个 HTTP 请求，然后根据路由中配置的规则转发请求：

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2024/03/19/Gyk46ZXd_%E8%B7%AF%E7%94%B1%E6%A6%82%E5%BF%B5.png" alt="Routes Diagram" width="90%" />
</div>
<br /><br />

:::warning

如果你熟悉 Apache APISIX，请注意路由和服务之间的关系与 API7 企业版中的不同。

:::

## 在路由上启用插件

路由通常也会配置插件。例如，在路由中配置 `rate-limit` 插件将开启速率限制功能。

## 版本控制

API7 企业版专门提供服务级别的版本控制。在发布到网关组时，对服务内任何路由所做的任何修改都会被视为新版本。
