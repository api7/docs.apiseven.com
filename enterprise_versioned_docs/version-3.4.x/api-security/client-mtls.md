---
title: 配置客户端与 API7 网关之间的 mTLS
slug: /api-security/client-mtls
---

import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

双向传输层安全性（mTLS），作为 TLS（传输层安全性）的一种高级应用，旨在通过客户端与服务器之间的双向身份验证机制，显著提升通信安全性。这一过程依赖于精心设计的握手流程，双方不仅交换加密密钥，还相互验证对方的数字证书，从而确保通信双方身份的准确无误。

本指南将阐述如何在客户端应用程序和 API7 企业版之间配置 mTLS，以有效阻止未经授权的访问并加固整体安全防线。

下面是一个互动演示，提供配置 mTLS 的实践入门。通过点击并按照步骤操作，你将更好地了解如何在 API7 企业版中使用。

<StorylaneEmbed src='https://app.storylane.io/demo/id1jfgxj5rgz' />

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md), 并确保你的服务已配置主机名 `test.com`。

## 生成证书和密钥

1. 生成证书颁发机构（CA）的密钥和证书。

    ```
    openssl genrsa -out ca.key 2048 && \
      openssl req -new -sha256 -key ca.key -out ca.csr -subj "/CN=ROOTCA" && \
      openssl x509 -req -days 36500 -sha256 -extensions v3_ca -signkey ca.key -in ca.csr -out ca.crt
    ```

2. 为 API7 企业版生成一个公用名为 `test.com` 的密钥和证书，并使用 CA 证书签名。

    ```
    openssl genrsa -out server.key 2048 && \
      openssl req -new -sha256 -key server.key -out server.csr -subj "/CN=test.com" && \
      openssl x509 -req -days 36500 -sha256 -extensions v3_req \
      -CA ca.crt -CAkey ca.key -CAserial ca.srl -CAcreateserial \
      -in server.csr -out server.crt
    ```

3. 为客户端生成一个公用名为 `CLIENT` 的密钥和证书，并使用 CA 证书签名。

    ```
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

## 创建证书

1. 从侧边导航栏中选择网关组的 **证书**，进入 **SSL 证书** 选项卡。
2. 单击 **新增 SSL 证书**。
3. 在对话框中，执行以下操作：

* 在 **名称** 字段中，输入 `测试 SSL 证书`。
* 在 **证书** 字段中，上传 `server.crt` 文件。
* 在 **私钥** 字段中，上传 `server.key` 文件。
* 单击 **新增**。

4. 从侧边导航栏中选择网关组的 **证书**，然后单击 **CA 证书** 选项卡。
5. 单击 **新增 CA 证书**。
6. 在对话框中，执行以下操作：

* 在 **名称** 字段中，输入 `测试 CA 证书`。
* 在 **证书** 字段中，上传 `ca.crt` 文件。
* 单击 **新增**。

## 创建 SNI

1. 从侧边导航栏中选择网关组的 **SNI**。
2. 单击 **新增 SNI**。
3. 在对话框中，执行以下操作：

* 在 **名称** 字段中，输入 `测试 SNI`。
* 在 **域名** 字段中，输入 `test.com`。
* 在 **SSL 协议** 字段中，选择 `TLS 1.2` 和 `TLS 1.3`。
* 在 **SSL 证书** 字段中，选择你之前创建的 `测试 SSL 证书`。
* 打开 **mTLS** 开关。
* 在 **CA 证书** 字段中，选择你之前创建的 `测试 CA 证书`。
* 单击 **新增**。

4. 在 **使用情况** 字段中，你应该会看到一个与主机名 `test.com` 匹配的已发布服务。然后你就可以进行验证了。

## 验证客户端与 API7 网关之间的 mTLS 连接

### 使用客户端证书进行请求

由于已配置的 SSL 证书针对公用名（CN）`test.com`，因此请确保在测试或生产环境中，使用 `test.com` 作为 API7 网关中服务的访问域名。

使用客户端证书发送请求至 `https://test.com:9443/ip`，并将 `test.com` 解析为 `127.0.0.1`。

```
curl -ikv --resolve "test.com:9443:127.0.0.1" "https://test.com:9443/ip" \
  --cert client.crt --key client.key
```

可以看到类似以下内容的响应，说明客户端与 API7 网关之间已启用 mTLS。

```
* Added test.com:9443:127.0.0.1 to DNS cache
* Hostname test.com was found in DNS cache
*   Trying 127.0.0.1:9443...
* Connected to test.com (127.0.0.1) port 9443
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
# highlight-start
* (304) (IN), TLS handshake, Request CERT (13):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Certificate (11):
* (304) (OUT), TLS handshake, CERT verify (15):
* (304) (OUT), TLS handshake, Finished (20):
# highlight-end
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
# highlight-start
< HTTP/2 200 
HTTP/2 200 
# highlight-end
...
```

> 注意，在握手期间，API7 网关和客户端成功验证了彼此的证书并建立了连接。

### 无客户端证书情况下进行请求

在无客户端证书的情况下，发送请求到 `https://test.com:9443/ip`。

```
curl -ikv --resolve "test.com:9443:127.0.0.1" "https://test.com:9443/ip"
```

可以看到类似以下内容的响应，说明客户端与 API7 网关之间 mTLS 握手失败。

```
* Added test.com:9443:127.0.0.1 to DNS cache
* Hostname test.com was found in DNS cache
*   Trying 127.0.0.1:9443...
* Connected to test.com (127.0.0.1) port 9443
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
# highlight-start
* (304) (IN), TLS handshake, Request CERT (13):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Certificate (11):
* (304) (OUT), TLS handshake, Finished (20):
# highlight-end
* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384 / [blank] / UNDEF
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=test.com
*  start date: Jul 31 08:50:42 2024 GMT
*  expire date: Jul  7 08:50:42 2124 GMT
*  issuer: CN=ROOTCA
# highlight-start
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
# highlight-end
* using HTTP/2
* [HTTP/2] [1] OPENED stream for https://test.com:9443
```

## 相关阅读

* 核心概念
  * [证书](../key-concepts/certificates)
  * [SNI](../key-concepts/snis)
* 快速入门
  * [创建一个简单的 API](../getting-started/launch-your-first-api)
