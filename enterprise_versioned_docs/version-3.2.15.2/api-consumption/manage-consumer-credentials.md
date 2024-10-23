---
title: 管理消费者凭据
slug: /api-consumption/manage-consumer-credentials
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[消费者](../key-concepts/consumers.md)是指使用你的API的应用程序或开发者。在[服务](../key-concepts/services.md)上启用身份验证可以让你控制访问，要求消费者在访问API之前获得凭据。

在服务上启用的身份验证插件就像给 API 上了一把锁，而消费者凭据则是解锁它们的钥匙。在 API7 网关中，你需要一个唯一的名称和至少一个凭据来设置消费者。

消费者可以使用多种不同类型的凭据，所有凭据在身份验证方面都被视为平等的。

本教程将指导你创建消费者和配置身份验证。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## Key Authentication

### 添加具有 Key Authentication 凭据的消费者

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
2. 点击**新增消费者**。
3. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `Alice`。
   * 点击**新增**。
4. 在**认证凭据**选项卡下，点击**添加 Key Authentication 凭据**。
5. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `primary-key`。
   * 在**Key**字段中，选择**手动输入**，然后输入 `alice-primary-key`。
   * 点击**新增**。

6. 再次尝试添加另一个名为 `backup-key` 的密钥认证凭据，**Key** 设置为 `alice-backup-key`。

</TabItem>

<TabItem value="adc">

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
    credentials:
      - name: primary-key
        type: key-auth
        config:
          key: alice-primary-key
      - name: backup-key
        type: key-auth
        config:
          key: alice-backup-key
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>

<TabItem value="ingress">

待更新。

</TabItem>

</Tabs>

### 为已发布的服务启用 Key Authentication

要在已发布服务中的所有路由上使用密钥认证，请在服务级别启用 `key-auth` 插件。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 从侧边栏选择**插件**，然后点击**启用插件**。
3. 搜索 `key-auth` 插件，然后点击**启用**。
4. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

       ```json
    {
    }
    ```

* 点击**启用**。

</TabItem>

<TabItem value="adc">

更新服务配置以使用 Key Authentication

```yaml title="adc-service.yaml"
services:
  - name: httpbin
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
        name: get-ip
        methods:
          - GET
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml -f adc-service.yaml
```
:::note

ADC 使用配置文件作为单一可信来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

ApisixService 自定义资源尚不可用。

[//]: <TODO: ApisixService 可用时更新本节>

</TabItem>

</Tabs>

### 验证

请按照以下步骤验证 Key Authentication。

#### 发送不带 Key 的请求

发送不带 `apikey` 的请求：
 
```bash
curl -i "http://127.0.0.1:9080/ip"  
```

由于未提供 **Key**，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Missing API key found in request"}
```

#### 发送携带不合法 Key 的请求

发送一个请求头中携带不合法（不属于任何消费者）的 **Key** 的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: invalidkey" 
```

由于这个 **Key** 不属于任何消费者凭据，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Invalid API key in request"}
```

#### 发送携带正确 Key 的请求

所有 Key Authentication 凭据都被视为平等的，可以在你的 API 请求中使用，多个凭据之间没有优先级之分，使用效果都完全相同。

使用正确的 **Key** 发送请求，你将收到一个 `HTTP/1.1 200 OK` 响应，其请求正文如下：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: alice-primary-key" 
```

你将收到一个 `HTTP/1.1 200 OK` 响应，其请求正文如下：

```text
{
  "origin": "192.168.0.102, 35.259.159.12"
}
```
使用另一个凭据发送请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: alice-backup-key" 
```

使用正确的 **Key** 发送请求，你将收到一个 `HTTP/1.1 200 OK` 响应，其请求正文如下：

```text
{
  "origin": "192.168.0.102, 35.259.159.12"
}
```

## Basic Authentication

### 添加具有 Basic Authentication 凭据的消费者

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
2. 点击**新增消费者**。
3. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `Alice`。
   * 点击**新增**。
4. 在**认证凭据**选项卡下，点击**Basic Authentication**选项卡，然后点击**添加 Basic Authentication 凭据**。
5. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `primary-basic`。
   * 在**用户名**字段中，输入 `Alice`。
   * 在**密码**字段中，选择**手动输入**，然后输入 `alice-password`。
   * 点击**新增**。

6. 再次尝试添加另一个名为 `backup-basic` 的 Basic Authentication 凭据，用户名为 `Alice-backup`，密码为 `alice-backup-password`。

</TabItem>

<TabItem value="adc">

即将推出。

</TabItem>

<TabItem value="ingress">

即将推出。

</TabItem>

</Tabs>

### 为已发布的服务启用 Basic Authentication

要在已发布服务中的所有路由上使用 Basic Authentication，请在服务级别启用 `basic-auth` 插件。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 从侧边栏选择**插件**，然后点击**启用插件**。
3. 搜索 `basic-auth` 插件，然后点击**启用**。
4. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

    ```json
    {
    }
    ```
* 点击**启用**。

</TabItem>

<TabItem value="adc">

即将推出。

</TabItem>

<TabItem value="ingress">

ApisixService 自定义资源尚不可用。

[//]: <TODO: ApisixService 可用时更新本节>

</TabItem>

</Tabs>

### 验证

请按照以下步骤验证 Basic Authentication。

#### 发送不带用户名和密码的请求

发送不带 Basic Authentication 凭据的请求：
 
```bash
curl -i "http://127.0.0.1:9080/ip"  
```

由于未提供 Basic Authentication 凭据，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Missing authorization in request"}
```

#### 发送携带不合法用户名和密码的请求

发送一个请求头中携带不合法（用户名密码不匹配，或用户名不存在）的认证凭据的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -u alice:wrong-password
```

由于用户名和密码不匹配，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Invalid API key in request"}
```

#### 发送携带正确用户名和密码的请求

所有 Basic Authentication 凭据都被视为平等的，可以在你的 API 请求中使用，多个凭据之间没有优先级之分，使用效果都完全相同。

使用正确的用户名和密码发送请求，你将收到一个 `HTTP/1.1 200 OK` 响应，其请求正文如下：

```bash
curl -i "http://127.0.0.1:9080/ip" -u alice:alice-password 
```

你将收到一个 `HTTP/1.1 200 OK` 响应，其请求正文如下：

```text
{
  "origin": "192.168.0.102, 35.259.159.12"
}
```
使用另一个凭据发送请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -u alice-backup:alice-backup-password
```

你将收到一个 `HTTP/1.1 200 OK` 响应，其请求正文如下：

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
  * [消费者](../key-concepts/consumers.md)
* API 安全
  * [设置 API 身份验证](../api-security/api-authentication.md)
* API 消费
  * [应用基于黑白名单的访问控制](./consumer-restriction.md)
