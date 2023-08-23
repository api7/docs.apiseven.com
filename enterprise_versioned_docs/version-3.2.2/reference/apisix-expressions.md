---
title: APISIX Expressions
slug: /reference/apisix-expressions
---

_APISIX Expressions_ are combinations of variables, operators, and values that can be evaluated to a result, such as a Boolean value, `true` or `false`. Expressions can be used in configurations for route matching, request filtering, selective plugin applications, log enrichment, and more.

[//]: <NOTE: these sample usage are summarized by understanding where expr lib was called in apisix>

[//]: <TODO: link docs (e.g. route matching, request filtering) to here once they are written>

APISIX supports the evaluation of comparison operators and logical operators, as well as [regular expressions (RegEx)](https://www.pcre.org).

## Comparison Operators

APISIX supports the following comparison operators to be used with [built-in variables](./built-in-variables.md) in expressions:

|**Operator**|**Description**|**Example**|
|--------|-----------|-------|
|`==`      |equal      |`["arg_version", "==", "v2"]`|
|`~=`      |not equal  |`["arg_version", "~=", "v2"]`|
|`>`       |greater than|`["arg_ttl", ">", 3600]`|
|`>=`      |greater than or equal to|`["arg_ttl", ">=", 3600]`|
|`<`       |less than  |`["arg_ttl", "<", 3600]`|
|`<=`      |less than or equal to|`["arg_ttl", "<=", 3600]`|
|`~~`      |match RegEx|`["arg_env", "~~", "[Dd]ev"]`|
|`~*`      |match RegEx (case-insensitive) |`["arg_env", "~~", "dev"]`|
|`in`      |exist in the right-hand side|`["arg_version", "in", ["v1","v2"]]`|
|`has`     |contain item in the right-hand side|`["graphql_root_fields", "has", "owner"]`|
|`!`       |reverse the adjacent operator|`["arg_env", "!", "~~", "[Dd]ev"]`|
|`ipmatch` |match IP address|`["remote_addr", "ipmatch", ["192.168.102.40", "192.168.3.0/24"]]`|

## Logical Operators

APISIX supports the following logical operators:

| **Operator** | **Explanation** |
|---|---|
| `AND` | `AND(A,B)` is true if both A and B are true. |
| `OR` | `OR(A,B)` is true if either A or B is true. |
| `!AND` | `!AND(A,B)` is true if either A or B is false. |
| `!OR` | `!OR(A,B)` is true only if both A and B are false. |

You can use logical operators to combine multiple expressions for evaluation, such as the following:

```json
[
    "AND",
    ["arg_version", "==", "v2"],
    [
        "OR",
        ["arg_action", "==", "signup"],
        ["arg_action", "==", "subscribe"]
    ]
]
```
