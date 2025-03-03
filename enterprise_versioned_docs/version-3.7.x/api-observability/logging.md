---
title: API 日志管理
slug: /api-observability/logging
---

API7 企业版支持收集 API 的访问信息并记录为日志，如主机、客户端 IP 地址、请求时间戳等。这些信息有助于解决问题。API7 企业版提供了灵活的插件扩展系统和日志记录插件。例如：

- 推送到 HTTP/TCP/UDP 日志服务器
- SkyWalking
- Kafka
- RocketMQ
- Clickhouse
- Syslog
- 阿里云 SLS
- 谷歌云日志服务
- Splunk HTTP Event Collector (HEC)
- 磁盘上的特定文件
- Elasticsearch
- 腾讯云 CLS
- Grafana Loki

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。
3. 获取自己的 ClickHouse 数据库的主机地址。

## 配置 ClickHouse

1. 在 Docker 中启动一个名为 `quickstart-clickhouse-server` 的 ClickHouse 实例，并使用默认数据库 `quickstart_db`、默认用户`quickstart-user` 和密码 `quickstart-pass`：

    ```bash
    docker network create apisix-quickstart-net

    docker run -d \
    --name quickstart-clickhouse-server \
    --network=apisix-quickstart-net \
    -e CLICKHOUSE_DB=quickstart_db \
    -e CLICKHOUSE_USER=quickstart-user \
    -e CLICKHOUSE_PASSWORD=quickstart-pass \
    -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
    --ulimit nofile=262144:262144 \
    clickhouse/clickhouse-server
    ```

2. 使用 Docker 中的命令行工具 `clickhouse-client` 连接到 ClickHouse 实例：

    ```shell
    docker exec -it quickstart-clickhouse-server clickhouse-client
    ```

3. 在数据库 `quickstart_db` 中创建一个表 `test`，字段为 `String` 类型的 `host`、`client_ip`、`route_id`、`@timestamp`：

    ```sql
    CREATE TABLE quickstart_db.test (
      `host` String,
      `client_ip` String,
      `route_id` String,
      `@timestamp` String,
      PRIMARY KEY(`@timestamp`)
    ) ENGINE = MergeTree()
    ```

    如果成功，你应该在输出中看到 `Ok`。

4. 输入`exit`命令，退出 Docker 命令行界面。

## 为所有服务开启日志记录

为了实现最佳监控和跟踪，强烈建议启用日志记录插件作为全局规则，以确保所有服务和路由都得到跟踪记录。

1. 从左侧导航栏中选择 **网关组**，然后选择 **测试网关组**。
2. 从左侧导航栏中选择 **插件设置**。
3. 选择 **插件全局规则** 页签，在 **插件** 字段中，搜索 `clickhouse-logger` 插件。
4. 单击 **加号** 图标 (+)，弹出对话框。
5. 应用以下配置：

    ```json
    {
      "log_format": {
        "host": "$host",
        "@timestamp": "$time_iso8601",
        "client_ip": "$remote_addr"
      },
      "user": "quickstart-user",
      "password": "quickstart-pass",
      "database": "quickstart_db",
      "logtable": "test",
      "endpoint_addrs": ["http://quickstart-clickhouse-server:8123"]
    }
    ```

6. 单击 **启用**。

## 验证

1. 向路由发送请求，生成访问日志条目：

    ```bash
    curl -i "http://127.0.0.1:9080/pet/1" 
    ```

2. 使用 Docker 中的命令行工具 `clickhouse-client` 连接到 ClickHouse 实例：

    ```bash
    docker exec -it 快速启动-clickhouse-server clickhouse-client
    ```

3. 查询表`quickstart_db.test`中的所有记录：

    ```sql
    SELECT * from quickstart_db.test
    ```

    你应该看到类似于以下内容的访问记录：

    ```text
    ┌─host───────────┬─client_ip───┬─route_id─────────────────────────────┬─@timestamp────────────────┐
    │ 127.0.0.1      │ 172.19.0.15 │ 6433300c-311b-4047-800e-579244d42aa7 │ 2023-09-01T09:24:16+00:00 │
    └────────────────┴─────────────┴──────────────────────────────────────┴───────────────────────────┘
    ```
