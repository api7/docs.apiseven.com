---
title: 配置客户端与 API7 企业版之间的 mTLS
slug: /api-security/client-mtls
---

import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

双向传输层安全性（mTLS），作为 TLS（传输层安全性）的一种高级应用，旨在通过客户端与服务器之间的双向身份验证机制，显著提升通信安全性。这一过程依赖于精心设计的握手流程，双方不仅交换加密密钥，还相互验证对方的数字证书，从而确保通信双方身份的准确无误。

本指南将阐述如何在客户端应用程序和 API7 企业版之间配置 mTLS，以有效阻止未经授权的访问并加固整体安全防线。

下面是一个互动演示，提供在客户端应用程序和 API7 企业版之间配置 mTLS 的操作指南。

<StorylaneEmbed src='https://app.storylane.io/demo/id1jfgxj5rgz' />

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## 生成证书和密钥

1. 生成证书颁发机构（CA）的密钥和证书。

    ```shell
    openssl genrsa -out ca.key 2048 && \
      openssl req -new -sha256 -key ca.key -out ca.csr -subj "/CN=ROOTCA" && \
      openssl x509 -req -days 36500 -sha256 -extensions v3_ca -signkey ca.key -in ca.csr -out ca.crt
    ```

2. 为 API7 企业版生成一个公用名为 `test.com` 的密钥和证书，并使用 CA 证书签名。

    ```shell
    openssl genrsa -out server.key 2048 && \
      openssl req -new -sha256 -key server.key -out server.csr -subj "/CN=test.com" && \
      openssl x509 -req -days 36500 -sha256 -extensions v3_req \
      -CA ca.crt -CAkey ca.key -CAserial ca.srl -CAcreateserial \
      -in server.csr -out server.crt
    ```

3. 为客户端生成一个公用名为 `CLIENT` 的密钥和证书，并使用 CA 证书签名。

    ```shell
    openssl genrsa -out client.key 2048 && \
      openssl req -new -sha256 -key client.key -out client.csr -subj "/CN=CLIENT" && \
      openssl x509 -req -days 36500 -sha256 -extensions v3_req \
      -CA ca.crt -CAkey ca.key -CAserial ca.srl -CAcreateserial \
      -in client.csr -out client.crt
    ```

4. 生成证书和密钥后，检查并确保以下文件已保存至你的本地设备。

    ❶ `server.crt`: 服务器证书

    ❷ `server.key`: 服务器证书的密钥

    ❸ `ca.crt`: CA 证书

## 为 API7 企业版配置 mTLS

1. 在侧边栏选择网关组的 **SSL 证书**，然后点击 **+ 新增 SSL 证书**。

2. 在对话框中，执行以下操作：

   - **类型** 选择 `服务器`。
   - 选择 **上传** 方法。
   - 在 **证书** 字段中上传 `server.crt` 文件。
   - 在 **私钥** 字段中上传 `server.key` 文件。
   - 打开 **对等验证** 按钮。
   - 在 **CA 证书（可选）** 字段中上传 `ca.crt` 文件。
   - 点击 **新增**。

3. 添加完成后，可以在 SSL 证书列表中看到一个新条目，包含一个唯一的 ID 和 `test.com` 作为其服务名称指示符（SNIS）。

## 验证客户端与 API7 网关之间的 mTLS 连接

### 使用客户端证书进行请求

由于已配置的 SSL 证书针对公用名（CN）`test.com`，因此请确保在测试或生产环境中，使用 `test.com` 作为 API7 网关中服务的访问域名。

使用客户端证书发送请求至 `https://test.com:9443/ip`，并将 `test.com` 解析为 `127.0.0.1`。

```shell
curl -ikv --resolve "test.com:9443:127.0.0.1" "https://test.com:9443/ip" \
  --cert client.crt --key client.key
```

可以看到类似以下内容的响应，说明客户端与 API7 网关之间已启用 mTLS。

```text
* Added test.com:9443:127.0.0.1 to DNS cache
* Hostname test.com was found in DNS cache
*   Trying 127.0.0.1:9443...
* Connected to test.com (127.0.0.1) port 9443
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
<!-- highlight-start -->
* (304) (IN), TLS handshake, Request CERT (13):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Certificate (11):
* (304) (OUT), TLS handshake, CERT verify (15):
* (304) (OUT), TLS handshake, Finished (20):
<!-- highlight-end -->
* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384 / [blank] / UNDEF
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=test.com
*  start date: Jul 31 08:50:42 2024 GMT
*  expire date: Jul  7 08:50:42 2124 GMT
*  issuer: CN=ROOTCA
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
* using HTTP/2
* [HTTP/2] [1] OPENED stream for https://test.com:9443/ip
* [HTTP/2] [1] [:method: GET]
* [HTTP/2] [1] [:scheme: https]
* [HTTP/2] [1] [:authority: test.com:9443]
* [HTTP/2] [1] [:path: /ip]
* [HTTP/2] [1] [user-agent: curl/8.6.0]
* [HTTP/2] [1] [accept: */*]
> GET /ip HTTP/2
> Host: test.com:9443
> User-Agent: curl/8.6.0
> Accept: */*
> 
<!-- highlight-start -->
```text
< HTTP/2 200 
HTTP/2 200 
<!-- highlight-end -->
...
```

> API7 网关和客户端在握手期间成功验证了彼此的证书，并建立了连接。

### 无客户端证书情况下进行请求

在无客户端证书的情况下，发送请求到 `https://test.com:9443/ip`。

```shell
curl -ikv --resolve "test.com:9443:127.0.0.1" "https://test.com:9443/ip"
```

可以看到类似以下内容的响应，说明客户端与 API7 网关之间 mTLS 握手失败。

```text
* Added test.com:9443:127.0.0.1 to DNS cache
* Hostname test.com was found in DNS cache
*   Trying 127.0.0.1:9443...
* Connected to test.com (127.0.0.1) port 9443
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
<!-- highlight-start -->
* (304) (IN), TLS handshake, Unknown (8):
* (304) (IN), TLS handshake, Request CERT (13):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Certificate (11):
* (304) (OUT), TLS handshake, Finished (20):
<!-- highlight-end -->
* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384 / [blank] / UNDEF
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=test.com
*  start date: Jul 31 08:50:42 2024 GMT
*  expire date: Jul  7 08:50:42 2124 GMT
*  issuer: CN=ROOTCA
<!-- highlight-start -->
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
<!-- highlight-end -->
* using HTTP/2
* [HTTP/2] [1] OPENED stream for https://test.com:9443/ip
* [HTTP/2] [1] [:method: GET]
* [HTTP/2] [1] [:scheme: https]
* [HTTP/2] [1] [:authority: test.com:9443]
* [HTTP/2] [1] [:path: /ip]
* [HTTP/2] [1] [user-agent: curl/8.6.0]
* [HTTP/2] [1] [accept: */*]
> GET /ip HTTP/2
> Host: test.com:9443
> User-Agent: curl/8.6.0
> Accept: */*
> 
* LibreSSL SSL_read: LibreSSL/3.3.6: error:1404C45C:SSL routines:ST_OK:reason(1116), errno 0
<!-- highlight-start -->
* Failed receiving HTTP2 data: 56(Failure when receiving data from the peer)
<!-- highlight-end -->
* Connection #0 to host test.com left intact
```

## 相关阅读

- 核心概念
  - [SSL 证书](../key-concepts/services.md)
- 快速入门
  - [创建一个简单的 API](../getting-started/launch-your-first-api.md)
