---
title: Routes
slug: /key-concepts/routes
---

在本文档中，您将学习有关 API7 企业版中 `route` 的基本概念，不同的服务路由选项，以及针对重复服务路由配置的缺点和解决方案。

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## 预览

_服务路由（Service routes）_ 定义了到上游服务的路径。在 API7 企业版中，服务路由负责根据配置的规则匹配客户端请求，加载并执行相应的插件，然后将请求转发到指定的上游服务端点。

一个简单的服务路由可以通过设置一个路径匹配的 URI 和相应的上游地址来完成。在下面的示意图中，用户发送了两个 HTTP 请求到 API7 企业版 API 网关，根据服务路由中配置的规则进行相应的请求转发：

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/24/WSfd0sRz_f5d0972d0f349dffbbb69b68bdc7345.png" alt="路由图" width="90%" />
</div>

<br /><br />

服务路由通常也会配置插件。例如，通过[在路由中配置速率限制插件](../../getting-started/rate-limiting.md)来开启流量速率限制功能。

Service routes are often configured with plugins as well. For example, [configuring the rate-limit plugin in a route](../../getting-started/rate-limiting.md) will enable rate-limiting effects.

<!-- 
## Service Routing Options

API7 Enterprise Edition offers three HTTP routing options:

1. `radixtree_host_uri` routes requests by hosts and URI paths. It can be used to route north-south traffic between clients and servers.

2. `radixtree_uri` routes requests by URI paths. It can be used to route east-west traffic, such as between microservices.

3. `radixtree_uri_with_parameter` enhances on `radixtree_uri` to support the use of parameter in path matching.

These routing options can be configured in `conf/config.yaml` under `apisix.router.http`.
-->

## 服务，路由和上游

虽然服务路由在定义流量路径时非常重要，但重复的服务路由配置（即为一组服务路由硬编码相同的服务上游地址或插件名称）也存在缺点。在更新时，这些路由的重复字段需要逐个遍历和更新。这种配置方式会导致维护成本增加，尤其是在具有许多服务路由的大规模系统中。

为了解决这个问题，[Services](./services.md) 和 [Service Upstream](./upstreams.md) 被设计为抽象化重复信息并减少冗余，遵循 DRY 原则[（Don't Repeat Yourself）](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).。

## 其他参考资源

* 入门指南  - [路由配置](../../getting-started/configure-routes.md)

[//]: <TODO: Configure Routes via API7 Enterprise Edition API>
[//]: <TODO: Lua Radix Tree>
