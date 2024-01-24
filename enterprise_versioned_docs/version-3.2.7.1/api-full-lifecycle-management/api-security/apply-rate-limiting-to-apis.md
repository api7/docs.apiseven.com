---
title: 对 API 启用速率限制
slug: /api-full-lifecycle-management/api-security/apply-rate-limiting-to-apis
---

速率限制允许控制发送到 API 后端的请求的速率。这有助于保护后端免受过多流量和高成本的影响。API 请求还可能包括网络爬虫生成的无效数据以及网络攻击，例如 DDoS。

API7 企业版提供速率限制功能，通过限制给定时间段内发送到上游节点的请求数量来保护 API。请求计数在内存中高效完成，具有低延迟和高性能。

![速率限制](https://static.apiseven.com/uploads/2023/09/01/08Z3zNlU_rate-limit.png)

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
2. [以服务维度发布 API](../api-publishing/publish-apis-by-service.md)。

## 对所有服务应用速率限制（不推荐）

速率限制插件通常不会设置为全局规则，因为 API 通常需要不同的速率限制配额。当同一插件在对象（例如路由）中全局和本地配置时，两个插件实例都会按顺序执行。

## 限制单个路由每次的请求数量

在本章节中，限制该路由在 60 秒内只能访问 3 次。如果超出限制，则返回 `503`。

由于插件配置不属于[运行时配置](../../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后将新版本发布到网关组。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择**插件**。
3. 在**插件**字段中，搜索 `limit-count` 插件。
4. 单击**加号**图标 (+)，弹出对话框。

    ![启用插件](https://static.apiseven.com/uploads/2023/12/08/1wM3wLm6_limit-count_plugin_zh.png)

5. 应用以下配置：

    ```json
    {
      "count": 3,
      "time_window": 60,
      "key_type": "var",
      "rejected_code": 503,
      "rejected_msg": "Too many request",
      "policy": "local",
      "allow_degradation": false,
      "show_limit_quota_header": true
    }
    ```

6. 单击**启用**。
7. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**发布新版本**。
8. 在**网关组**字段中，选择`测试网关组`，然后单击**下一步**。
9. 单击**添加服务**。在对话框中，执行以下操作：
    - 在**服务**字段中，选择 `Swagger Petstore`。
    - 在**新版本**字段中，输入 `1.0.1`。
    - 单击**添加**。

    ![发布服务](https://static.apiseven.com/uploads/2024/01/24/VeXMeabB_publish-service-1.0.1_zh.png)

### 验证

循环请求 API 五次：

```bash
for i in {1..5}; do curl 127.0.0.1:9080/pet/1;  done # 将 127.0.0.1 替换为测试网关组的地址。
```

```bash
# 响应第 1、2、3 次请求
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 323
Connection: keep-alive
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 58
Date: Fri, 01 Sep 2023 03:48:27 GMT
x-srv-trace: v=1;t=fa189e8ae9c6f5f0
x-srv-span: v=1;s=fafd95fb74cd40ff
Access-Control-Allow-Origin: *
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 1693540165
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

# 响应第 4 和第 5 次请求

HTTP/1.1 503 Service Temporarily Unavailable
Date: Fri, 01 Sep 2023 03:48:27 GMT
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 0
Server: APISIX/dev

{"error_msg":"Too many request"}
```

## 限制单个路由每秒的请求数量

在本教程中，路由限制为每秒 1 个请求。如果请求数量在 1 到 3 之间，则会引入延迟。如果每秒请求数超过 3 个，则会被拒绝，状态码为 `503`。

由于插件配置不属于[运行时配置](../../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后将新版本发布到网关组。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择**插件**。
3. 在**插件**字段中，搜索 `limit-req` 插件。
4. 单击**加号**图标 (+)，弹出对话框。

    ![启用插件](https://static.apiseven.com/uploads/2023/12/08/YHaTF3s1_limit-req_zh.png)

5. 应用以下配置：

    ```json
    {
      "rate": 1,
      "burst": 2,
      "rejected_code": 503,
      "key_type": "var",
      "key": "remote_addr",
      "rejected_msg": "Requests are too frequent, please try again later."
    }
    ```

6. 单击**启用**。
7. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**发布新版本**。
8. 在**网关组**字段中，选择`测试网关组`，然后单击**下一步**。
9. 单击**添加服务**。在对话框中，执行以下操作：
    - 在**服务**字段中，选择 `Swagger Petstore`。
    - 在**新版本**字段中，输入 `1.0.1`。
    - 单击**添加**。

    ![发布服务](https://static.apiseven.com/uploads/2024/01/24/VeXMeabB_publish-service-1.0.1_zh.png)

### 验证

循环请求五次 API：

```bash
for i in {1..5}; do curl 127.0.0.1:9080/pet/1;  done  # 将 127.0.0.1 替换为测试网关组的地址。
```

当循环发送 API 请求时，正常响应所有请求：

```bash
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 323
Connection: keep-alive
Date: Fri, 01 Sep 2023 04:16:05 GMT
x-srv-trace: v=1;t=620ffed95fea96cb
x-srv-span: v=1;s=44c7c66dd6b810c8
Access-Control-Allow-Origin: *
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 1693541823
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

并发五次请求 API：

```bash
curl -i "http://127.0.0.1:9080/pet/1" & \
curl -i "http://127.0.0.1:9080/pet/1" & \
curl -i "http://127.0.0.1:9080/pet/1" & \
curl -i "http://127.0.0.1:9080/pet/1" & \
curl -i "http://127.0.0.1:9080/pet/1"   # 将 127.0.0.1 替换为测试网关组的地址。
```

成功响应三个请求。另外两个请求被阻止并返回以下内容：

```bash
HTTP/1.1 503 Service Temporarily Unavailable
Date: Fri, 01 Sep 2023 04:16:02 GMT
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: APISIX/dev

{"error_msg":"Requests are too frequent, please try again later."}
```
