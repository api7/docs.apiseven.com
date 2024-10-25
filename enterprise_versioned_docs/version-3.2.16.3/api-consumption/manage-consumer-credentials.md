---
title: 管理消费者凭据
slug: /api-consumption/manage-consumer-credentials
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

[消费者](../key-concepts/consumers)是指使用你的API的应用程序或开发者。在[服务](../key-concepts/services)上启用身份验证可以让你控制访问，要求消费者在访问API之前获得凭据。

在服务上启用的身份验证插件就像API上的锁，而消费者凭据则是解锁它们的钥匙。在API7企业版中，你需要一个唯一的用户名和至少一个凭据来设置消费者。

消费者可以使用多种不同类型的凭据，所有凭据在身份验证方面都被视为平等的。

本教程将指导你创建消费者和配置身份验证凭据。

## 前提条件

1. [安装API7企业版](../getting-started/install-api7-ee)。
2. [在网关组上运行API](../getting-started/launch-your-first-api)。

## 配置密钥认证凭据

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: 'Dashboard', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**消费者**。
2. 点击**+ 添加消费者**。
3. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `Alice`。
   * 点击**添加**。
4. 在**凭据**选项卡下，点击**+ 添加密钥认证凭据**。
5. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `primary-key`。
   * 在**密钥**字段中，选择**手动输入**，然后输入 `alice-primary-key`。
   * 如果你想选择**从密钥提供程序引用**，请参阅[在 HashiCorp Vault 中引用密钥](../api-security/hashicorp-vault) 或 [在 AWS Secrets Manager 中引用密钥](../api-security/aws-secrets-manager)。
   * 点击**添加**。

6. 再次尝试添加另一个名为 `backup-key` 的密钥认证凭据，密钥为 `alice-backup-key`。所有凭据都是有效的，可以互换使用以进行 API 身份验证。

下面是一个交互式演示，提供了使用 API7 企业版配置密钥认证凭据的实践介绍。

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

Ingress Controller 目前不支持凭据和匿名消费者。

</TabItem>

</Tabs>

### 验证

有关说明，请参阅[为 API 启用密钥认证](../api-security/api-authentication#enable-key-authentication-for-apis)，并在服务级别启用 [Key Auth 插件](/hub/key-auth)。

然后按照[验证密钥认证](../api-security/api-authentication#validate-key-authentication) 说明进行操作。

## 配置基本认证凭据

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: 'Dashboard', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**消费者**。
2. 点击**添加消费者**。
3. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `Alice`。
   * 点击**添加**。
4. 在**凭据**选项卡下，点击**基本认证**选项卡，然后点击**添加基本认证凭据**。
5. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `primary-basic`。
   * 在**用户名**字段中，输入 `alice`。
   * 在**密码**字段中，选择**手动输入**，然后输入 `alice-password`。
   * 如果你想选择**从密钥提供程序引用**，请参阅[在 HashiCorp Vault 中引用密钥](../api-security/hashicorp-vault) 或 [在 AWS Secrets Manager 中引用密钥](../api-security/aws-secrets-manager)。
   * 点击**添加**。

6. 再次尝试添加另一个名为 `backup-basic` 的基本认证凭据，用户名为 `alice-backup`，密码为 `alice-backup-password`。所有凭据都是有效的，可以互换使用以进行 API 身份验证。

</TabItem>

<TabItem value="adc">

即将推出。

</TabItem>

<TabItem value="ingress">

Ingress Controller 目前不支持凭据和匿名消费者。

</TabItem>

</Tabs>

### 验证

有关说明，请参阅[为 API 启用基本认证](../api-security/api-authentication#enable-basic-authentication-for-apis)，并在服务级别启用 [Key Auth 插件](/hub/key-auth)。

然后按照[验证基本认证](../api-security/api-authentication#validate-basic-authentication) 说明进行操作。

## 配置不同的身份验证凭据

虽然消费者可以拥有多个不同类型的凭据，但已发布服务中的每个路由都应该只配置一个身份验证插件。这允许消费者使用他们喜欢的身份验证方法访问多个路由。

下面是一个交互式演示，提供了使用 API7 企业版配置各种身份验证凭据的实践介绍。

<StorylaneEmbed src='https://app.storylane.io/demo/yi4wdp4iifjo' />

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: 'Dashboard', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**消费者**。
2. 点击**+ 添加消费者**。
3. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `John`。
   * 点击**添加**。
4. 在**凭据**选项卡下，点击**添加密钥认证凭据**。
5. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `key-auth`。
   * 在**密钥**字段中，选择**手动输入**，然后输入 `john-key-auth`。
   * 点击**添加**。

6. 在**凭据**选项卡下，选择**基本认证**，然后点击**添加基本认证凭据**。
7. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `basic-auth`。
   * 在**用户名**字段中，输入 `john`。
   * 在**密码**字段中，选择**手动输入**，然后输入 `john-password`。
   * 点击**添加**。

8. 在**凭据**选项卡下，选择**JWT**，然后点击**添加 JWT 凭据**。
9. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `jwt-auth`。
   * 在**密钥**字段中，输入 `john-jwt-key`。
   * 在**算法**字段中，选择 `RS256`。
   * 在**公钥**字段中，选择**手动输入**，然后输入你的公钥。
   * 点击**添加**。

10. 在**凭据**选项卡下，选择**HMAC 认证**，然后点击**添加 HMAC 认证凭据**。
11. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `hmac-auth`。
   * 在**密钥 ID** 字段中，输入 `john-key`。
   * 在**密钥**字段中，选择**手动输入**，然后输入 `john-hmac-key`。
   * 点击**添加**。

</TabItem>

<TabItem value="adc">

即将推出。

</TabItem>

<TabItem value="ingress">

Ingress Controller 目前不支持凭据和匿名消费者。

</TabItem>

</Tabs>

## 扩展阅读

* 关键概念
  * [服务](../key-concepts/services)
  * [路由](../key-concepts/routes)
  * [插件