---
title: 上游
slug: /key-concepts/upstreams
---

API7 企业版中的上游对象是一组包含一个或多个上游节点地址的逻辑抽象。[服务](./services.md)中需要使用它来指定请求的流向和分发方式。
服务与上游之间通常是一对一（1:1）的关系，唯一的例外是在流量灰度过程中，服务会暂时有两个上游。

下面是路由中上游配置的一个示例：

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2024/03/19/l41chml4_%E4%B8%8A%E6%B8%B8%E6%A6%82%E5%BF%B5.png"
    alt="Upstreams Diagram show three routes with different plugins pointing to the same upstream object with the desired upstream address"
    width="95%" />
</div>
<br />

:::warning

如果你熟悉 Apache APISIX，请务必注意上游和服务之间的关系与 API7 企业版中的不同。

:::

## 服务发现

在基于微服务的架构中，尽管静态地确定上游地址是最简单直接的，但上游地址在自动扩容、故障和更新过程中通常是动态分配和更改的。因此，静态配置不太方便，效率也低。

在这种情况下，你可以使用服务发现。服务发现能自动检测可用的上游端点，并将它们的地址保存在数据库（称为服务注册中心）中，以供其他服务引用。API7 企业版可以通过注册中心始终获取最新的上游端点列表，确保所有请求都被转发到健康的上游节点。

API7 企业版支持与 Kubernetes 服务发现集成，并且还支持与更多服务注册表的集成，例如Consul、Eureka、Nacos等。这种集成能力使得API7 企业版能够灵活地适应不同的微服务架构环境，并提供高效、可靠的 API 管理服务。

## 上游节点健康检查

API7 企业版提供主动和被动健康检查选项，以探测上游节点是否健康，可以按照预期运行。不健康的上游节点将被忽略，直到它们恢复并再次被视为健康节点。

## 运行时配置

上游节点和服务发现均属于运行时配置。这是因为当同一服务版本发布到不同网关组时，它们的值可能会有所不同，而且用户可以在网关组内直接进行编辑。详情参考[服务运行时配置](services.md#运行时配置)

## 相关阅读

- [上游高可用](../best-practices/upstream-ha.md)
- [流量灰度](../getting-started/canary-upstream.md)