---
title: 设置 API 身份认证
slug: /api-security/api-authentication
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

为了安全起见，你应该只允许经过身份验证和授权的[消费者](../key-concepts/consumers.md)访问你的 API。API7 网关提供了多种插件来启用身份验证和授权。

本指南将引导你使用 `key-auth` 插件启用简单的基于密钥的身份验证。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## 添加消费者

消费者是使用你的 API 的实体。本示例将创建一个名为 `Alice` 的消费者。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 选择你的服务发布所在的网关组。
2. 从侧边栏选择 **消费者**。
3. 点击 **新增消费者**。
4. 在对话框中，执行以下操作：
   
* **名称** 填写 `Alice`。
* 点击 **新增**。

5. 在刚刚创建的消费者下，在 **插件**字段中，搜索 `key-auth` 插件。
6. 点击 **加号** 图标 (+)。
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

要使用 ADC 创建消费者，请创建以下配置：

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
    plugins:
      key-auth:
        _meta:
          disable: false
        key: secret-key
```

将配置同步到 API7 网关：

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>

<TabItem value="ingress">

使用 ApisixConsumer 自定义资源创建一个 Kubernetes manifest 文件来配置消费者：

```yaml title="consumer.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixConsumer
metadata:
  name: alice
  # namespace: api7    # replace with your namespace
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

## 启用密钥认证

### 针对服务

要对服务中的所有路由使用密钥认证，请在服务上启用 `key-auth` 插件。

:::note

如果你已经在服务上启用了 `key-auth` 插件，那么你不能在路由上启用其他认证插件。

:::

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **已发布服务**，然后点击要启用认证的服务，例如，版本为 `1.0.0` 的 `httpbin API`。
2. 从侧边栏选择 **插件**。
3. 搜索 `key-auth` 插件。
4. 点击 **加号** 图标 (+)。
5. 在对话框中，执行以下操作：

* 将以下配置添加到 **JSON 编辑器**：

    ```json
    {
    }
    ```

* 点击 **启用**。

</TabItem>

<TabItem value="adc">

更新服务配置以使用密钥认证：

```yaml title="adc-service.yaml"
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
      key-auth:
        _meta:
          disable: false
    routes:
      - uris:
          - /ip
        name: api-security-ip
        methods:
          - GET
```

将配置同步到 API7 网关：

```shell
adc sync -f adc-consumer.yaml -f adc-service.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

ApisixService 自定义资源尚不可用。

[//]: <TODO: ApisixService 可用时更新本节>

</TabItem>

</Tabs>

### 针对单个路由

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>
<TabItem value="dashboard">

要对特定路由使用密钥认证，请在路由上启用 `key-auth` 插件，而不是在服务上启用。

1. 从侧边栏选择网关组的 **已发布服务**，然后点击要启用认证的服务，例如，版本为 `1.0.0` 的 `httpbin API`。
2. 在已发布的服务下，从侧边栏选择 **路由**。
3. 选择你的目标路由，例如，`getting-started-anything`。
4. 搜索 `key-auth` 插件。
5. 点击 **加号** 图标 (+)。
6. 在对话框中，执行以下操作：

* 将以下配置添加到**JSON 编辑器**：

    ```json
    {
    }
    ```

* 点击 **启用**。

</TabItem>

<TabItem value="adc">

更新路由配置以使用密钥认证：

```yaml title="adc-route.yaml"
services:
  - name: httpbin Service
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
        name: api-security-ip
        methods:
          - GET
        plugins:
          key-auth:
            _meta:
              disable: false
```

将配置同步到 API7 网关：

```shell
adc sync -f adc-consumer.yaml -f adc-route.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

创建一个启用了密钥认证的路由的 Kubernetes manifest 文件：

```yaml title="httpbin-route.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: httpbin-route
  # namespace: api7    # replace with your namespace
spec:
  http:
    - name: httpbin-route
      match:
        paths:
          - /ip
        methods:
          - GET
      backends:
        - serviceName: httpbin
          servicePort: 80
      authentication:
        enable: true
        type: keyAuth
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
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

* 核心概念
  * [服务](../key-concepts/services.md) 
  * [路由](../key-concepts/routes.md)
  * [插件](../key-concepts/plugins.md)
* API 消费
  * [管理消费者访问凭证](../api-consumption/manage-consumer-credentials.md)
  * [于黑白名单的访问控制](../api-consumption/consumer-restriction.md)
