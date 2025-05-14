---
title: API7 表达式
slug: /reference/expressions
description: 了解如何在 API7 企业版中使用表达式实现路由匹配、请求过滤和配置条件逻辑。
---

_API7表达式_ 是由变量、运算符和值组成的组合，可被解析为结果（如布尔值 `true` 或 `false`）。表达式可用于路由匹配、请求过滤、选择性插件应用、日志增强等配置场景。

[//]: <注：这些示例用法是通过理解 APISIX 中 expr 库的调用位置总结得出的>

[//]: <待办：相关文档（如路由匹配、请求过滤）编写完成后需链接至此>

API7 企业版支持比较运算符、逻辑运算符以及[正则表达式(RegEx)](https://www.pcre.org)的解析。

## 比较运算符

API7企业版支持以下与[内置变量](./built-in-variables.md)配合使用的比较运算符：

|**运算符**|**描述**|**示例**|
|--------|-----------|-------|
|`==`      |等于      |`["arg_version", "==", "v2"]`|
|`~=`      |不等于    |`["arg_version", "~=", "v2"]`|
|`>`       |大于      |`["arg_ttl", ">", 3600]`|
|`>=`      |大于等于  |`["arg_ttl", ">=", 3600]`|
|`<`       |小于      |`["arg_ttl", "<", 3600]`|
|`<=`      |小于等于  |`["arg_ttl", "<=", 3600]`|
|`~~`      |正则匹配  |`["arg_env", "~~", "[Dd]ev"]`|
|`~*`      |正则匹配（不区分大小写） |`["arg_env", "~~", "dev"]`|
|`in`      |存在于右侧值中|`["arg_version", "in", ["v1","v2"]]`|
|`has`     |包含右侧项  |`["graphql_root_fields", "has", "owner"]`<br />`["post_arg.messages[*].content[*].type","has","image_url"]`|
|`!`       |反转相邻运算符|`["arg_env", "!", "~~", "[Dd]ev"]`|
|`ipmatch` |IP地址匹配  |`["remote_addr", "ipmatch", ["192.168.102.40", "192.168.3.0/24"]]`|

## 逻辑运算符

APISIX 支持以下逻辑运算符：

| **运算符** | **说明** |
|---|---|
| `AND` | `AND(A,B)` 当 A 和 B 都为真时返回 true |
| `OR` | `OR(A,B)` 当 A 或 B 任一为真时返回 true |
| `!AND` | `!AND(A,B)` 当 A 或 B 任一为假时返回 true |
| `!OR` | `!OR(A,B)` 仅当 A 和 B 都为假时返回 true |

您可以使用逻辑运算符组合多个表达式进行解析，例如：

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
