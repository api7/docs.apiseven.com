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

By default, most APISIX plugins are installed as outlined in the default [configuration file](../../reference/configuration-files.md#config-defaultyaml-and-configyaml):

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

If you would like to make adjustments to plugins installation, add the customized `plugins` configuration to `config.yaml`, which takes precedence over the `plugins` configuration in `config-default.yaml`, and [reload APISIX](../../reference/apisix-cli.md#apisix-reload) for changes to take effect.

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

1. Plugins in [global rules](./plugin-global-rules.md)
   1. plugins in rewrite phase 
   2. plugins in access phase

2. Plugins bound to other objects
   1. plugins in rewrite phase
   2. plugins in access phase

Within each [phase](#plugins-execution-lifecycle), you can optionally define a new priority value in the `_meta.priority` attribute of the plugin, which takes precedence over the default plugins priority during execution. Plugins with higher priority values are executed first. See plugin [common configurations](../../plugins/common-configurations.md#_metapriority) for an example.

## Plugins Merging Precedence

When the same plugin is configured both globally in a global rule and locally in an object (e.g. a route), both plugin instances are executed sequentially. 

However, if the same plugin is configured locally on multiple objects, such as on [routes](./routes.md), [services](./services.md), or [consumers](./consumers.md), only one copy of configuration is used as each non-global plugin is only executed once. This is because during execution, plugins configured in these objects are merged with respect to a specific order of precedence: 

`Consumer`  > `Consumer Group` > `Route` > `Plugin Config` > `Service`

such that if the same plugin has different configurations in different objects, the plugin configuration with the highest order of precedence during merging will be used. 

## Plugins Execution Filter

By default, all plugins are triggered by incoming requests that match the configured rules in routes. However, in some cases, you may want more granular control over plugins execution; that is, conditionally determine which plugins are triggered for requests.

APISIX allows for dynamic control over plugin execution by applying the `_meta.filter` configuration to the plugins. The configuration supports the evaluation of a wide range of [built-in variables](../../reference/built-in-variables.md) and [APISIX expressions](../../reference/apisix-expressions.md).

See plugin [common configurations](../../plugins/common-configurations.md#_metafilter) for an example.

## Plugins Development

APISIX supports plugin extension in multiple languages, including Lua, Java, Python, Go, and Wasm.
Plugins run in three major ways:

* Lua plugins run natively in APISIX.
* Java, Python, and Go plugins run in their corresponding APISIX plugin runners, communicating over [remote procedure calls (RPCs)](https://apisix.apache.org/docs/apisix/internal/plugin-runner/).
* Wasm plugins run in the APISIX Wasm plugin runtime.

To learn more about developing plugins, see the plugin development how-to guide (coming soon).

[//]: <TODO: Link to plugins development doc. >

## Additional Resource(s)

* Getting Started - [Configure Rate Limiting](../../getting-started/rate-limiting.md)
* Reference - [Plugin Common Configurations](../../plugins/common-configurations.md)
[//]: <TODO: Lua Plugins>
[//]: <TODO: External Plugins>
[//]: <TODO: Plugin Orchestration>
[//]: <TODO: Plugin Hotloading>
[//]: <TODO: Plugin References/Hub>
