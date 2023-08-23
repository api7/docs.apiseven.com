---
title: Upstreams
slug: /key-concepts/upstreams
---

在本文档中，您将学习有关 API7 企业版中 `upstream` 的基本概念，以及为何需要使用它。我们将为您介绍一些相关的功能，包括负载均衡、服务发现和上游服务的健康检查。

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## 预览

在 API7 企业版中，_upstream_ 对象是对包含一个或多个上游地址的一组内容的逻辑抽象。在 [`service`](../key-concepts/services.md) 中需要它来指定请求流向的**位置**以及**如何**分发请求流量。

以下是在服务路由中的配置示例，其中相同的 `upstream` 地址将在三个不同的服务路由中被重复使用：

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/21/wRbqorQB_2d02abd2b60371240f518b943a54f30.png"
    alt="图中展示了三条不同的请求指向相同的上游对象并且具有所需上游地址的服务路由。"
    width="95%" />
</div>

<br />

正如您已经看到的，具有许多服务的大规模系统将会在同一个 `upstream` 中获取上游服务地址，从而减少了冗余信息，降低运营成本。

## 负载均衡

_upstream_ 的一个重要用途是帮助实现[负载均衡](../../getting-started/load-balancing.md)，即确定客户端请求转发的位置以及如何在多个后端服务之间进行请求流量的分发。

在 `upstream` 中，有四种可供选择的负载均衡算法：

* `Round Robin` - weighted round robin
* `Consistent Hash` - consistent hashing
* `Exponentially Weighted Moving Average(EWMA)` - exponentially weighted moving average
* `Least Connection` - least connections

更多有关 API7 企业版中负载均衡的详细说明，请参阅负载均衡操作指南和 API 文档（即将推出）。

[//]: <TODO: link to Load Balancing article under How-To>
[//]: <TODO: refer to API for more upstream load balancing config>

## 服务发现

虽然通过静态确定上游地址的方式最简单直接，但是在基于微服务的架构体系中，上游地址通常是动态分配的，因此在自动扩展、发生故障和服务更新期间可能会发生变化。在这种情况下，静态配置并不适用。

此时就需要使用到服务发现。通过将上游服务地址保存在一个数据库中（称为服务注册表）的方式，其他服务从中获取并发起请求调用。通过这种方式，API 网关可以通过服务注册表获取最新的上游地址列表，确保所有请求都被转发到健康的上游节点。

API7 企业版支持许多服务发现组件，例如 `Consul`、`Eureka`、`Nacos`、`Kubernetes` 等等。

有关如何与第三方服务发现组件集成的详细说明，请参阅服务发现（即将推出）。

[//]: <TODO: for more details about the integration, see Service Discovery in How-To Guide>

## 上游服务健康检查

API7 企业版提供主动和被动健康检查两种方式，用来探测上游节点是否在线（即健康状态）。不健康的上游节点将被忽略，直到它们恢复健康状态为止。

上游健康检查可以在 `upstream` 的 `checks` 参数中进行配置。

关于如何配置上游健康检查的更多信息将在主动和被动健康检查文档中说明（即将推出）。

[//]: <TODO: for all health checking parameter options, see API>
[//]: <TODO: How-To Guide - Health Checking>

## 其他参考资源

* 入门指南 - [负载均衡](../../getting-started/load-balancing.md)
[//]: <TODO: Configure Upstreams via API7 Enterprise Edition API>
[//]: <TODO: Configure Upstreams via API7 Enterprise EditionSIX Dashbaord>
[//]: <TODO: Upstream Health Checks>
[//]: <TODO: Service Discovery in how to guide>
