---
title: Architecture
slug: /architecture
tags:
  - API7 Enterprise
  - API7 Whitepaper
  - Architecture
---

## Data Plane

The data plane is used to receive and process caller requests, using Lua and NGINX to dynamically control request traffic. When a request comes in, it is matched based on predefined routing rules, and the matched request is forwarded by API7 gateway to the corresponding upstream service. During this process, API7 gateway has the ability to use a series of plugins to operate on the request from entry to exit, depending on the configuration of the different plugins in the preset rules. For example, the request may go through several steps such as authentication (to avoid replay attacks, parameter tampering, etc.), request audit (request source information, upstream processing time, etc.), route processing (to obtain the final upstream service address according to the preset rules), request forwarding (the gateway forwards the request to the upstream target node), and request response (after the upstream processing is completed, the gateway returns the result to the caller).

## Control Plane

The control plane contains the ManagerAPI and the default configuration center etcd. when the administrator accesses and operates the console, the console will call the ManagerAPI to send the configuration to the etcd, and with the etcd Watch mechanism, the configuration will take effect in real time in the gateway. For example, an administrator can add a route and configure a rate limit plugin, and when the rate limit threshold is triggered, the gateway will temporarily block access to subsequent requests matching that route. With etcd's Watch mechanism, API7 will notify each gateway node within milliseconds when the administrator updates the configuration in the control panel.

## Others

API7 adopts the architecture of separating the data plane and the control plane, and the configuration center receives and sends down the configuration so that the data plane will not be affected by the control plane. The configuration center is etcd by default, but it also supports Consul, Nacos, Eureka, etc., so you can choose according to your actual situation. In addition, enterprise users only need to focus on the business itself, and most functions not related to the business can be implemented by the built-in plugins of API7, such as authentication, performance analysis, etc.
