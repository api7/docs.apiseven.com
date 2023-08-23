---
title: Built-In Variables
slug: /reference/built-in-variables
---

_Built-in variables_ in APISIX are pre-defined variables that can be directly referenced in configurations. The actual value of these variables will be replaced into the program at runtime, making APISIX configurations more descriptive and easier to manage.

APISIX supports three types of built-in variables:

* NGINX Variables
* APISIX Variables
* Custom Variables

They are evaluated in a given order. 

## NGINX Variables

APISIX supports NGINX variables in:

1. Plugin configurations
2. Custom logging formats in the configuration YAML files, similar to NGINX

<br />

Some of the commonly used variables include:

* `upstream_addr`
* `remote_addr`
* `request_uri`
* `server_name`
* `uri`
* `http_user_agent`

See the [complete list of NGINX variables](https://nginx.org/en/docs/varindex.html) for more information.

[//]: <TODO: link to configuration yaml files>

## APISIX Variables

In addition to [NGINX variables](https://nginx.org/en/docs/varindex.html), APISIX offers a variety of built-in variables to be used in plugins:

| Variable Name       | Description                                                                       |
|---------------------|-----------------------------------------------------------------------------------|
| `balancer_ip`        | Upstream server IP                                                                |
| `balancer_port`       | Upstream server port                                                              |
| `consumer_name`       | Consumer username                                                                 |
| `consumer_group_id`   | Consumer group ID                                                                 |
| `graphql_name`        | GraphQL [operation name](https://graphql.org/learn/queries/#operation-name)       |
| `graphql_operation`   | GraphQL [operation type](https://graphql.org/learn/queries/#operation-name)       |
| `graphql_root_fields` | GraphQL [root fields](https://graphql.org/learn/execution/#root-fields-resolvers) |
| `route_id`            | Route ID                                                                          |
| `route_name`          | Route name                                                                        |
| `service_id`          | Service ID                                                                        |
| `service_name`        | Service name                                                                      |
| `resp_body`           | HTTP response body       |
| `mqtt_client_id`      | Client ID in MQTT protocol                                                        |
| `redis_cmd_line`      | Redis command                                                                     |
| `rpc_time`            | RPC request round-trip time                                                       |

## Custom Variables

You can create your own variables and use them as built-in variables in plugins.

For more details on how to create custom variables, please refer to the plugins development guide (coming soon).

## Evaluation Order

APISIX evaluates variables in the given order: 

1. Custom Variables
2. APISIX Variables
3. NGINX Variables

If a variable is successfully sourced in custom variables, APISIX will not continue to look in APISIX variables or NGINX variables. 

In other words, custom variables will **overwrite variables of the same names** defined in APISIX variables or NGINX variables, to better meet requirements of your specific use cases. 
