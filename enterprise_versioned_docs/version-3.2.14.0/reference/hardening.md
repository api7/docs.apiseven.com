---
title: 安全加固参考
slug: /reference/hardening
---

# 基础设施安全

基础设施安全是组织为了遵守最新的监管和法律要求而仔细审查的一个重要议题。了解敏感信息存储的位置和方式对于实施强有力的安全措施、防止未经授权的访问、数据泄露或恶意攻击至关重要。

![ee-component-diagram](https://static.apiseven.com/uploads/2024/04/11/5ZUDl6rt_ee-sec-0411.png)

本文档提供了 API7 企业版中敏感信息存储位置、存储方式和保护方式的详细参考。

## 数据面 (DP) 和控制面 (CP) 之间

DP 和 CP 之间的通信可以通过令牌或 mTLS 来保护。

* 使用令牌时，令牌经过 PBKDF2 加密并保存到数据库中。
* 使用 mTLS 时，CP 只存储服务器和 CA 证书。它不存储客户端证书。

## 控制面 (CP)

### 数据库连接凭证

数据库连接凭证存储在控制面的配置文件中。它们也可以存储在环境变量中并注入到配置文件中。

### 插件资源

插件配置中的敏感[插件](../key-concepts/plugins.md)字段在插件模式中指定为 `encrypted_fields`。这些字段中的信息使用 AES256 加密并保存到数据库中。

用于加密敏感信息的密钥环因网关组而异，它们在保存到数据库之前也会被加密。

### SSL 资源

对于 [SSL 资源](../key-concepts/ssl-certificates.md)，元数据以明文保存，而证书则经过 AES 加密并保存到数据库中。

使用 API 或控制台查看 SSL 资源时，你只能看到元数据。

### 控制台和 DP 管理器连接

控制台和 DP 管理器之间的通信默认使用 HTTPS。如果未配置证书，API7 将使用自签名证书。

### 审计

敏感信息（例如密码）在审计日志保存到数据库之前会被屏蔽。禁止对审计日志进行任何其他修改。

### 用户凭证

用户凭证，包括用户名和密码以及访问令牌，在保存到数据库之前都会经过加盐和 PBKDF2 加密。

### 加密算法

在字段不应可逆的情况下，加密算法将是带有盐的 PBKDF2。

在字段应可逆的情况下，加密算法将是 AES。

## 数据面 (DP)

在客户端和 API7 企业版之间，以及 API7 企业版和上游服务之间，你可以选择配置 TLS 或 mTLS 来保护通信。
