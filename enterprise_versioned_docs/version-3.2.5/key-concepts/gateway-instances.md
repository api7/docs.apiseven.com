---
title: 网关实例
slug: /key-concepts/gateway-instances
---

网关实例是处理流量的单个代理。网关实例属于[网关组](./gateway-groups.md)。如果你熟悉 Apache APISIX，网关实例类似于 Apache APISIX 数据平面节点。

网关组内的多个网关实例独立运行，以实现横向扩展和负载均衡。虽然使用集中配置，但它们并不共享状态。添加或删除网关实例有助于调整容量，实现高可用性和容错。监控每个实例对评估整体系统健康状况至关重要。