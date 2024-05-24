---
title: Upstreams
slug: /key-concepts/upstreams
---

In this document, you will learn the basic concept of an upstream object in API7 Enterprise Edition and why you would want to use it. You will be introduced to a few relevant features, including load balancing, service discovery, and upstream health checking.

Explore additional resources at the end for more information on related topics.

## Overview

An _upstream_ object in API7 Enterprise Edition is a logical abstraction of a set containing one or more upstream addresses. It is required in [services](../key-concepts/services.md) to specify **where** requests flow to and **how** they are distributed.

Here is an example of such a configuration in service routes, where the same upstream address is repeated across three different service routes:

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/08/21/wRbqorQB_2d02abd2b60371240f518b943a54f30.png"
    alt="Upstreams Diagram show three routes with different plugins pointing to the same upstream object with the desired upstream address"
    width="95%" />
</div>

<br />

As you can probably see, large-scale systems with many services would benefit significantly from configuring identical groups of upstream addresses in upstream objects, reducing redundant information and operational costs.

## Load Balancing

An important use case of upstreams is to help [enable load balancing](../../getting-started/load-balancing.md) - that is, outlining where client requests are forwarded to and how they are distributed among back-end replicas.

In upstreams, there are four load-balancing algorithms available to choose from:

* `Round Robin` - weighted round robin
* `Consistent Hash` - consistent hashing
* `Exponentially Weighted Moving Average(EWMA)` - exponentially weighted moving average
* `Least Connection` - least connections

For detailed instructions and explanation about load balancing in API7 Enterprise Edition, please refer to the load balancing how-to guide and API Reference (coming soon).

[//]: <TODO: link to Load Balancing article under How-To>
[//]: <TODO: refer to API for more upstream load balancing config>

## Service Discovery

While it is straightforward to figure upstream addresses statically, in microservice-based architectures, upstream addresses are often dynamically assigned and therefore, changed, during autoscaling, failures, and updates. Static configurations are less than ideal in this case.  

Service discovery comes to rescue. It describes the process of automatically detecting the available upstream services, keeping their addresses in a database (called a service registry) for others to reference. That way, an API gateway can always fetch the latest list of upstream addresses through the registry, ensuring all requests are forwarded to healthy upstream nodes.

API7 Enterprise Edition supports integrations with many service registries, such as Consul, Eureka, Nacos, Kubernetes service discovery, and more.

For more details about how to integrate with third-party service registries, please see Service Discovery (coming soon).

[//]: <TODO: for more details about the integration, see Service Discovery in How-To Guide>

## Upstream Health Checking

API7 Enterprise Edition provides active and passive health checking options to probe if upstream nodes are online (a.k.a. healthy). Unhealthy upstream nodes will be ignored until they recover and are deemed healthy again.

Upstream health checking can be configured in the `checks` parameter in an upstream object.

More details about how to configure upstream health checking will be provided in Active and Passive Health Checking (coming soon).

[//]: <TODO: for all health checking parameter options, see API>
[//]: <TODO: How-To Guide - Health Checking>

## Additional Resource(s)

* Getting Started - [Load Balancing](../../getting-started/load-balancing.md)
[//]: <TODO: Configure Upstreams via API7 Enterprise Edition API>
[//]: <TODO: Configure Upstreams via API7 Enterprise EditionSIX Dashbaord>
[//]: <TODO: Upstream Health Checks>
[//]: <TODO: Service Discovery in how to guide>
