---
title: Services
slug: /key-concepts/services
---

In this document, you will learn the basic concept of _services_ in APISIX and the advantages of using services.

Explore additional resources at the end for more information on related topics.

## Overview

A _service_ object in APISIX is an abstraction of a backend application providing logically related functionalities. The relationship between a service and routes is usually one-to-many (1:N).

The following diagram illustrates an example of a service object used in architecting a data analytics (`da`) backend at Foodbar Company (a fictional company), where there are two routes with distinctive configurations - one for getting data ([HTTP GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)) and the other one for uploading data ([HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)):

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/02/28/7Iudl0X8_services.svg" alt="Services Diagram" width="95%" />
</div>

<br /><br />

Note that the [rate-limiting](../../getting-started/rate-limiting.md) plugin `limit-count` is configured once on the service object, regulating incoming client requests from the two routes. Similarly, the upstream address is also configured only once on the [upstream](./upstreams.md) object. While plugins and upstreams can also be configured in routes individually (and repetitively) to serve the same purpose, it is advised against adopting this approach, as things quickly become hard to manage when the system grows. Using upstreams and services help reduce the risk of data anomalies and minimize operational costs.

For simplicity, the example above only pointed the traffic to one upstream node. You can add more upstream nodes, when needed, to [enable load balancing](../../getting-started/load-balancing.md), maintaining a smooth operation and response for users and avoiding a single point of failure in the architecture.

## Additional Resource(s)

* Getting Started
  * [Configure Routes](../../getting-started/configure-routes.md)
  * [Load Balancing](../../getting-started/load-balancing.md)
* Key Concepts
  * [Routes](./routes.md)
  * [Upstreams](./upstreams.md)
  * [Plugins](./plugins.md)

[//]: <TODO: Configure Services via APISIX Admin API>
[//]: <TODO: Configure Services via APISIX Dashbaord>
