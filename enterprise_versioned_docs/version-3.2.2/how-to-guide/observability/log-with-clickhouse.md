---
title: Log with ClickHouse
slug: /how-to-guide/observability/log-with-clickhouse
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

APISIX supports collecting route access information and recording it as logs, such as host, client IP, and request timestamp. This key information will be of great help in troubleshooting related problems.

[ClickHouse](https://clickhouse.com/) is an open-source column-oriented database management system (DBMS) for online analytical processing (OLAP). It allows users to generate analytical reports such as log analytics using SQL queries in real-time.

This guide will show you how to enable the `clickhouse-logger` plugin to record the APISIX logs into ClickHouse databases.

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker/).
* Install [cURL](https://curl.se/) to send requests to the services for validation.
* Follow the [Getting Started tutorial](./../../getting-started/) to start a new APISIX instance in Docker.

## Configure ClickHouse

Start a ClickHouse instance named `quickstart-clickhouse-server` with a default database `quickstart_db`, a default user `quickstart-user` and password `quickstart-pass` in Docker:

```shell
docker run -d \
  --name quickstart-clickhouse-server \
  --network=apisix-quickstart-net \
# highlight-start
  -e CLICKHOUSE_DB=quickstart_db \
  -e CLICKHOUSE_USER=quickstart-user \
  -e CLICKHOUSE_PASSWORD=quickstart-pass \
# highlight-end
  -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
  --ulimit nofile=262144:262144 \
  clickhouse/clickhouse-server
```

Connect to the ClickHouse instance using the command line tool `clickhouse-client` in Docker:

```shell
docker exec -it quickstart-clickhouse-server clickhouse-client
```

Create a table `test` in database `quickstart_db` with fields `host`, `client_ip`, `route_id`, `@timestamp` of `String` type, or adjust the command accordingly based on your needs:

```sql
CREATE TABLE quickstart_db.test (
  `host` String,
  `client_ip` String,
  `route_id` String,
  `@timestamp` String,
   PRIMARY KEY(`@timestamp`)
) ENGINE = MergeTree()
```

If successful, you should see `Ok` on the output. 

Enter `exit` to exit from the command line interface in Docker.

## Enable `clickhouse-logger` Plugin

Create a route:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes" -X PUT -d '
{
  "id": "getting-started-ip",
  "uri": "/ip",
  "upstream": {
    "type": "roundrobin",
    "nodes": {
      "httpbin.org:80": 1
    }
  }
}'
```

Enable the `clickhouse-logger` plugin globally for all requests, or on a specific route:

<Tabs
  defaultValue="global"
  values={[
    {label: 'Global', value: 'global'},
    {label: 'Route', value: 'route'},
  ]}>
  <TabItem value="global">

Enable the `clickhouse-logger` plugin on all routes:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/global_rules" -X PUT -d '
{
  "id": "clickhouse",
  "plugins": {
    "clickhouse-logger": {
# highlight-start
// Annotate 1
      "log_format": {
# highlight-end
        "host": "$host",
        "@timestamp": "$time_iso8601",
        "client_ip": "$remote_addr"
      },
# highlight-start
// Annotate 2
      "user": "quickstart-user",
      "password": "quickstart-pass",
      "database": "quickstart_db",
      "logtable": "test",
      "endpoint_addrs": ["http://quickstart-clickhouse-server:8123"]
# highlight-end
    }
  }
}'
```

➊ Specify all fields corresponding to the ClickHouse table in the log format

➋ ClickHouse server information

An `HTTP/1.1 201 OK` response verifies that the `clickhouse-logger` plugin is enabled successfully.

  </TabItem>
  <TabItem value="route">

Enable the `clickhouse-logger` plugin on a specific route:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes/getting-started-ip" -X PATCH -d '
{
  "plugins": {
    "clickhouse-logger": {
# highlight-start
// Annotate 1
      "log_format": {
# highlight-end
        "host": "$host",
        "@timestamp": "$time_iso8601",
        "client_ip": "$remote_addr"
      },
# highlight-start
// Annotate 2
      "user": "quickstart-user",
      "password": "quickstart-pass",
      "database": "quickstart_db",
      "logtable": "test",
      "endpoint_addrs": ["http://quickstart-clickhouse-server:8123"]
# highlight-end
    }
  }
}'
```

➊ Specify all fields corresponding to the ClickHouse table in the log format

➋ ClickHouse server information

An `HTTP/1.1 200 OK` response verifies that the `clickhouse-logger` plugin is enabled successfully.

  </TabItem>
</Tabs>

## Submit Logs in Batches

The `clickhouse-logger` plugin supports using a batch processor to aggregate and process logs in batches. This avoids frequent submissions of log entries to ClickHouse, which slows down the operations.
 
By default, the batch processor submits data every 5 seconds or when the data size in a batch reaches 1000 KB. You can adjust the time interval of submission `inactive_timeout` and maximum batch size `batch_max_size` for the plugin. For example, this is how you can set `inactive_timeout` to 10 seconds and `batch_max_size` to 2000 KB:

<Tabs
  defaultValue="global"
  values={[
    {label: 'Global', value: 'global'},
    {label: 'Route', value: 'route'},
  ]}>
  <TabItem value="global">

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/global_rules/clickhouse" -X PATCH -d '
{
  "plugins": {
    "clickhouse-logger": {
      "batch_max_size": 2000,
      "inactive_timeout": 10
    }
  }
}'
```

  </TabItem>
  <TabItem value="route">

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes/getting-started-ip" -X PATCH -d '
{
  "plugins": {
    "clickhouse-logger": {
      "batch_max_size": 2000,
      "inactive_timeout": 10
    }
  }
}'
```

  </TabItem>
</Tabs>

## Verify Logging

Send a request to the route to generate an access log entry:

```shell
curl -i "http://127.0.0.1:9080/ip"
```

Connect to the ClickHouse instance using the command line tool `clickhouse-client` in Docker:

```shell
docker exec -it quickstart-clickhouse-server clickhouse-client
```

Query all records in table `quickstart_db.test`:

```sql
SELECT * from quickstart_db.test
```

You should see an access record similar to the following, which verifies `clickhouse-logger` plugin works as intended.

```text
┌─host──────┬─client_ip──┬─route_id───────────┬─@timestamp────────────────┐
│ 127.0.0.1 │ 172.18.0.1 │ getting-started-ip │ 2023-06-07T15:28:24+00:00 │
└───────────┴────────────┴────────────────────┴───────────────────────────┘
```

## Next Steps

See `clickhouse-logger` plugin reference to learn more about the plugin configuration options (coming soon).

[//]: <TODO: Add link to the clickhouse-logger plugin reference>
