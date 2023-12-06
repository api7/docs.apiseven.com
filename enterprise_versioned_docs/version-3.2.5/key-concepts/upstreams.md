---
title: 上游
slug: /key-concepts/upstreams
---

API7 企业版中的上游对象是一组包含一个或多个上游地址的逻辑抽象。[服务](./services.md)中需要使用它来指定请求的流向和分发方式。
服务与上游之间通常是一对多（1:N）的关系。

下面是路由中上游配置的一个示例，其中三个不同的路由共享同一个上游地址：

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/28/PvcCbptb_ec8ef4d8ab047e05e480f6f061d5348.png"
    alt="Upstreams Diagram show three routes with different plugins pointing to the same upstream object with the desired upstream address"
    width="95%" />
</div>
<br />

:::info

如果你熟悉 Apache APISIX，请务必注意上游和服务之间的关系与 API7 企业版中的不同。

:::

## 服务发现

虽然可以直接静态计算上游地址，但在基于微服务的架构中，上游地址通常是动态分配的。因此在自动扩展、故障和更新过程中，上游地址会发生变化。在这种情况下，静态配置上游地址并不理想。 

这时，服务发现功能就派上用场了。它描述了自动检测可用上游端点的过程，并将其地址保存在数据库（服务注册表）中，供用户参考。这样，API7 企业版就能随时通过注册表获取最新的上游端点列表，确保所有请求都能转发到健康的上游节点。

API7 企业版支持与 Kubernetes 服务发现的集成。更多服务注册表也即将推出，如 Consul、Eureka、Nacos 等。

## 上游健康检查

API7 企业版提供主动和被动健康检查选项，以探测上游节点是否在线（又称健康）。不健康的上游节点将被忽略，直到它们恢复并再次被视为健康节点。

## 运行时配置

上游节点和服务发现均属于运行时配置。这是因为当同一服务版本发布到不同网关组时，它们的值可能会有所不同，而且用户可以在网关组内直接进行编辑。