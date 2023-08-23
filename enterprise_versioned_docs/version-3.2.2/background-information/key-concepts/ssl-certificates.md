---
title: SSL Certificates
slug: /key-concepts/ssl-certificates
---

在本文档中，您将学习 API7 企业版中 SSL Certificates 对象的基本概念，以及为什么需要使用他们，包括在客户端应用程序、API7 企业版和上游服务器之间配置 TLS 或 mTLS。您将在开始时了解 SSL/TLS 的基础知识，以更好地理解何时在 API7 企业版中使用 SSL Certificates 对象。

In this document, you will learn the basic concept of SSL certificate objects in API7 Enterprise Edition and scenarios where you may need them, including configuring TLS or mTLS between client applications, API7 Enterprise Edition, and upstream servers. You will go over the basics of SSL/TLS at the beginning to help further understanding when to use SSL certificate objects in API7 Enterprise Edition. 

您可以在本文档的末尾查看更多关于相关主题的资源，以获取更多信息。

## 预览
_TLS（Transport Layer Security）_ 作为 SSL（Secure Sockets Layer）协议的继任者，是一种用于在两个参与方之间（例如 Web 浏览器和 Web 服务器）保护通信数据的加密协议。它在现有协议（如 HTTP 或 TCP）之上实现，通过建立 TLS 握手连接并加密数据来提供额外的安全保护。

以下是 [TLS v1.2](https://www.rfc-editor.org/rfc/rfc5246) 和 [TLS v1.3](https://www.rfc-editor.org/rfc/rfc8446)（两个最常用的 TLS 版本）中**单向 TLS 握手**的高级概述：

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/08/22/8PNEGiO7_acvck7tc_handshake.svg"
    alt="TLS Handshake for TLS v1.2 and TLS v1.3"
    width="75%" />
</div>


在此过程中，服务器通过向客户端发送证书进行自身的身份验证。客户端验证证书以确保其有效，并确保证书由受信任的机构签发。一旦证书经过验证，客户端和服务器将会就一个共享密钥达成一致，该密钥用于加密和解密应用数据。

API7 企业版还支持 _双向 TLS_, 或称为 _mTLS_，客户端也通过同样的方式进行身份验证，有效地创建了一个双向的 TLS 连接。这确保了双方都经过了身份验证，并有助于防止诸如 [中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) 等网络攻击。

要在 API7 企业版中启用 TLS 或 mTLS，您应在适当的位置生成和配置证书，例如在客户端应用程序、API7 企业版或上游服务器上。对于 API7 企业版方面的配置，根据您要保护的通信段，可能需要一个 SSL 证书对象：

<div style={{textAlign: 'center', margin: 'auto'}}>

|                                   | **TLS (单向 TLS)**    | **mTLS (双向 TLS)** |
|-----------------------------------|-----------------------|-----------------|
| **客户端应用程序 -- API7 企业版**   |    必需               | 必需            |
| **API7 企业版 -- 服务上游**         |   不必需              | 可选            |

</div>

您将了解这些场景下的 SSL Certificates 对象的使用。

## 客户端应用程序与 API7 企业版之间的 TLS

在客户端应用程序与 API7 企业版之间强制使用 TLS 是一种常见做法，因为在这个通信段中，数据传输通常通过公网进行，因此更容易遭到窃听。

以下示意图说明了在客户端应用程序与 API7 企业版之间实现 TLS（也称为 HTTPS）的 SSL Certificates 对象的使用情况。在该示例中，API7 企业版部署在一个任意的 IP 地址 `132.69.xxx.xxx` 后面的域名 `foodservice.com` 上，并充当公共流量与内部服务之间的守卫：

<br />

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/08/23/qi2BmwgB_c11effce8e076fa32df80ece67e2e8a.png"
    alt="Example of TLS between Client Applications and API7 Enterprise Edition"
    width="95%" />
</div>

<br /><br />

以下是示意图中的关键步骤：

1. 客户端应用程序发起对 `https://foodservice.com` 的请求。

2. 请求首先经过 DNS 服务器，该服务器将域名解析为 IP 地址，并将 IP 地址返回给客户端应用程序。

3. 客户端应用程序将请求发送到其已解析的 IP 地址，过程中客户端应用程序与 API7 企业版进行了 [TLS 握手](#overview)，在此过程中，API7 企业版向客户端发送其证书 `server.crt` 进行身份验证。

4. 由于 `foodservice.com` 被包括在 API7 企业版 SSL 证书对象的 SNI 列表中，TLS 握手将成功。客户端应用程序与 API7 企业版之间的通信现在已使用 TLS 进行了加密。

5. API7 企业版将请求路由转发到相应的上游服务上。请注意，在这个示例中，上游服务在默认的 80 端口上公开，而 TLS 在 API7 企业版上终止。

[//]:<TODO: multi-tanancy?>
[//]:<TODO: SNI radix tree?>

有关如何在客户端和 API7 企业版之间配置 HTTPS 的详细说明，请参阅[操作指南](../how-to-guide/traffic-management/tls-and-mtls/configure-https-between-client-and-apisix)。

## API7 企业版与上游之间的 TLS

在 API 网关和上游之间的流量不安全或不私密时，上游服务可能需要使用 TLS。在 API7 企业版和上游之间进行单向 TLS 设置时，上游服务器负责呈现证书和密钥。在 API7 企业版方面，您只需配置上游（[upstreams](./upstreams.md)）以使用 HTTPS 协议和端口 443（或其他指定端口）。

有关如何在 API7 企业版与上游之间配置 TLS 的详细说明，请参阅[操作指南](../how-to-guide/traffic-management/tls-and-mtls/configure-upstream-https)。

## 客户端应用程序与 API7 企业版之间的双向 TLS（mTLS）

在仅限特定服务访问的封闭系统中，服务器验证客户端的身份是非常重要的，确保只有经过身份验证和授权的客户端可以访问后端服务。实现这一点的方法之一是在客户端和服务器之间配置双向 TLS（mTLS）。通过 mTLS，客户端在 TLS 握手过程中向服务器发送证书，服务器使用证书来验证客户端的身份。如果客户端未经过身份验证，服务器将拒绝请求。

要在客户端应用程序和 API7 企业版之间配置双向 TLS（mTLS），除了所需的 TLS 配置外，您还应该：

1. 在客户端应用程序上生成和配置证书和密钥。

2. 将 [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) 证书添加到 API7 企业版的 SSL 证书对象的 `client.ca` 字段中，如下所示：

    ```json
    {   
      "type": "server",
      "sni": "foodservice.com",
      "cert": "<content of server.crt>",
      "key": "<content of server.key>",
      # highlight-start
      "client": {
        "ca": "<content of ca.crt>"
      }
      # highlight-end
    }
    ```
    其中 CA 证书用于验证由 CA 颁发的客户端证书上的数字签名，从而验证客户端应用程序的身份。
    

有关如何在客户端和 API7 企业版之间配置双向 TLS（mTLS）的详细说明，请参阅[操作指南](../how-to-guide/traffic-management/tls-and-mtls/configure-mtls-between-client-and-apisix)。

[//]:<NOTE: API7 Cloud uses mTLS between DP and CP>
[//]:<TODO: Add route-level mTLS once implemented, to protect certain endpoints with sensitive data. Currently mTLS is global.>

## API7 企业版与上游之间的双向 TLS（mTLS）

在高度安全的环境中，诸如金融机构之类的组织通常会在 API 网关与其上游服务之间实现双向 TLS（mTLS），以确保他们符合相关的安全标准和法规。

在 API7 企业版中，是否使用 SSL 证书对象在配置 API7 企业版与其上游服务之间的双向 TLS（mTLS）时取决于配置是否会重复。

如果证书仅对一个域名有效，您可以选择直接在上游对象中配置证书和密钥：

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/08/23/nrCJe7g7_adbb5ac3634fd32a61e92f686fb4ed9.png"
    alt="Example of mTLS between API7 Enterprise Edition and Upstreams without SSL object"
    width="95%" />
</div>

<br />

当一个证书（例如通配符证书）对多个域名有效时，建议创建一个单独的 SSL 证书对象来存储证书和密钥，以避免在上游中重复进行 TLS 配置：

<br />

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/08/23/buGRXBh5_2424c6fbb291ae3d19fd10349fea153.png"
    alt="Example of mTLS between API7 Enterprise Edition and Upstreams with SSL object"
    width="95%" />
</div>

<br />

有关如何在 API7 企业版和上游之间配置双向 TLS（mTLS）的详细说明，请参阅操作指南（即将推出）。

## Additional Resource(s)

关键概念

  * 路由（[Routes](./routes.md)）
  * 上游（[Upstreams](./upstreams.md)）

[//]: <TODO: TLS, mTLS how-to Guide>
[//]: <TODO: API, SSL>
[//]: <TODO: How to enable SSL in standalone deployment mode>
[//]: <TODO: how-to guide about L4 TLS Over TCP>
