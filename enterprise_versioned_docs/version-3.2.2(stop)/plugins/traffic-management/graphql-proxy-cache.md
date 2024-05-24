---
title: graphql-proxy-cache
slug: /plugins/graphql-proxy-cache
sidebar_label: graphql-proxy-cache
sidebar_position: 1
---

import EnterpriseLabel from '@site/src/MDXComponents/EnterpriseLabel';

# graphql-proxy-cache <EnterpriseLabel />

The `graphql-proxy-cache` plugin provides the capability to cache responses for GraphQL queries. It uses [MD5](https://en.wikipedia.org/wiki/MD5) algorithm to generate cache key based on the plugin configurations and GraphQL queries. The plugin supports both disk-based and memory-based caching options to cache for [GET](https://graphql.org/learn/serving-over-http/#get-request) and [POST](https://graphql.org/learn/serving-over-http/#post-request) GraphQL requests.

If a request contains a [mutation](https://graphql.org/learn/queries#mutations) operation, the plugin will not cache the data. Instead, it adds an `Apisix-Cache-Status: BYPASS` header to the response to show that the request bypasses the caching mechanism.

## Attributes

See plugin [common configurations](../common-configurations.md) for configuration options available to all plugins.

| Name               | Type           | Required | Default      | Valid Values                                                                          | Description                                                                                                                         |
| ------------------ | -------------- | ------ | ------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| cache_strategy     | `string`       | false   | disk  | ["disk","memory"]                                                               | Caching strategy. Cache on disk or in memory. |
| cache_zone         | `string`       | false   | disk_cache_one |    | Cache zone used with the caching strategy. The value should match one of the cache zones defined in the [configuration files](#static-configurations) and should correspond to the caching strategy. For example, when using the in-memory caching strategy, you should use an in-memory cache zone. |
| cache_ttl          | `integer`      | false   | 300  |  >=1   | Cache time to live (TTL) in seconds when caching in memory. |

<br />

:::info

To adjust the TTL when caching on disk, update `cache_ttl` in the [configuration files](#static-configurations). The TTL value is evaluated in conjunction with the values in the response headers  [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires) received from the upstream service.

:::

## Static Configurations

By default, values such as `cache_ttl` when caching on disk and cache `zones` are pre-configured in the default [configuration file](../../reference/configuration-files.md#config-defaultyaml-and-configyaml). For example:

```yaml
apisix:
  proxy_cache:
  cache_ttl: 10s  # for caching on disk
  zones:
    - name: disk_cache_one
      memory_size: 50m
      disk_size: 1G
      disk_path: /tmp/disk_cache_one
      cache_levels: 1:2
    # - name: disk_cache_two
    #   memory_size: 50m
    #   disk_size: 1G
    #   disk_path: "/tmp/disk_cache_two"
    #   cache_levels: "1:2"
    - name: memory_cache
      memory_size: 50m
```

To customize, add the corresponding configurations to `config.yaml`, which takes precedence over the configurations in `config-default.yaml`. [Reload APISIX](../../reference/apisix-cli.md#apisix-reload) for changes to take effect.

## Examples

The examples below use [GitHub GraphQL API](https://docs.github.com/en/graphql) as an upstream and demonstrate how you can configure `graphql-proxy-cache` for different scenarios.

To follow along, create a GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with the appropriate scopes for the resources you want to interact with.

### Cache Data on Disk

The following example demonstrates how you can use `graphql-proxy-cache` plugin on a route to cache data on disk.

Create a route with the `graphql-proxy-cache` plugin with the default configuration to cache data on disk:

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/1" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "uri": "/graphql",
    "plugins": {
      # highlight-start
      "graphql-proxy-cache": {}
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

Send a request with a GraphQL query to verify:

```shell
curl -i "http://127.0.0.1:9080/graphql" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the following headers, showing the plugin is successfully enabled:

```text
APISIX-Cache-Key: e9c1624ee35f792548512ff9f6ff1bfa
Apisix-Cache-Status: MISS
```

As there is no cache available before the first response, `Apisix-Cache-Status: MISS` is shown.

Send the same request again within the cache TTL window. You should see an `HTTP/1.1 200 OK` response with the following headers, showing the cache is hit:

```text
APISIX-Cache-Key: e9c1624ee35f792548512ff9f6ff1bfa
Apisix-Cache-Status: HIT
```

Wait for the cache to expire after the TTL and send the same request again. You should see an `HTTP/1.1 200 OK` response with the following headers, showing the cache has expired:

```text
APISIX-Cache-Key: e9c1624ee35f792548512ff9f6ff1bfa
Apisix-Cache-Status: EXPIRED
```

### Cache Data in Memory

The following example demonstrates how you can use `graphql-proxy-cache` plugin on a route to cache data in memory.

Create a route with `graphql-proxy-cache` enabled and configure it use memory-based caching:

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/1" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{
    "uri": "/graphql",
    "plugins": {
      # highlight-start
      "graphql-proxy-cache": {
        // Annotate 1
        "cache_strategy": "memory",
        // Annotate 2
        "cache_zone": "memory_cache",
        // Annotate 3
        "cache_ttl": 10
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

❶ `cache_strategy`: set to `memory` for in-memory setting.

❷ `cache_zone`: set to the name of an in-memory cache zone.

❸ `cache_ttl`: set the time to live for the in-memory cache.

Send a request with a GraphQL query to verify:

```shell
curl "http://127.0.0.1:9080/graphql" -i -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GH_ACCESS_TOKEN}" \
  -d '{"query": "query {viewer{login}}"}'
```

You should see an `HTTP/1.1 200 OK` response with the following headers, showing the plugin is successfully enabled:

```text
APISIX-Cache-Key: a661316c4b1b70ae2db5347743dec6b6
Apisix-Cache-Status: MISS
```

As there is no cache available before the first response, `Apisix-Cache-Status: MISS` is shown.

Send the same request again within the cache TTL window. You should see an `HTTP/1.1 200 OK` response with the following headers, showing the cache is hit:

```text
APISIX-Cache-Key: a661316c4b1b70ae2db5347743dec6b6
Apisix-Cache-Status: HIT
```

### Remove Cache Manually

While most of the time it is not necessary, there may be situations where you would want to manually remove cached data.

The following example demonstrates how you can use the `public-api` plugin to expose the `/apisix/plugin/graphql-proxy-cache/{cache_strategy}/{route_id}/{key}` endpoint created by the `graphql-proxy-cache` plugin to manually remove cache.

Create a route that matches the URI `/apisix/plugin/graphql-proxy-cache/*`:

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes" -X PUT \
  -H "X-API-KEY: ${ADMIN_API_KEY}" \
  -d '{   
    "id": "graphql-cache-purge",
    "uri": "/apisix/plugin/graphql-proxy-cache/*",
    "plugins": {
      "public-api": {}
    }
  }'
```

Send a PURGE request to remove data cached on disk for route `1`:

```shell
curl -i "http://127.0.0.1:9080/apisix/plugin/graphql-proxy-cache/disk/1/e9c1624ee35f792548512ff9f6ff1bfa" -X PURGE
```

An `HTTP/1.1 200 OK` response verifies that the cache corresponding to the key is successfully removed.

If you send the same request again, you should see an `HTTP/1.1 404 Not Found` response, showing there is no cache on disk with this cache key after the cache removal.
