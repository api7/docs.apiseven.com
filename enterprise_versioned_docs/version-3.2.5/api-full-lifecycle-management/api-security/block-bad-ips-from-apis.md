---
title: 阻止 API 中的错误 IP 地址
slug: /api-full-lifecycle-management/api-security/block-bad-ips-from-apis
---

为了保护 API 免受来自被禁止的 IP 地址的攻击，你可以配置 IP 地址黑名单来阻止来自这些特定 IP 地址的请求。

本文档介绍如何启用 `ip-restriction` 插件作为全局规则，建立共享 IP 地址黑名单。如果 IP 地址在黑名单中，则请求会被拒绝，并返回 `403`。根据列表检查的 IP 地址可能是发起请求的客户端的 IP 地址或基于代理的 X-Forwarded-For （XFF）地址。

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
2. [按服务发布 API](../api-publishing/publish-apis-by-service.md)。

## 为所有 API 设置共享 IP 地址黑名单

一旦发现恶意 IP 地址正在攻击 API，最好将该 IP 地址添加到共享黑名单中以保护其他 API。

如需设置共享 IP 地址黑名单，遵循以下步骤：

1. 从左侧导航栏中选择**网关组**，然后选择 **Test Group**。
2. 从左侧导航栏中选择**全局插件**。
2. 在**插件**字段中，搜索 `ip-restriction` 插件。
3. 单击**加号**图标 (+)，弹出对话框。

    ![启用插件](https://static.apiseven.com/uploads/2023/12/08/HdYGTNCQ_ip-restriction_plugin.png)

4. 应用以下配置，将 IP 地址 `127.0.0.1` 添加到黑名单：

    ```json
    {
    "blacklist": ["127.0.0.1"],
    "message": "Sorry, your IP address is not allowed."
    }
    ```

5. 单击**启用**。

## 验证

发送 API 请求：

```bash
curl -i "http://127.0.0.1:9080/pet/1" # 将 127.0.0.1 替换为 Test Group 的地址。
```

由于IP地址受到黑名单的限制，此时，你将看到以下输出：

```bash
HTTP/1.1 503 Service Temporarily Unavailable
Date: Fri, 01 Sep 2023 03:48:27 GMT
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 0
Server: APISIX/dev

{"error_msg":"Sorry, your IP address is not allowed."}
```
