---
title: 核心概念
slug: /background-information/key-concept
tags:
  - API7 Enterprise
---

![API7 key concept](https://static.apiseven.com/uploads/2023/04/28/y55wAby6_keyconcept-zh.png)

## 集群

API7 Enterprise 产品中的集群概念，指的是 API7 网关的集群。每一个集群由多个互相协同工作的节点组成，包含多个数据面节点和一个控制面节点。这些节点之间可以相互通信和协调工作，以提供高可用性、高性能和高伸缩性的 API 网关服务。
当用户向 API7 网关集群发送 API 请求时，请求会被路由到可用的数据面节点进行处理。如果某个数据面节点出现故障或不可用，无需手动指定，其他数据面节点会继续处理请求，从而确保系统的稳定性和可靠性。
同一个集群的所有数据面节点读取的是同一份网关配置，执行完全一样的业务逻辑。不同集群之间的配置是隔离的，对当前集群做的修改不会影响其他集群。如果当前集群出现故障，也不会影响其他集群。
每个集群都有不同的对外地址，API 的调用方需要明确自己的请求要发送到哪个 API7 网关集群并使用对应的地址。

## 工作分区

工作分区是指在同一个 API7 网关集群内，将上游、路由/API、消费者、证书、插件模板、全局插件等资源划分为独立的区域或分片，供不同的团队独立管理和维护。通过使用多个工作分区，可以实现 API7 Enterprise 的多租户管理。
工作分区仅仅是对资源的可见性和编辑权限做了划分，并不会影响对 API 的接收、处理和转发。API 的调用者也无需感知工作分区的具体情况。
同一个集群内的所有工作分区，仍然共享了数据面和控制面节点。因此如果节点发生故障，所有工作分区都将受到影响。

## etcd资源

etcd 是 API7 网关存储配置数据的组件，一条 etcd 资源指的就是一个 etcd 集群。如果考虑高可用，建议一个 etcd 集群至少包含三个节点。
不同网关集群的配置数据可以存放在不同etcd集群中，通过资源隔离提升安全性，也可以放在同一个etcd集群中方便统一管理和节约资源。

## 上游

API7 中的上游概念，与 Apache APISIX 中的上游概念保持一致。
[了解什么是上游](https://docs.api7.ai/apisix/key-concepts/upstreams).

## 路由/API

API7 中的路由/ API 概念，与 Apache APISIX 中的路由概念保持一致。

[了解什么是路由](https://docs.api7.ai/apisix/key-concepts/routes).

## 插件模板

API7 中的插件模板概念，与 Apache APISIX 中的插件模板概念保持一致。

[了解什么是插件模板](https://docs.api7.ai/apisix/key-concepts/plugin-configs).

:::caution

- API7 中插件不可直接配置在路由/API 上，必须通过插件模板才可使用。插件模板中的插件数量可以为一个或多个。
- 消费者可以直接使用单个或多个插件，无需通过插件模板。

:::

## 消费者

API7 中的消费者概念，与 Apache APISIX 中的消费者概念保持一致。
[了解什么是消费者](https://docs.api7.ai/apisix/key-concepts/consumers).

## 数据面节点

又称网关节点，指在网关集群中部署了 API7-Gateway 服务的节点。数据面节点是 API7 的核心组件之一，它负责实际处理所有传入的 API 请求并返回响应。
在生产实践中，建议部署两个以上的数据面节点以防止单点故障。

## 控制面节点

指在网关集群中部署了 API7-Dashboard 服务的节点。主要负责接收 API7 网关的配置修改请求，管理 API7 网关节点的上下线，以及控制流量的转发规则。
在生产实践中，数据面节点和控制面节点分开部署，每个网关集群需要至少一个控制面节点。


## 开发者门户

API7 开发者门户是 AP7 Enterprise 产品的子功能，它允许用户将配置在 API7 Enterprise 之上的 API，发布到开发者门户上，让对这些 API 有需要的外部开发者可以方便地订阅和使用 API。并且利用 API7 Enterprise 提供的鉴权、限流等能力，很好地对 API 进行保护，保证 API 的安全性。

开发者门户通常分为管理端和展示端两个站点。管理端的用户为 API “生产者”（下面称为管理员），展示端的用户为 API “消费者”（下面称为开发者）。

管理端核心功能:

- 控制 API 在展示端的发布和下线，仅发布后的 API 在展示端站点可见。
- 为发布的 API 添加一些策略，例如限制访问 QPS、要求鉴权等来保护发布的 API。
- 对来自展示端站点的请求进行审批。

展示端核心功能：

- 供开发者查看所有由管理员发布后的 API 以及它们的使用文档和细节信息。
- 以应用为主体向管理员申请 API 的订阅。
- 为已经订阅的 API 创建访问所需要的凭证信息，并通过查看 API 文档来了解如何集成。

![API7 devportal concept](https://static.apiseven.com/uploads/2023/04/26/1Lv7ih05_devportal-concept.png)

### 组织

管理开发者及应用的单位，组织之间的数据是隔离的，可用于多租户管理。

:::info

- 目前只提供默认的 default 组织，后续支持自定义创建并管理组织。

:::

### 应用

订阅 API 并发起调用的主体，由开发者创建，通常对应业务中的一个产品或一组服务。

- 每个应用将拥有一组 API key，作为调用 API 的凭证。
- 应用属于组织而非属于某个具体的开发者。组织内获得授权的开发者，都可以查看应用的信息并使用 API key，他们在 API 生产者的视角里是同一个调用来源。
- 每个应用在网关中对应一个消费者。

### API

对应网关上的一条路由/ API。

- 在网关侧修改路由/API 的属性或删除路由/API，开发者门户上对应的 API 也会随之变动。
- 网关上的路由/API 没有对外开放需求时，无需发布到开发者门户。

### API订阅

开发者以应用为主体申请订阅 API。即 API 的调用许可和凭证，不属于某个特定的开发者，而是应该根据业务划分，属于某个应用。

订阅成功后应用方可调用此 API。如果 API 开启了认证，则应用会获得对应的访问凭证。

- 对于同一个 API，不同应用的访问凭证是不同的，但对于同一个应用，如果订阅了多个使用同样认证方式的 API，则对应的访问凭证是一样的。
- 如果取消某个应用对当前 API 的订阅，则此应用的访问凭证会失效。
- 每条 API 订阅成功，会映射为在该 API 的关联路由中，将对应的消费者（Consumer）添加入访问白名单中；取消 API 订阅，会映射为在该 API 的关联路由中，从访问白名单里删除对应的消费者（Consumer）。因此，如果在 API7 网关侧直接更改了 API 关联路由中的访问白名单，会破坏 API 订阅关系，引起错误。

:::info

- 若API没有开启任何认证，实际上任何应用都可以直接访问，不需要订阅。
- 暂不支持已经订阅成功的应用更换访问凭证。

:::