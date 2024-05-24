---
title: Configure Upstream HTTPS
slug: /how-to-guide/traffic-management/tls-and-mtls/configure-upstream-https
---

_TLS (Transport Layer Security)_ is a cryptographic protocol designed to secure communication between two parties, such as a web browser and a web server. Services often require TLS if traffic between the API gateway and upstream services is not considered secure or private.

This guide will show you how to configure TLS between APISIX and an upstream service.

<br/>
  <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2023/05/10/YEowzK2g_tls-apisix-upstream.jpg" alt="TLS between APISIX and Upstream" width="70%"/>
  </div>
<br/>

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker).
* Install [cURL](https://curl.se/) to send requests to the services for validation.
* Install and run APISIX, or follow the [Getting Started tutorial](../../../getting-started/) to start a new APISIX instance in Docker.

## Create a Route With TLS Enabled

Create a route to an example upstream [httpbin.org](https://httpbin.org) on its default HTTPS port `443`:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes" -X PUT -d '
{
  "id": "quickstart-tls-upstream",
  "uri": "/ip",
  "upstream": {
# highlight-start
// Annotate 1
    "scheme": "https",
    "nodes": {
    // Annotate 2
      "httpbin.org:443":1
    },
# highlight-end
    "type": "roundrobin"
  }
}'
```

❶ Configure scheme as `https`

❷ Configure port as `443`

## Test TLS between APISIX and Upstream

Send a request to the route:

```shell
curl -i -k "http://127.0.0.1:9080/ip"
```

An `HTTP/1.1 200 OK` response verifies that APISIX has successfully established connection and communicated with the upstream service over HTTPS.

## Next Steps

APISIX also supports TLS connection between clients and APISIX. See Enable Downstream TLS how-to guide for more details (coming soon).

[//]: <TODO: update section and link>
