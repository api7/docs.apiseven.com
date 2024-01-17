---
title: Plugins
slug: /key-concepts/plugins
---

In this document, you will learn the basic concept of plugins in APISIX and why you need plugins. You will be introduced to a few relevant concepts, including plugins enablement, plugins configuration files precedence, plugins execution filter and order, as well as plugins development.

Explore additional resources at the end of the document for more information on related topics.

## Overview

APISIX _plugins_ extend APISIX's functionalities to meet organization or user-specific requirements in traffic management, observability, security, request/response transformation, serverless computing, and more.

APISIX offers many existing plugins that can be customized and orchestrated to suit your needs. These plugins can be globally enabled to be triggered on every incoming request, or locally bound to other objects, such as [routes](./routes.md), [services](./services.md), or [consumers](./consumers.md).

If existing APISIX plugins do not meet your needs, you can also write your own plugins in Lua or other languages such as Java, Python, Go, and Wasm.

[//]: <TODO: PluginHub provides an inventory of plugins and their detailed usage. >

[//]: <TODO: Add link for orchestraiton. >

## Plugins Installation

By default, most APISIX plugins are installed as outlined in the default configuration file.

```yaml
plugins:
  - real-ip         # installed
  - ai              
  - client-control
  - proxy-control
  - request-id
  - zipkin
  # - skywalking    # not installed
...
```

If you would like to make adjustments to plugins installation, add the customized `plugins` configuration to `config.yaml`, which takes precedence over the `plugins` configuration in `config-default.yaml`, and reload APISIX for changes to take effect.

## Plugins Execution Lifecycle

An installed plugin is first initialized. The configuration of the plugin is then checked against the defined [JSON Schema](https://json-schema.org) to make sure the plugins configuration schema is correct.

When a request goes through APISIX, the plugin's corresponding methods are executed in one or more of the following phases : `rewrite`, `access`, `before_proxy`, `header_filter`, `body_filter`, and `log`. These phases are largely influenced by the [OpenResty directives](https://openresty-reference.readthedocs.io/en/latest/Directives/).

<br />
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/03/09/ZsH5C8Og_plugins-phases.png" alt="Routes Diagram" width="50%"/>
</div>
<br />

To learn more about phases for your custom plugins development, see the plugin development how-to guide (coming soon).

## Plugins Execution Order

In general, plugins are executed in the following order:

1. Plugins in global rules
   1. plugins in rewrite phase 
   2. plugins in access phase

2. Plugins bound to other objects
   1. plugins in rewrite phase
   2. plugins in access phase

Within each [phase](#plugins-execution-lifecycle), you can optionally define a new priority value in the `_meta.priority` attribute of the plugin, which takes precedence over the default plugins priority during execution. Plugins with higher priority values are executed first. See plugin common configurations for an example.

## Plugins Merging Precedence

When the same plugin is configured both globally in a global rule and locally in an object (e.g. a route), both plugin instances are executed sequentially. 

However, if the same plugin is configured locally on multiple objects, such as on [routes](./routes.md), [services](./services.md), or [consumers](./consumers.md), only one copy of configuration is used as each non-global plugin is only executed once. This is because during execution, plugins configured in these objects are merged with respect to a specific order of precedence: 

`Consumer`  > `Consumer Group` > `Route` > `Plugin Config` > `Service`

such that if the same plugin has different configurations in different objects, the plugin configuration with the highest order of precedence during merging will be used. 

## Plugins Execution Filter

By default, all plugins are triggered by incoming requests that match the configured rules in routes. However, in some cases, you may want more granular control over plugins execution; that is, conditionally determine which plugins are triggered for requests.

APISIX allows for dynamic control over plugin execution by applying the `_meta.filter` configuration to the plugins. The configuration supports the evaluation of a wide range of built-in variables and APISIX expressions.

## Plugins Development

APISIX supports plugin extension in multiple languages, including Lua, Java, Python, Go, and Wasm.
Plugins run in three major ways:

* Lua plugins run natively in APISIX.
* Java, Python, and Go plugins run in their corresponding APISIX plugin runners, communicating over [remote procedure calls (RPCs)](https://apisix.apache.org/docs/apisix/internal/plugin-runner/).
* Wasm plugins run in the APISIX Wasm plugin runtime.

To learn more about developing plugins, see the plugin development how-to guide (coming soon).

[//]: <TODO: Link to plugins development doc. >

## Plugin Global Rules

In this section, you will learn the basic concept of plugin global rules in APISIX and why you may need them. 

### Overview

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

## Plugin Metadata

In this section, you will learn the basic concept of plugin metadata in APISIX and why you may need them. 

### Overview

In APISIX, a _plugin metadata_ object is used to configure the common metadata field(s) of all plugin instances sharing the same plugin name. It is useful when a plugin is enabled across multiple objects and requires a universal update to their metadata fields. 

The following diagram illustrates the concept of plugin metadata using two instances of `syslog` plugins on two different routes, as well as a plugin metadata object setting a global  `log_format` for the `syslog` plugin:

<br />

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/04/17/Z0OFRQhV_plugin%20metadata.svg" alt="Plugin Metadata diagram with two routes and one plugin metadata" width="95%" />
</div>

<br />

Without otherwise specified, the `log_format` on plugin metadata object should apply the same log format uniformly to both `syslog` plugins. However, since the `syslog` plugin on the `/order` route has a different `log_format`, requests visiting this route will generate logs in the `log_format` specified by the plugin in route.

In general, if a field of a plugin is defined in both the plugin metadata and another object, such as a route, the definition on the other object **takes precedence** over the global definition in plugin metadata to provide a more granular level of control.

Plugin metadata objects should only be used for plugins that have metadata fields. For more details on which plugins have metadata fields, please refer to the plugin reference guide (coming soon).

[//]: <TODO: link to syslog doc>

## Additional Resource(s)

* Key Concepts
  * [Consumers](./consumers.md)

[//]: <TODO: Lua Plugins>
[//]: <TODO: External Plugins>
[//]: <TODO: Plugin Orchestration>
[//]: <TODO: Plugin Hotloading>
[//]: <TODO: Plugin References/Hub>
