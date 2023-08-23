---
title: graphql-limit-count
slug: /plugins/graphql-limit-count
sidebar_label: graphql-limit-count
sidebar_position: 1
---

import EnterpriseLabel from '@site/src/MDXComponents/EnterpriseLabel';

# graphql-limit-count <EnterpriseLabel />

The `graphql-limit-count` plugin uses a fixed window algorithm to limit the rate of GraphQL requests based on the depth of the GraphQL [queries](https://graphql.org/learn/queries/) or [mutations](https://graphql.org/learn/queries#mutations).

In GraphQL, the depth refers to the number of nesting levels in a query or mutation. The following is an example query with a depth of 3:

```text
{
  a {
    b {
      c
    }
  }
}
```

The `graphql-limit-count` plugin rate limits by a quota of depth within a given time interval. For example, if the quota of count is set to 4 within a 30-second interval, requests with a depth of 3 will be allowed. The remaining quota within the same 30-second is 1. If a request of depth 2 is sent within the same 30-second interval, it will be rejected.

## Attributes

See plugin [common configurations](../common-configurations.md) for configuration options available to all plugins.

| Name        | Type  | Required    | Default  | Valid Values              | Description                                                                                                                 |
| ------------------- | ------- | ---------- | ------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| count         | `integer` | true    |        | > 0  | The maximum request depth allowed within a given time interval. |
| time_window     | `integer` | true  |        | > 0  | The time interval corresponding to the rate limiting `count` in seconds. |
| key_type      | `string`  | false     |  "var"  | ["var", "var_combination", "constant"] | The type of key. If it is `var`, the `key` is interpreted a variable. If it is `var_combination`, the `key` is interpreted as a combination of variables. If it is `constant`, the `key` is interpreted as a constant. |
| key         | `string`  | false    | "remote_addr"  |                    | The key to count requests by. |
| rejected_code     | `integer` | false    | 503      | [200,...,599]              | The HTTP status code returned when a request is rejected for exceeding the threshold. |
| rejected_msg    | `string`  | false    |        | non-empty                | The response body returned when a request is rejected for exceeding the threshold. |
| policy        | `string`  | false    | "local"    | ["local", "redis", "redis-cluster"]  | The policy for rate limiting counter. If it is `local`, the counter is stored in memory locally. If it is `redis`, the counter is stored on a Redis instance. If it is `redis-cluster`, the counter is stored in a Redis cluster. |
| allow_degradation   | `boolean` | false    | false      |                     | If `true`, allow APISIX to continue handling requests without the plugin when the plugin or its dependencies become unavailable. |
| show_limit_quota_header | `boolean` | false  | true      |                      | If `true`, include `X-RateLimit-Limit` to show the total quota and `X-RateLimit-Remaining` to show the remaining quota in the response header. |
| group         | `string`  | false     |         | non-empty                 | The `group` ID for the plugin, such that routes of the same `group` can share the same rate limiting counter. |
| redis_host      | `string`  | false     |         |         | The address of the Redis node. Required when `policy` is `redis`. |
| redis_port      | `integer` | false | 6379 | [1,...] | The port of the Redis node when `policy` is `redis`. |
| redis_password    | `string`  | false     |         |         | The password of the Redis node when `policy` is `redis` or `redis-cluster`. |
| redis_database    | `integer` | false     | 0       | >= 0           | The database number in Redis when `policy` is `redis`. |
| redis_ssl  | `boolean`  | false   |  false  |  | If `true`, use SSL to connect to Redis cluster when `policy` is `redis`. |
| redis_ssl_verify  | `boolean`  | false   |  false   |  | If `true`, verify the server SSL certificate when `policy` is `redis`. |
| redis_timeout     | `integer` | false     | 1000      | [1,...]   | The Redis timeout value in milliseconds when `policy` is `redis` or `redis-cluster`. |
| redis_cluster_nodes | `array[string]`   | false     |         |                     | The list of the Redis cluster nodes with at least two addresses. Required when `policy` is `redis-cluster`. |
| redis_cluster_name  | `string`  | false     |         |                     | The name of the Redis cluster. Required when `policy` is `redis-cluster`. |
| redis_cluster_ssl  | `boolean`  | false     |   false  |                     | If `true`, use SSL to connect to Redis cluster when `policy` is `redis-cluster`. |
| redis_cluster_ssl_verify  | `boolean`  | false   |  false   |                | If `true`, verify the server SSL certificate when `policy` is `redis-cluster`. |

## Examples

The examples below use [GitHub GraphQL API](https://docs.github.com/en/graphql) endpoint as an upstream and demonstrate how you can configure `graphql-limit-count` for different scenarios.

To follow along, create a GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with the appropriate scopes for the resources you want to interact with.

### Apply Rate Limiting by Remote Address

The following example demonstrates the rate limiting of GraphQL requests by a single variable, `remote_addr`. 

Create a route with `graphql-limit-count` plugin that allows for a quota of depth 2 within a 30-second window per remote address:

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/1" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "uri": "/graphql",
    "plugins": {
      # highlight-start
      "graphql-limit-count": {
        "count": 2,
        "time_window": 30,
        "rejected_code": 429,
        "key_type": "var",
        "key": "remote_addr"
      }
      # highlight-end
    },
    "upstream": {
      "type": "roundrobin",
      "pass_host": "node",
      "scheme": "https",
      "nodes": {
        "api.github.com:443": 1
      }
    }
  }'
```

#### Verify With GraphQL Query

Send a request with a GraphQL query of depth 2 to verify:

```shell
curl -i "http://127.0.0.1:9080/graphql" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the corresponding response body.

The request has consumed all the quota allowed for the time window. If you send the request again within the same 30-second time interval, you should receive an `HTTP/1.1 429 Too Many Requests` response, indicating the request surpasses the quota threshold.

#### Verify With GraphQL Mutation

You can also send a request with a GraphQL mutation of depth 3 to verify:

```shell
curl -i "http://127.0.0.1:9080/graphql" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "mutation AddReactionToIssue {addReaction(input:{subjectId:\"MDU6SXNzdWUyMzEzOTE1NTE=\",content:HOORAY}) {reaction {content} subject {id}}}"}'
```

You should see an `HTTP/1.1 429 Too Many Requests` response at any time, as depth 3 always surpasses the quota of depth 2.

### Apply Rate Limiting by Remote Address and Consumer Name

The following example demonstrates the rate limiting of GraphQL requests by a combination of variables, `remote_addr` and `consumer_name`. It allows for a quota of depth 2 within a 30-second window per remote address and for each [consumer](../../background-information/key-concepts/consumers.md).

Create two consumers, `jane` and `john`, and enable [key authentication](../../getting-started/key-authentication.md):

```shell
curl "http://127.0.0.1:9180/apisix/admin/consumers" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "username": "jane",
    "plugins": {
      "key-auth": {
        "key": "jane-key"
      }
    }
  }'
```

```shell
curl "http://127.0.0.1:9180/apisix/admin/consumers" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "username": "john",
    "plugins": {
      "key-auth": {
        "key": "john-key"
      }
    }
  }'
```

Create a route with `key-auth` and `graphql-limit-count` plugins:

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/1" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "uri": "/graphql",
    "plugins": {
      # highlight-start
      // Annotate 1
      "key-auth": {},
      "graphql-limit-count": {
        "count": 2,
        "time_window": 30,
        "rejected_code": 429,
        // Annotate 2
        "key_type": "var_combination",
        // Annotate 3
        "key": "$remote_addr $consumer_name"
      }
      # highlight-end
    },
    "upstream": {
      "type": "roundrobin",
      "pass_host": "node",
      "scheme": "https",
      "nodes": {
        "api.github.com:443": 1
      }
    }
  }'
```

❶ `key-auth`: enable key authentication on the route.

❷ `key_type`: set to `var_combination` to interpret the `key` is as a combination of variables.

❸ `key`: set to `$remote_addr $consumer_name` to apply rate limiting quota by remote address and consumer.

Send a request with a GraphQL query of depth 2 as the consumer `jane`:

```shell
curl -i "http://127.0.0.1:9080/graphql" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -H 'apikey: jane-key' \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the corresponding response body.

This request has consumed all the quota set for the time window. If you send the same request as the consumer `jane` within the same 30-second time interval, you should receive an `HTTP/1.1 429 Too Many Requests` response, indicating the request surpasses the quota threshold.

Send the same request as the consumer `john` within the same 30-second time interval:

```shell
curl -i "http://127.0.0.1:9080/graphql" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -H 'apikey: john-key' \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the corresponding response body, indicating the request is not rate limited.

Send the same request as the consumer `john` again within the same 30-second time interval, you should receive an `HTTP/1.1 429 Too Many Requests` response.

This verifies the plugin rate limits by the combination of variables, `remote_addr` and `consumer_name`.

### Share Quota Among Routes

The following example demonstrates the sharing of GraphQL rate limiting quota Among multiple routes by configuring the `group` of the `graphql-limit-count` plugin.

Note that the configurations of the `graphql-limit-count` plugin of the same `group` should be identical. To avoid update anomalies and repetitive configurations, you can create a [service](../../background-information/key-concepts/services.md) with `graphql-limit-count` plugin and upstream for routes to connect to.

Create a service with an ID of `1`:

```shell
curl http://127.0.0.1:9180/apisix/admin/services/1 -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "plugins": {
      # highlight-start
      "graphql-limit-count": {
        "count": 2,
        "time_window": 30,
        "rejected_code": 429,
        "group": "srv1"
      }
      # highlight-end
    },
    "upstream": {
      "type": "roundrobin",
      "pass_host": "node",
      "scheme": "https",
      "nodes": {
        "api.github.com:443": 1
      }
    }
  }'
```

Create two routes and configure their `service_id` to be `1`, so that they share the same configurations for the plugin and upstream:

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/1" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    # highlight-start
    "service_id": "1",
    # highlight-end
    "uri": "/graphql1",
    "plugins": {
      "proxy-rewrite": {
        "uri": "/graphql"
      }
    }
  }'
```

```shell
curl http://127.0.0.1:9180/apisix/admin/routes/2 -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    # highlight-start
    "service_id": "1",
    # highlight-end
    "uri": "/graphql2",
    "plugins": {
      "proxy-rewrite": {
        "uri": "/graphql"
      }
    }
  }'
```

:::note

The `proxy-rewrite` plugin is used to rewrite the URI to `/graphql` so that requests are forwarded to the correct endpoint.

[//]: <TODO: Add link to proxy-rewrite>

:::

Send a request with a GraphQL query of depth 2 to route `/graphql1`:

```shell
curl -i "http://127.0.0.1:9080/graphql1" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the corresponding response body.

Send the same query of depth 2 to route `/graphql2` within the same 30-second time interval:

```shell
curl -i "http://127.0.0.1:9080/graphql2" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "query {viewer{login}}"}'
```

You should receive an `HTTP/1.1 429 Too Many Requests` response, which verifies the two routes share the same rate limiting quota.

### Share Quota Among APISIX Nodes with a Redis Server

The following example demonstrates the rate limiting of GraphQL requests across multiple APISIX nodes with a Redis server, such that different APISIX nodes share the same rate limiting quota. 

On each APISIX instance, create a route with the following configurations. Adjust the address of the Admin API accordingly.

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/1" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "uri": "/graphql",
    "plugins": {
      # highlight-start
      "graphql-limit-count": {
        "count": 2,
        "time_window": 30,
        "rejected_code": 429,
        "key": "remote_addr",
        // Annotate 1
        "policy": "redis",
        // Annotate 2
        "redis_host": "192.168.xxx.xxx",
        // Annotate 3
        "redis_port": 6379,
        // Annotate 4
        "redis_password": "p@ssw0rd",
        // Annotate 5
        "redis_database": 1
      }
      # highlight-end
    },
    "upstream": {
      "type": "roundrobin",
      "pass_host": "node",
      "scheme": "https",
      "nodes": {
        "api.github.com:443": 1
      }
    }
  }'
```

❶ `policy`: set to `redis` to use a Redis instance for rate limiting.

❷ `redis_host`: set to Redis instance IP address.

❸ `redis_port`: set to Redis instance listening port.

❹ `redis_password`: set to the password of the Redis instance, if any.

❺ `redis_database`: set to the database number in the Redis instance.

Send a request with a GraphQL query of depth 2 to an APISIX instance:

```shell
curl -i "http://127.0.0.1:9080/graphql" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the corresponding response body.

Send the same request to a different APISIX instance within the same 30-second time interval, you should receive an `HTTP/1.1 429 Too Many Requests` response, verifying routes configured in different APISIX nodes share the same quota.

### Share Quota Among APISIX Nodes with a Redis Cluster

You can also use a Redis cluster to apply the same quota across multiple APISIX nodes, such that different APISIX nodes share the same rate limiting quota.

Ensure that your Redis instances are running in [cluster mode](https://redis.io/docs/management/scaling/#create-and-use-a-redis-cluster). A minimum of two nodes are required for the `graphql-limit-count` plugin configurations.

On each APISIX instance, create a route with the following configurations. Adjust the address of the Admin API accordingly.

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/1" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "uri": "/graphql",
    "plugins": {
      # highlight-start
      "graphql-limit-count": {
        "count": 2,
        "time_window": 30,
        "rejected_code": 429,
        "key": "remote_addr",
        // Annotate 1
        "policy": "redis-cluster",
        // Annotate 2
        "redis_cluster_nodes": [
          "192.168.xxx.xxx:6379",
          "192.168.xxx.xxx:16379"
        ],
        // Annotate 3
        "redis_password": "p@ssw0rd",
        // Annotate 4
        "redis_cluster_name": "redis-cluster-1",
        // Annotate 5
        "redis_cluster_ssl": true
      }
      # highlight-end
    },
    "upstream": {
      "type": "roundrobin",
      "pass_host": "node",
      "scheme": "https",
      "nodes": {
        "api.github.com:443": 1
      }
    }
  }'
```

❶ `policy`: set to `redis-cluster` to use a Redis cluster for rate limiting.

❷ `redis_cluster_nodes`: set to Redis node addresses in the Redis cluster.

❸ `redis_password`: set to the password of the Redis cluster, if any.

❹ `redis_cluster_name`: set to the Redis cluster name.

➎ `redis_cluster_ssl`: enable SSL/TLS communication with Redis cluster.

Send a request with a GraphQL query of depth 2 to an APISIX instance:

```shell
curl -i "http://127.0.0.1:9080/graphql" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the corresponding response body.

Send the same request to a different APISIX instance within the same 30-second time interval, you should receive an `HTTP/1.1 429 Too Many Requests` response, verifying routes configured in different APISIX nodes share the same quota.
