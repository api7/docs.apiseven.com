---
title: Services
slug: /key-concepts/services
---

在本文档中，您将了解 API7 企业版中 _服务（services）_ 的基本概念以及使用服务的优势。

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## Overview

在 API7 企业版中，_服务（service）_ 对象是一个抽象概念，表示提供逻辑相关功能的后端应用程序。在企业版中，服务与路由之间的关系通常是包含关系。

以下示意图演示了在构建 Foodbar 公司（一个虚构公司）的 `Swagger Petstore` 后端服务时使用的服务对象示例，其中有两个具有不同配置的路由 - 一个用于获取数据（[HTTP GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)），另一个用于获取库存：

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/24/BcuGGD1s_762c5b5183b3dad7749f42b73f4be02.png" alt="Services Diagram" width="95%" />
</div>

<br /><br />

请注意，[速率限制](../../getting-started/rate-limiting.md)插件 `limit-count` 仅在服务对象上配置一次，用于控制来自两个路由的客户端请求。同样，上游服务地址也仅在 [上游（upstream）](./upstreams.md) 对象上配置一次。尽管插件和上游服务也可以在服务路由中单独（且重复地）进行配置，以达到相同的目的，但不建议采用这种方法，因为随着系统的增长，管理变得困难。使用上游服务有助于减少数据异常的风险并降低运营成本。

为简单起见，上面的示例仅将流量指向一个上游服务节点。当需要时，您可以添加更多的上游服务节点，以[启用负载均衡](../../getting-started/load-balancing.md)，保持用户的平稳操作和响应，并避免架构中的单点故障。

## 其他参考资源
- 入门指南
  - [配置路由](../../getting-started/configure-routes.md)
  - [负载均衡](../../getting-started/load-balancing.md)
- 关键概念
  - [路由](./routes.md)
  - [上游](./upstreams.md)
  - [插件](./plugins.md)

[//]: <TODO: Configure Services via API7 Enterprise Edition API>
[//]: <TODO: Configure Services via API7 Enterprise Edition Dashbaord>
