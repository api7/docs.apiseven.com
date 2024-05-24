---
title: SSL Certificates
slug: /key-concepts/ssl-certificates
---

In this document, you will learn the basic concept of SSL certificate objects in APISIX and scenarios where you may need them, including configuring TLS or mTLS between client applications, APISIX, and upstream servers. You will go over the basics of SSL/TLS at the beginning to help further understanding when to use SSL certificate objects in APISIX. 

Explore additional resources at the end of the document for more information on related topics. 

## Overview

_TLS (Transport Layer Security)_, being the successor to SSL (Secure Sockets Layer) protocol, is a cryptographic protocol designed to secure communication between two parties, such as a web browser and a web server. It is implemented on top of an existing protocol, such as HTTP or TCP, to provide an additional layer of security by establishing a connection through a TLS handshake and encrypting data transmission. 

The following is a high-level overview of the **one-way TLS handshake** in [TLS v1.2](https://www.rfc-editor.org/rfc/rfc5246) and [TLS v1.3](https://www.rfc-editor.org/rfc/rfc8446)—the two most commonly used TLS versions:

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/04/03/acvck7tc_handshake.svg"
    alt="TLS Handshake for TLS v1.2 and TLS v1.3"
    width="75%" />
</div>

During this process, the server authenticates itself to the client by presenting its certificate. The client verifies the certificate to ensure that it is valid and issued by a trusted authority. Once the certificate has been verified, the client and server agree on a shared secret, which is used to encrypt and decrypt the application data. 

APISIX also supports _mutual TLS_, or _mTLS_, where client also authenticates itself to the server by presenting its certificate, effectively creating a two-way TLS connection. This ensures that both parties are authenticated and helps prevent network attacks like [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack). 

To enable TLS or mTLS in your system with APISIX, you should generate and configure certificates in the appropriate places, such as on client applications, APISIX, and/or upstream servers. For configuration on the APISIX side, an SSL certificate object may be required, depending on the segment of communication you want to secure:

<div align="center">

|                                  | **TLS**       | **mTLS** |
|----------------------------------|---------------|----------|
| **Client Application –– APISIX** | Required      | Required |
| **APISIX –– Upstream**           | Not Required  | Optional |

</div>

You will learn about use cases and non-use cases of SSL objects for those scenarios. 

## TLS Between Client Applications and APISIX

It is common practice to enforce TLS between client applications and APISIX as data transmission in this segment is typically over the public internet and therefore, is at a higher risk of being eavesdropped. 

The following diagram illustrates the usage of an SSL object in implementing TLS over HTTP (also known as HTTPS) between client applications and APISIX, where APISIX is deployed at an arbitrary IP address `132.69.xxx.xxx` behind the domain name `foodservice.com` and acts as a gatekeeper between public traffic and internal services: 

<br />

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/04/03/KwdECkCm_mTLS-downstream.svg"
    alt="Example of TLS between Client Applications and APISIX"
    width="95%" />
</div>

<br /><br />

Here are the key steps that took place in the illustration: 

1. The client application initiates a request to `https://foodservice.com`.

2. The request first goes through a DNS server, which resolves the domain name to an IP address and returns the IP address to the client application.

3. The client application sends the request for `foodservice.com` to its resolved IP address, during which process, client application performs a [TLS handshake](#overview) with APISIX, where APISIX sends its certificate `server.crt` to client for authentication.

4. As `foodservice.com` is included in the SNI list of the APISIX SSL object, the TLS handshake shall succeed. The communication between the client application and APISIX is now encrypted with TLS. 

5. APISIX routes and forwards the request to the corresponding upstream services over HTTP. Note that the upstream services are exposed on the default port 80 and TLS is terminated at APISIX in this example.

[//]:<TODO: multi-tanancy?>
[//]:<TODO: SNI radix tree?>

For detailed instructions on how to configure HTTPS between client and APISIX, please refer to the [how-to guide](../how-to-guide/traffic-management/tls-and-mtls/configure-https-between-client-and-apisix).

## TLS Between APISIX and Upstreams

Upstream services may require TLS in cases where the traffic between the API gateway and upstreams is not secure or private. In a one-way TLS setup between APISIX and upstreams, upstream servers are responsible for presenting the certificate and key. On the APISIX side, you only need to configure [upstreams](./upstreams.md) to use HTTPS scheme and port 443 (or other designated port).

For detailed instructions on how to configure TLS between APISIX and upstreams, please refer to the [how-to guide](../how-to-guide/traffic-management/tls-and-mtls/configure-upstream-https).

## mTLS Between Client Applications and APISIX

In closed systems where general access to back-end services is restricted, it is important for the server to verify the identity of the client to ensure that only authenticated and authorized clients are allowed to access the back-end services. One way to achieve this is to configure mTLS between the client and server. With mTLS, the client presents a certificate to the server during the TLS handshake process, and the server uses the certificate to verify the identity of the client. If the client is not authenticated, the server will reject the request.

To configure mTLS between client applications and APISIX, in addition to the configuration required for TLS, you should also:

1. Generate and configure certificates and keys on the client applications.

2. Add the [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) certificate to the `client.ca` field in APISIX's SSL object, such as the following: 

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

    where the CA certificate is used to verify the digital signatures on client certificates issued by the CA, thereby verifying the identity of client applications.

For detailed instructions on how to configure mTLS between client and APISIX, please refer to the [how-to guide](../how-to-guide/traffic-management/tls-and-mtls/configure-mtls-between-client-and-apisix).

[//]:<NOTE: API7 Cloud uses mTLS between DP and CP>
[//]:<TODO: Add route-level mTLS once implemented, to protect certain endpoints with sensitive data. Currently mTLS is global.>

## mTLS Between APISIX and Upstreams

mTLS between an API gateway and its upstream services is typically implemented in high-security environments by organizations, such as financial institutions, who need to stay compliant with relevant security standards and regulations. 

In APISIX, whether to use an SSL object in configuring mTLS between APISIX and its upstream services is determined by whether the configuration will be repetitive. 

If the certificate is valid for only one domain, you can choose to directly configure the certificate and key in the upstream object: 

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/04/03/bsORjkQO_TLS-upstream-1.svg"
    alt="Example of mTLS between APISIX and Upstreams without SSL object"
    width="95%" />
</div>

<br />

When a certificate, such as a wildcard certificate, is valid for multiple domains, it is recommended to create a single SSL object to store the certificate and key and avoid the repetitive TLS configurations on upstreams:

<br />

<div style={{textAlign: 'center'}}>
<img
    src="https://static.apiseven.com/uploads/2023/04/03/DPFJmx4E_TLS-upstream-2.svg"
    alt="Example of mTLS between APISIX and Upstreams with SSL object"
    width="95%" />
</div>

<br />

For detailed instructions on how to configure mTLS between APISIX and upstreams, please refer to the how-to guide (coming soon). 

## Additional Resource(s)

* Key Concepts

  * [Routes](./routes.md)
  * [Upstreams](./upstreams.md)

[//]: <TODO: TLS, mTLS how-to Guide>
[//]: <TODO: Admin API, SSL>
[//]: <TODO: How to enable SSL in standalone deployment mode>
[//]: <TODO: how-to guide about L4 TLS Over TCP>
