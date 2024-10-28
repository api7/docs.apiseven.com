---
title: 密钥（Secret）
slug: /key-concepts/secrets
---

在本文档中，你将学习 API7 网关中 *密钥（Secret）* 和 *Secret 提供商* 的基本概念以及为什么你可能需要它们。

在文档末尾浏览其他资源以获取有关相关主题的更多信息。

## 概述

*密钥（Secret）* 对象是一条需要防止未经授权访问的敏感信息，而 *Secret 提供商* 对象用于设置与外部密钥管理服务（HashiCorp Vault、AWS Secret Manager 等）的集成，以便 API7 网关可以在运行时动态地建立连接并从密钥管理服务中获取密钥。

通过将密钥存储在专用的密钥管理服务中，你可以：

* 降低数据泄露的风险：最大限度地减少 API7 网关中敏感信息的暴露。
* 简化管理：集中密钥的存储和检索，简化配置和维护。
* 增强安全性：利用外部密钥管理服务的高级安全功能和审计功能。
* 提高合规性：确保符合行业法规和数据保护的最佳实践。

## 使用案例

### 保护消费者凭据

消费者凭据中的以下敏感字段可以存储在外部密钥管理服务（HashiCorp Vault、AWS Secret Manager 等）中，并在 API7 网关中引用：

* Key Authentication 凭据中的 `key`
* Basic Authentication 凭据中的 `password`
* JWT 认证凭据中的 `secret`、`public key`
* HMAC 认证凭据中的 `secret key`

有关详细教程，请参阅 [管理消费者凭据](../api-consumption/manage-consumer-credentials)。

### 保护插件配置中的敏感字段

插件配置中的以下敏感字段可以存储在外部密钥管理服务（HashiCorp Vault、AWS Secret Manager 等）中，并在 API7 网关中引用：

|插件|字段|
|:---|:---|
|[Limit Count](/hub/limit-count)|`redis_username`、`redis_password`|
|[Authz-Casdoor](https://apisix.apache.org/docs/apisix/plugins/authz-casdoor/)|`client_id`、`client_secret`|
|[Wolf RBAC](https://apisix.apache.org/docs/apisix/plugins/wolf-rbac/)|`appid`|
|[LDAP 认证](https://apisix.apache.org/docs/apisix/plugins/ldap-auth/)|`user_dn`|

例如，请参阅 [API 限流限速](../api-security/rate-limiting) 并在插件配置中使用密钥。

## 相关阅读

* 核心概念
  * [插件](./plugins)
  * [消费者](./consumers)
* API 安全
  * [引用 HashiCorp Vault 中的密钥](../api-security/hashicorp-vault)
  * [引用 AWS Secrets Manager 中的密钥](../api-security/aws-secrets-manager)
* API 消费
  * [管理消费者凭据](../api-consumption/manage-consumer-credentials)
  * [API 限流限速](../api-security/rate-limiting)
```