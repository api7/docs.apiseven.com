---
title: Configure HTTPS Between Client and APISIX
slug: /how-to-guide/traffic-management/tls-and-mtls/configure-https-between-client-and-apisix
---

_TLS (Transport Layer Security)_ is a cryptographic protocol designed to secure communication between two entities. Enforcing HTTPS between clients and APISIX improves the security and authenticity during the data transmission. 

This guide will show you how to configure HTTPS between client applications and APISIX.

<br/>
  <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2023/05/17/730dMrid_tls-client-apisix.jpg" alt="TLS between APISIX and Upstream" width="70%"/>
  </div>
<br/>

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker).
* Install [cURL](https://curl.se/) to send requests to the services for validation.
* Follow the [Getting Started tutorial](../../../getting-started/) to start a new APISIX instance in Docker.

## Create a Route

Create a route that forwards all requests to `/ip` to the upstream `httpbin.org`:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes" -X PUT -d '
{
  "id": "quickstart-client-ip",
  "uri": "/ip",
  "upstream": {
    "nodes": {
      "httpbin.org:80":1
    },
    "type": "roundrobin"
  }
}'
```

An `HTTP/1.1 200 OK` response verifies that the route is created successfully.

## Generate Certificates and Keys

Generate the certificate authority (CA) key and certificate:

```shell
openssl genrsa -out ca.key 2048 && \
  openssl req -new -sha256 -key ca.key -out ca.csr -subj "/CN=ROOTCA" && \
  openssl x509 -req -days 36500 -sha256 -extensions v3_ca -signkey ca.key -in ca.csr -out ca.crt
```

Generate the key and certificate with the common name `test.com` for APISIX, and sign with the CA certificate:

```shell
openssl genrsa -out server.key 2048 && \
  openssl req -new -sha256 -key server.key -out server.csr -subj "/CN=test.com" && \
  openssl x509 -req -days 36500 -sha256 -extensions v3_req \
  -CA ca.crt -CAkey ca.key -CAserial ca.srl -CAcreateserial \
  -in server.csr -out server.crt
```

## Configure HTTPS for APISIX

Load the content stored in `server.crt` and `server.key` into shell variables:

```shell
server_cert=$(cat server.crt)
server_key=$(cat server.key)
```

Create an SSL certificate object to save the server certificate and its key:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/ssls" -X PUT -d '
{
  "id": "quickstart-tls-client-ssl",
# highlight-start
// Annotate 1
  "sni": "test.com",
// Annotate 2
  "cert": "'"${server_cert}"'",
// Annotate 3
  "key": "'"${server_key}"'"
# highlight-end
}'
```

❶ `sni`: `test.com`, the same as server certificate CN value

❷ `cert`: server certificate

❸ `key`: private key for the server certificate

## Verify HTTPS between Client and APISIX

As the certificate is only valid for the CN `test.com`, you should use `test.com` as the domain name where APISIX is hosted.

Send a request to `https://test.com:9443/ip` and resolve `test.com` to `127.0.0.1`:

```shell
curl -ikv --resolve "test.com:9443:127.0.0.1" "https://test.com:9443/ip"
```

A TLS handshake process similar to the following verifies the TLS between client and APISIX is enabled:

```text
* Added test.com:9443:127.0.0.1 to DNS cache
* Hostname test.com was found in DNS cache
*   Trying 127.0.0.1:9443...
* Connected to test.com (127.0.0.1) port 9443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*  CAfile: /etc/ssl/certs/ca-certificates.crt
*  CApath: /etc/ssl/certs
# highlight-start
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
# highlight-end
* ALPN, server accepted to use h2
* Server certificate:
*  subject: CN=test.com
*  start date: Apr 21 07:47:54 2023 GMT
*  expire date: Mar 28 07:47:54 2123 GMT
*  issuer: CN=ROOTCA
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x556274d632e0)
> GET /ip HTTP/2
> Host: test.com:9443
> user-agent: curl/7.74.0
> accept: */*
> 
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
* Connection state changed (MAX_CONCURRENT_STREAMS == 128)!
< HTTP/2 200 
HTTP/2 200 
...
```

## Next Steps

You can learn more about TLS and APISIX SSL object in [SSL Certificates](../../../key-concepts/ssl-certificates).

APISIX also supports mTLS connection between clients and APISIX. See [Configure mTLS between client and APISIX](../tls-and-mtls/configure-mtls-between-client-and-apisix) for more details.
