---
title: 基于黑白名单的访问控制
slug: /api-consumption/consumer-restriction
---

一旦 API 和消费者都启用了身份认证，消费者将使用相同的身份认证插件来访问所有 API。但在某些场景下，需要对 API 进行更精准的访问控制。这意味着即使消费者持有访问凭证，消费者也必须位于白名单上才能访问 API；或者如果消费者处于黑名单中，则持有访问凭证也不能调用 API。每个 API 都可以有自己独特的白名单或黑名单。

本教程介绍如何创建消费者白名单，通过 `consumer-restriction` 插件管理访问控制。

## 前提条件

1. 获取一个具有**超级管理员** 或 **API 提供者** 角色的用户账户。
2. [发布一个服务](../getting-started/publish-service.md)，其中会包含至少一个 API。
3. [开启 API 身份认证](../api-security/api-authentication.md)。
4. [管理消费者的访问凭证](../api-consumption/manage-consumer-credentials.md)。

## 用消费者名称配置黑白名单

当收到 API 请求时，API7 企业版会从中提取访问凭证（可能是key, 用户名密码或其他类型的凭证），并查找出对应的消费者名称。因此，各个 API 无需直接识别访问凭证，只需识别消费者的名称即可。当消费者出于安全考虑定时更新了自己的访问凭证时，或者因为旧凭证泄漏而更换新的访问凭证时，他曾经被授权访问的 API 不需要做任何修改。这种方式更加简单、人性化和易于管理。

由于插件配置不属于[运行时配置](../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后将新版本发布到网关组。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择**插件**。
3. 在**插件**字段中，搜索 `consumer-restriction` 插件。
4. 单击**加号**图标 (+)，弹出对话框。
5. 应用以下配置：

    ```json
    {
    "whitelist": [
      "Alice"
    ]
    }
    ```
5. 单击**启用**。
6. 你还可以在服务级别启用 `consumer-restriction` 插件，当服务下所有路由都共享一份白名单配置时。
7. 如果你想进一步严格限制 `Alice` 只能通过 HTTP GET 方法进行访问，你可以将插件的配置（在路由或消费者中）更新为以下内容：

```json
{
      "allowed_by_methods":[
        {
          "user":"Alice",
          "methods":["GET"]
        }
}
```

## 验证

1. 添加一个新的消费者 `Lisa` 并使用以下配置启用 `key-auth` 插件。有关详细信息，参见[管理消费者的访问凭证](../api-consumption/manage-consumer-credentials.md)。

    ```json
    {
      "key": "secret-key2"
    }
    ```

2. 使用 `Alice` 的密钥发送 API 请求：

    ```bash
    curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: Secret-key" 
    ```

    因为`Alice`这位消费者在白名单中，他的 API 请求应当被接受。所以你应该看到以下返回：

    ```bash
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    Content-Length: 323
    Connection: keep-alive
    Date: Fri, 01 Sep 2023 07:00:09 GMT
    x-srv-trace: v=1;t=569591aa680bb202
    x-srv-span: v=1;s=b5cbb398895e3f13
    Access-Control-Allow-Origin: *
    X-RateLimit-Limit: 120
    X-RateLimit-Remaining: 119
    X-RateLimit-Reset: 1693551669
    ETag: W/"143-JIrwO+Sx1/7FTTpJ2ljwAfgaRCY"
    Vary: Accept-Encoding
    Server: APISIX/dev

    {
      "name": "Dog",
      "photoUrls": [
        "https://example.com/dog-1.jpg",
        "https://example.com/dog-2.jpg"
      ],
      "id": 1,
      "category": {
        "id": 1,
        "name": "pets"
      },
      "tags": [
        {
          "id": 1,
          "name": "friendly"
        },
        {
          "id": 2,
          "name": "smart"
        }
      ],
      "status": "available"
    }
    ```

3. 使用 `Lisa` 的密钥发送 API 请求：

    ```bash
    curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: Secret-key2" 
    ```

    因为`Lisa`这位消费者不在白名单中，他的 API 请求应当被拦截。所以你应该看到以下输出：

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Fri, 01 Sep 2023 07:00:05 GMT
    Content-Type: text/plain; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Server: APISIX/dev

    {"message":"The consumer_name is forbidden."}
    ```
