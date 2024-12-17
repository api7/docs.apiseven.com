---
title: 配置 API7 企业版与上游之间的 mTLS
slug: /api-security/upstream-mtls
---

import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

双向传输层安全性（mTLS），作为 TLS（传输层安全性）的一种高级应用，旨在通过客户端与服务器之间的双向身份验证机制，显著提升通信安全性。本指南将使用 NGINX 作为上游服务示例，阐述如何在 API7 企业版和上游服务之间配置 mTLS。

下面是一个互动演示，提供了在 API7 企业版和上游服务之间配置 mTLS 的操作指南。

<StorylaneEmbed src='https://app.storylane.io/demo/nbkxwcdlozyx' />

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。
3. 在 API7 Enterprise 上创建一个令牌。

## 生成证书和密钥

1. 生成证书颁发机构（CA）的密钥和证书。

    ```shell
    openssl genrsa -out ca.key 2048
    openssl req -x509 -new -nodes -key ca.key -sha256 -days 36500 -out ca.crt \
    -subj "/CN=ROOTCA"
    ```

2. 为 API7 企业版生成一个公用名为 `test.com` 的服务器密钥和证书，并使用 CA 证书签名。

    ```shell
    openssl genrsa -out server.key 2048 && \
    openssl req -new -key server.key -out server.csr -subj "/CN=test.com" && \
    cat > server.ext << EOF
    authorityKeyIdentifier=keyid,issuer
    basicConstraints=CA:FALSE
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
    subjectAltName = @alt_names
    [alt_names]
    DNS.1 = test.com
    EOF
    openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
    -CAcreateserial -out server.crt -days 36500 \
    -sha256 -extfile server.ext
    ```

3. 为客户端生成一个公用名为 `CLIENT` 的密钥和证书，并使用 CA 证书签名。

    ```shell
    openssl genrsa -out client.key 2048 && \
    openssl req -new -key client.key -out client.csr -subj "/CN=client" && \
    cat > client.ext << EOF
    authorityKeyIdentifier=keyid,issuer
    basicConstraints=CA:FALSE
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
    extendedKeyUsage = clientAuth
    EOF
    openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 36500 -sha256 -extfile client.ext
    ```

4. 生成证书和密钥后，检查并确保以下文件已保存至你的本地设备。

    ❶ `client.crt`: 客户端证书

    ❷ `client.key`: 客户端证书密钥

    ❸ `ca.crt`: CA 证书

## 配置上游服务

在 Docker 启动一个 NGINX 服务器作为示例上游服务。

```shell
docker run -d \
  --name quickstart-nginx \
  --network=apisix-quickstart-net \
  -p 8443:8443 \
  nginx
```

将 CA 证书、服务器证书、服务器的密钥复制到 NGINX 容器中：

```shell
docker cp ca.crt quickstart-nginx:/var/ca.crt
docker cp server.crt quickstart-nginx:/var/server.crt
docker cp server.key quickstart-nginx:/var/server.key
```

在 NGINX 配置文件中配置一个监听 `/hello` 路由和 `8443` 端口的 HTTPS 服务器。

```text title="/etc/nginx/nginx.conf"
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    keepalive_timeout  65;
    #gzip  on;
    server {
        listen 8443 ssl;
    # highlight-start
    // Annotate 1
        server_name            test.com;
    // Annotate 2
        ssl_certificate        /var/server.crt;
    // Annotate 3
        ssl_certificate_key    /var/server.key;
    // Annotate 4
        ssl_client_certificate /var/ca.crt;
    // Annotate 5
        ssl_verify_client on;
    # highlight-end
        location /hello {
            return 200 "Hello API7!";
        }
    }
    include /etc/nginx/conf.d/*.conf;
}
```

❶ `server_name`: 设置为 `test.com`，与服务器证书中的 CN 值保持一致。  

❷ `ssl_certificate`: 配置服务器证书公钥路径 `server.crt`。  

❸ `ssl_certificate_key`: 配置服务器证书私钥路径 `server.key`。  

❹ `ssl_client_certificate`: 配置 CA 证书公钥路径 `ca.crt`。  

❺ `ssl_verify_client`: 设置为 `on`，启用客户端证书验证。

重新加载 NGINX 服务器以应用配置更改。

```shell
docker exec quickstart-nginx nginx -s reload
```

要验证 NGINX 实例是否正确配置，发送以下带有客户端证书和密钥的请求。

```shell
curl -ik "https://127.0.0.1:8443/hello" --cert client.crt --key client.key
```

你应该收到 `HTTP/1.1 200 OK` 的响应。

## 配置 API7 企业版的 mTLS

### 创建服务和路由

1. 登录到 API7 企业版控制台，选择 `default` 网关组。
2. 创建名为 `mtls-nginx` 的服务，并配置 `/hello` 路由和 `GET` 方法。
3. 配置上游节点，在 **主机** 字段中输入 API7 控制台的 IP 地址，如 `192.168.31.29`，并在 **端口** 字段填写 `8443`。
4. 在 **协议** 字段选择 `HTTPS`。

### 配置 SSL 证书

1. 在侧边栏选择网关组的 **SSL 证书**，然后点击 **+ 新增 SSL 证书**。
2. 在对话框中，执行以下操作：

    - **类型** 选择 `客户端证书`。
    - 选择 **上传** 方法。
    - 在 **证书** 字段中上传 `client.crt` 文件。
    - 在 **私钥** 字段中上传 `client.key` 文件。
    - 打开 **对等验证** 按钮。
    - 在 **CA 证书（可选）** 字段中上传 `ca.crt` 文件。
    - 点击 **新增**。

3. 添加完成后，可以在 SSL 证书列表中看到一个新条目，包含一个唯一的 ID 和 `test.com` 作为其服务名称指示符（SNIS）。

### 修改上游服务的 TLS 配置

设置环境变量，首先需使用非 Admin 账号创建 token，再将以下内容替换。

```shell
export service_id=${YOUR_SERVICE_ID}
export gateway_group_id=${YOUR_GATEWAY_GROUP_ID}
export client_cert_id=${YOUR_CLIENT_CERT_KEY}
export X_API_KEY=${YOUR_API_KEY}
```

查看当前服务的配置。

```shell
curl -k -X GET "https://192.168.31.29:7443/apisix/admin/services/$service_id?gateway_group_id=$gateway_group_id" \
  -H 'Content-Type: application/json' \
  -H 'X-API-KEY: ${YOUR_API_KEY}'
```

你将收到类似的响应，其中缺少 TLS 密钥。

```text
...
"service_id":"b7c9c7bc-19b3-47db-b2a2-4867380e2ff1","id":"b7c9c7bc-19b3-47db-b2a2-4867380e2ff1","service_version_id":"5e59b458-e5e3-426e-9f9e-668ced45e522","gateway_group_id":"default","gateway_group_name":"default","status":1,
...
```

修改上游服务的 TLS 配置。

```shell
curl -k -X PATCH "https://192.168.31.29:7443/apisix/admin/services/$service_id?gateway_group_id=$gateway_group_id" \
  -H 'Content-Type: application/json' \
  -H 'X-API-KEY: ${YOUR_API_KEY}' \
  -d '[{"op":"add", "path":"/upstream/tls", "value": {"client_cert_id": ${YOUR_CLIENT_CERT_ID}}}]'
```

你将收到类似的响应，其中包含 TLS 密钥：

```json
...
# highlight-start
"tls":{"client_cert_id":"58999f7b-3400-493a-a518-99716439488e"}},
# highlight-end
"service_id":"b7c9c7bc-19b3-47db-b2a2-4867380e2ff1","id":"b7c9c7bc-19b3-47db-b2a2-4867380e2ff1","service_version_id":"5e59b458-e5e3-426e-9f9e-668ced45e522","gateway_group_id":"default","gateway_group_name":"default","status":1,
...
```

## 验证 API7 Enterprise 和上游间的 mTLS

发送以下请求进行验证。

```shell
curl -ik "http://127.0.0.1:9080/hello"
```

你应当收到一个 `HTTP/1.1 200 OK` 的响应，这说明 API7 企业版与上游服务之间的 mTLS 已经成功设置。

## 相关阅读

- 核心概念
  - [SSL 证书](../key-concepts/services.md)
- 快速入门
  - [创建一个简单的 API](../getting-started/launch-your-first-api.md)
