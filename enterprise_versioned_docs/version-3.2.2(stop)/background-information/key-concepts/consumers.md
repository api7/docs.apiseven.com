---
title: Consumers
slug: /key-concepts/consumers
---

In this document, you will learn the basic concepts of consumers in APISIX and why you need them. You will be introduced to a few relevant concepts, including how to pass consumer information to upstream, consumer access restriction, as well as consumer authentication and authorization.

Explore additional resources at the end of the document for more information on related topics.

## Overview

In APISIX, a _consumer_ object represents a user, application, or host that sends requests to the API gateway and consumes backend services. It is used in conjunction with the authentication system; that is, every consumer should be configured with at least one authentication plugin.

Consumer objects come in handy if you have different consumers sending requests to your system, and you need APISIX to perform certain functions, such as rate limiting, based on consumers. These functionalities are provided by APISIX plugins configured in consumers.

The following diagram illustrates an example of APISIX with one route and two consumers, where one consumer, `FetchBot`, is a data fetching bot,  and the other consumer, `JohnDoe`, is a human end user. Plugin `key-auth` is configured on route and consumers, so that requests will be authenticated with API keys. To access the internal service, `FetchBot` would send its requests with `bot-key` and `JohnDoe` would send his request with `john-key`.

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/03/17/YrMYOGVo_Consumers.svg" alt="consumers diagram example" width="95%"/>
</div>
<br />

This configuration ensures that only authenticated requests can interact with the internal service exposed on `/internal`. If a request is sent to APISIX:

* without any key or with a wrong key, the request is rejected.
* with `bot-key`, the request is authenticated and seen as sent by `FetchBot` to fetch data from the internal service. The rate limiting plugin `limit-count` on the consumer takes effect, limiting the number of requests within a 5-second window to 2. If the rate limiting threshold has not been met, the request is forwarded to the upstream service; otherwise, it is rejected.
* with `john-key`, the request is authenticated and seen as sent by `JohnDoe`, subsequently being forwarded to the upstream service.

Note that the authentication plugin is executed before the rate limiting plugin in this scenario, in accordance with the [plugins execution phases](./plugins.md#plugins-execution-lifecycle).

## Passing Consumer Information to Upstream

For certain use cases, such as logging, analytics, and auditing, you might want to pass consumer information to upstream services. Consumer information, by default, is not exposed to upstream; however, you can use `proxy-rewrite` plugin to include the needed information in the header:

```json
{
  "plugins":{
    ...,
    "proxy-rewrite":{
      "headers":{
        "set":{
          "X-Consumer-Name":"$consumer_name"
        }
      }
    }
  }
}
```

## Consumer Access Restriction

You can control request access to your API by imposing restrictions based on consumer name, HTTP methods, or other parameters in the `consumer-restriction` plugin.

For example, if you want to blacklist `FetchBot` from accessing your internal service without changing any consumers configuration in the example from [overview](#overview), you can update the plugin's configuration in route to the following:

```json
{
  "plugins":{
    "key-auth":{},
    "consumer-restriction":{
      "blacklist":["FetchBot"]
    }
  }
}
```

Or, if you want to strictly allow `FetchBot`'s access by HTTP GET method, you can update the plugin's configuration (in either the route or the consumer) to the following:

```json
{
  "plugins":{
    ...,
    "consumer-restriction":{
      "allowed_by_methods":[
        {
          "user":"FetchBot",
          "methods":["GET"]
        }
      ]
    }
  }
}
```

The `consumer-restriction` plugin can also be used with [routes](./routes.md), [services](./services.md), and [plugin global rules](./plugin-global-rules.md). For more details on the plugin usage, please refer to the plugin reference guide (coming soon).

[//]: <TODO: Point to the consumer-restriction reference doc>

## Authentication & Authorization

There are two main design patterns for building authentication and authorization in an APISIX-based architecture.

The first and most commonly adopted approach is to authenticate and authorize requests through a third-party [identity provider (IdP)](https://en.wikipedia.org/wiki/Identity_provider), such as [Keycloak](https://www.keycloak.org):

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/03/16/N8W31TWC_consumers-auth1.svg" alt="APISIX integration with an IdP" width="60%"/>
</div>
<br />

In some environments, a request might need to go through more than one IdP before it can be forwarded to the upstream service. In such cases, you can configure multiple authentication plugins, each corresponding to an IdP, on one consumer; only when all IdPs have granted access to a request will APISIX show success response.

With multiple authentication plugins in place, the [plugins order of execution](./plugins.md#plugins-execution-order) is determined by the plugin's priority, which can be overridden with `_meta.priority`.

The second and a more basic approach is to perform authentication and authorization on the API gateway itself, using `key-auth`, `basic-auth`, `jwt-auth`, `hmac-auth` plugins:

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/03/16/UGxTDGut_consumers-auth2.svg" alt="APISIX performs auth without IdP" width="59%"/>
</div>
<br />

For details about how to configure authentication and authorization for your specific needs, please refer to the authentication chapter in How-To Guides (coming soon).

## Additional Resource(s)

* Getting Started - [Configure Key Authentication](../../getting-started/key-authentication.md)
[//]: <TODO: consumer-restriction plugin>
[//]: <TODO: Admin API - Consumers>
