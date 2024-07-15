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

## 添加消费者

消费者是使用你的 API 的实体。本示例将创建一个名为 `Alice` 的消费者。

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
]}>
<TabItem value="dashboard">

1. 选择要启用密钥认证的服务。
2. 从侧边栏选择 **插件**，搜索 `key-auth` 插件。
3. 点击 **加号** 图标 (+)。
4. 在对话框中，执行以下操作：

* 将以下配置添加到**JSON 编辑器**：

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