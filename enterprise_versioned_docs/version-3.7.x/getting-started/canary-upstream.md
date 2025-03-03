---
title: 灰度流量
slug: /getting-started/canary-upstream
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

灰度流量功能可以让你使用一小部分流量安全地测试新的上游，同时将大部分流量保持在默认上游。

:::note

* 灰度流量不同于灰度发布，因为 API/服务的版本保持不变。灰度发布指的是同一个 API/服务同时有两个版本都在运行并可被调用。

:::

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。

## 按百分比切分流量

在这个示例中，你将把 10% 的流量引导到一个新的上游。其余 90% 将继续转发到默认上游。测试新的上游后，请考虑使用新值重写默认上游配置，并删除插件以停止灰度过程。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. 从侧边导航栏中选择网关组的 **已发布服务**，然后单击要修改的服务，例如版本为 `1.0.0` 的 `httpbin`。
2. 在已发布服务下，从侧边导航栏中选择 **上游**。
3. 在 **连接配置** 模块中，单击 **编辑**，选择 `使用节点主机`，然后单击 **保存**。
   > 注意：由于 `mock.api7.ai` 强制执行 HTTPS 访问，因此上游需要配置为使用端口 `443` 才能访问 HTTPS 端点。请根据您的使用情况相应地调整 `pass_host` 参数。
4. 单击 **添加上游**。
5. 在对话框中，执行以下操作：
   * 在 **上游名称** 字段中，输入 `newupstream`。
   * 单击 **添加节点** 以调整节点的主机指向新后端。例如，使用 `mock.api7.ai` 作为主机和 `443` 作为端口。
   * 单击 **添加**。
6. 单击上游标题（在 **操作** 按钮下）中的 **查看 ID** 并复制以供使用。
7. 在已发布服务下，从侧边导航栏中选择 **插件**。
8. 单击 **新增插件**。
9. 搜索 `traffic-split` 插件，然后单击 **新增**。
10. 在对话框中，执行以下操作：

* 将以下配置输入到 **JSON Editor**:

    ```json
    {
      "rules": [
                {
                    "weighted_upstreams": [
                        {
                            "upstream_id": new_upstream_id,    // Use upstream id, not upstream name
                            "weight": 1
                        },
                        {
                            "weight": 9
                        }
                    ]
                }
            ]
    }
    ```

* 点击 **新增**。

### 验证

通过发送 10 个请求来验证灰度规则：

  ```bash
   for i in {1..10}; do "curl 127.0.0.1:9080/headers";  done
   ```

   其中大约 9 次请求会被转发到默认上游的地址 `httpbin.org`，然后你应该能收到如下类似的响应：

   ```json
   {
     "headers": {
       "Accept": "*/*",
       "Host": "httpbin.org",
       "User-Agent": "curl/7.74.0",
       "X-Amzn-Trace-Id": "Root=1-6650ab7e-32c90eba787abbeb4e3dbb0c",
       "X-Forwarded-Host": "127.0.0.1"
     }
   }
   ```

   剩下 1 次请求会被转发到新上游的地址`mock.api7.ai`：

   ```json
   {
     "headers": {
       "accept": "*/*",
       "accept-encoding": "gzip, br",
       "cf-connecting-ip": "159.89.160.194",
       "cf-ipcountry": "IN",
       "cf-ray": "888e28733f9604aa",
       "cf-visitor": "{\"scheme\":\"https\"}",
       "connection": "Keep-Alive",
       "content-type": "application/json",
       "host": "mock.api7.ai",
       "user-agent": "curl/7.74.0",
       "x-application-owner": "API7.ai",
       "x-forwarded-for": "127.0.0.1",
       "x-forwarded-host": "127.0.0.1",
       "x-forwarded-port": "9080",
       "x-forwarded-proto": "https",
       "x-real-ip": "159.89.160.194",
       "X-Application-Owner": "API7.ai",
       "Content-Type": "application/json"
     }
   }
   ```

</TabItem>

<TabItem value="adc">

更新你的 ADC 配置文件（`adc.yaml`）以包含新上游。完整的配置如下所示：


```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: Test Group
      scheme: https
      nodes:
        - host: httpbin.org
          port: 443
          weight: 100
    plugins:
      api7-traffic-split:
        rules:
          - canary_upstreams:
              - upstream_name: newupstream
                weight: 10
              - weight: 90
        upstreams:
          - name: newupstream
            nodes:
              - host: mock.api7.ai
                port: 443
                weight: 100
            scheme: https
    routes:
      - uris:
          - /headers
        name: getting-started-headers
        methods:
          - GET
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

发送 10 次请求以验证灰度上游：

```bash
for i in {1..10}; do curl "127.0.0.1:9080/headers";  done
```

其中大约 9 次请求会被转发到默认上游的地址 `httpbin.org`，然后你应该能收到如下类似的响应：

```json
{
 "headers": {
   "Accept": "*/*",
   "Host": "httpbin.org",
   "User-Agent": "curl/7.74.0",
   "X-Amzn-Trace-Id": "Root=1-6650ab7e-32c90eba787abbeb4e3dbb0c",
   "X-Forwarded-Host": "127.0.0.1"
 }
}
```

剩下 1 次请求会被转发到灰度上游的地址`mock.api7.ai`：

```json
{
 "headers": {
   "accept": "*/*",
   "accept-encoding": "gzip, br",
   "cf-connecting-ip": "159.89.160.194",
   "cf-ipcountry": "IN",
   "cf-ray": "888e28733f9604aa",
   "cf-visitor": "{\"scheme\":\"https\"}",
   "connection": "Keep-Alive",
   "content-type": "application/json",
   "host": "mock.api7.ai",
   "user-agent": "curl/7.74.0",
   "x-application-owner": "API7.ai",
   "x-forwarded-for": "127.0.0.1",
   "x-forwarded-host": "127.0.0.1",
   "x-forwarded-port": "9080",
   "x-forwarded-proto": "https",
   "x-real-ip": "159.89.160.194",
   "X-Application-Owner": "API7.ai",
   "Content-Type": "application/json"
 }
}
```

现在，将权重更新为 `50:50`，以允许一半的流量路由到灰度上游：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: Test Group
      scheme: https
      nodes:
        - host: httpbin.org
          port: 443
          weight: 100
    plugins:
      api7-traffic-split:
        rules:
          - canary_upstreams:
              - upstream_name: newupstream
                weight: 50
              - weight: 50
        upstreams:
          - name: newupstream
            nodes:
              - host: mock.api7.ai
                port: 443
                weight: 100
            scheme: https
    routes:
      - uris:
          - /headers
        name: getting-started-headers
        methods:
          - GET
```

发送更多请求以测试灰度上游，直到它达到你的业务预期。最后，使用当前上游的值更新默认上游，完成灰度流量转移：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: Test Group
      scheme: https
      nodes:
        - host: mock.api7.ai
          port: 443
          weight: 100
    routes:
      - uris:
          - /headers
        name: getting-started-headers
        methods:
          - GET
```

</TabItem>
</Tabs>

## 按请求头转移流量

在本例中，你将把带有请求头 `version = test` 的请求引导到新上游，而其余流量将继续流向默认上游。灰度规则适用于服务中的所有路由，不能应用于单个路由。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. 从侧边导航栏中选择网关组的 **已发布服务**，然后单击要修改的服务，例如版本为 `1.0.0` 的 `httpbin`。
2. 在已发布服务下，从侧边导航栏中选择 **上游**。
3. 在 **连接配置** 模块中，单击 **编辑**，选择 `使用节点主机`，然后单击 **保存**。
   > 注意：由于 `mock.api7.ai` 强制执行 HTTPS 访问，因此上游需要配置为使用端口 `443` 才能访问 HTTPS 端点。请根据您的使用情况相应地调整 `pass_host` 参数。
4. 单击 **添加上游**。
5. 在对话框中，执行以下操作：
   * 在 **上游名称** 字段中，输入 `newupstream`。
   * 单击 **添加节点** 以调整节点的主机指向新后端。例如，使用 `mock.api7.ai` 作为主机和 `443` 作为端口。
   * 单击 **添加**。
6. 单击上游标题（在 **操作** 按钮下）中的 **查看 ID** 并复制以供使用。
7. 在已发布服务下，从侧边导航栏中选择 **插件**。
8. 单击 **新增插件**。
9. 搜索 `traffic-split` 插件，然后单击 **新增**。
10. 在对话框中，执行以下操作：

* 将以下配置输入到 **JSON Editor**:

    ```json
    {
      "rules": [
        {
            "match": [
              {
                "vars": [
                  ["version","==","test"]
                ]
              }
            ],
            "weighted_upstreams": [
                {
                    "upstream_id": new_upstream_id,    // Use upstream id, not upstream name
                    "weight": 1
                },
                {
                     "weight": 9
                }
            ]
        }
    ]
    }
    ```

* 点击 **新增**。

### 验证

通过发送多个请求来验证灰度规则：

  发送一个带有正确请求头的请求：

  ```bash
   curl 127.0.0.1:9080/headers -H "version:test"
   ```
   你应该能收到来自新上游的如下类似的响应：

   ```json
   {
     "headers": {
       "accept": "*/*",
       "accept-encoding": "gzip, br",
       "cf-connecting-ip": "159.89.160.194",
       "cf-ipcountry": "IN",
       "cf-ray": "888e28733f9604aa",
       "cf-visitor": "{\"scheme\":\"https\"}",
       "connection": "Keep-Alive",
       "content-type": "application/json",
       "host": "mock.api7.ai",
       "user-agent": "curl/7.74.0",
       "x-application-owner": "API7.ai",
       "x-forwarded-for": "127.0.0.1",
       "x-forwarded-host": "127.0.0.1",
       "x-forwarded-port": "9080",
       "x-forwarded-proto": "https",
       "x-real-ip": "159.89.160.194",
       "X-Application-Owner": "API7.ai",
       "Content-Type": "application/json"
     }
   }
   ```
   
   发送一个带有错误请求头的请求：

   ```bash
   curl 127.0.0.1:9080/headers -H "version:new"
   ```
   
   你应该能收到来自默认上游的如下类似的响应：

   ```json
   {
     "headers": {
       "Accept": "*/*",
       "Host": "httpbin.org",
       "User-Agent": "curl/7.74.0",
       "X-Amzn-Trace-Id": "Root=1-6650ab7e-32c90eba787abbeb4e3dbb0c",
       "X-Forwarded-Host": "127.0.0.1"
     }
   }
   ```

   发送一个不带请求头的请求：

   ```bash
   curl 127.0.0.1:9080/headers
   ```

  你应该能收到来自默认上游的如下类似的响应：

   ```json
   {
     "headers": {
       "Accept": "*/*",
       "Host": "httpbin.org",
       "User-Agent": "curl/7.74.0",
       "X-Amzn-Trace-Id": "Root=1-6650ab7e-32c90eba787abbeb4e3dbb0c",
       "X-Forwarded-Host": "127.0.0.1"
     }
   }
   ```

</TabItem>

<TabItem value="adc">

更新你的 ADC 配置文件 (`adc.yaml`) 以包含新上游。完整的配置如下所示：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: default
      scheme: https
      nodes:
        - host: httpbin.org
          port: 443
          weight: 100
    plugins:
      api7-traffic-split:
        rules:
          - canary_upstreams:
              - upstream_name: newupstream
                weight: 100
            match:
              - exprs:
                  - - http_version
                    - ==
                    - test
        upstreams:
          - name: newupstream
            nodes:
              - host: mock.api7.ai
                port: 443
                weight: 100
            scheme: https
    routes:
      - uris:
          - /headers
        name: getting-started-headers
        methods:
          - GET
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

发送一个带有正确请求头的请求：

  ```bash
   curl 127.0.0.1:9080/headers -H "version:test"
   ```
   你应该能收到来自新上游的如下类似的响应：

   ```json
   {
     "headers": {
       "accept": "*/*",
       "accept-encoding": "gzip, br",
       "cf-connecting-ip": "159.89.160.194",
       "cf-ipcountry": "IN",
       "cf-ray": "888e28733f9604aa",
       "cf-visitor": "{\"scheme\":\"https\"}",
       "connection": "Keep-Alive",
       "content-type": "application/json",
       "host": "mock.api7.ai",
       "user-agent": "curl/7.74.0",
       "x-application-owner": "API7.ai",
       "x-forwarded-for": "127.0.0.1",
       "x-forwarded-host": "127.0.0.1",
       "x-forwarded-port": "9080",
       "x-forwarded-proto": "https",
       "x-real-ip": "159.89.160.194",
       "X-Application-Owner": "API7.ai",
       "Content-Type": "application/json"
     }
   }
   ```
   
   发送一个带有错误请求头的请求：

   ```bash
   curl 127.0.0.1:9080/headers -H "version:new"
   ```
   
   你应该能收到来自默认上游的如下类似的响应：

   ```json
   {
     "headers": {
       "Accept": "*/*",
       "Host": "httpbin.org",
       "User-Agent": "curl/7.74.0",
       "X-Amzn-Trace-Id": "Root=1-6650ab7e-32c90eba787abbeb4e3dbb0c",
       "X-Forwarded-Host": "127.0.0.1"
     }
   }
   ```

   发送一个不带请求头的请求：

   ```bash
   curl 127.0.0.1:9080/headers
   ```

  你应该能收到来自默认上游的如下类似的响应：

   ```json
   {
     "headers": {
       "Accept": "*/*",
       "Host": "httpbin.org",
       "User-Agent": "curl/7.74.0",
       "X-Amzn-Trace-Id": "Root=1-6650ab7e-32c90eba787abbeb4e3dbb0c",
       "X-Forwarded-Host": "127.0.0.1"
     }
   }
   ```

使用当前上游的值更新默认上游，完成灰度流量转移：

```yaml title="adc.yaml"
services:
  - name: httpbin API
    upstream:
      name: Test Group
      scheme: https
      nodes:
        - host: mock.api7.ai
          port: 443
          weight: 100
    routes:
      - uris:
          - /headers
        name: getting-started-headers
        methods:
          - GET
```

</TabItem>
</Tabs>

## 相关阅读

* 核心概念
  * [服务](../key-concepts/services.md)
  * [上游](../key-concepts/upstreams.md)
  