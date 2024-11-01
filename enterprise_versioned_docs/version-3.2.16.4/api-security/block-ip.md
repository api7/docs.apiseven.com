---
title: 屏蔽恶意 IP 地址
slug: /api-security/block-ip
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

你可以基于 IP 地址配置访问控制，以防止不必要的用户访问你的 API。

本指南将引导你在网关组上配置 `ip-restriction` 插件作为全局规则，以阻止黑名单中的 IP 地址。如果请求来自黑名单中的 IP 地址，API7 网关将拒绝该请求并返回 `403` 响应代码。请求的 IP 地址可以是实际的客户端 IP 地址，也可以是 `X-Forwarded-For` 地址。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## 为网关组内所有 API 设置共享 IP 地址黑名单

一旦发现恶意 IP 地址正在攻击 API，最好将该 IP 地址添加到共享黑名单中以保护其他 API。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 选择你的服务所在的网关组。
2. 从侧边栏选择 **插件设置**，然后选择 **插件全局规则**。
3. 在 **插件** 字段中，搜索 `ip-restriction` 插件。
4. 点击 **加号** 图标 (+)。
5. 在出现的对话框中，将以下配置添加到 **JSON 编辑器** 中，将 IP 地址 `127.0.0.1` 添加到黑名单中：

    ```json
    {
    "blacklist": ["127.0.0.1"],
    "message": "Sorry, your IP address is not allowed."
    }
    ```

6. 点击 **启用**。

</TabItem>

<TabItem value="adc">

要使用 ADC 配置 IP 限制，请创建以下配置：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    routes:
      - uris:
          - /ip
        name: security-ip
        methods:
          - GET
global_rules:
  ip-restriction:
    _meta:
      disable: false
    blacklist:
      - 127.0.0.1
    message: Sorry, your IP address is not allowed.
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

创建一个路由的 Kubernetes manifest 文件：

```yaml title="httpbin-route.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: httpbin-route
  # namespace: api7    # replace with your namespace
spec:
  http:
    - name: httpbin-route
      match:
        paths:
          - /ip
        methods:
          - GET
      backends:
        - serviceName: httpbin
          servicePort: 80
```

创建另一个启用了密钥认证的路由的 manifest 文件：

```yaml title="global-ip-restriction.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixGlobalRule
metadata:
  name: global-ip-restriction
  # namespace: api7    # replace with your namespace
spec:
  plugins:
    - name: ip-restriction
      enable: true
      config:
        blacklist:
          - "127.0.0.1"
        message: Sorry, your IP address is not allowed.
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml -f global-ip-restriction.yaml
```

</TabItem>

</Tabs>

## 验证

从受限的 IP 地址发送请求。在本例中，`127.0.0.1` 被配置为黑名单 IP 地址：

```shell
curl -i "http://127.0.0.1:9080/ip" 
```

你将收到一个 `503 Service Temporarily Unavailable` 响应，并附带以下消息：

```text
{"error_msg":"Sorry, your IP address is not allowed."}
```

## 相关阅读

- 核心概念
  - [服务](../key-concepts/services.md)
  - [路由](../key-concepts/routes.md)
  - [插件](../key-concepts/plugins.md)
