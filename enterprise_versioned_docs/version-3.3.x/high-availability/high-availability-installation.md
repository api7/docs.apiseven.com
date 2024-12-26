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

API7 Dashboard 是控制面中的主要组件，它是一个 Web GUI 并处理业务逻辑。API7 Dashboard 是一个无状态服务，所有数据信息都存储在关系型数据库中（默认使用 PostgreSQL）。

为达到高可用，需要不只一个控制面节点，而是一个包含多个节点的集群。同时，你需要在多个控制面节点之前部署一个负载均衡。通过负载均衡，可以将进入的流量均匀分配到多个控制面节点上，如果某个节点发生故障，负载均衡可以将其移除，确保流量不会被发送到不可用的节点上。

对于所有控制面节点，请执行以下操作：

1. 将控制面软件包复制到主机。你可以从[高可用配置准备](./prepare-for-high-availability.md)中获取合适的软件包。
2. 配置 `dashboard-config.yaml` 以修改数据库地址：

```bash
server:
  listen:
    host: "0.0.0.0"
    port: 17080

database:
  dsn: "postgres://$user:$password@$postgresql_address:$postgresql_port/api7ee"
```

3. 启动 API7 Dashboard：

```bash
docker run -d -p 17080:17080 -v ./dashboard-config.yaml:/app/conf/config.yaml api7/api7-ee-3-integrated:v3.2.16.3
```

4. 配置 `dp-manager-config.yaml`：

打开配置文件，修改其中数据库地址的配置项:

```bash
server:
  listen:
    host: "0.0.0.0"
    port: 17900

database:
  dsn: "postgres://$user:$password@$postgresql_address:$postgresql_port/api7ee"
```

5. 启动 DP Manager：

```bash
docker run -d -p 17900:17900 -v ./dp-manager-config.yaml:/usr/local/api7/conf/config.yaml api7/api7-ee-dp-manager:v3.2.9.1
```

## 数据面部署步骤

API7 网关根据接受来自客户端的流量并将其转发到上游进行收费，因此数据面节点也可以称为网关实例。API7 网关是一个无状态组件，所有配置信息都存储在 PostgreSQL 中。因此，您可以部署多个节点来提高数据面的高可用性。

### 添加网关组

为了确保高可用性，您需要一个包含多个数据面节点的数据面集群。数据面集群也可以称为[网关组](../key-concepts/gateway-groups.md)。有关说明，请参阅[新增网关组](../getting-started/add-gateway-group.md)。

### 健康检查

在数据面节点前面部署负载均衡器并启用健康检查对于保持高可用性和防止流量路由到不健康的节点至关重要。

1. 配置 `gateway_conf/config.yaml` 以添加用于监听接口的 `status` 模块：

```bash
apisix:
  status:
    ip: 0.0.0.0
    port: 7085
```

2. 将负载均衡器设置为定期检查所有健康检查接口。根据你的具体要求和应用程序的预期响应时间确定合适的健康检查频率。通常的做法是将健康检查设置为每 30 秒探测一次。

```bash
curl "http://127.0.0.1:7085/status" -v
```

如果数据面是健康的，你应该会看到以下 `200 OK` 响应：

```text
*   Trying 127.0.0.1:7085...
* Connected to 127.0.0.1 (127.0.0.1) port 7085 (#0)
> GET /status HTTP/1.1
> Host: 127.0.0.1:7085
> User-Agent: curl/7.74.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Server: openresty
< Date: Thu, 17 Oct 2024 06:27:38 GMT
< Content-Type: text/plain; charset=utf-8
< Transfer-Encoding: chunked
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
```
