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

API7 Dashboard 是控制面的一个逻辑组件，它是一个 Web GUI 并处理业务逻辑。API7 Dashboard 是一个无状态服务，所有数据信息都存储在关系型数据库中。

此外，您可以在所有 API7 Dashboard 节点之前部署一个负载均衡。

对于所有计划部署控制面的主机，请执行以下操作：

**1. 将控制面安装包复制到主机上**

**2. 配置 `dashboard-config.yaml`**

修改数据库地址的配置项:

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

修改数据库地址的配置项:

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

在数据面上，API7 Gateway 组件负责接收来自客户端的流量并将其转发到上游服务。API7 Gateway 是一个无状态组件，所有配置信息都存储在关系型数据库中。因此，您可以部署多个节点以提高数据面的高可用性。

此外，您可以在所有 API7 Gateway 节点之前部署一个负载均衡。这样的架构使得API7 Gateway 能够更好地处理高并发请求，并提供更可靠的服务。通过负载均衡，可以将进入的流量均匀分配到多个 API7 Gateway 节点上，如果某个网关节点发生故障，负载均衡可以将其移除，确保流量不会被发送到不可用的节点上。

对于所有计划部署数据面的主机，请执行以下操作：

**1. 登录 API7 企业版控制台**.

**2. 进入指定网关组或创建新的网关组.**

**3. 点击 `新增网关实例`**

参考 [添加网关实例](../api-full-lifecycle-management/api-runtime/add-gateway-instances.md) 完成操作.
