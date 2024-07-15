---
title: 管理消费者的访问凭证
slug: /api-consumption/manage-consumer-credentials
---

通常情况下，业务会先发布 API，在路由上启用的身份认证插件会锁定访问权限，要求带正确的访问凭证才能访问 API；然后创建[消费者](../key-concepts/consumers.md)，并为其分配访问凭证。每个消费者需要一个独一无二的用户名。为了实现身份认证，还需要将身份认证插件添加到消费者的`插件`字段中。

在本教程中，你将创建一个使用密钥身份认证（key-auth）的消费者，然后使用他的密钥访问指定的 API。

## 前提条件

1. 获取一个具有**超级管理员** 或 **API 提供者** 角色的用户账户。
2. [发布一个服务](../getting-started/publish-service.md)，其中会包含至少一个 API。
3. [开启 API 身份认证](../api-security/api-authentication.md)。

## 创建消费者

1. 从左侧导航栏中选择**消费者**，然后单击**新增消费者**。
2. 在**新增消费者**对话框中，执行以下操作：

    - 在**网关组**字段中，选择`测试网关组`。
    - 在**名称**字段中，输入 `Alice`。

4. 单击**新增**。

## 为消费者启用密钥认证

1. 从左侧导航栏中选择**消费者**，然后选择 **Alice**。
2. 在**插件**字段中，搜索 `key-auth` 插件。
3. 单击**加号**图标 (+)，弹出对话框。
4. 应用以下配置：

    ```json
    {
      "key": "secret-key"
    }
    ```

5. 单击**启用**。

## 验证

### 未使用密钥发送请求

```bash
curl -i "http://127.0.0.1:9080/pet/1" 
```

因为 API 对应的路由上通过添加插件的方式开启了身份认证，没有自带访问凭证的 API 请求会被拒绝。所以你应该看到以下输出：

```bash
HTTP/1.1 401 Unauthorized
Date: Fri, 01 Sep 2023 03:06:51 GMT
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: APISIX/dev

{"message":"Missing API key found in request"}
```

### 使用错误的密钥发送请求

```bash
curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: wrongkey" 
```

因为此 API Key 不属于任何一个消费者，是一个错误的、不存在的密钥，API 请求会被拒绝。所以你应该看到以下输出：

```bash
HTTP/1.1 401 Unauthorized
Date: Fri, 01 Sep 2023 03:08:00 GMT
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: APISIX/dev

{"message":"Invalid API key in request"}
```

### 使用正确的密钥发送请求

```bash
curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: secret-key" 
```

因为此 API Key 属于消费者`Alice`，是一个真实的密钥，所以 API 请求会被放行。所以你应该看到以下输出：

```bash
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 323
Connection: keep-alive
Date: Fri, 01 Sep 2023 03:09:22 GMT
x-srv-trace: v=1;t=ada7cefb43c4848d
x-srv-span: v=1;s=4221c976c3e1b0fe
Access-Control-Allow-Origin: *
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1693537822
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

## 扩展阅读

- [基于黑白名单限制对 API 的访问](../api-consumption/consumer-restriction.md)