---
title: 基于黑白名单的访问控制
slug: /api-consumption/consumer-restriction
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

有时候，你需要比身份验证插件提供的更精确的访问控制。例如，你可能希望保留可以访问API的消费者白名单。现在，消费者必须发送经过身份验证的请求，并且在白名单上（而不是在黑名单上）才能访问 API。

本教程将指导你通过 `consumer-restriction` 插件创建消费者白名单来配置精确的访问控制。

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 在网关组上已发布一个服务。
3. 已有一个启用了身份验证的消费者。

## 通过消费者名称限制

当消费者发出经过身份验证的请求时，API7 网关会将消费者的名称传递给路由。因此，路由不需要直接访问消费者的凭据，这对用户更加友好。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **已发布服务**，然后选择要配置的服务，例如，版本为 `1.0.0` 的 `httpbin API`。
2. 从侧边栏选择 **插件**。
3. 搜索 `consumer-restriction` 插件。
4. 点击 **加号**图标 (+)。
5. 在对话框中，执行以下操作：

* 将以下配置添加到**JSON 编辑器**：


    ```json
    {
    "whitelist": [
      "Alice"
    ]
    }
    ```

* 点击 **启用**。

6. 用同样的方法添加一个新的消费者 `Lisa` 并使用以下配置启用 `key-auth` 插件。

    ```json
    {
      "key": "secret-key2"
    }
    ```

</TabItem>

<TabItem value="adc">

下面的配置启用了 `consumer-restriction` 插件并创建了一个新的消费者 `Lisa`：

```yaml title="adc.yaml"
services:
  - name: httpbin Service
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    plugins:
      consumer-restriction:
        _meta:
          disable: false
        whitelist:
          - Alice
      key-auth:
        _meta:
          disable: false
    routes:
      - uris:
          - /ip
        name: api-security-ip
        methods:
          - GET
consumers:
  - username: Alice
    plugins:
      key-auth:
        _meta:
          disable: false
        key: secret-key
  - username: Lisa
    plugins:
      key-auth:
        _meta:
          disable: false
        key: secret-key-2
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>
</Tabs>

## 验证

以消费者 `Alice` 的身份向服务发起请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: secret-key" 
```

你将看到请求成功，并收到 `200 OK` 响应，因为消费者 `Alice` 在白名单中。

现在，以新创建的消费者 Lisa 的身份向服务发起请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: secret-key2" 
```

你将收到 403 Forbidden 响应，并附带以下请求正文，因为消费者 Lisa 未添加到白名单中：

```text
{"message":"The consumer_name is forbidden."}
```

## 相关阅读

- 核心概念
  - [服务](../key-concepts/services.md)
  - [路由](../key-concepts/routes.md)
  - [插件](../key-concepts/plugins.md)
  - [消费者](../key-concepts/consumers.md)
- API 安全
  - [设置 API 身份验证](../api-security/api-authentication.md)
- API 消费
  - [管理消费者的访问凭证](../api-consumption/manage-consumer-credentials.md)
