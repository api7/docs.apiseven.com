---
title: 引用在 HashiCorp Vault 中的密钥
slug: /api-security/hashicorp-vault
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

[HashiCorp Vault](https://www.vaultproject.io/) 是一个集中式平台，用于管理不同环境和应用程序中的密钥和加密。它提供了一个统一的密钥管理平台，用于存储和访问 API 密钥、密码、证书等。

本教程演示了如何将 API7 企业版与 HashiCorp Vault 集成，使你能够安全地存储和引用 Vault 中的消费者凭据和插件配置。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. 在你的网关组中[至少有一个网关实例](../getting-started/add-gateway-instance.md)。
3. 安装 [Docker](https://docs.docker.com/get-docker/)。
4. 安装 [cURL](https://curl.se/) 以向服务发送请求进行验证。
5. 安装 [ZIP](https://infozip.sourceforge.net/Zip.html) 以解压缩 [官方分发的压缩文件](https://developer.hashicorp.com/vault/downloads) 中的 Vault 二进制文件。

## 配置 Vault 服务器

在 Docker 中以开发模式启动一个名为 `api7-quickstart-vault` 的 Vault 实例，令牌为 `api7-quickstart-vault-token`。暴露的端口映射到主机上的 `8200`：

```shell
docker run -d --cap-add=IPC_LOCK \
    -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200' \
    -e 'VAULT_ADDR=http://127.0.0.1:8200' \
# highlight-start
    -e 'VAULT_DEV_ROOT_TOKEN_ID=api7-quickstart-vault-token' \
    -e 'VAULT_TOKEN=api7-quickstart-vault-token' \
    --network=api7-quickstart-net \
    --name api7-quickstart-vault \
# highlight-end
    -p 8200:8200 vault:1.13.0
```

API7 网关需要访问 Vault 和检索密钥的权限。你应该创建一个 [HashiCorp 配置语言 (HCL)](https://github.com/hashicorp/hcl) 策略文件来为 API7 网关生成 Vault 访问令牌。在 Vault 实例中创建一个名为 `api7-policy.hcl` 的 Vault 策略文件，以授予 API7 网关对路径 `secret/` 的读取权限。你可以将密钥放在路径 `secret/` 下以允许 API7 网关读取它们：

```shell
docker exec api7-quickstart-vault /bin/sh -c "echo '
# highlight-start
path \"secret/data/*\" {
    capabilities = [\"read\"]
}
# highlight-end
' > /etc/api7-policy.hcl"
```

将策略文件应用于 Vault 实例：

```shell
docker exec api7-quickstart-vault vault policy write api7-policy /etc/api7-policy.hcl
```

接下来，生成附加到新定义的策略的访问令牌，以供 API7 网关访问 Vault：

```shell
docker exec api7-quickstart-vault vault token create -policy="api7-policy"
```

每次执行上述命令都会生成不同的令牌。如果成功，输出应类似于以下内容：

```text
Key                  Value
---                  -----
# highlight-start
token                hvs.CAESIHUznrV4wgcifUia0FROd6iprK7NjipAiHBYwiZDQP9TGh4KHGh2cy5ndHc5dzBPbXd5Y1pzblZXd2ZuQXA3ZHI
# highlight-end
token_accessor       YY4iCj2lICDNd50ZJDsBjvZK
token_duration       768h
token_renewable      true
token_policies       ["api7-policy" "default"]
identity_policies    []
policies             ["api7-policy" "default"]
```

## 在网关组中新增 Secret 提供商

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**Secret 提供商**，然后点击**新增 Secret 提供商**。
2. 在对话框中，执行以下操作：
   * **Secret 提供商 ID**，输入 `my-vault`。
   * **Secret 管理服务**，选择 `HashiCorp Vault`。
   * **KV 版本**，选择 `KV version 1`。
   * 填写**Vault 服务器 URL**字段。例如，`127.0.0.1`。
   * 填写**Secret 前缀**字段。例如，`secret/api7`。
   * **身份验证方法**，选择 `Token`。
   * 填写**令牌**字段。
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

* Key Authentication 凭据中的 `key`
* Basic Authentication 凭据中的 `password`
* JWT 认证凭据中的 `secret`、`public key`
* HMAC 认证凭据中的 `secret key`

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

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 存储密钥

为 Key Authentication 凭据创建一个密钥 `key=alice-primary-key`，并将其存储在 Vault 的路径 `secret/api7/consumer/alice` 中。**确保路径与你配置的Secret 前缀一致**：

```shell
docker exec api7-quickstart-vault vault kv put secret/api7/consumer/alice key=alice-primary-key
```

预期响应类似于以下内容：

```text
=== Secret Path ===
secret/data/api7

======= Metadata =======
Key                Value
---                -----
created_time       2023-03-15T11:42:17.123175125Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
```

重复创建其他消费者凭据的更多密钥，所有密钥都在同一路径下：

* 对于Basic Authentication 凭据：

```shell
docker exec api7-quickstart-vault vault kv put secret/api7/consumer/alice password=alice-password
```

* 对于 JWT 认证凭据：

```shell
docker exec api7-quickstart-vault vault kv put secret/api7/consumer/alice secret=alice-secret
```

* 对于 HMAC 认证凭据：

```shell
docker exec api7-quickstart-vault vault kv put secret/api7/consumer/alice secret-key=alice-secret-key
```

### 新增Key Authentication 凭据

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
3. **凭据**选项卡下，点击**新增Key Authentication 凭据**。
4. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-key`。
   * **Key**，选择**引用 Secret 提供商**，然后输入 `$secret://vault/my-vault/consumer/alice/key`。
   * 点击**新增**。

:::note

 所有密钥引用都以 `$secret://` 开头。`vault` 是 Secret 提供商的**Secret 管理服务**，`my-vault` 是**Secret 提供商 ID**。连接到 HashiCorp Vault 时，`$secret://vault/my-vault` 将替换为 Secret 提供商的实际**Secret 前缀**。最后，发送到 HashiCorp Vault 的路径将是 `secret/api7/consumer/alice/key`。

:::

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 新增Basic Authentication 凭据

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
3. **凭据**选项卡下，点击**基本认证**选项卡，然后点击**新增Basic Authentication 凭据**。
4. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-basic`。
   * **用户名**，输入 `Alice`。
   * **密码**，选择**引用 Secret 提供商**，然后输入 `$secret://vault/my-vault/consumer/alice/password`。
   * 点击**新增**。

:::note

 所有密钥引用都以 `$secret://` 开头。`vault` 是 Secret 提供商的**Secret 管理服务**，`my-vault` 是**Secret 提供商 ID**。连接到 HashiCorp Vault 时，`$secret://vault/my-vault` 将替换为 Secret 提供商的实际**Secret 前缀**。最后，发送到 HashiCorp Vault 的路径将是 `secret/api7/consumer/alice/password`。

:::

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

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
   * **密钥**，选择**引用 Secret 提供商**，然后输入 `$secret://vault/my-vault/consumer/alice/secret`。
   * 点击**新增**。

:::note

 所有密钥引用都以 `$secret://` 开头。`vault` 是 Secret 提供商的**Secret 管理服务**，`my-vault` 是**Secret 提供商 ID**。连接到 HashiCorp Vault 时，`$secret://vault/my-vault` 将替换为 Secret 提供商的实际**Secret 前缀**。最后，发送到 HashiCorp Vault 的路径将是 `secret/api7/consumer/alice/secret`。

:::

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

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
   * **Key ID**，输入 `alice-keyid`。
   * **Secret Key**，选择**引用 Secret 提供商**，然后输入 `$secret://vault/my-vault/consumer/alice/secret-key`。
   * 点击**新增**。

:::note

 所有密钥引用都以 `$secret://` 开头。`vault` 是 Secret 提供商的**Secret 管理服务**，`my-vault` 是**Secret 提供商 ID**。连接到 HashiCorp Vault 时，`$secret://vault/my-vault` 将替换为 Secret 提供商的实际**Secret 前缀**。最后，发送到 HashiCorp Vault 的路径将是 `secret/api7/consumer/alice/secret-key`。

:::

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

## 引用密钥以启用插件

插件配置中的以下敏感字段可以存储在外部Secret 管理服务（HashiCorp Vault、AWS Secret Manager 等）中，并在 API7 网关中引用：

|插件|字段|
|:---|:---|
|Limit Count|`redis_username`、`redis_password`|
|[Authz-Casdoor](https://apisix.apache.org/docs/apisix/plugins/authz-casdoor/)|`client_id`、`client_secret`|
|[Wolf RBAC](https://apisix.apache.org/docs/apisix/plugins/wolf-rbac/)|`appid`|
|[LDAP 认证](https://apisix.apache.org/docs/apisix/plugins/ldap-auth/)|`user_dn`|

本节以配置 `Limit Count 插件` 为例进行演示。

### 创建密钥

创建一个密钥 `username=api7`，并将其存储在 Vault 的路径 `secret/api7/redis` 中。**确保路径与你配置的Secret 前缀一致**：

```shell
docker exec api7-quickstart-vault vault kv put secret/api7/redis username=api7
```

预期响应类似于以下内容：

```text
=== Secret Path ===
secret/data/api7

======= Metadata =======
Key                Value
---                -----
created_time       2023-03-15T11:42:17.123175125Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
```

再次尝试存储 Redis 密码的密钥：

```shell
docker exec api7-quickstart-vault vault kv put secret/api7/redis password=redis-api7
```

### 配置 Limit Count 插件

有关在何处以及如何启用 `Limit Count 插件`，请参阅 [API 限流限速](../api-security/rate-limiting.md)。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

将以下配置添加到**JSON 编辑器**：

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
  "redis_username": "$secret://vault/my-vault/redis/username",
  "redis_password": "$secret://vault/my-vault/redis/password",
  "redis_database": 1,
  "redis_timeout": 1001,
  "allow_degradation": false,
  "show_limit_quota_header": true
}
```

:::note

所有密钥引用都以 `$secret://` 开头。`vault` 是Secret 提供商的**Secret 管理服务**，`my-vault` 是**Secret 提供商 ID**。连接到 HashiCorp Vault 时，`$secret://vault/my-vault` 将替换为Secret 提供商的实际**Secret 前缀**。最后，发送到 HashiCorp Vault 的路径将是 `secret/api7/redis/username` 和 `secret/api7/redis/password`。

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
