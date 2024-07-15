---
title: 管理消费者的访问凭证
slug: /api-consumption/manage-consumer-credentials
---

通常情况下，业务会先发布 API，在路由上启用的身份认证插件会锁定访问权限，要求带正确的访问凭证才能访问 API；然后创建[消费者](../key-concepts/consumers.md)，并为其分配访问凭证。每个消费者需要一个独一无二的用户名。为了实现身份认证，还需要将身份认证插件添加到消费者的`插件`字段中。

在本教程中，你将创建一个使用密钥身份认证（key-auth）的消费者，然后使用他的密钥访问指定的 API。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. 在网关组上有一个已发布服务。

## 添加消费者

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>

<TabItem value="dashboard">

1. 选择你的服务发布所在的网关组。
2. 从侧边栏选择 **消费者**。
3. 点击 **添加消费者**。
4. 在对话框中，执行以下操作：
   
* **名称** 填写 `Alice`。
* 点击 **添加**。

5. 在刚刚创建的消费者下，在 **插件**字段中，搜索 `key-auth` 插件。
6. 点击 **加号**图标 (+)。
7. 在对话框中，执行以下操作：

* 将以下配置添加到**JSON 编辑器**：


    ```json
    {
      "key": "secret-key"
    }
    ```

* 点击 **启用**。

</TabItem>

<TabItem value="adc">

要使用 ADC 创建消费者和需要访问的 API，请创建以下配置：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    routes:
      - uris:
          - /ip
        name: api-consumption-ip
        methods:
          - GET
# highlight-start
consumers:
  - username: Alice
# highlight-end
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>
</Tabs>

## 验证

请按照以下步骤验证密钥认证。

### 发送不带密钥的请求

发送不带 `apikey` 头的请求：

```bash
curl -i "http://127.0.0.1:9080/ip"  
```

由于未提供密钥，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Missing API key found in request"}
```

### 发送带有错误密钥的请求

发送带有错误密钥的 `apikey` 头的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: secret-key" 
```

由于密钥错误，你会收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```json
{"message": "Unauthorized"}

```text
{"message":"Invalid API key in request"}
```

### 发送带有正确密钥的请求

发送带有正确密钥的 `apikey` 头的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: secret-key" 
```

使用正确的密钥发送请求，你将收到一个 `HTTP/1.1 200 OK` 响应，其请求正文类似：

```text
{
  "origin": "192.168.0.102, 35.259.159.12"
}
```

## 相关阅读

- 核心概念
  - [服务](../key-concepts/services.md) 
  - [路由](../key-concepts/routes.md)
  - [插件](../key-concepts/plugins.md)
- API 消费
  - [基于黑白名单限制对 API 的访问](../api-consumption/consumer-restriction.md)