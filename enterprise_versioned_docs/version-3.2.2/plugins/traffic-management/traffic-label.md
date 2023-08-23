---
title: traffic-label
slug: /plugins/traffic-label
sidebar_label: traffic-label
sidebar_position: 1
---

import EnterpriseLabel from '@site/src/MDXComponents/EnterpriseLabel';

# traffic-label <EnterpriseLabel />

The `traffic-label` plugin labels traffic based on user-defined rules and takes actions based on labels and the associated weights for actions. It provides a granular approach to traffic management, making it easy to conditionally action on requests with flexibility and precision.

## Attributes

See plugin [common configurations](../common-configurations.md) for configuration options available to all plugins.

| Name | Type | Required  | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
| rules | `array[object]` | true | | An array of one or more pairs of matching conditions and actions to be executed. |
| rules.match | `array[array]` | true | | An array of one or more matching conditions in the form of [APISIX expressions](../../reference/apisix-expressions.md). |
| rules.actions | `array[object]` | true | | An array of one or more actions to be executed when a condition is successfully matched. |
| rules.actions.set_headers | `object` | false | | One or more request headers to apply to requests in the format of `{"name": "value", ...}`, where `value` could be a [built-in variable](../../reference/built-in-variables.md). If a header of the same name already exists, it will be overwritten. |
| rules.actions.weight | `integer` | false | 1 | The weight of action distribution. See [action weight](#create-weighted-actions) for a detailed calculation. |

:::info

Rules are evaluated in sequential order. If the condition of a rule is matched, the associated actions will execute and the subsequent rules will be omitted. See [multiple matching rules](#define-multiple-matching-rules) for an example.

:::

## Examples

The examples below demonstrate how you can configure `traffic-label` on a route in different scenarios.

### Define a Single Matching Condition

The following example demonstrates a simple rule with one matching condition and one associated action. If the URI of the request is `/headers`, the plugin will add the header `"X-Server-Id": "100"` to the request.

```shell
curl http://127.0.0.1:9180/apisix/admin/routes/1 \
-H 'X-API-KEY: ${ADMIN_API_KEY}' -X PUT -d '
{
    "uri":"/headers",
    "plugins":{
        # highlight-start
        "traffic-label": {
            "rules": [
                {
                    "match": [
                        ["uri", "==", "/headers"]
                    ],
                    "actions": [
                        {
                            "set_headers": {
                                "X-Server-Id": 100
                            }
                        }
                    ]
                }
            ]
        }
        # highlight-end
    },
    "upstream":{
        "type":"roundrobin",
        "nodes":{
            "httpbin.org:80":1
        }
    }
}'
```

Send a request to verify:

```shell
curl http://127.0.0.1:9080/headers
```

You should see a response similar to the following:

```text
{
  "headers": {
    "Accept": "*/*",
    ...
    "X-Server-Id": "100"
  }
}
```

### Define Multiple Matching Conditions with Logical Operators

You can build more complex matching conditions with [logical operators](../../reference/apisix-expressions.md#logical-operators).

The following example demonstrates a rule with two matching conditions logically grouped by `OR` and one associated action. If one of the conditions is met, the plugin will add the header `"X-Server-Id": "100"` to the request.

```shell
curl http://127.0.0.1:9180/apisix/admin/routes/1 \
-H 'X-API-KEY: ${ADMIN_API_KEY}' -X PUT -d '
{
    "uri":"/headers",
    "plugins":{
        # highlight-start
        "traffic-label": {
            "rules": [
                {
                    "match": [
                        "OR",
                        ["arg_version", "==", "v1"],
                        ["arg_env", "==", "dev"]
                    ],
                    "actions": [
                        {
                            "set_headers": {
                                "X-Server-Id": 100
                            }
                        }
                    ]
                }
            ]
        }
        # highlight-end
    },
    "upstream":{
        "type":"roundrobin",
        "nodes":{
            "httpbin.org:80":1
        }
    }
}'
```

Send a request to verify:

```shell
curl http://127.0.0.1:9080/headers?env=dev
```

You should see a response similar to the following:

```text
{
  "headers": {
    "Accept": "*/*",
    ...
    "X-Server-Id": "100"
  }
}
```

If you send a request that does not match any of the conditions, you will not see `"X-Server-Id": "100"` added to the request header.

### Create Weighted Actions

The following example demonstrates a rule with one matching condition and multiple weighted actions, where incoming requests are distributed proportionally based on the weights.

If a `weight` is not associated with any action, this portion of the requests will not have any action performed on them.

```shell
curl http://127.0.0.1:9180/apisix/admin/routes/1 \
-H 'X-API-KEY: ${ADMIN_API_KEY}' -X PUT -d '
{
    "uri":"/headers",
    "plugins":{
        # highlight-start
        "traffic-label": {
            "rules": [
                {
                    "match": [
                        ["uri", "==", "/headers"]
                    ],
                    "actions": [
                        {
                            "set_headers": {
                                "X-Server-Id": 100
                            },
                            // Annotate 1
                            "weight": 3
                        },
                        {
                            "set_headers": {
                                "X-API-Version": "v2"
                            },
                            // Annotate 2
                            "weight": 2
                        },
                        {
                            // Annotate 3
                            "weight": 5
                        }
                    ]
                }
            ]
        }
        # highlight-end
    },
    "upstream":{
        "type":"roundrobin",
        "nodes":{
            "httpbin.org:80":1
        }
    }
}'
```

The proportion of times each action is executed is determined by the weight of the action relative to the total weight of all actions listed under the `actions` field. Here, the total weight is calculated as the sum of all action weights: 3 + 2 + 5 = 10.

Therefore:

❶ 30% of the requests should have the `X-Server-Id: 100` request header.

❷ 20% of the requests should have the `X-API-Version: v2` request header.

❸ 50% of the requests should not have any action performed on them.

Generate 50 consecutive requests to verify the weighted actions:

```shell
resp=$(seq 50 | xargs -I{} curl "http://127.0.0.1:9080/headers" -sL) && \
  count_w3=$(echo "$resp" | grep "X-Server-Id" | wc -l) && \
  count_w2=$(echo "$resp" | grep "X-API-Version" | wc -l) && \
  echo X-Server-Id: $count_w3, X-API-Version: $count_w2
```

The response shows that headers are added to requests in a weighted manner:

```text
X-Server-Id: 15, X-API-Version: 10
```

### Define Multiple Matching Rules

The following example demonstrates the use of multiple rules, each with their matching condition and action.

```shell
curl http://127.0.0.1:9180/apisix/admin/routes/1 \
-H 'X-API-KEY: ${ADMIN_API_KEY}' -X PUT -d '
{
    "uri":"/headers",
    "plugins":{
        # highlight-start
        "traffic-label": {
            "rules": [
                {
                    "match": [
                        ["arg_version", "==", "v1"]
                    ],
                    "actions": [
                        {
                            "set_headers": {
                                "X-Server-Id": 100
                            }
                        }
                    ]
                },
                {
                    "match": [
                        ["arg_version", "==", "v2"]
                    ],
                    "actions": [
                        {
                            "set_headers": {
                                "X-Server-Id": 200
                            }
                        }
                    ]
                }
            ]
        }
        # highlight-end
    },
    "upstream":{
        "type":"roundrobin",
        "nodes":{
            "httpbin.org:80":1
        }
    }
}'
```

Send a request to `/headers?version=v1` to verify:

```shell
curl http://127.0.0.1:9080/headers?version=v1
```

You should see a response similar to the following:

```text
{
  "headers": {
    "Accept": "*/*",
    ...
    "X-Server-Id": "100"
  }
}
```

Send a request to `/headers?version=v2` to verify:

```shell
curl http://127.0.0.1:9080/headers?version=v2
```

You should see a response similar to the following:

```text
{
  "headers": {
    "Accept": "*/*",
    ...
    "X-Server-Id": "200"
  }
}
```
