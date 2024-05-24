---
title: Common Configurations
slug: /plugins/common-configurations
---

Plugin common configurations are a set of configuration options that can be applied universally to all APISIX plugins through the `_meta` attribute. They can be used to configure:

* [Plugin conditional execution](#_metafilter)
* [Plugin execution priorities](#_metapriority)
* [Plugin disablement](#_metadisable)
* [Plugin error response](#_metaerror_response)

## `_meta.filter`

You can use `_meta.filter` to configure the conditional execution of plugins based on request parameters. Conditions are created with [APISIX expressions](../reference/apisix-expressions.md) and configured as an array. Plugin only executes when all conditions are met.

For example, the following configuration sets a condition on the request's URI [query parameter](https://en.wikipedia.org/wiki/Query_string). Only requests with the URI query parameter `version` being `v2` will trigger the execution of `proxy-rewrite` plugin, which rewrites the request's URI path to `/api/v2` before forwarding it to the upstream:

```json
{
  ...,
  "plugins": {
    "proxy-rewrite": {
      "uri": "/api/v2",
      "_meta": {
        "filter": [
          ["arg_version", "==", "v2"]
        ]
      }
    }
  }
}
```

Requests not meeting the condition will not have their URI paths rewritten and will be forwarded as-is.

## `_meta.priority`

You can use `_meta.priority` to adjust the execution order of **plugins of the same type** (i.e. global or non-global) **within a given phase**. Once defined, the value will take precedence over the default plugins priority defined in the [configuration file](../reference/configuration-files.md#config-defaultyaml-and-configyaml).

Suppose two plugins that run in the same [phase](../background-information/key-concepts/plugins.md#plugins-execution-lifecycle), `limit-count` and `ip-restriction`, are configured on the same route. `limit-count` has a default priority of 1002 and `ip-restriction` has a default priority of 3000. When a request is sent to the route, `ip-restriction` is executed first as it has a higher default priority value. However, you can run `limit-count` before `ip-restriction` by assigning `_meta.priority` of `limit-count` a priority value higher than 3000, such as:

```json
{
  ...,
  "plugins": {
    "limit-count": {
      ...,
      "_meta": {
        "priority": 3010
      }
    }
  }
}
```

To learn more about the execution order when global and non-global plugins are used together, see [plugins execution order](../background-information/key-concepts/plugins.md#plugins-execution-order).

## `_meta.disable`

You can use `_meta.disable` to disable a plugin without removing the plugin from the object it is bound to entirely.

For example, you can disable the `proxy-rewrite` plugin with the following:

```json
{
  "plugins": {
    "proxy-rewrite": {
      "_meta": {
        "disable": true
      }
    }
  }
}
```

## `_meta.error_response`

You can use `_meta.error_response` to customize the error response returned by a plugin to a fixed value. This could be used to mitigate complications that may arise from the default error response in some cases.

For example, you can customize the error response of the `limit-count` plugin:

```json
{
  "plugins": {
    "limit-count": {
      "count": 1,
      "time_window": 60,
      "_meta": {
        "error_response": {
          "message": "You have exceeded the rate limiting threshold."
        }
      }
    }
  }
}
```

If more than one request is sent within the 60-second window to the route that the plugin binds to, you should see the following response:

```text
{"message":"You have exceeded the rate limiting threshold."}
```

## Differentiate From Plugin Metadata

When working with plugins, it is important to understand the distinctions between the `_meta` common configurations, as outlined in this document, and the [plugin metadata](../background-information/key-concepts/plugin-metadata.md). These two concepts serve different purposes and should not be mixed.

While the `_meta` common configurations refer to configuration options that are available for all APISIX plugins, plugin metadata only applies to plugins that have metadata attributes. These metadata attributes could also be configured with the Admin API plugin metadata resource.

See [plugin metadata](../background-information/key-concepts/plugin-metadata.md) to learn more.
