---
title: 服务
slug: /key-concepts/services
---

一个服务代表了一个后端应用或外部的微服务。它本质上将该应用或微服务提供的所有 API 进行了分组。以下是几个和服务有关的关键关系：

* 路由（Route）与四层路由（Stream Route）：大多数服务与路由或四层路由（二者不能共存于一个服务之内）之间是一对多的关系。这意味着一个服务可以与多个路由或流路由关联，定义了传入的 API 请求如何被导向到服务内的相应功能。

* 上游： 通常一个服务与一个上游保持一对一的关系。上游充当了一个容器，指定了处理该服务请求的后端服务器的地址。为了便于金丝雀部署（灰度发布），一个服务可能暂时会有两个上游：一个上游指向现有的后端版本，另一个上游指向正在引入的新版本。

:::info

对于熟悉 Apache APISIX 的人来说，需要注意的是，API7 企业版中的服务对象与 Apache APISIX 中的服务对象是不同的。

:::

## 服务工作原理

下图展示了一个已发布的服务，该服务架构了一个宠物店（`Petstore`）服务。该服务具有两个具有分别配置的路由。你可以使用 HTTP GET 方法从该服务获取相关数据。

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2024/03/19/5xIGO6Nu_%E6%9C%8D%E5%8A%A1%E6%A6%82%E5%BF%B5.png" alt="Services Diagram" width=" 95%" />
</div>
<br /><br />


本示例仅将流量转发到一个上游节点。你可以根据需要为服务添加更多上游节点，以维持平稳的运行和响应，同时防止单点故障。

## 服务状态

一个服务可以有多个版本，每个版本有三种状态：模板、已发布和历史。这些状态代表了服务的整个 API 生命周期。每个服务都有自己的版本号体系。如果版本号相同，则说明服务的表现完全相同。

### 模板

模板是初始状态，代表最新的未发布配置草案。模板中的 API 不可访问，也没有特定的版本号。

### 已发布

将模板发布到网关组会创建一个具有唯一版本号的已激活版本。已发布版本中的 API 和网关组绑定，用户可以访问网关组内的 API，但是只能编辑其运行时配置（主机、路径前缀和上游节点）。更新正在运行中的 API 时，必须发布新的服务版本。模板更改不会影响已发布的版本。

### 历史

发布新版本时，以前的版本会转换为历史版本。请注意，一个服务不能同时在网关组中拥有两个已激活版本，但不同的网关组可以同时运行不同的版本。

历史版本为问题追踪提供了对过去配置的可见性，但不可编辑。它们主要用于紧急回滚。

历史版本不包括[运行时配置](#运行时配置)。回滚时会保留当前值。

## 运行时配置

以下配置被归类为运行时配置。这是因为当同一服务版本发布到不同网关组时，它们可能会有不同的值，而且可以在网关组内直接编辑。这些配置并不构成不同的版本。

* 上游配置
* 服务发现
* 服务主机
* 路径前缀

:::info

例如

* 测试环境中的 API URL 是 `https://api7-test.ai/v1/pet`，节点地址是 `127.0.0.1:80`。
* 生产环境中的 API URL 是 `https://api7.ai/petstore/pet`，节点地址是 `192.168.0.1:80`。

:::

## 相关阅读

* 核心概念 
  * [路由](routes.md)
  * [上游](upstreams.md)
  * [四层路由](stream-routes.md)
* 快速入门
  * [发布服务](../getting-started/publish-service.md)
  * [在不同网关组之间同步服务版本](/enterprise/getting-started/sync-service)
* 最佳实践
  * [API 版本控制](../best-practices/api-version-control.md)