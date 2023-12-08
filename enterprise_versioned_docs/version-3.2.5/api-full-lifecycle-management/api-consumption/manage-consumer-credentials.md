---
title: 管理消费者凭证
slug: /api-full-lifecycle-management/api-consumption/manage-consumer-credentials
---

消费者指使用 API 的应用程序或开发人员。路由上启用的身份认证插件会锁定访问权限，要求消费者获得凭据才能访问 API。

通常情况下，发布 API 之后再创建消费者，而开发者则申请凭证。创建消费者需要一个唯一的用户名。作为身份认证配置的一部分，你还需要将上述列表中的身份认证插件添加到消费者的`插件`字段中。

在本教程中，你将创建一个使用密钥身份认证的消费者，然后使用密钥身份认证访问 API。

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
2. [按服务发布 API](../api-publishing/publish-apis-by-service.md)。
3. [配置 API 认证](../api-security/set-up-api-authentication.md)。

## 创建消费者

如需创建消费者，遵循以下步骤：

1. 从左侧导航栏中选择**服务**，然后单击目标服务。
2. 从左侧导航栏中选择**消费者**，然后单击**新增消费者**。

    <br />
    <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2023/12/08/RxIDvUNJ_add_consumer_zh.png" alt="Add Consumer" width="95%" />
    </div>
    <br />

3. 在**新增消费者**对话框中执行以下操作：

    - 在**网关组**字段中，选择 `Test Group`。
    - 在**名称**字段中，输入 `Alice`。

4. 单击**新增**。

## 为消费者启用密钥认证


1. 从左侧导航栏中选择**消费者**，然后选择 **Alice**。
2. 在**插件**字段中，搜索 `key-auth` 插件。
3. 单击**加号**图标 (+)，弹出对话框。

    ![Enable key-auth](https://static.apiseven.com/uploads/2023/12/08/kTLnhWaM_enable-key-auth_zh.png)

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
curl -i "http://127.0.0.1:9080/pet/1" # 将 127.0.0.1 替换为 Test Group 的地址。
```

你应该看到以下输出：

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
curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: wrongkey" # 将 127.0.0.1 替换为 Test Group 的地址。
```

你应该看到以下输出：

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
curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: secret-key" # 将 127.0.0.1 替换为 Test Group 的地址。
```

你应该看到以下输出：

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