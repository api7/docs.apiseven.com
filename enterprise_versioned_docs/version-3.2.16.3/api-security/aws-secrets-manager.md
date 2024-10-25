
---
title: 在 AWS Secrets Manager 中引用密钥
slug: /api-security/aws-secrets-manager
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

[AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) 是一项完全托管的服务，你可以将其与 API7 企业版集成，以安全地存储、管理和检索敏感信息，例如 API 密钥、密码和其他类型的凭据。它允许自动轮换密钥，从而降低凭据随时间推移而暴露的风险。

本教程演示了如何将 API7 企业版与 AWS Secret Manager 集成，使你能够安全地存储和引用消费者凭据和插件配置。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. 在你的网关组中[至少有一个网关实例](../getting-started/add-gateway-instance.md)。
3. 拥有一个 [AWS 账户](https://aws.amazon.com)。

## 获取 IAM 访问密钥 ID 和秘密访问密钥

获取 [IAM 用户访问密钥和秘密访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)，这些密钥将在下一步中配置到 API7 企业版中以访问 AWS Secrets Manager。

## 在网关组中新增Secret 提供商

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**Secret 提供商**，然后点击**新增Secret 提供商**。
2. 在对话框中，执行以下操作：
   * **Secret 提供商 ID** ，输入 `my-secrets-manager`。
   * **Secret 管理服务**，选择 `AWS Secrets Manager`。
   * **区域**，选择你的 AWS Secrets Manager 服务所在的区域。例如，`us-east-1`。
   * 使用[上一步](#obtain-iam-access-key-id-and-secret-access-key)中获取的访问密钥和秘密访问密钥填写**访问密钥 ID** 和**秘密访问密钥**字段。
   * 点击**新增**。

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

## 引用密钥以创建消费者凭据

消费者凭据中的以下敏感字段可以存储在外部Secret 管理服务（HashiCorp Vault、AWS Secret Manager 等）中，并在 API7 网关中引用：

* Key Authentication凭据中的 `key`
* Basic Authentication凭据中的 `password`
* JWT 认证凭据中的 `secret`、`public key`
* HMAC 认证凭据中的 `secret_key`

### 新增消费者

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
   * **名称**，输入 `Alice`。
   * 点击**新增**。

</TabItem>

<TabItem value="adc">

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 在 AWS Secrets Manager 中创建密钥

在本节中，你将创建一个密钥来存储用户 `alice` 的消费者凭据。

1. 在控制台中导航到 AWS Secrets Manager 并创建一个密钥。选择 **其他类型的密钥** 作为密钥类型，并在键值对中输入密钥名称 `key` 和凭据 `alice-primary-key`。
2. 在下一步中，将密钥名称配置为 `alice-credentials`，并可选择新增描述。
3. 查看其余信息并完成密钥创建。你应该会在 AWS Secrets Manager 中看到列出的密钥。
4. 重复创建其他消费者凭据的更多键/值对，所有键/值对都在密钥名称 `alice-credentials` 下：

* 对于Basic Authentication凭据： `password:alice-password`
* 对于 JWT 认证凭据： `secret:alice-secret`
* 对于 HMAC 认证凭据： `secret-key:alice-secret-key`

### 新增Key Authentication凭据

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
2. 选择你的目标消费者，例如，`Alice`。
3. **凭据**选项卡下，点击**新增Key Authentication凭据**。
4. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-key`。
   * **Key**，选择**从Secret 提供商引用**，然后输入 `$secret://aws/my-secrets-manager/alice-credentias/key`。
   * 点击**新增**。

:::note

所有密钥引用都以 `$secret://` 开头。`aws` 是Secret 提供商的**Secret 管理服务**，`my-secrets-manager` 是**Secret 提供商 ID**。

:::

</TabItem>

<TabItem value="adc">

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
    credentials:
      - name: primary-key
        type: key-auth
        config:
          key: `$secret://aws/my-secrets-manager/alice-credentias/key`
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 新增Basic Authentication凭据

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
2. 选择你的目标消费者，例如，`Alice`。
3. **凭据**选项卡下，点击**Basic Authentication**选项卡，然后点击**新增Basic Authentication凭据**。
4. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-basic`。
   * **用户名**，输入 `alice`。
   * **密码**，选择**从Secret 提供商引用**，然后输入 `$secret://aws/my-secrets-manager/alice-credentias/password`。
   * 点击**新增**。

:::note

所有密钥引用都以 `$secret://` 开头。`aws` 是**Secret 管理服务**，`my-secrets-manager` 是**Secret 提供商 ID**。

:::

</TabItem>

<TabItem value="adc">

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
    credentials:
      - name: primary-basic
        type: basic-auth
        config:
          username: alice
          password: $secret://aws/my-secrets-manager/alice-credentias/password`
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>

<TabItem value="ingress">

尚不支持。

</TabItem>

</Tabs>


### 新增 JWT 认证凭据

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
2. 选择你的目标消费者，例如，`Alice`。
3. **凭据**选项卡下，点击**JWT**选项卡，然后点击**新增 JWT 凭据**。
4. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-jwt`。
   * **Key**，输入 `alice-key`。
   * **算法**，选择 `HS256`。
   * **Secret**，选择**从Secret 提供商引用**，然后输入 `$secret://aws/my-secrets-manager/alice-credentias/secret`。
   * 点击**新增**。

:::note

所有密钥引用都以 `$secret://` 开头。`aws` 是Secret 提供商的**Secret 管理服务**，`my-secrets-manager` 是**Secret 提供商 ID**。

:::

</TabItem>

<TabItem value="adc">

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
    credentials:
      - name: primary-jwt
        type: jwt-auth
        config:
          key: alice-key
          algorithm: HS256
          secret: `$secret://aws/my-secrets-manager/alice-credentias/secret`
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>

<TabItem value="ingress">

尚不支持。

</TabItem>

</Tabs>

### 新增 HMAC 认证凭据

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
2. 选择你的目标消费者，例如，`Alice`。
3. **凭据**选项卡下，点击**HMAC 认证**选项卡，然后点击**新增 HMAC 认证凭据**。
4. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-hmac`。
   * **Key ID** ，输入 `alice-keyid`。
   * **Secret Key**，选择**从Secret 提供商引用**，然后输入 `$secret://aws/my-secrets-manager/alice-credentias/secret-key`。
   * 点击**新增**。

:::note

所有密钥引用都以 `$secret://` 开头。`aws` 是Secret 提供商的**Secret 管理服务**，`my-secrets-manager` 是**Secret 提供商 ID**。

:::

</TabItem>

<TabItem value="adc">

```yaml title="adc-consumer.yaml"
consumers:
  - username: Alice
    credentials:
      - name: primary-hmac
        type: key-auth
        config:
          keyid: alice-keyid
          secret_key: `$secret://aws/my-secrets-manager/alice-credentias/secret-key`
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml
```

</TabItem>

<TabItem value="ingress">

尚不支持。

</TabItem>

</Tabs>

## 引用密钥以启用插件

插件配置中的以下敏感字段可以存储在外部Secret 管理服务（HashiCorp Vault、AWS Secret Manager 等）中，并在 API7 网关中引用：

|插件|字段|
|:---|:---|
|[Limit Count](/hub/limit-count)|`redis_username`、`redis_password`|
|[Authz-Casdoor](https://apisix.apache.org/docs/apisix/plugins/authz-casdoor/)|`client_id`、`client_secret`|
|[Wolf RBAC](https://apisix.apache.org/docs/apisix/plugins/wolf-rbac/)|`appid`|
|[LDAP 认证](https://apisix.apache.org/docs/apisix/plugins/ldap-auth/)|`user_dn`|

本节以配置 [Limit Count 插件](/hub/limit-count) 为例进行演示。

### 创建密钥

在你的 AWS Secrets Manager 中，使用键/值对 `username:api7` 和 `password:redis-api7` 在密钥名称 `redis` 下创建密钥。

### 配置 Limit Count 插件

有关在何处以及如何启用 [Limit Count 插件](/hub/limit-count)，请参阅 [API 限流限速](../api-security/rate-limiting.md)。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

将以下配置新增到**JSON 编辑器**：

```json
{
  "count": 3,
  "time_window": 60,
  "key_type": "var",
  "rejected_code": 429,
  "rejected_msg": "Too many requests",
  "key": "remote_addr",
  "policy": "redis",
  "redis_host": "127.0.0.1",
  "redis_port": 6379,
  "redis_username": "$secret://aws/my-secrets-manager/redis/username",
  "redis_password": "$secret://aws/my-secrets-manager/redis/password",
  "redis_database": 1,
  "redis_timeout": 1001,
  "allow_degradation": false,
  "show_limit_quota_header": true
}
```

:::note

所有密钥引用都以 `$secret://` 开头。`aws` 是Secret 提供商的**Secret 管理服务**，`my-secrets-manager` 是**Secret 提供商 ID**。

:::

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

## 相关阅读

* 核心概念
  * [密钥](../key-concepts/secrets.md)
  * [插件](../key-concepts/plugins.md)
  * [消费者](../key-concepts/consumers.md)
* API 使用
  * [管理消费者凭据](../api-consumption/manage-consumer-credentials.md)
