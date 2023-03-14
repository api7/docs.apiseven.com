---
title: Feature Highlights
slug: /feature-highlights
tags:
  - API7 Enterprise
  - API7 Whitepaper
---

## API Management

It covers API design, creation, testing, deployment, management, operation and maintenance, and offline phases, which can further help enterprises optimize API management process and increase enterprise value. With OpenAPI 3.0 standard, you can easily import and export APIs and generate documents to make more use of API capabilities.

## Multi-tenancy Capability

API7 supports project isolation through work partitions to support multi-tenant capability. Combined with user system and permission management, different users have different permissions for resources under different work partitions, allowing for fine-grained permission control of resources.

## Multi-Protocol Conversion

Since API7 supports communication protocols such as Dubbo, gRPC, and MQTT, API7 supports unified exposure of RESTful APIs to the outside world, reducing internal service protocol transformation.

## Full Dynamic Capability

With the fully dynamic capability of API gateway, from gateway configuration to plugin modification, it can take effect in real time without restarting the service, avoiding service interruptions that affect business traffic and produce unpredictable results. In addition, API7 also supports dynamic loading of SSL certificates.

## Custom Plugins

API7 has more than 60 plugins built in, which can be used in combination to meet most gateway requirements.

With the unique low-code capability of the API7, you can combine plugins by drawing flowcharts to achieve a more advanced way of using plugins. If existing plugins do not meet your specific needs, customized plugins written in Lua is also supported by API7. Customized plugins can be used at all stages from request entry to response return, such as init, rewrite, access, balancer, header filter, body filter, log, etc.

## Analysis and Monitoring

API7 integrates with Prometheus to obtain detailed API call data, including but not limited to access sources, success rates, top-95 values, top-99 values, success/failure response code distributions, QPS, and other metrics.

## Dashboard

API7 has built-in dashboard control panel and ManagerAPI. Dashboard control panel facilitates users to configure rules through visual panel. ManagerAPI facilitates users to use automation tools or integrate into internal business to control gateway nodes.

## Plugin template

Plugin template is one or a group of commonly used plugin configuration sets, which can be selectively applied to the target API to avoid repeated configuration when creating an API.

## Alarm Monitoring

In the traffic monitoring module, we support the establishment of alarm rules and provide alarm reminders when the alarm rules are hit.

## Global Node, visit nearby

Support nearby access within global gateway nodes. It can provide multi-layer network capabilities. API Gateway forms a local area network through the enterprise backbone network around the world, and has the ability to locate and forward each other.

## Data Sovereignty Isolation

The user's region is located through a multi-layer network, and data sovereignty isolation is achieved by storing the data configured by users with different data sovereignty in different etcd.