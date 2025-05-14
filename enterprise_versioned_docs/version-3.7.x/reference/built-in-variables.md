---
title: 内置变量  
slug: /reference/built-in-variables  
description: 探索 API7 中可用的内置变量，包括 NGINX 和 APISIX 变量，这些变量可用于路由匹配、日志定制和插件配置。  
---

API7 企业版中的_内置变量_是预定义的变量，可直接在配置中引用。它们常用于插件配置、路由匹配和日志定制。  

API7 企业版支持两种类型的内置变量：  

* NGINX 变量  
* APISIX 变量  

这些变量会按照[特定顺序](#evaluation-order)进行评估。  

## NGINX 变量  

NGINX 提供了一组变量，可用于访问各种请求特定的信息。  

一些常用的变量包括：  

* `upstream_addr`  
* `remote_addr`  
* `request_uri`  
* `server_name`  
* `uri`  
* `http_user_agent`  

更多信息，请参阅[NGINX 变量完整列表](https://nginx.org/en/docs/varindex.html)。  

## APISIX 变量  

除了 [NGINX 变量](https://nginx.org/en/docs/varindex.html)，APISIX 还提供了多种内置变量：  

| 变量名称            | 描述                                                                       |  
|---------------------|---------------------------------------------------------------------------|  
| `post_arg_*`        | 当内容类型为 `application/x-www-form-urlencoded` 时的 HTTP POST 表单数据。星号需替换为实际的 POST 表单数据名称。 |  
| `post_arg.*`        | 当内容类型为 `application/json`、`application/x-www-form-urlencoded` 或 `multipart/form-data` 时的 HTTP POST 请求体参数。星号需替换为实际的 POST 参数名称。支持类似 JSON 路径的选择，例如 `post_arg.model.version` 和 `post_arg.messages[*].content[*].type`。 |  
| `arg_*`            | URL 查询字符串。星号需替换为实际的查询参数名称。 |  
| `http_*`           | HTTP 请求头。星号需替换为实际的请求头名称。 |  
| `cookie_*`         | 请求 Cookie。星号需替换为实际的 Cookie 名称。 |  
| `balancer_ip`      | 上游服务器 IP。 |  
| `balancer_port`    | 上游服务器端口。 |  
| `consumer_name`    | 消费者用户名。 |  
| `consumer_group_id` | 消费者组 ID。 |  
| `graphql_name`     | GraphQL [操作名称](https://graphql.org/learn/queries/#operation-name)。 |  
| `graphql_operation` | GraphQL [操作类型](https://graphql.org/learn/queries/#operation-name)。 |  
| `graphql_root_fields` | GraphQL [根字段](https://graphql.org/learn/execution/#root-fields-resolvers)。 |  
| `route_id`         | 路由 ID。 |  
| `route_name`       | 路由名称。 |  
| `service_id`       | 服务 ID。 |  
| `service_name`     | 服务名称。 |  
| `resp_body`        | HTTP 响应体。 |  
| `mqtt_client_id`   | MQTT 协议中的客户端 ID。 |  
| `redis_cmd_line`   | Redis 命令。 |  
| `rpc_time`         | RPC 请求往返时间。 |  

## 评估顺序  

API7 企业版按照以下顺序评估变量：  

1. APISIX 变量  
2. NGINX 变量  

如果自定义变量中成功获取到某个变量，API7 企业版将不再继续在 APISIX 变量或 NGINX 变量中查找。  

换句话说，自定义变量会**覆盖** APISIX 变量或 NGINX 变量中同名的变量，以更好地满足您的特定用例需求。
