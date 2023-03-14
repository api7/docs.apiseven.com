---
title: Highlights
slug: /highlights
tags:
  - API7 Enterprise
  - API7 Whitepaper
---

![API7 Highlights](https://static.apiseven.com/2023/01/03/63b3cb7254175.png)

## Cloud Native

API7 is a cloud-native API gateway. It is neither platform-related nor vendor-locked. API7 supports bare metal, virtual machines, Kubernetes, OpenShift, ARM64, and other platforms. In addition, API7 can easily interface with other components such as SkyWalking, Prometheus, Kafka, Zipkin, etc., to empower the enterprise.

## High Availability

By default, API7 uses etcd as the configuration center. etcd supports distributed and high availability, and has a lot of practical experience in K8s and other fields, which makes API7 easily support millisecond configuration updates and thousands of gateways; the gateways are stateless and can be expanded or reduced at will.

## Protocol conversion

API7 supports many protocol types, such as TCP/UDP, Dubbo, MQTT, gRPC, SOAP, WebSocket, etc.

## Security Protection

API7 has a variety of built-in authentication and security capabilities, such as Basic Auth, JSON Web Token, IP blacklist and whitelist, OAuth, etc.

## High Performance

API7 uses Radixtree algorithm for high-performance, flexible routing with QPS of about 140K and latency of about 0.2 ms in AWS 8-core servers.

## Full Dynamic Capability

API7 supports modifying the gateway configuration, adding or modifying plugins, etc., which can take effect in real time without restarting or reloading the gateway service. API7 also supports dynamic loading of SSL certificates.

## High Scalability

With the flexible plugin mechanism, you can customize the functions for internal services. API7 supports customized load balancing algorithms and routing algorithms. It is not limited to API gateway implementation. You can implement serverless by dynamically executing user-defined functions at runtime, making the gateway edge nodes more flexible.

## Rich Governance Capacity

Such as fault isolation, service meltdown, service downgrade, flow limit and rate limit, etc. After enabling active health check, API7 will support the ability to intelligently track unhealthy upstream nodes and automatically filter unhealthy nodes to improve overall service stability.
