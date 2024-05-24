---
title: Plugin Global Rules
slug: /key-concepts/plugin-global-rules
---

In this document, you will learn the basic concept of plugin global rules in APISIX and why you may need them. 

Explore additional resources at the end of the document for more information on related topics. 

## Overview

In APISIX, a _global rule_ object is used to create [plugins](./plugins.md) that are triggered on every incoming request and executed before other plugins locally bound to objects, such as [routes](./routes.md), [services](./services.md), and [consumers](./consumers.md). Certain plugins, such as rate limiting and observability plugins, are frequently enabled globally in order to provide consistent and comprehensive protection for APIs. 

The following diagram illustrates an example of enabling key authentication plugin globally for all incoming requests, where `key-auth` plugin is configured in both a global rule and a consumer. The `proxy-rewrite` plugin is configured on a route to modify the request's [HTTP header](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_header), for demonstrating [plugins execution order](./plugins.md#plugins-execution-order):

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/04/06/marUkTnE_Global%20Rules.svg" alt="diagram with a global rule, a consumer, and a route" width="95%"/>
</div>
<br />

This configuration ensures that only the authenticated requests are allowed to interact with the upstream service. If a request is sent to APISIX:

* without any key or with a wrong key, the request is rejected.
* with `global-key` but to a non-existent route, the request is authenticated but APISIX returns an error warning users that the route is not found. 
* with `global-key` to an existing route, the request is first authenticated, then the header of the request is modified by the plugin on the route, and finally the request is forwarded to the upstream service. 

The example above used two different plugins in a global rule and a route. If the same plugin is configured in both objects, both instances of the plugin will be [executed sequentially](./plugins.md#plugins-execution-order), rather than overwriting each other. 

## Additional Resource(s)

* Key Concepts
  * [Plugins](./plugins.md)
  * [Consumers](./consumers.md)
