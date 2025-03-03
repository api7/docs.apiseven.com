---
title: 证书
slug: /key-concepts/certificates
---

证书用于在客户端应用程序和 API7 网关之间配置 TLS 或 mTLS。这种 SSL 和 CA 证书系统对于在线建立信任和安全至关重要，允许用户自信地浏览和与网站交互。

* SSL 证书：用于传输层安全 (TLS)。安全套接字层 (SSL) 协议是一种加密协议，旨在保护双方之间的通信安全。
* CA 证书：用于双向传输层安全 (mTLS)。它就像一个用于安全连接的双重检查系统，双方在交换信息之前验证彼此的身份。

## SSL 证书

TLS 在现有协议（例如 HTTP 或 TCP）之上实现。它通过 TLS 握手建立连接和加密数据传输来提供额外的安全层。

下图重点介绍了以下内容中的**单向 TLS 握手**：

* [TLS v1.2](https://www.rfc-editor.org/rfc/rfc5246) 
* [TLS v1.3](https://www.rfc-editor.org/rfc/rfc8446)。

TLS v1.2 和 TLS v1.3 是两个最常用的 TLS 版本。

<div style={{textAlign: 'center'}}>
<img
    src="https://static.api7.ai/uploads/2023/08/24/OtRgQadG_acvck7tc_handshake.svg"
    alt="TLS v1.2 和 TLS v1.3 的 TLS 握手"
    width="75%" />
</div>

在此过程中，服务器通过出示其证书向客户端进行身份验证。
客户端验证证书以确保其有效并且由受信任的机构颁发。
证书验证完成后，客户端和服务器就共享密钥达成一致，该密钥用于加密和解密应用程序数据。

![SSL](https://static.api7.ai/uploads/2024/12/13/vtqOSnyr_key-concept-ssl.png)

## CA 证书

API7 企业版还支持双向 TLS (mTLS)，其中客户端也通过出示其证书向 API7 网关进行身份验证，从而有效地创建双向 TLS 连接。
这确保了双方都经过身份验证，并有助于防止网络攻击，例如 [中间人攻击](https://zh.wikipedia.org/wiki/%E4%B8%AD%E9%97%B4%E4%BA%BA%E6%94%BB%E5%87%BB)。

## 使用案例

要在你的系统中使用 API7 企业版启用 TLS 或 mTLS，你应该生成和配置证书并与 [SNI](./snis) 关联。

## 相关阅读

* 核心概念 
  * [服务](./services)
  * [SNI](./snis)
* API 安全
  * [在客户端和 API7 网关之间配置 mTLS](../api-security/client-mtls)