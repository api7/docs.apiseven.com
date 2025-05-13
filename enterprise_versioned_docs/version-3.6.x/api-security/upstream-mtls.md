---
title: 配置 API7 企业版 和上游之间的 mTLS
slug: /api-security/upstream-mtls
description: 按照本指南配置 API 网关和上游之间的相互 TLS (mTLS)，通过双方的相互身份验证来增强安全性。
---

Mutal TLS (mTLS) 是一种双向 TLS，客户端和服务器相互验证身份。它通常在对安全要求高的环境中采用，以防止未经授权的访问并加强安全性。

本指南将引导你完成如何在 API7 网关和上游服务之间配置 mTLS 的过程，使用 NGINX 作为示例上游服务。

## 前提条件

* [安装 API7 企业版](../getting-started/install-api7-ee)。
* 在 API7 企业版上创建令牌。

## 生成证书和密钥

1. 生成 CA 密钥和证书。

    ```json
    openssl genrsa -out ca.key 2048
    openssl req -x509 -new -nodes -key ca.key -sha256 -days 36500 -out ca.crt \
    -subj "/CN=ROOTCA"
    ```

2. 使用 `test.com` 为 API7 企业版生成服务器密钥和证书，并使用 CA 证书签名。

    ```json
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

3. 使用 `CLIENT` 为客户端生成密钥和证书，并使用 CA 证书签名。

    ```
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

4. 生成证书和密钥后，检查本地设备以找到这些文件。

    ❶ `client.crt`: 客户端证书
    
    ❷ `client.key`: 客户端证书密钥
    
    ❸ `ca.crt`: CA 证书

## 配置上游服务

启动 NGINX 服务器作为示例上游服务：

```shell
docker run -d \
  --name quickstart-nginx \
  --network=apisix-quickstart-net \
  -p 8443:8443 \
  nginx
```

将 CA 证书、服务器证书公钥和私钥复制到 NGINX 中：

```shell
docker cp ca.crt quickstart-nginx:/var/ca.crt
docker cp server.crt quickstart-nginx:/var/server.crt
docker cp server.key quickstart-nginx:/var/server.key
```

在 NGINX 配置文件中配置侦听 `/hello` 和端口 `8443` 的 HTTPs 服务器：

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

❶ `server_name`: 设置为 `test.com`，以便与服务器证书的 CN 值保持一致。

❷ `ssl_certificate`: 配置服务器证书公钥 `server.crt` 的路径。

❸ `ssl_certificate_key`: 配置服务器证书私钥 `server.key` 的路径。

❹ `ssl_client_certificate`: 配置 CA 证书公钥 `ca.crt` 的路径。

❺ `ssl_verify_client`: 设置为 `on`，以验证客户端证书。

重新加载 NGINX 服务器以应用配置更改：

```shell
docker exec quickstart-nginx nginx -s reload
```

要验证 NGINX 实例是否已正确配置，请使用客户端证书和密钥向路由发送请求：

```shell
curl -ik "https://127.0.0.1:8443/hello" --cert client.crt --key client.key
```

你应该收到一个 `HTTP/1.1 200 OK` 响应。

## 为 API7 企业版配置 mTLS

### 创建到 NGINX 服务器的路由

1. 从侧边导航栏中选择你的网关组下的 **已发布服务**，然后点击 **新增服务**。
2. 选择 **手动新增**。
3. 在 **新增服务** 对话框中，执行以下操作：
    * 在 **服务基本信息** 的 **名称** 字段中，输入 `mtls-nginx`。
    * 在 **服务类型** 字段中，选择 `HTTP (七层代理)`。
    * 在 **上游基本信息** 的 **名称** 字段中，输入 `default`。
    * 在 **如何查找上游** 字段中，选择 `使用节点`。
    * 点击 **新增节点**。
    * 在 **新增节点** 对话框中，执行以下操作：
        * 在 **主机** 字段中，输入你的 API7 控制面板的 IP 地址。
        * 在 **端口** 字段中，输入 `8443`。
        * 在 **权重** 字段中，输入 `100`。
    * 在 **上游协议** 字段中，选择 `HTTPs`。将 **客户端证书** 和 **CA 证书** 字段留给后续步骤。
    * 打开 **新增第一个路由** 开关，然后创建一个带有 `GET` 方法的 `/hello` 路由。
    * 点击 **新增**。

### 创建证书

1. 从侧边导航栏中选择你的网关组的 **证书**，进入 **SSL 证书** 选项卡。
2. 点击 **新增 SSL 证书**。
3. 在对话框中，执行以下操作：

* 在 **名称** 字段中，输入 `上游 SSL 证书`。
* 在 **证书** 字段中，上传 `client.crt` 文件。
* 在 **私钥** 字段中，上传 `client.key` 文件。
* 点击 **新增**。

4. 从侧边导航栏中选择你的网关组的 **证书**，然后点击 **CA 证书** 选项卡。
5. 点击 **新增 CA 证书**。
6. 在对话框中，执行以下操作：

* 在 **名称** 字段中，输入 `上游 CA 证书`。
* 在 **证书** 字段中，上传 `ca.crt` 文件。
* 点击 **新增**。

### 配置上游证书

1. 从侧边导航栏中选择你的网关组的 **已发布服务**，进入你之前创建的 `mtls-nginx` 服务。
2. 从侧边导航栏中选择 **上游**。
3. 点击 **连接配置** 字段的编辑按钮。
4. 在对话框中，执行以下操作：

* 在 **客户端证书** 字段中，选择 `上游 SSL 证书`。
* 在 **CA 证书** 字段中，选择 `上游 CA 证书`。
* 点击 **保存**。

## 验证 API7 企业版和上游服务之间的 mTLS

向路由发送请求：

```shell
curl -ik "http://127.0.0.1:9080/hello"
```

你应该收到一个 `HTTP/1.1 200 OK` 响应，验证 API7 Enterprise 和上游之间的 mTLS 已成功设置。

## 相关阅读

* 核心概念
  * [证书](../key-concepts/certificates)
  