---
title: Plugin Metadata
slug: /key-concepts/plugin-metadata
---

In this document, you will learn the basic concept of plugin metadata in APISIX and why you may need them. 

Explore additional resources at the end of the document for more information on related topics. 

## Overview

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

* Key Concepts - [Plugins](./plugins.md)

[//]: <TODO: plugin hub>
[//]: <TODO: Admin API - Plugin metadata>
[//]: <TODO: Control API - plugin metadata reference>
