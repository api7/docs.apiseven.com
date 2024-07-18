---
title: API 限流限速
slug: /api-security/rate-limiting
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

速率限制允许控制发送到 API 后端的请求的速率。这有助于保护后端免受过多流量和高成本的影响。API 请求还可能包括网络爬虫生成的无效数据以及网络攻击，例如 DDoS，限制请求速率也有助于降低这些恶意流量的危害，避免业务宕机。

API7 网关提供速率限制功能，通过限制给定时间段内发送到上游节点的请求数量来保护 API。请求计数在内存中高效完成，具有低延迟和高性能。

![速率限制](https://static.apiseven.com/uploads/2023/09/01/08Z3zNlU_rate-limit.png)

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## 对所有服务应用速率限制（不推荐）

速率限制插件通常不会设置为全局规则，因为 API 通常需要不同的速率限制配额。当同一插件在对象（例如路由）中全局和本地配置时，两个插件实例都会按顺序执行。

### 限制总请求计数

本节配置一个具有速率限制的路由，在60秒内仅允许3个请求。当超出限制时，将向消费者返回 429 状态码。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>
<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **已发布服务**，然后点击要修改的服务，例如，版本为 `1.0.0` 的 `httpbin API`。
2. 在已发布的服务下，从侧边栏选择 **路由**。
3. 选择你的目标路由，例如，`getting-started-anything`。
4. 搜索 `limit-count` 插件。
5. 点击 **加号** 图标 (+)。
6. 在出现的对话框中，执行以下操作：

* 将以下配置添加到**JSON 编辑器**：

    ```json
    {
      "count": 3,
      "time_window": 60,
      "key_type": "var",
      "rejected_code": 429,
      "rejected_msg": "Too many requests",
      "policy": "local",
      "allow_degradation": false,
      "show_limit_quota_header": true
    }
    ```

* 点击 **启用**。

</TabItem>

<TabItem value="adc">

要使用 ADC 配置路由，请创建以下配置：

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
        plugins:
          limit-count:
            _meta:
              disable: false
            allow_degradation: false
            count: 3
            key: remote_addr
            key_type: var
            policy: local
            rejected_code: 429
            rejected_msg: Too many requests
            show_limit_quota_header: true
            time_window: 60
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

创建一个被启用了速率限制的路由的 Kubernetes manifest 文件:

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
      plugins:
        - name: limit-count
          enable: true 
          config:
            time_window: 60
            count: 3
            rejected_code: 429
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

#### 验证

要进行验证，请向路由发送五个连续的请求：

```bash
for i in {1..5}; do curl -i '127.0.0.1:9080/ip';  done

```

前三个请求将成功，后两个请求将被拒绝，并显示 `429 Too Many Requests` 状态码：

```bash
Date: Fri, 01 Jun 2024 04:43:51 GMT
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 0
Server: API7/3.2.13.0

{"error_msg":"Too many requests"}
```

### 限制每秒请求速率

本节配置一个具有速率限制的路由，每秒仅允许 1 个请求。当每秒请求数在 1 到 3 之间时，它们将被延迟/限制。当每秒请求数超过 3 时，将返回 429 状态码。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **已发布服务**，然后点击要修改的服务，例如，版本为 `1.0.0` 的 `httpbin API`。
2. 在已发布的服务下，从侧边栏选择 **路由**。
3. 选择你的目标路由，例如，`getting-started-anything`。
4. 搜索 `limit-req` 插件。
5. 点击 **加号** 图标 (+)。
6. 在出现的对话框中，执行以下操作：

* 将以下配置添加到**JSON 编辑器**：

    ```json
    {
      "rate": 1,
      "burst": 2,
      "rejected_code": 429,
      "key_type": "var",
      "key": "remote_addr",
      "rejected_msg": "Requests are too frequent, please try again later."
    }
    ```

* 点击 **启用**。

</TabItem>

<TabItem value="adc">

要使用 ADC 配置路由，请创建以下配置：

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
        plugins:
          limit-req:
            _meta:
              disable: false
            burst: 2
            key: remote_addr
            key_type: var
            rate: 1
            rejected_code: 429
            rejected_msg: Requests are too frequent, please try again later.
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>
</Tabs>

#### 验证

要进行验证，请向路由发送五个请求：

```bash
for i in {1..5}; do curl -i '127.0.0.1:9080/ip';  done 
```

由于请求是按顺序发送的，你会收到所需的响应。现在向路由发送五个并发请求：

```bash
curl -i "http://127.0.0.1:9080/ip" & \
curl -i "http://127.0.0.1:9080/ip" & \
curl -i "http://127.0.0.1:9080/ip" & \
curl -i "http://127.0.0.1:9080/ip" & \
curl -i "http://127.0.0.1:9080/ip"   
```

三个请求会返回正常响应，另外两个请求会因为每秒请求数超过限制而被拒绝，返回如下响应：

```bash
HTTP/1.1 429 Too Many Requests
Date: Fri, 01 Jun 2024 04:43:51 GMT
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: API7/3.2.13.0

{"error_msg":"Requests are too frequent, please try again later."}
```

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services.md)
  * [路由](../key-concepts/routes.md)
  * [插件](../key-concepts/plugins.md)
