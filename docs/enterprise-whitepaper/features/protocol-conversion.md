---
title: Protocol Conversion
slug: /features/protocol-conversion
tags:
  - API7 Enterprise
  - API7 Whitepaper
  - Protocol Conversion
---

API7 exposes RESTful APIs uniformly to the outside world, which can be set by administrators in the control panel. These APIs correspond to microservices/upstream services in the enterprise and support proxies for protocols such as Dubbo, gRPC, WebServices, MQTT, etc., in addition to common HTTP services.

![Protocol Conversion](https://static.apiseven.com/2023/01/03/63b3e457c6824.png)

The control panel allows administrators to create upstream services of different protocols and supports creating route objects to bind to upstream services, which are the APIs to be used by the caller. in the process of configuring routes, administrators need to set the HTTP methods (such as GET, POST, PATCH, etc.) listened to by the route, HTTP host name, and other parameters to match requests as rules.

After the route is configured and published, when the request is processed by the API gateway, the API gateway will match the corresponding request according to each routing rule, construct the request content of different protocols and forward it to the upstream service.
