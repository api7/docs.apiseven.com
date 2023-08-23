---
title: Routes
slug: /key-concepts/routes
---

In this document, you will learn the basic concept of routes in APISIX, different routing options APISIX offers, as well as drawbacks and solutions to repetitive route configurations.

Explore additional resources at the end of the document for more information on related topics.

## Overview

_Routes_ define paths to upstream services. In APISIX, a route is responsible for matching client requests based on configured rules, loading and executing the corresponding plugins, and forwarding requests to the specified upstream endpoints.

A simple route can be set up with a path-matching URI and a corresponding upstream address. The diagram below shows an example of users sending two HTTP requests to the APISIX API gateway, which are forwarded accordingly per the configured rules in routes:

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/02/24/1yJwf7in_routes.svg" alt="Routes Diagram" width="90%" />
</div>

<br /><br />

Routes are often configured with plugins as well. For example, [configuring the rate-limit plugin in a route](../../getting-started/rate-limiting.md) will enable rate-limiting effects.

## Routing Options

APISIX offers three HTTP routing options:

1. `radixtree_host_uri` routes requests by hosts and URI paths. It can be used to route north-south traffic between clients and servers.

2. `radixtree_uri` routes requests by URI paths. It can be used to route east-west traffic, such as between microservices.

3. `radixtree_uri_with_parameter` enhances on `radixtree_uri` to support the use of parameter in path matching.

These routing options can be configured in `conf/config.yaml` under `apisix.router.http`.

## Routes, Upstreams, and Services

While routes are essential in defining the paths of traffic flows, there are drawbacks to repetitive route configurations (i.e. hard coding **the same upstream addresses or plugin names** for a group of routes). During the time of updates, the repetitive field(s) of these routes will need to be traversed and updated one by one. Configurations like this increase a lot of maintenance costs as a result, especially in large-scale systems with many routes.

To address this issue, [Upstreams](./upstreams.md) and [Services](./services.md) were designed to abstract away repetitive information and reduce redundancies, following the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

## Additional Resource(s)

* Getting Started - [Configure Routes](../../getting-started/configure-routes.md)

[//]: <TODO: Configure Routes via APISIX Admin API>
[//]: <TODO: Lua Radix Tree>
