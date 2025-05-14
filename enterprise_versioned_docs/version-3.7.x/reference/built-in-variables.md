---
title: 内置变量  
slug: /reference/built-in-variables  
description: 了解 API7 中可用的内置变量，包括 NGINX 和 APISIX 变量，这些变量可用于路由匹配、日志定制和插件配置。  
---

API7 企业版中的_内置变量_是预定义的变量，可直接在配置中引用。它们常用于插件配置、路由匹配和日志定制场景。  

API7 企业版支持两类内置变量：  

* NGINX 变量  
* APISIX 变量  

这些变量会按照[指定顺序](#evaluation-order)进行求值。  

## NGINX 变量  

NGINX 提供了一系列变量，可用于访问请求相关的各类信息。  

常用变量包括：  

* `upstream_addr`  
* `remote_addr`  
* `request_uri`  
* `server_name`  
* `uri`  
* `http_user_agent`  

完整变量列表请参阅 [NGINX 官方变量索引](https://nginx.org/en/docs/varindex.html)。  

## APISIX 变量  

除 [NGINX 变量](https://nginx.org/en/docs/varindex.html)外，APISIX 还提供了多种内置变量：  

| 变量名称             | 描述                                                                       |
|---------------------|---------------------------------------------------------------------------|
| `post_arg_*`        | 当 Content-Type 为 `application/x-www-form-urlencoded` 时的 HTTP POST 表单数据。星号需替换为实际的表单字段名。            |
| `post_arg.*`        | 当 Content-Type 为 `application/json`、`application/x-www-form-urlencoded` 或 `multipart/form-data` 时的 HTTP POST 参数。星号需替换为实际参数名。支持类似 JSON Path 的选择语法，例如 `post_arg.model.version` 和 `post_arg.messages[*].content[*].type`。            |
| `arg_*`             | URL 查询字符串参数。星号需替换为实际查询参数名。               |
| `http_*`            | HTTP 请求头。星号需替换为实际请求头名称。              |
| `cookie_*`          | 请求 Cookie。星号需替换为实际 Cookie 名称。              |
| `balancer_ip`       | 上游服务器 IP 地址。                                                                |
| `balancer_port`     | 上游服务器端口号。                                                              |
| `consumer_name`     | 消费者用户名。                                                                 |
| `consumer_group_id` | 消费者组 ID。                                                                 |
| `graphql_name`      | GraphQL [操作名称](https://graphql.org/learn/queries/#operation-name)。       |
| `graphql_operation` | GraphQL [操作类型](https://graphql.org/learn/queries/#operation-name)。       |
| `graphql_root_fields` | GraphQL [根字段](https://graphql.org/learn/execution/#root-fields-resolvers)。 |
| `route_id`          | 路由 ID。                                                                          |
| `route_name`        | 路由名称。                                                                        |
| `service_id`        | 服务 ID。                                                                        |
| `service_name`      | 服务名称。                                                                      |
| `resp_body`         | HTTP 响应体内容。       |
| `mqtt_client_id`    | MQTT 协议中的客户端 ID。                                                        |
| `redis_cmd_line`    | Redis 命令。                                                                     |
| `rpc_time`          | RPC 请求往返时间。                                                       |

## 求值顺序  

API7 企业版按以下顺序对变量进行求值：  

1. APISIX 变量  
2. NGINX 变量  

若自定义变量中已成功获取某变量值，API7 企业版将不再继续查找 APISIX 变量或 NGINX 变量中的同名变量。  

换言之，自定义变量会**覆盖** APISIX 变量或 NGINX 变量中的同名定义，以满足特定场景的定制化需求。
