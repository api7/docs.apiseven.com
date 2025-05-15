---
title: 在 Kubernetes Secret 中引用密钥
slug: /api-security/kubernetes-secret
description: 本指南将带您实现 API7 企业版与 Kubernetes 的集成，安全存储和获取 API 密钥、密码等敏感信息。
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

Kubernetes Secrets 是用于存储密码、API 密钥和令牌等敏感数据的对象。这些密钥可以作为环境变量暴露给 Pod，或作为 Secret 提供商集成以增强 API 安全性。

本教程演示如何将 API7 企业版与 Kubernetes 集成作为Secret 提供商，使您能够安全地存储和引用消费者凭据及插件配置。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)
2. [网关组中至少有一个网关实例](../getting-started/add-gateway-instance.md)
3. 准备用于存储密钥的 Kubernetes 集群
4. 安装 [cURL](https://curl.se/) 用于服务验证

## 在网关组中添加 Secret 提供商

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: ' 控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress 控制器 ', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **Secret 提供商**，点击 **添加 Secret 提供商**。
2. 在对话框中：
   * **Secret 提供商 ID** 输入 `my-kubernetes-secret`。
   * **密钥管理器** 选择 `Kubernetes`。
   * 填写 **API 服务器地址** 如 `http://127.0.0.1`。
   * 填写 **Token**。
   * 点击**添加**。
3. 复制 **密钥变量** 供后续使用，所有密钥引用都基于此生成，例如：`$secret://kubernetes/my-kubernetes-secret/$namespace/$secret_name/$key`。

</TabItem>

<TabItem value="adc">

即将推出。

</TabItem>

<TabItem value="ingress">

即将推出

</TabItem>

</Tabs>

## 为 SSL 证书引用密钥

SSL 证书对象中的敏感字段 `certificate` 和 `private key` 可以安全地存储在外部密钥管理器 (如 HashiCorp Vault、 AWS Secret Manager 或 Kubernetes Secret) 中，并在 API7 网关中引用。

### 存储密钥

创建 `ssl-secret.yaml` 文件：

```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: default
  name: ssl
type: kubernetes.io/tls
data: # 必须使用 base64 编码值
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNVakNDQWJzQ0FnMytNQTBHQ1NxR1NJYjNE
    UUVCQlFVQU1JR2JNUXN3Q1FZRFZRUUdFd0pLVURFT01Bd0cKQTFVRUNCTUZWRzlyZVc4eEVEQU9C
    Z05WQkFjVEIwTm9kVzh0YTNVeEVUQVBCZ05WQkFvVENFWnlZVzVyTkVSRQpNUmd3RmdZRFZRUUxF
    dzlYWldKRFpYSjBJRk4xY0hCdmNuUXhHREFXQmdOVkJBTVREMFp5WVc1ck5FUkVJRmRsCllpQkRR
    VEVqTUNFR0NTcUdTSWIzRFFFSkFSWVVjM1Z3Y0c5eWRFQm1jbUZ1YXpSa1pDNWpiMjB3SGhjTk1U
    TXcKTVRFeE1EUTFNVE01V2hjTk1UZ3dNVEV3TURRMU1UTTVXakJMTVFzd0NRWURWUVFHREFKS1VE
    RVBNQTBHQTFVRQpDQXdHWEZSdmEzbHZNUkV3RHdZRFZRUUtEQWhHY21GdWF6UkVSREVZTUJZR0Ex
    VUVBd3dQZDNkM0xtVjRZVzF3CmJHVXVZMjl0TUlHYU1BMEdDU3FHU0liM0RRRUJBUVVBQTRHSUFE
    Q0JoQUo5WThFaUhmeHhNL25PbjJTbkkxWHgKRHdPdEJEVDFKRjBReTliMVlKanV2YjdjaTEwZjVN
    Vm1UQllqMUZTVWZNOU1vejJDVVFZdW4yRFljV29IcFA4ZQpqSG1BUFVrNVd5cDJRN1ArMjh1bklI
    QkphVGZlQ09PekZSUFY2MEdTWWUzNmFScG04L3dVVm16eGFLOGtCOWVaCmhPN3F1TjdtSWQxL2pW
    cTNKODhDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUVVGQUFPQmdRQU1meTQzeE15OHh3QTUKVjF2T2NS
    OEtyNWNaSXdtbFhCUU8xeFEzazlxSGtyNFlUY1JxTVQ5WjVKTm1rWHYxK2VSaGcwTi9WMW5NUTRZ
    RgpnWXcxbnlESnBnOTduZUV4VzQyeXVlMFlHSDYyV1hYUUhyOVNVREgrRlowVnQvRGZsdklVTWRj
    UUFEZjM4aU9zCjlQbG1kb3YrcE0vNCs5a1h5aDhSUEkzZXZ6OS9NQT09Ci0tLS0tRU5EIENFUlRJ
    RklDQVRFLS0tLS0K
  tls.key: RXhhbXBsZSBkYXRhIGZvciB0aGUgVExTIGNydCBmaWVsZA==
```

应用到 Kubernetes 集群：

```shell
kubectl apply -f ssl-secret.yaml
```

### 添加 SSL 证书

1. 从侧边栏选择网关组的 **证书**，进入 **SSL 证书** 标签页
2. 点击 **添加 SSL 证书**
3. 在对话框中：
   * **名称** 输入 `测试 SSL 证书`
   * **证书** 输入 `$secret://kubernetes/my-kubernetes-secret/default/ssl/tls.crt`
   * **私钥** 输入 `$secret://kubernetes/my-kubernetes-secret/default/ssl/tls.key`
   * 点击**添加**

4. 完整使用和验证 SSL 证书，参见 [配置客户端与 API7 网关间的 mTLS](client-mtls.md)

## 为消费者凭据引用密钥

以下消费者凭据中的敏感字段可存储在外部密钥管理器中：

* 密钥认证凭据中的 `key`
* 基础认证凭据中的 `password`
* JWT 认证凭据中的 `secret`、`public key`
* HMAC 认证凭据中的 `secret key`

### 添加消费者

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: ' 控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress 控制器 ', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **消费者**
2. 点击 **添加消费者**
3. 在对话框中：
   * **名称** 输入 `Alice`
   * 点击**添加**

</TabItem>

<TabItem value="adc">

即将推出

</TabItem>

<TabItem value="ingress">

即将推出

</TabItem>

</Tabs>

### 存储密钥

创建 `alice-secret.yaml` 文件：

```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: default
  name: alice
type: Opaque
stringData: # 必须使用 base64 编码值
  key: alice-key # 用于密钥认证
  password: alice-password # 用于基础认证
  secret: alice-secret # 用于 JWT 凭据
  secret-key: alice-secret-key # 用于 HMAC 认证
```

应用到 Kubernetes 集群：

```shell
kubectl apply -f alice-secret.yaml
```

### 添加密钥认证凭据

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: ' 控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress 控制器 ', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **消费者**
2. 选择目标消费者如 `Alice`
3. 在 **凭据** 标签页点击 **添加密钥认证凭据**
4. 在对话框中：
   * **名称** 输入 `primary-key`
   * **密钥** 输入 `$secret://kubernetes/my-kubernetes-secret/default/alice/key`
   * 点击**添加**

</TabItem>

<TabItem value="adc">

即将推出

</TabItem>

<TabItem value="ingress">

即将推出

</TabItem>

</Tabs>

### 添加基础认证凭据

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: ' 控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress 控制器 ', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **消费者**
2. 选择目标消费者如 `Alice`
3. 在 **凭据** 标签页的 **基础认证** 子标签下点击 **添加基础认证凭据**
4. 在对话框中：
   * **名称** 输入 `primary-basic`
   * **用户名** 输入 `Alice`
   * **密码** 输入 `$secret://kubernetes/my-kubernetes-secret/default/alice/password`
   * 点击**添加**

</TabItem>

<TabItem value="adc">

即将推出

</TabItem>

<TabItem value="ingress">

即将推出

</TabItem>

</Tabs>

### 添加 JWT 认证凭据

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: ' 控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress 控制器 ', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **消费者**
2. 选择目标消费者如 `Alice`
3. 在 **凭据** 标签页的 **JWT** 子标签下点击 **添加 JWT 凭据**
4. 在对话框中：
   * **名称** 输入 `primary-jwt`
   * **密钥** 输入 `alice-key`
   * **算法** 选择 `HS256`
   * **密钥** 输入 `$secret://kubernetes/my-kubernetes-secret/default/alice/secret`
   * 点击**添加**

</TabItem>

<TabItem value="adc">

即将推出

</TabItem>

<TabItem value="ingress">

即将推出

</TabItem>

</Tabs>

### 添加 HMAC 认证凭据

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: ' 控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress 控制器 ', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **消费者**
2. 选择目标消费者如 `Alice`
3. 在 **凭据** 标签页的 **HMAC 认证** 子标签下点击 **添加 HMAC 认证凭据**
4. 在对话框中：
   * **名称** 输入 `primary-hmac`
   * **密钥 ID** 输入 `alice-keyid`
   * **密钥** 输入 `$secret://kubernetes/my-kubernetes-secret/default/alice/secret-key`
   * 点击**添加**

</TabItem>

<TabItem value="adc">

即将推出

</TabItem>

<TabItem value="ingress">

即将推出

</TabItem>

</Tabs>

### 验证消费者凭据

#### 验证密钥认证

参见 [为 API 启用密钥认证](../api-security/api-authentication#enable-key-authentication-for-apis)，在服务级别启用 [Key Auth 插件](https://docs.api7.ai/hub/key-auth)。

然后按照 [验证密钥认证](../api-security/api-authentication#validate-key-authentication) 操作。

#### 验证基础认证

参见 [为 API 启用基础认证](../api-security/api-authentication#enable-basic-authentication-for-apis)，在服务级别启用 [Basic Auth 插件](https://docs.api7.ai/hub/basic-auth)。

然后按照 [验证基础认证](../api-security/api-authentication#validate-basic-authentication) 操作。

#### 验证 JWT 认证

参见 [为 API 启用 JWT 认证](../api-security/api-authentication#enable-jwt-authentication-for-apis)，在服务级别启用 [JWT Auth 插件](https://docs.api7.ai/hub/jwt-auth)。

然后按照 [验证 JWT 认证](../api-security/api-authentication#validate-jwt-authentication) 操作。

#### 验证 HMAC 认证

参见 [为 API 启用 HMAC 认证](../api-security/api-authentication#enable-hmac-authentication-for-apis)，在服务级别启用 [HMAC Auth 插件](https://docs.api7.ai/hub/hmac-auth)。

然后按照 [验证 HMAC 认证](../api-security/api-authentication#validate-hmac-authentication) 操作。

## 为插件启用引用密钥

以下插件配置中的敏感字段可存储在外部密钥管理器中：

| 插件               | 字段                         |
| -------------------- | -------------------------------- |
| [Limit Count](https://docs.api7.ai/hub/limit-count)|  `redis_username`, `redis_password` |
| [Authz-Casdoor](https://apisix.apache.org/docs/apisix/plugins/authz-casdoor/)|  `client_id`, `client_secret` |
| [Wolf RBAC](https://apisix.apache.org/docs/apisix/plugins/wolf-rbac/)|  `appid`|
| [LDAP 认证](https://apisix.apache.org/docs/apisix/plugins/ldap-auth/)|  `user_dn` |

本节以配置 [Limit Count 插件](https://docs.api7.ai/hub/limit-count) 为例。

### 存储密钥

创建 `redis-secret.yaml` 文件：

```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: default
  name: redis
type: Opaque
stringData:
  username: YXBpNw==
  password: cmVkaXMtYXBpNw==
```

应用到 Kubernetes 集群：

```shell
kubectl apply -f redis-secret.yaml
```

### 配置 Limit Count 插件

关于如何启用 [Limit Count 插件](https://docs.api7.ai/hub/limit-count)，参见 [对 API 应用速率限制](../api-security/rate-limiting.md)。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: ' 控制台 ', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress 控制器 ', value: 'ingress'},
]}>

<TabItem value="dashboard">

在 **JSON 编辑器** 中添加以下配置：

```json
{
  "count": 3,
  "time_window": 60,
  "key_type": "var",
  "rejected_code": 429,
  "rejected_msg": " 请求过多 ",
  "key": "remote_addr",
  "policy": "redis",
  "redis_host": "127.0.0.1",
  "redis_port": 6379,
  "redis_username": "$secret://kubernetes/my-kubernetes-secret/default/redis/username",
  "redis_password": "$secret://kubernetes/my-kubernetes-secret/default/redis/password",
  "redis_database": 1,
  "redis_timeout": 1001,
  "allow_degradation": false,
  "show_limit_quota_header": true
}
```

</TabItem>

<TabItem value="adc">

以下仅为插件配置，非完整同步配置文件。使用 ADC 启用 Limit Count 插件的位置和方法，参见 [对 API 应用速率限制](../api-security/rate-limiting.md)。

```yaml
limit-count:
  count: 3
  time_window: 60
  key_type: var
  rejected_code: 429
  rejected_msg: 请求过多
  key: remote_addr
  policy: redis
  redis_host: 127.0.0.1
  redis_port: 6379
  redis_username: $secret://kubernetes/my-kubernetes-secret/default/redis/username
  redis_password: $secret://kubernetes/my-kubernetes-secret/default/redis/password
  redis_database: 1
  redis_timeout: 1001
  allow_degradation: false
  show_limit_quota_header: true
```

</TabItem>

<TabItem value="ingress">

即将推出

</TabItem>

</Tabs>

## 附加资源

* 核心概念
  * [密钥](../key-concepts/secrets.md)
  * [插件](../key-concepts/plugins.md)
  * [消费者](../key-concepts/consumers.md)
  * [证书](../key-concepts/certificates.md)
* API 消费
  * [管理消费者凭据](../api-consumption/manage-consumer-credentials.md)
