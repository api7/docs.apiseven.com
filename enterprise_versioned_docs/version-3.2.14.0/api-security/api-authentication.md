---
title: 开启 API 身份认证
slug: /api-security/api-authentication
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

为了安全起见，你应该只允许经过身份验证和授权的使用者访问你的 API。API7 网关提供了多种插件来启用身份验证和授权。

本指南将引导你使用 `key-auth` 插件启用简单的基于密钥的身份验证。

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 在网关组上有一个已发布服务。

### 添加消费者

消费者是使用您的 API 的实体。本示例将创建一个名为 `Alice` 的消费者。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. Select the gateway group where your service is published.
2. Select **Consumers** from the side navigation bar.
3. Click **Add Consumer**.
4. From the Add Consumer dialog box, do the following:
    - In the **Name** field, enter `Alice`.
5. Click **Add**. 
6. In the consumer you just created under the **Plugins** field, search for the `key-auth` plugin.
7. Click the **Plus** icon (+).
8. In the dialog box that appeared, add the following configuration to the **JSON Editor**:

    ```json
    {
      "key": "secret-key"
    }
    ```

9. Click **Enable**.

</TabItem>

<TabItem value="adc">

To use ADC to create a consumer, create the following configuration:

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
    plugins:
      key-auth:
        _meta:
          disable: false
        key: secret-key
```

Synchronize the configuration to API7 Enterprise:

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>
</Tabs>


## 为单个服务设置密钥认证

如果要为单个服务的所有现有和未来路由启用密钥认证，请在服务级别启用 `key-auth` 插件。这样就禁止在路由级别启用其他认证插件。

由于插件配置不属于[运行时配置](../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后将新版本发布到网关组。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择**插件**。
3. 在**插件**字段中，搜索 `key-auth` 插件。
4. 单击**加号**图标 (+)，弹出对话框。
5. 单击**启用**。
7. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**发布新版本**。
8. 在弹出的对话框中，选择`测试网关组`，然后单击**下一步**。
9. 在**新版本**字段中，输入 `1.0.1`。
10. 确认服务信息，然后单击**发布**。

## 为单个路由设置密钥认证

如果要为单个路由启用密钥认证，请尝试在路由级别启用 `key-auth` 插件。

由于插件配置不属于[运行时配置](../key-concepts/services.md#运行时配置)，因此应在服务模板中进行修改，然后将新版本发布到网关组。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore**。
2. 从左侧导航栏中选择 **Routes**，然后选择 **getPetById**。
3. 在**插件**字段中，搜索 `key-auth` 插件。
4. 单击**加号**图标 (+)，弹出对话框。
5. 单击**启用**。
6. 从左侧导航栏中选择**服务**，然后选择 `Swagger Petstore` 服务并单击**发布新版本**。
7. 在弹出的对话框中，选择`测试网关组`，然后单击**下一步**。
8. 在**新版本**字段中，输入 `1.0.1`。
9. 确认服务信息，然后单击**发布**。

## 验证

要验证 API 身份认证的效果，需要创建一个[消费者](../key-concepts/consumers.md)，并在消费者中也启用身份认证，并配置相应的访问凭证。

### 为消费者启用密钥认证

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

### 未使用密钥发送请求

```bash
curl -i "http://127.0.0.1:9080/pet/1" 
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
curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: wrongkey" 
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
curl -i "http://127.0.0.1:9080/pet/1" -H "apikey: secret-key" 
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