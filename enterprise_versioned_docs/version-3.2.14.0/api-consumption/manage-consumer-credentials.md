---
title: 管理消费者的访问凭证
slug: /api-consumption/manage-consumer-credentials
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[消费者](../key-concepts/consumers.md)是指使用你的API的应用程序或开发者。在你的 API 中的[路由](../key-concepts/routes.md)上启用身份验证可以让你控制访问，要求消费者在访问路由之前获得凭证。

消费者通常在 API 发布后创建。在 API7 网关中，创建消费者需要一个唯一的用户名并配置一个认证插件。

本教程将指导你创建消费者并配置密钥认证。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## 添加消费者

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**消费者**。
2. 点击 **新增消费者**。
3. 在对话框中，执行以下操作：
   
* **名称** 填写 `Alice`。
* 点击 **新增**。

4. 在刚刚创建的消费者下，在 **插件**字段中，搜索 `key-auth` 插件。
5. 点击 **加号**图标 (+)。
6. 在对话框中，执行以下操作：

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

<TabItem value="ingress">

使用 ApisixConsumer 自定义资源创建一个 Kubernetes manifest 文件来配置消费者：

```yaml title="consumer.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixConsumer
metadata:
  name: alice
  # namespace: api7       # replace with your namespace
```

将配置应用到你的集群：

```shell
kubectl apply -f consumer.yaml
```

</TabItem>

</Tabs>

## 为消费者启用密钥认证

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**消费者**。
2. 选择你的消费者，例如，`Alice`。
3. 在**插件**字段中，搜索 `key-auth` 插件。
4. 点击**加号**图标 (+)。
5. 在对话框中，执行以下操作：

* 将以下配置添加到**JSON 编辑器**：

  ```json
    {
      "key": "secret-key"
    }
    ```

* 点击 **启用**。

</TabItem>

<TabItem value="adc">

要使用 ADC 启用密钥认证，请更新你的配置：


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
consumers:
  - username: Alice
    # highlight-start
    plugins:
      key-auth:
        _meta:
          disable: false
        key: secret-key
    # highlight-end
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

更新 Kubernetes manifest 文件，为消费者配置密钥认证：

```yaml title="consumer.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixConsumer
metadata:
  name: alice
  # namespace: api7       # replace with your namespace
spec:
  authParameter:
    keyAuth:
      value:
        key: "secret-key"
```

将配置应用到你的集群：

```shell
kubectl apply -f consumer.yaml
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
curl -i "http://127.0.0.1:9080/ip" -H "apikey: wrong-key" 
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