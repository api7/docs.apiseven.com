---
title: Configure mTLS Between Client and APISIX
slug: /how-to-guide/traffic-management/tls-and-mtls/configure-mtls-between-client-and-apisix
---

_Mutual TLS (mTLS)_ is a two-way TLS where client and the server authenticate each other. It is typically implemented to prevent unauthorized access and harden security.

This guide will show you how to configure mTLS between downstream client applications and APISIX.

<br/>
  <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2023/05/24/ESNFa0Qi_mtls-client-apisix.jpg" alt="mTLS between Client and APISIX" width="70%"/>
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
  "id": "quickstart-ip",
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

Generate the key and certificate with the common name `CLIENT` for a client, and sign with the CA certificate:

```shell
openssl genrsa -out client.key 2048 && \
  openssl req -new -sha256 -key client.key -out client.csr -subj "/CN=CLIENT" && \
  openssl x509 -req -days 36500 -sha256 -extensions v3_req \
  -CA ca.crt -CAkey ca.key -CAserial ca.srl -CAcreateserial \
  -in client.csr -out client.crt
```

## Configure mTLS for APISIX

Load the content stored in `server.crt`, `server.key`, and `ca.crt` into shell variables:

```shell
server_cert=$(cat server.crt)
server_key=$(cat server.key)
ca_cert=$(cat ca.crt)
```

Create an SSL certificate object to save the server certificate, server certificate key, and CA certificate:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/ssls" -X PUT -d '
{
  "id": "quickstart-mtls-client-ssl",
# highlight-start
// Annotate 1
  "sni": "test.com",
// Annotate 2
  "cert": "'"${server_cert}"'",
// Annotate 3
  "key": "'"${server_key}"'",
# highlight-end
  "client": {
# highlight-start
// Annotate 4
    "ca": "'"${ca_cert}"'"
# highlight-end
  }
}'
```

❶ `sni`: `test.com`, the same as server certificate CN value

❷ `cert`: server certificate `server.crt`

❸ `key`: server certificate key `server.key`

❹ `client.ca`: CA certificate `ca.crt`

## Verify mTLS between Client and APISIX

### With Client Certificate

As the certificate is only valid for the CN `test.com`, you should use `test.com` as the domain name where APISIX is hosted.

Send a request to `https://test.com:9443/ip` with client certificate and resolve `test.com` to `127.0.0.1`:

```shell
curl -ikv --resolve "test.com:9443:127.0.0.1" "https://test.com:9443/ip" \
  --cert client.crt --key client.key
```

An mTLS handshake similar to the following verifies the mTLS between client and APISIX is enabled:

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
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
# highlight-start
* TLSv1.3 (IN), TLS handshake, Request CERT (13):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
# highlight-end
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
# highlight-start
* TLSv1.3 (OUT), TLS handshake, Certificate (11):
* TLSv1.3 (OUT), TLS handshake, CERT verify (15):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
# highlight-end
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
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
* Using Stream ID: 1 (easy handle 0x5625339a72e0)
> GET /ip HTTP/2
> Host: test.com:9443
> user-agent: curl/7.74.0
> accept: */*
> 
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
* Connection state changed (MAX_CONCURRENT_STREAMS == 128)!
# highlight-start
< HTTP/2 200 
HTTP/2 200 
# highlight-end
...
```

Note that APISIX and the client successfully verified each other's certificate during the handshake and established a connection.

### Without Client Certificate

Send a request to `https://test.com:9443/ip` but without client certificate:

```shell
curl -ikv --resolve "test.com:9443:127.0.0.1" "https://test.com:9443/ip"
```

A failed mTLS handshake is similar to the following:

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
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
# highlight-start
* TLSv1.3 (IN), TLS handshake, Request CERT (13):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
# highlight-end
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
# highlight-start
* TLSv1.3 (OUT), TLS handshake, Certificate (11):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
# highlight-end
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
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
* Using Stream ID: 1 (easy handle 0x55f791e252e0)
> GET /ip HTTP/2
> Host: test.com:9443
> user-agent: curl/7.74.0
> accept: */*
> 
* TLSv1.3 (IN), TLS alert, unknown (628):
* OpenSSL SSL_read: error:1409445C:SSL routines:ssl3_read_bytes:tlsv13 alert certificate required, errno 0
* Failed receiving HTTP2 data
* OpenSSL SSL_write: SSL_ERROR_ZERO_RETURN, errno 0
* Failed sending HTTP2 data
* Connection #0 to host test.com left intact
```

the handshake failed due to the lack of client certificate.

## Next Steps

You can learn more about mTLS and APISIX SSL object in [SSL Certificates](../../../key-concepts/ssl-certificates).

APISIX also supports TLS connection between clients and APISIX. See [Configure HTTPS between client and APISIX](../tls-and-mtls/configure-https-between-client-and-apisix) for more details.
