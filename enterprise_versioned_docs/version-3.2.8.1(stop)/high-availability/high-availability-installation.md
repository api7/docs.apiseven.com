---
title: 高可用部署步骤
slug: /high-availability/high-availability-installation
---

本文档介绍了如何对 API7 网关的以下组件进行高可用部署：

- 控制面：
  - API7 Dashboard
  - DP Manager
- 数据面：
  - API7 Gateway

不包括以下组件的高可用部署：

- PostgreSQL
- Prometheus

### 前提条件

- 完成 [高可用配置准备](./prepare-for-high-availability.md)。
- 自行另外安装 PostgreSQL 和 Prometheus (可选)。

## 控制面部署步骤

API7 Dashboard 是控制面中的主要组件，它是一个 Web GUI 并处理业务逻辑。API7 Dashboard 是一个无状态服务，所有数据信息都存储在关系型数据库中（默认使用PostgreSQL）。

为达到高可用，需要不只一个控制面节点，而是一个包含多个节点的集群。同时，你需要在多个控制面节点之前部署一个负载均衡。通过负载均衡，可以将进入的流量均匀分配到多个控制面节点上，如果某个节点发生故障，负载均衡可以将其移除，确保流量不会被发送到不可用的节点上。

对于集群内所有计划部署控制面件的主机，请执行以下操作：

**1. 将控制面安装包复制到主机上**

请参考[高可用配置准备](./prepare-for-high-availability.md)，获取对应安装包。

**2. 配置 `dashboard-config.yaml`**

打开配置文件，修改其中数据库地址的配置项，然后保存:

```bash
server:
  listen:
    host: "0.0.0.0"
    port: 17080

database:
  dsn: "postgres://$user:$password@$postgresql_address:$postgresql_port/api7ee"
```

**3. 启动 API7 Dashboard**

```bash
docker run -d -p 17080:17080 -v ./dashboard-config.yaml:/app/conf/config.yaml api7/api7-ee-3-integrated:v3.2.8.1
```

**4. 配置 `dp-manager-config.yaml`**

打开配置文件，修改其中数据库地址的配置项:

```bash
server:
  listen:
    host: "0.0.0.0"
    port: 17900

database:
  dsn: "postgres://$user:$password@$postgresql_address:$postgresql_port/api7ee"
```

**5. 启动 DP Manager**

```bash
docker run -d -p 17900:17900 -v ./dp-manager-config.yaml:/usr/local/api7/conf/config.yaml api7/api7-ee-dp-manager:v3.2.8.1
```

## 数据面部署步骤

在数据面上，API7 Gateway 组件负责接收来自客户端的流量并将其转发到上游服务，因此部署着数据面的节点，又被称为一个[网关实例](../key-concepts/gateway-instances.md)。

API7 Gateway 是一个无状态组件，所有配置信息都存储在关系型数据库中。为达到高可用，需要不只一个数据面节点，而是一个包含多个节点的集群。同时，你需要在多个数据面节点之前部署一个负载均衡。通过负载均衡，可以将进入的流量均匀分配到多个数据面节点上，如果某个网关节点发生故障，负载均衡可以将其移除，确保流量不会被发送到不可用的节点上。

对于所有计划部署数据面的主机，请执行以下操作：

**1. 登录 API7 企业版控制台**.

**2. 进入指定网关组或创建新的网关组.**

**3. 点击 `新增网关实例`**

参考 [添加网关实例](../getting-started/add-gateway-instance.md) 完成操作.
