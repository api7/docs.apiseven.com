---
title: 管理消费者凭据
slug: /api-consumption/manage-consumer-credentials
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

[消费者](../key-concepts/consumers)是指使用你的API的应用程序或开发者。在[服务](../key-concepts/services)上启用身份验证可以让你控制访问，要求消费者在访问API之前获得凭据。

在服务上启用的身份验证插件就像 API 上的锁，而消费者凭据则是解锁它们的钥匙。在 API7 企业版中，你需要一个唯一的用户名和至少一个凭据来设置消费者。

消费者可以使用多种不同类型的凭据，所有凭据在身份验证方面都被视为平等的。

:::note

在实施基于消费者的凭据管理之前，请考虑 [开发者](../key-concepts/developers) 是否是更好的解决方案。

:::

本教程将指导你创建消费者和配置身份验证凭据。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee)。
2. [在网关组上运行 API](../getting-started/launch-your-first-api)。

## 配置Key Authentication凭据

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
2. 点击**+ 新增消费者**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `Alice`。
   * 点击**新增**。
4. **凭据**选项卡下，点击**+ 新增Key Authentication凭据**。
5. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-key`。
   * **Key**，选择**手动输入**，然后输入 `alice-primary-key`。
   * 如果你想选择**引用 Secret 提供商**，请参阅[引用 HashiCorp Vault 中的密钥](../api-security/hashicorp-vault) 或 [引用 AWS Secrets Manager 中的密钥](../api-security/aws-secrets-manager)。
   * 点击**新增**。

6. 再次尝试新增另一个名为 `backup-key` 的 Key Authentication 凭据，Key 为 `alice-backup-key`。所有凭据都是有效的，可以互换使用以进行 API 身份验证。

下面是一个交互式演示，提供了使用 API7 企业版配置 Key Authentication 凭据的实践介绍。

<StorylaneEmbed src='https://app.storylane.io/demo/1sb3joej3mek' />

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

暂不支持。

</TabItem>

</Tabs>

### 验证

有关说明，请参阅[为 API 启用 Key Authentication](../api-security/api-authentication#enable-key-authentication-for-apis)，并在服务级别启用 `Key Auth 插件`。

然后按照[验证 Key Authentication](../api-security/api-authentication#validate-key-authentication) 说明进行操作。

## 配置Basic Authentication凭据

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
4. **凭据**选项卡下，点击**Basic Authentication**选项卡，然后点击**新增Basic Authentication凭据**。
5. 在对话框中，执行以下操作：
   * **名称**，输入 `primary-basic`。
   * **用户名**，输入 `alice`。
   * **密码**，选择**手动输入**，然后输入 `alice-password`。
   * 如果你想选择**引用 Secret 提供商**，请参阅[引用 HashiCorp Vault 中的密钥](../api-security/hashicorp-vault) 或 [引用 AWS Secrets Manager 中的密钥](../api-security/aws-secrets-manager)。
   * 点击**新增**。

6. 再次尝试新增另一个名为 `backup-basic` 的 Basic Authentication 凭据，用户名为 `alice-backup`，密码为 `alice-backup-password`。所有凭据都是有效的，可以互换使用以进行 API 身份验证。

</TabItem>

<TabItem value="adc">

即将推出。

</TabItem>

<TabItem value="ingress">

Ingress Controller 目前不支持凭据和匿名消费者。

</TabItem>

</Tabs>

### 验证

有关说明，请参阅[为 API 启用 Basic Authentication](../api-security/api-authentication#enable-basic-authentication-for-apis)，并在服务级别启用 `Basic Auth 插件`。

然后按照[验证 Basic Authentication](../api-security/api-authentication#validate-basic-authentication) 说明进行操作。

## 配置不同的身份验证凭据

虽然消费者可以拥有多个不同类型的凭据，但已发布服务中的每个路由都应该只配置一个身份验证插件。这允许消费者使用他们喜欢的身份验证方法访问多个路由。

下面是一个交互式演示，提供了使用 API7 企业版配置各种身份验证凭据的实践介绍。

<StorylaneEmbed src='https://app.storylane.io/demo/yi4wdp4iifjo' />

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
2. 点击**+ 新增消费者**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `John`。
   * 点击**新增**。
4. **凭据**选项卡下，点击**新增Key Authentication凭据**。
5. 在对话框中，执行以下操作：
   * **名称**，输入 `key-auth`。
   * **密钥**，选择**手动输入**，然后输入 `john-key-auth`。
   * 点击**新增**。

6. **凭据**选项卡下，选择**Basic Authentication**，然后点击**新增 Basic Authentication 凭据**。
7. 在对话框中，执行以下操作：
   * **名称**，输入 `basic-auth`。
   * **用户名**，输入 `john`。
   * **密码**，选择**手动输入**，然后输入 `john-password`。
   * 点击**新增**。

8. **凭据**选项卡下，选择**JWT**，然后点击**新增 JWT 凭据**。
9. 在对话框中，执行以下操作：
   * **名称**，输入 `jwt-auth`。
   * **密钥**，输入 `john-jwt-key`。
   * **算法**，选择 `RS256`。
   * **公钥**，选择**手动输入**，然后输入你的公钥。
   * 点击**新增**。

10. **凭据**选项卡下，选择**HMAC 认证**，然后点击**新增 HMAC 认证凭据**。
11. 在对话框中，执行以下操作：

* **名称**，输入 `hmac-auth`。
* **密钥 ID** ，输入 `john-key`。
* **密钥**，选择**手动输入**，然后输入 `john-hmac-key`。
* 点击**新增**。

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

Ingress Controller 目前不支持凭据和匿名消费者。

</TabItem>

</Tabs>

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services)
  * [路由](../key-concepts/routes)
  * [插件](../key-concepts/plugins)
  * [消费者](../key-concepts/consumers)
* API 安全
  * [设置 API 身份验证](../api-security/api-authentication)
* API 使用
  * [应用基于列表的访问控制](./consumer-restriction)
