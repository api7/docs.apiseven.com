---
title: Canary Release
slug: /features/canary-release
tags:
  - API7 Enterprise
  - API7 Whitepaper
  - Canary Release
---

Routing is the core function of the API gateway, which is used to route and match requests passing through the API gateway and forward them to the corresponding upstream service. When the upstream service finishes processing, the result is returned to the client. If a request does not match a route, the gateway will return a 404 status code because the route has not been published to the gateway or the route is not configured.

With API7's powerful routing capabilities, the need for grayscale publishing and blue-green deployment can also be realized so that enterprises can smoothly upgrade their services in a stable manner. In addition, when the API gateway forwards requests to upstream services, it will carry some HTTP request headers to mark that the traffic came from the gateway.

Take a Canary Release as an example: after starting a Canary Release, first start the new version of the service (application) and give it to testers to test the new version. If the test is OK, then a small amount of traffic can be switched to the new version, followed by a running status check of the new version and the collection of various data. When the new version is confirmed to be working well, then gradually switch more traffic to the new version. Until 100% of the traffic is switched to the new version, then the old version is shut down and the Canary Release is completed. If you find any problem with the new version during the Canary Release, you can immediately switch the traffic back to the old version, so that the negative impact will be kept to a minimum.

![Canary Release](https://static.apiseven.com/2023/01/03/63b3e2a92cb65.png)
