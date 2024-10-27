---
title: 设置 API 身份认证
slug: /api-security/api-authentication
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

为了安全起见，你应该只允许经过身份认证和授权的[消费者](../key-concepts/consumers)访问你的 API。API7 网关提供了多种插件来启用身份认证和授权。

在服务上启用的身份认证插件就像给 API 上的锁，而消费者凭据则是解锁它们的钥匙。在 API7 网关中，你需要一个唯一的用户名和至少一个认证凭据来设置消费者。

消费者可以使用多种不同类型的认证凭据，所有认证凭据在身份认证方面都被视为平等的。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee)。
2. [在网关组上运行 API](../getting-started/launch-your-first-api)。

:::note

避免在同一服务/路由上配置多个身份认证插件，以防止冲突。

:::

## 为 API 启用 Key Authentication

### 针对服务

要在服务中的所有路由上使用 Key Authentication，请在服务上启用 `Key Auth 插件`。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 从侧边栏选择**插件**，然后点击**启用插件**。
3. 搜索 `key-auth` 插件，然后点击**启用**。
4. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新服务配置以使用 Key Authentication：

```yaml title="adc-service.yaml"
services:
  - name: httpbin
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    plugins:
      key-auth:
        _meta:
          disable: false
    routes:
      - uris:
          - /ip
        name: get-ip
        methods:
          - GET
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml -f adc-service.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 针对单个路由

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

要对特定路由使用 Key Authentication，请在路由上启用 `Key Auth 插件`，而不是在服务上启用。

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 在已发布的服务下，从侧边栏选择**路由**。
3. 选择你的目标路由，例如，`get-ip`。
4. **插件**，点击**启用插件**。
5. 搜索 `key-auth` 插件，然后点击**启用**。
6. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新路由配置以使用Key Authentication：

```yaml title="adc-route.yaml"
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
```

将配置同步到 API7 网关：

```shell
adc sync -f adc-consumer.yaml -f adc-route.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

创建一个启用了 Key Authentication 的路由的 Kubernetes mainfest文件：

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
      authentication:
        enable: true
        type: keyAuth
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

### 验证Key Authentication

按照[配置Key Authentication凭据](../api-consumption/manage-consumer-credentials#configure-key-authentication-credentials)创建具有Key Authentication凭据的消费者。

然后按照以下步骤验证Key Authentication。

1. 发送不带 `apikey` 请求头的请求：

```bash
curl -i "http://127.0.0.1:9080/ip"
```

由于未提供密钥，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Missing API key found in request"}
```

2. 在 `apikey` 请求头中发送带有错误密钥的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: wrongkey"
```

由于密钥错误，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Invalid API key in request"}
```

3. 在 `apikey` 请求头中发送带有正确密钥的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "apikey: alice-primary-key"
```

使用正确的密钥发送请求，你将收到一个 `HTTP/1.1 200 OK` 响应。

```markdown
## 为 API 启用Basic Authentication

### 针对服务

要在服务中的所有路由上使用Basic Authentication，请在服务上启用 [Basic Auth 插件](/hub/basic-auth)。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 从侧边栏选择**插件**，然后点击**启用插件**。
3. 搜索 `basic-auth` 插件，然后点击**启用**。
4. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新服务配置以使用Basic Authentication：

```yaml title="adc-service.yaml"
services:
  - name: httpbin
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    plugins:
      basic-auth:
        _meta:
          disable: false
    routes:
      - uris:
          - /ip
        name: get-ip
        methods:
          - GET
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml -f adc-service.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 针对单个路由

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

要对特定路由使用 Basic Authentication，请在路由上启用 `Basic Auth 插件`，而不是在服务上启用。

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 在已发布的服务下，从侧边栏选择**路由**。
3. 选择你的目标路由，例如，`get-ip`。
4. **插件**，点击**启用插件**。
5. 搜索 `basic-auth` 插件，然后点击**启用**。
6. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新路由配置- name: httpbin
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
          basic-auth:
            _meta:
              disable: false
```

将配置同步到 API7 网关：

```shell
adc sync -f adc-consumer.yaml -f adc-route.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

创建一个启用了 Basic Authentication 的路由的 Kubernetes mainfest 文件：

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
      authentication:
        enable: true
        type: basicAuth
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

### 验证 Basic Authentication

按照[配置Basic Authentication 凭据](../api-consumption/manage-consumer-credentials#configure-basic-authentication-credentials)创建具有 Basic Authentication 凭据的消费者。

请按照以下步骤验证 Basic Authentication。

1. 发送不带 Basic Authentication 凭据的请求：

```bash
curl -i "http://127.0.0.1:9080/ip"  
```

由于未提供凭据，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Missing authorization in request"}
```

2. 发送带有无效 Basic Authentication凭 据（用户名密码不匹配，或用户名不存在）的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -u alice:wrong-password
```

由于密码与任何消费者凭据都不匹配，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Invalid user authorization"}
```

3. 发送带有正确 Basic Authentication 凭据的请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -u alice:alice-password 
```

使用正确的凭据发送请求，你将收到一个 `HTTP/1.1 200 OK` 响应。

## 为 API 启用 JWT 认证

### 针对服务

要在服务中的所有路由上使用 JWT 认证，请在服务上启用 `JWT Auth 插件`。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 从侧边栏选择**插件**，然后点击**启用插件**。
3. 搜索 `jwt-auth` 插件，然后点击**启用**。
4. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新服务配置以使用 Basic Authentication：

```yaml title- name: httpbin
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    plugins:
      jwt-auth:
        _meta:
          disable: false
    routes:
      - uris:
          - /ip
        name: get-ip
        methods:
          - GET
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml -f adc-service.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

暂不支持。

</TabItem>

</Tabs>

### 针对单个路由

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

要对特定路由使用 JWT 认证，请在路由上启用 `JWT Auth 插件`，而不是在服务上启用。

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 在已发布的服务下，从侧边栏选择**路由**。
3. 选择你的目标路由，例如，`get-ip`。
4. **插件**，点击**启用插件**。
5. 搜索 `jwt-auth` 插件，然后点击**启用**。
6. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新路由配置以使用 JWT 认证：

```yaml title="adc-route.yaml"
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
          jwt-auth:
            _meta:
              disable: false
```

将配置同步到 API7 网关：

```shell
adc sync -f adc-consumer.yaml -f adc-route.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

创建一个启用了 JWT 认证的路由的 Kubernetes mainfest文件：

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
      authentication:
        enable: true
        type: jwtAuth
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

### 暴露 JWT 签名端点

这是在 API7 企业版中暴露 JWT 签名端点的准备步骤。如果你使用的是对称算法（例如 HS256（默认）或 HS512），其中 API7 企业版既是 JWT 签发者又是验证者，则此步骤是强制性的。如果你使用的是非对称算法（例如 RS256 或 ES256），则此步骤是可选的，因为签发者和验证者可以是不同的两方。

`jwt-auth 插件`会在 `/apisix/plugin/jwt/sign` 创建一个内部端点来签署 JWT。使用 `Public API 插件` 暴露该端点：

1. 添加一个名为 `jwt-auth-api` 的已发布服务，以及一个名称为 `jwt-auth-api` 且路径为 `/api7/plugin/jwt/sign` 的路由。
2. 从侧边栏选择**插件**，然后点击**启用插件**。
3. 搜索 `public-api` 插件，然后点击**启用**。
4. 在对话框中执行以下操作：
   * 将一个空配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

### 验证 JWT 认证

按照[配置 JWT 认证凭据](../api-consumption/manage-consumer-credentials#configure-varied-authentication-credentials)创建具有 JWT 凭据的消费者。

请按照以下步骤验证 JWT 认证。

1. 发送不带凭据的请求：

```bash
curl -i "http://127.0.0.1:9080/ip"  
```

由于未提供凭据，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Missing authorization in request"}
```

2. 使用消费者 JWT 凭据中的 `key` 获取 JWT 令牌：

```bash
jwt_token=$(curl -s "http://127.0.0.1:9080/apisix/plugin/jwt/sign?key=john-jwt-key") && echo $jwt_token
```

3. 在请求头中携带 `jwt_token` 向你的 API 发送请求：

```bash
curl -i "http://127.0.0.1:9080/ip" -H "Authorization: ${jwt_token}"
```

使用正确的凭据发送请求，你将收到一个 `HTTP/1.1 200 OK` 响应。

30 秒后，令牌应该会过期。使用相同的令牌发送请求以进行验证，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"failed to verify jwt"}
```

## 为 API 启用 HMAC 认证

### 针对服务

要在服务中的所有路由上使用 HMAC 认证，请在服务上启用 `HMAC Auth 插件`。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 从侧边栏选择**插件**，然后点击**启用插件**。
3. 搜索 `hmac-auth` 插件，然后点击**启用**。
4. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新服务配置以使用 Basic Authentication：

```yaml title="adc-service.yaml"
services:
  - name: httpbin
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    plugins:
      jwt-auth:
        _meta:
          disable: false
    routes:
      - uris:
          - /ip
        name: get-ip
        methods:
          - GET
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc-consumer.yaml -f adc-service.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

ApisixService 自定义资源尚不可用。

[//]: <TODO: update this section when ApisixService is available>

</TabItem>

</Tabs>

### 针对单个路由

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

要对特定路由使用 HMAC 认证，请在路由上启用 [HMAC Auth 插件](/hub/hmac-auth)，而不是在服务上启用。

1. 从侧边栏选择网关组的**已发布服务**，然后选择要修改的服务，例如，版本为 `1.0.0` 的 `httpbin`。
2. 在已发布的服务下，从侧边栏选择**路由**。
3. 选择你的目标路由，例如，`get-ip`。
4. **插件**，点击**启用插件**。
5. 搜索 `hmac-auth` 插件，然后点击**启用**。
6. 在对话框中执行以下操作：
   * 将以下配置添加到**JSON 编辑器**：

     ```json
     {
     }
     ```

   * 点击**启用**。

</TabItem>

<TabItem value="adc">

更新路由配置以使用 HMAC 认证：

```yaml title="adc-route.yaml"
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
          jwt-auth:
            _meta:
              disable: false
```

将配置同步到 API7 网关：

```shell
adc sync -f adc-consumer.yaml -f adc-route.yaml
```

:::note

ADC 使用配置文件作为单一事实来源。因此，请确保将消费者和服务配置文件都传递给 `adc sync` 命令，以使两种配置都生效。

:::

</TabItem>

<TabItem value="ingress">

创建一个启用了 HMAC 认证的路由的 Kubernetes mainfest文件：

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
      authentication:
        enable: true
        type: hmacAuth
```

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

### 验证 HMAC 认证

按照[配置 HMAC 认证凭据](../api-consumption/manage-consumer-credentials#configure-varied-authentication-credentials)创建具有 HMAC 凭据的消费者。

请按照以下步骤验证 HMAC 认证。

1. 生成签名

你可以使用以下 Python 代码段或你选择的其他堆栈：

```python title="hmac-sig-header-gen.py"
import hmac
import hashlib
import base64
from datetime import datetime, timezone
key_id = "john-key"                # 密钥 ID
secret_key = b"john-hmac-key"      # 密钥
request_method = "GET"             # HTTP 方法
request_path = "/headers"          # 路由 URI
algorithm= "hmac-sha256"           # 可以使用 allowed_algorithms 中的其他算法
# 获取 GMT 当前日期时间
# 注意：签名将在时钟偏差（默认 300 秒）后失效
# 你可以在签名失效后重新生成签名，或者增加时钟偏差以延长有效期，但建议在安全边界内
gmt_time = datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')
# 构造签名字符串（有序）
# 日期和任何后续的自定义请求头应小写，并用单个空格字符分隔，即 `<key>:<space><value>`
# [https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-12#section-2.1.6](https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-12#section-2.1.6)
signing_string = (
  f"{key_id}\n"
  f"{request_method} {request_path}\n"
  f"date: {gmt_time}\n"
)

# 创建签名
signature = hmac.new(secret_key, signing_string.encode('utf-8'), hashlib.sha256).digest()
signature_base64 = base64.b64encode(signature).decode('utf-8')

# 构造请求请求头
headers = {
  "Date": gmt_time,
  "Authorization": (
    f'Signature keyId="{key_id}",algorithm="{algorithm}",'
    f'headers="@request-target date",'
    f'signature="{signature_base64}"'
  )
}

# 打印请求头
print(headers)
```

运行脚本：

```shell
python3 hmac-sig-header-gen.py
```

2. 发送不带请求头的请求：

```bash
curl -i "http://127.0.0.1:9080/ip"  
```

由于未提供凭据，你将收到一个 `HTTP/1.1 401 Unauthorized` 响应，其请求正文如下：

```text
{"message":"Missing authorization in request"}
```

```markdown
3. 使用请求头向你的 API 发送请求：

```bash
curl -X GET "http://127.0.0.1:9080/ip" \
  -H "Date: Fri, 06 Sep 2024 06:41:29 GMT" \
  -H 'Authorization: Signature keyId="alice-keyid",algorithm="hmac-sha256",headers="@request-target date",signature="wWfKQvPDr0wHQ4IHdluB4IzeNZcj0bGJs2wvoCOT5rM="'
```

使用正确的凭据发送请求，你将收到一个类似于以下内容的 `HTTP/1.1 200 OK` 响应：

```json
{
  "headers":{
    "Accept": "*/*",
    "Authorization": "Signature keyId=\"john-key\",aigorithm=\'hmac-sha256\",headers=\"@reques
    t-target date\", signature=\'HtQm1m8kGvnVlztZ59)XokweovFqQN04Ui6P6NfzjRr4=\'"
    "Date": "Tue, 24 Sep 2024 10:28:41 GMT",
    "Host": "127.0.0.1",
    "User-Agent":"curl/8.7.1",
    "X-Amzn-Trace-Id": "Root=1-66f29481-7355340a05778cbb21e9b25a",
    "X-Consumer-Username": "John",
    "X-Credential-Identifier": "4130bb4a-0fdc-461d-be8d-2bba8a1e36dc",
    "X-Forwarded-Host": "127.0.0.1"
}
}
```

## 扩展阅读

* 关键概念
  * [服务](../key-concepts/services) 
  * [路由](../key-concepts/routes)
  * [插件](../key-concepts/plugins)
* API 使用
  * [管理消费者凭据](../api-consumption/manage-consumer-credentials)
  * [应用基于列表的访问控制](../api-consumption/consumer-restriction)
