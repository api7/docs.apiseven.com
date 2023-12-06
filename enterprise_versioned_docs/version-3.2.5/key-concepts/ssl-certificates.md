---
title: SSL 证书
slug: /key-concepts/ssl-certificates
---

在本文档中，你将了解 SSL 证书对象的基本概念以及可能需要它们的场景。

传输层安全（Transport Layer Security，TLS）是安全套接字层（Secure Socket Layer，SSL）协议的后继者，是一种加密协议，旨在保护两方（例如 Web 浏览器和 Web 服务器）之间的通信安全。它是在现有协议（例如 HTTP 或 TCP）之上实现的，通过 TLS 握手建立连接并加密数据传输来提供额外的安全层。

下图展示了 [TLS v1.2](https://www.rfc-editor.org/rfc/rfc5246) 和 [TLS v1.3](https://www.rfc-editor.org/rfc/rfc8446) 两种最常用的 TLS 版本中**单向 TLS 握手**：

<div style={{textAlign: 'center'}}>
<img
  src="https://static.apiseven.com/uploads/2023/08/24/OtRgQadG_acvck7tc_handshake.svg"
  alt="TLS v1.2 和 TLS v1.3 的 TLS 握手"
  宽度="75%"/>
</div>

在此过程中，服务器通过提供其证书向客户端验证自身身份。客户端验证证书以确保其有效并且由受信任的机构颁发。验证证书后，客户端和服务器就共享密钥达成一致，该密钥用于加密和解密应用程序数据。

API7 企业版还支持 双向 TLS（mTLS），其中客户端通过提供其证书来向服务器验证自身身份，从而有效地创建双向 TLS 连接。这可以确保双方都经过身份验证，并有助于防止类似于“[中间人](https://zh.wikipedia.org/wiki/%E4%B8%AD%E9%97%B4%E4%BA%BA%E6%94%BB%E5%87%BB)”这样的网络攻击。

要在具有 API7 企业版的系统中启用 TLS 或 mTLS，你应该在客户端应用程序、API7 企业版和/或上游服务器上等适当的位置生成和配置证书。对于 API7 企业版端的配置，可能需要 SSL 证书对象，具体取决于你要保护的通信段：

<div style={{textAlign: 'center', margin: 'auto'}}>

| | **TLS** | **mTLS** |
|------------------------------------|------------- --|----------|
| **客户端应用程序 -- API7 企业版** |必填 |必填|
| **API7 企业版 -- 上游服务** |不需要|可选|

</div>

[//]: <TODO: TLS、mTLS 操作指南>
[//]: <TODO: API、SSL>
[//]: <TODO: 如何在独立部署模式下启用 SSL>
[//]: <TODO：有关 TCP 上的 L4 TLS 的操作指南>
