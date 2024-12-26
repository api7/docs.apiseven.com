---
title: ADC 配置参考
slug: /reference/configuration-adc
---

ADC 使用单个配置文件或多个配置文件来定义 API7 企业版中的服务、路由、插件和其他配置。配置文件可以是 YAML 或 JSON 格式，并作为单一事实来源。

本文档提供了一个示例配置文件，可用作创建你自己的配置文件的参考。有关将配置文件与 ADC 一起使用的更多信息，请参阅[命令参考](./adc.md)。

## 示例配置文件

以下配置文件定义了两个具有多个路由和标签的服务、两个具有密钥认证凭据的消费者以及一个配置 Prometheus 插件的全局规则：

```yaml title="adc.yaml"
services:
  - name: mockbin Service
    labels:
      deployment: staging
    upstream:
      name: Default Upstream
      scheme: http
      type: roundrobin
      hash_on: vars
      nodes:
        - host: mock.api7.ai
          port: 80
          weight: 100
          priority: 0
      timeout:
        connect: 60
        send: 60
        read: 60
      retry_timeout: 0
      keepalive_pool:
        size: 320
        idle_timeout: 60
        requests: 1000
      pass_host: pass
    strip_path_prefix: true
    routes:
      - uris:
          - /api
        name: api
        methods:
          - GET
        enable_websocket: false
        priority: 0
  - name: httpbin Service
    labels:
      deployment: production
    upstream:
      name: Default Upstream
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
    routes:
      - uris:
          - /ip
        name: ip
        labels:
          app: catalog
        methods:
          - GET
      - uris:
          - /anything/*
        name: anything
        methods:
          - GET
consumers:
  - username: Jane
    labels:
      organisation: ACME
    credentials:
      - name: primary-key
        labels:
          type: internal
        type: key-auth
        config:
          key: c1_yN0nCWousUfiR4EzfH
        metadata:
          id: 9ae2df2b-e578-46d9-8357-cf7c3cd64d51
  - username: John
    labels:
      organisation: API7.ai
    credentials:
      - name: primary-key
        type: key-auth
        config:
          key: EIul6mAuYkLJ27on1aJD4
        metadata:
          id: c5e8c41e-37c5-4329-87a9-ba2e6916cfe3
global_rules:
  prometheus:
    _meta:
      disable: false
    prefer_name: false
```
```