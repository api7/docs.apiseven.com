---
title: 配置 API 认证
slug: /api-full-lifecycle-management/api-security/set-up-api-authentication
---

出于安全考虑，API7 企业版应在消费者访问内部资源前对其进行认证和授权。API7 企业版提供了灵活的插件扩展系统和大量插件，用于用户认证和授权。例如：

- 密钥认证
- 基本认证
- JWT 认证
- Keycloak
- Casdoor
- Wolf RBAC
- OpenID Connect
- 中央认证服务（Central Authentication Service，CAS）
- HMAC
- Casbin
- LDAP
- 开放策略代理（Open Policy Agent，OPA）
- 转发认证

每个路由可以选择的一种认证机制。不同路由可以使用不同的认证。但是，请勿在单个路由上启用多个认证插件，或者将认证插件作为全局规则启用。

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
2. [按服务发布 API](../api-publishing/publish-apis-by-service.md)。

## 为单一服务设置密钥认证

如果要为单个服务的所有现有和未来路由启用密钥认证，请在服务级别启用 `key-auth` 插件。这样就不会在路由级别启用其他认证插件。

由于插件配置不属于[运行时配置](../../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后向网关组发布新版本。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择 **插件**。
3. 在**插件**字段中，搜索 `key-auth` 插件。
4. 单击**加号**图标 (+)，弹出对话框。
5. 单击**启用**。
6. 从左侧导航栏中选择**服务**，然后单击**发布服务**。
7. 在**网关组**字段中，选择 "测试组"，然后单击**下一步**。
8. 单击**添加服务**。在对话框中，执行以下操作：
    - 在**服务**字段中，选择 "Swagger Petstore"。
    - 在**新版本**字段中，输入 `1.0.1`。
    - 单击 **添加**。

    ![发布服务](https://static.apiseven.com/uploads/2023/12/07/85b5kKOE_publish-service-1.0.1.png)

9. 确认服务信息，然后单击 **下一步**。
10. 保持节点不变，然后单击 **发布**。

## 为单一路由设置密钥认证

如果要为单个路由启用密钥认证，请尝试在路由级别启用 `key-auth` 插件。

由于插件配置不属于[运行时配置](../../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后向网关组发布新版本。

1. 从左侧导航栏中选择 **服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择**Routes**，然后选择**getPetById**。
3. 在**插件**字段中，搜索 `key-auth` 插件。
4. 单击**加号**图标 (+)，弹出对话框。
5. 单击**启用**。
7. 从左侧导航栏中选择**服务**，然后单击**发布服务**。
8. 在**网关组**字段中，选择 `Test Group`，然后单击**下一步**。
9. 单击**添加服务**。在对话框中，执行以下操作：
    - 在**服务**字段中，选择 `Swagger Petstore`。
    - 在**新版本**字段中，输入 `1.0.1`。
    - 单击**添加**。

    ![发布服务](https://static.apiseven.com/uploads/2023/12/11/t03uxF0A_publish-service-1.0.1_zh.png)

10. 确认服务信息，然后单击**下一步**。
11. 保持节点不变，然后单击**发布**。

## 验证

本章介绍如何为[服务](../../key-concepts/services.md)和[消费者](../../key-concepts/consumers.md)上配置认证。

### 添加消费者

1. 从左侧导航栏中选择**消费者**，然后单击**新增消费者**。

    <br />
    <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2023/12/08/RxIDvUNJ_add_consumer_zh.png" alt="Add Consumer" width="95%" />
    </div>
    <br />

2. 在**新增消费者**对话框中，执行以下操作：

    - 在**网关组**字段中，选择 `Test Group`。
    - 在**名称**字段中，输入 `Alice`。

3. 单击**新增**。

### 为消费者启用密钥认证


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