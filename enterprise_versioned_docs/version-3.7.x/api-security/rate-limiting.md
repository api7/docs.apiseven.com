---
title: API 限流限速
slug: /api-security/rate-limiting
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

应用速率限制可以控制发送到 API 后端的请求数量。这可以保护你的后端免受过多流量（包括正常流量和恶意流量（网络爬虫、DDoS 攻击））的影响，这些流量可能导致运营效率低下和成本增加。

本指南将引导你应用速率限制来控制随时间推移发送到上游节点的请求。

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/09/01/08Z3zNlU_rate-limit.png" alt="速率限制" />
</div>

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee)。
2. [在网关组上运行 API](../getting-started/launch-your-first-api)。

## 对所有服务应用速率限制（不推荐）

你不应该全局配置速率限制插件，因为不同的 API 通常需要不同的速率限制配额。如果在全局（全局规则中）和本地（路由中）配置相同的插件，API7 网关将按顺序执行这两个插件实例。

## 对单个路由应用速率限制

### 限制请求计数

本节配置一个具有速率限制的路由，在 60 秒内仅允许 3 个请求。当超出限制时，将向消费者返回 429 状态码。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后点击要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 在已发布的服务下，从侧边栏选择**路由**。
3. 选择你的目标路由，例如，`get-ip`。
4. 在**插件**字段中，点击**新增插件**。
5. 搜索 `limit-count` 插件，然后点击**新增**。
6. 在对话框中，执行以下操作：
   * 将以下配置新增到**JSON 编辑器**：

     ```json
     {
       "count": 3,
       "time_window": 60,
       "key_type": "var",
       "key": "remote_addr",
       "rejected_code": 429,
       "rejected_msg": "Too many requests",
       "policy": "local",
       "allow_degradation": false,
       "show_limit_quota_header": true
     }
     ```

   如果你想引用 Secret 提供商中的密钥，请参阅 [引用 HashiCorp Vault 中的密钥](./hashicorp-vault) 和 [引用 AWS Secrets Manager 中的密钥](./aws-secrets-manager)，并使用以下带有密钥的配置：

   ```json
   {
     "count": 3,
     "time_window": 60,
     "key_type": "var",
     "key": "remote_addr",
     "rejected_code": 429,
     "rejected_msg": "Too many requests",
     "policy": "redis",
     "redis_host": "127.0.0.1",
     "redis_port": 6379,
     "redis_username": "$secret://vault/my-vault/redis/username",
     "redis_password": "$secret://vault/my-vault/redis/password",
     "redis_database": 1,
     "redis_timeout": 1001,
     "allow_degradation": false,
     "show_limit_quota_header": true
   }
   ```

   * 点击**新增**。

下面是一个交互式演示，提供了限制请求数量的实践介绍。通过点击并按照步骤操作，你将更好地了解如何在 API7 企业版中使用它。

<StorylaneEmbed src='https://app.storylane.io/demo/no7b8hvogdkv' />

</TabItem>

<TabItem value="adc">

要使用 ADC 配置路由，请创建以下配置：

```yaml title="adc.yaml"
services:
  - name: httpbin
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
        name: get-ip
        methods:
          - GET
        plugins:
          limit-count:
            _meta:
              disable: false
            count: 3
            time_window: 60
            key_type: var
            key: remote_addr
            policy: local
            rejected_code: 429
            rejected_msg: Too many requests
            allow_degradation: false
            show_limit_quota_header: true
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

创建一个启用了速率限制的路由的 Kubernetes mainfest 文件：

```yaml title="httpbin-route.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: get-ip
  # namespace: api7    # replace with your namespace
spec:
  http:
    - name: get-ip
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
            count: 3
            time_window: 60
            key_type: var
            key: remote_addr
            policy: local
            rejected_code: 429
            rejected_msg: Too many requests
            allow_degradation: false
            show_limit_quota_header: true
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

#### 验证

要进行验证，请发送五个连续的请求：

```shell
resp=$(seq 5 | xargs -I{} curl "http://127.0.0.1:9080/ip" -o /dev/null -s -w "%{http_code}\n") && \
  count_200=$(echo "$resp" | grep "200" | wc -l) && \
  count_429=$(echo "$resp" | grep "429" | wc -l) && \
  echo "200": $count_200, "429": $count_429
```

你应该会看到以下响应，表明在 5 个请求中，有 3 个请求成功（状态码 200），而其他请求被拒绝（状态码 429）。

```text
200:    3, 429:    2
```

### 每秒限制请求数

本节配置一个具有速率限制的路由，每秒仅允许 1 个请求。当每秒请求数在 1 到 3 之间时，它们将被延迟/限制。当每秒请求数超过 3 时，将返回 429 状态码。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>
<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 在已发布的服务下，从侧边栏选择**路由**。
3. 选择你的目标路由，例如，`get-ip`。
4. 在**插件**字段中，点击**新增插件**。
5. 搜索 `limit-req` 插件，然后点击**新增**。
6. 在对话框中，执行以下操作：
   * 将以下配置新增到**JSON 编辑器**：

     ```json
     {
       "rate": 1,
       "burst": 2,
       "key_type": "var",
       "key": "remote_addr",
       "rejected_code": 429,
       "rejected_msg": "Requests are too frequent, please try again later."
    }
    ```

   * 点击**新增**。

</TabItem>

<TabItem value="adc">

要使用 ADC 配置路由，请创建以下配置：

```yaml title="adc.yaml"
services:
  - name: httpbin
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
        name: get-ip
        methods:
          - GET
        plugins:
          limit-req:
            _meta:
              disable: false
            rate: 1
            burst: 2
            key_type: var
            key: remote_addr
            rejected_code: 429
            rejected_msg: Requests are too frequent, please try again later.
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

创建一个启用了速率限制的路由的 Kubernetes mainfest 文件：

```yaml title="httpbin-route.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: get-ip
  # namespace: api7    # replace with your namespace
spec:
  http:
    - name: get-ip
      match:
        paths:
          - /ip
        methods:
          - GET
      backends:
        - serviceName: httpbin
          servicePort: 80
      plugins:
        - name: limit-req
          enable: true 
          config:
            rate: 1
            burst: 2
            key_type: var
            key: remote_addr
            rejected_code: 429
            rejected_msg: Requests are too frequent, please try again later.
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

#### 验证

要进行验证，请向路由发送三个请求：

```bash
resp=$(seq 3 | xargs -I{} curl -i "http://127.0.0.1:9080/ip" -o /dev/null -s -w "%{http_code}\n") && \
  count_200=$(echo "$resp" | grep "200" | wc -l) && \
  count_429=$(echo "$resp" | grep "429" | wc -l) && \
  echo "200 responses: $count_200 ; 429 responses: $count_429"
```

你可能会看到所有三个请求都成功了：

```bash
200 responses: 3 ; 429 responses: 0 
```

将插件配置中的 `burst` 更新为 `0`，然后向路由发送三个请求：

```bash
resp=$(seq 3 | xargs -I{} curl -i "http://127.0.0.1:9080/ip" -o /dev/null -s -w "%{http_code}\n") && \
  count_200=$(echo "$resp" | grep "200" | wc -l) && \
  count_429=$(echo "$resp" | grep "429" | wc -l) && \
  echo "200 responses: $count_200 ; 429 responses: $count_429"
```

你应该会看到类似于以下内容的响应，表明超过速率的请求已被拒绝：

```bash
200 responses: 1 ; 429 responses: 2
```

## 具有消费者的速率限制

以下示例演示了如何按常规和匿名消费者配置不同的速率限制策略，其中匿名消费者不需要身份验证并且配额较少。虽然此示例使用 `Key Auth 插件` 进行身份验证，但也可以使用 `Basic Auth 插件`、`JWT Auth 插件` 和 `HMAC Auth 插件` 配置匿名消费者。

### 新增普通消费者

创建一个具有 Key Authentication凭据的常规消费者 `Alice`，并将 `Limit Count 插件` 配置为允许在 60 秒窗口内使用 3 个配额：

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**消费者**。
2. 点击**新增消费者**。
3. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `Alice`。
   * 点击**新增**。
4. 在**凭据**选项卡下，点击**新增Key Authentication凭据**。
5. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `alice-key`。
   * 在**密钥**字段中，选择**手动输入**，然后输入 `alice-key`。
   * 如果你想选择**从Secret 提供商引用**，请参阅 [引用 HashiCorp Vault 中的密钥](./hashicorp-vault) 或 [引用 AWS Secrets Manager 中的密钥](./aws-secrets-manager)。
   * 点击**新增**。

6. 转到**插件**选项卡，点击**新增插件**。
7. 搜索 `limit-count` 插件，然后点击**新增**。
8. 在对话框中，执行以下操作：
   * 将以下配置新增到**JSON 编辑器**：

     ```json
     {
       "count": 3,
       "time_window": 60,
       "key_type": "var",
       "key": "remote_addr",
       "rejected_code": 429,
       "rejected_msg": "Too many requests",
       "policy": "local",
       "allow_degradation": false,
       "show_limit_quota_header": true
     }
     ```

   * 点击**新增**。

</TabItem>

<TabItem value="adc">

即将推出。

</TabItem>

<TabItem value="ingress">

Ingress Controller 目前不支持凭据和匿名消费者。

</TabItem>

</Tabs>

### 新增匿名消费者

创建一个匿名消费者 `anonymous` 并配置 `Limit Count 插件` 以允许在 60 秒窗口内使用 1 个配额：

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**消费者**。
2. 点击**新增消费者**。
3. 在对话框中，执行以下操作：
   * 在**名称**字段中，输入 `anonymous`。
   * 点击**新增**。
4. 转到**插件**选项卡，点击**新增插件**。
5. 搜索 `limit-count` 插件，然后点击**新增**。
6. 在对话框中，执行以下操作：
   * 将以下配置新增到**JSON 编辑器**：

     ```json
     {
       "count": 1,
       "time_window": 60,
       "key_type": "var",
       "key": "remote_addr",
       "rejected_code": 429,
       "rejected_msg": "Too many requests",
       "policy": "local",
       "allow_degradation": false,
       "show_limit_quota_header": true
     }
     ```

   * 点击**新增**。

</TabItem>

<TabItem value="adc">

暂不支持。

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 配置路由

创建路由并配置 `Key Auth 插件` 以允许匿名消费者 `anonymous` 绕过身份验证：

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后点击要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 在已发布的服务下，从侧边栏选择**路由**。
3. 选择你的目标路由，例如，`get-ip`。
4. 在**插件**字段中，点击**新增插件**。
5. 搜索 `key-auth` 插件，然后点击**新增**。
6. 在对话框中，执行以下操作：
   * 将以下配置新增到**JSON 编辑器**：

     ```json
     {
       "anonymous_consumer": "anonymous"
     }
     ```

   * 点击**新增**。

</TabItem>

<TabItem value="adc">

要使用 ADC 配置路由，请创建以下配置：

```yaml title="adc.yaml"
services:
  - name: httpbin
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
        name: get-ip
        methods:
          - GET
        plugins:
          key-auth:
            _meta:
              disable: false
            anonymous_consumer: anonymous
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 验证

要进行验证，请使用 `Alice` 的密钥发送五个连续的请求：

```shell
resp=$(seq 5 | xargs -I{} curl "http://127.0.0.1:9080/ip" -H 'apikey: alice-key' -o /dev/null -s -w "%{http_code}\n") && \
  count_200=$(echo "$resp" | grep "200" | wc -l) && \
  count_429=$(echo "$resp" | grep "429" | wc -l) && \
  echo "200": $count_200, "429": $count_429
```

你应该会看到以下响应，表明在 5 个请求中，有 3 个请求成功（状态码 200），而其他请求被拒绝（状态码 429）。

```text
200:    3, 429:    2
```

发送五个匿名请求：

```shell
resp=$(seq 5 | xargs -I{} curl "http://127.0.0.1:9080/ip" -o /dev/null -s -w "%{http_code}\n") && \
  count_200=$(echo "$resp" | grep "200" | wc -l) && \
  count_429=$(echo "$resp" | grep "429" | wc -l) && \
  echo "200": $count_200, "429": $count_429
```

你应该会看到以下响应，表明只有一个请求成功：

```text
200:    1, 429:    4
```

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services)
  * [路由](../key-concepts/routes)
  * [插件](../key-concepts/plugins)
  * [消费者](../key-concepts/consumers)
