---
title: 灰度流量
slug: /getting-started/canary-upstream
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

灰度流量功能可以让你使用一小部分流量安全地测试新的上游，同时将大部分流量保持在基准上游。

:::note

* 灰度流量不同于灰度发布，因为 API/服务的版本保持不变。灰度发布指的是同一个 API/服务同时有两个版本都在运行并可被调用。

:::

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 在网关组上发布一个服务。

## 按百分比切分流量

在本例中，你将把 10% 的流量引导到一个灰度上游。其余 90% 将继续转发到基准上游。在新的灰度上游经过测试后，所有流量都可以路由到灰度上游，它将成为新的基准上游。然后可以删除旧的基准上游。灰度流量规则适用于服务中的所有路由，不能应用于单个路由。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后单击要灰度的服务，例如，版本为 `1.0.0` 的 `httpbin API`。
2. 在服务下，从侧边栏选择**上游**。
3. 在**灰度规则**区域，点击**开始灰度**。
4. 在表单中执行以下操作：
   * 关闭 **条件** 开关。
   * **权重** 填写 `10`。
   * 点击 **下一步**。
5. **选择或创建灰度上游** 选择 `创建一个新的上游`。
   * 将新上游的名称修改为 `newupstream`。
   * 调整节点的主机以指向新的后端。例如，使用 `mock.api7.ai` 作为主机，`80` 作为端口。
   * 保持其他属性与基准上游相同。
   * 点击**下一步**。
6. 确认显示的信息并点击 **开始**。灰度规则将立即生效。
7. 通过发送 10 个请求来验证灰度规则：

  ```bash
   for i in {1..10}; do "curl 127.0.0.1:9080/headers";  done
   ```

   其中大约 9 次请求会被转发到基准上游的地址 `httpbin.org`，然后你应该能收到如下类似的响应：

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

8. 在**灰度规则**区域，点击**编辑**。
9. 在表单中，执行以下操作：
  * 将权重调整为 50%。
  * 点击**编辑**。
10. 发送更多 API 请求，测试灰度上游，直到它达到你的业务预期。
11. 在**灰度规则**区域，点击**结束**。
12. 在表单中执行以下操作：
  * **基准上游** 选择 `灰度上游：newupstream`。
  * 打开 **删除未选择的上游** 开关。
  * 点击**完成**。

</TabItem>

<TabItem value="adc">

更新你的 ADC 配置文件（`adc.yaml`）以包含灰度上游。完整的配置如下所示：


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

其中大约 9 次请求会被转发到基准上游的地址 `httpbin.org`，然后你应该能收到如下类似的响应：

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

发送更多请求以测试灰度上游，直到它达到你的业务预期。最后，使用当前上游更新旧上游，完成灰度流量转移：

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

你也可以将旧的上游保留为权重为 `0` 的灰度上游，以便在新上游出现问题时回滚。

</TabItem>
</Tabs>

## 按请求头转移流量

在本例中，你将把带有请求头 `version = test` 的请求引导到灰度上游，而其余流量将继续流向基准上游。灰度规则适用于服务中的所有路由，不能应用于单个路由。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
]}>
<TabItem value="dashboard">

1. 从侧边栏选择网关组的 **已发布服务**，然后点击要灰度的服务，例如，版本为 `1.0.0` 的 `httpbin API`。
2. 在服务下，从侧边栏选择 **上游**。
3. 在 **灰度规则** 区域中，点击 **开始灰度**。
4. 在表单中执行以下操作：
  * 打开 **条件** 开关。
  * 填写 header 条件为 `header` `version == test`。
  * **权重** 填写 `100`。
  * 点击 **下一步**。
5. **选择或创建灰度上游** 选择 `创建一个新的上游`。
   * 将新上游的名称修改为 `newupstream`。
   * 调整节点的主机以指向新的后端。例如，使用 `mock.api7.ai` 作为主机，`80` 作为端口。
   * 保持其他属性与基准上游相同。
   * 点击**下一步**。
6. 确认显示的信息并点击 **开始**。灰度规则将立即生效。
7. 通过发送多个请求来验证灰度规则：

  发送一个带有正确请求头的请求：

  ```bash
   curl 127.0.0.1:9080/headers -H "version:test"
   ```
   你应该能收到来自灰度上游的如下类似的响应：

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
   
   你应该能收到来自基准上游的如下类似的响应：

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

  你应该能收到来自基准上游的如下类似的响应：

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

8. 发送更多请求以测试灰度上游，直到其符合你的期望。
9. 在**灰度规则**区域，点击**完成**。
10. 在表单中执行以下操作：
    * **基准上游** 选择`灰度上游: newupstream`。
    * 关闭 **删除未选中的上游**开关。
    * 点击 **完成**。

</TabItem>

<TabItem value="adc">

更新你的 ADC 配置文件 (`adc.yaml`) 以包含灰度上游。完整的配置如下所示：

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
   你应该能收到来自灰度上游的如下类似的响应：

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
   
   你应该能收到来自基准上游的如下类似的响应：

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

  你应该能收到来自基准上游的如下类似的响应：

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

使用当前上游更新旧上游，完成灰度流量转移：

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

你也可以将旧的上游保留为权重为 `0` 的灰度上游，以便在新上游出现问题时回滚。

</TabItem>
</Tabs>

## 相关阅读

- 核心概念
  - [服务](../key-concepts/services.md)
  - [上游](../key-concepts/upstreams.md)
  