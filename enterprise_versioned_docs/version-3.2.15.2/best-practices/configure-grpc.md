---
title: 使用 API7 企业版代理 gRPC 服务
slug: /best-practices/configure-grpc
---

Google Remote Procedure Call（gRPC）是基于 HTTP/2 协议的开源高性能远程过程调用（Remote Procedure Call，RPC）框架。gRPC 使用 Protocol Buffers（protobuf）作为接口描述语言（Interface Description Language，IDL）。API7 企业版提供协议转换、负载均衡、身份验证和授权等关键功能，增强了 gRPC 的潜力。

本指南介绍如何使用 API7 企业版代理 gRPC 服务。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [安装 gRPCurl](https://github.com/fullstorydev/grpcurl)，将请求发送到 gRPC 服务器进行验证。

## 部署示例 gRPC 服务器

<Tabs
groupId="platform"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'k8s'},
]}>

<TabItem value="docker">

API7 提供了一个 gRPC 服务示例，用于测试。你可以使用以下命令在端口 `50051` 上启动示例 gRPC 服务器的 Docker 实例 `grpc-service`：

```shell
docker run -d \
  --name grpc-service \
  --network=api7-ee_api7 \
  -p 50051:50051 \
  --restart always api7/grpc-server-example:1.0.0
```

</TabItem>

<TabItem value="k8s">

Start an example gRPC server listening on port `50051`:

```shell
kubectl run grpc-service \
  --image=api7/grpc-server-example:1.0.0 \
  --port=50051 \
  --restart=Always
```

你应该能看到类似 `pod/grpc-service created` 的响应。

</TabItem>

</Tabs>
  
### 验证 gRPC 服务器是否启动成功

<Tabs
groupId="platform"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'k8s'},
]}>

<TabItem value="docker">

<!-- leave this section empty -->

</TabItem>

<TabItem value="k8s">

暴露应用的 `50051` 端口：

```shell
kubectl expose pod grpc-service --port 50051
```

你应该看到类似 `service/grpc-service exposed` 的响应。

将端口`50051` 转发到 localhost：

```shell
kubectl port-forward svc/grpc-service 50051:50051 &
```

</TabItem>

</Tabs>

通过列出所有可用的 gRPC 服务和方法来验证 gRPC 服务器是否成功启动：

```bash
grpcurl -plaintext 127.0.0.1:50051 list
```

你应该能看到以下输出：

```text
grpc.reflection.v1alpha.ServerReflection
helloworld.Greeter
helloworld.TestImport
```

列出所有 `helloworld.Greeter` 服务可用的方法:


```bash
grpcurl -plaintext 127.0.0.1:50051 list helloworld.Greeter
```

你应该能看到以下输出：

```text
helloworld.Greeter.GetErrResp
helloworld.Greeter.Plus
helloworld.Greeter.SayHello
helloworld.Greeter.SayHelloAfterDelay
helloworld.Greeter.SayHelloBidirectionalStream
helloworld.Greeter.SayHelloClientStream
helloworld.Greeter.SayHelloServerStream
```
## 创建服务和路由

本示例创建一个名为 `grpc-example` 的服务和一个名为 `helloworld.Greeter` 的路由，将请求转发到上面的示例 gRPC 服务。

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

<h3>新增服务</h3>

1. 在左侧菜单选择目标网关组下的 **已发布服务** 菜单，然后点击 **新增服务**。 
2. 选择 **手动新增**。
3. 在对话框中执行以下操作：

* **名称** 填写 `grpc-example`。
* **服务类型** 选择 `HTTP （七层）`。 
* **上游 Scheme** 选择 `gRPC`。
* **如何找到上游** 选择 `使用节点`。
* 点击 **新增节点**。
* 在新增节点对话框中，执行以下操作：
  * **主机** 填写你的私有 IP 地址，例如`192.168.2.103`。
  * **端口** 填写 `50051`。
  * **权重** 填写 `100`。

4. 点击 **新增**。 

<h3>创建一条路由</h3>

1. 进入刚才创建好的服务，然后点击 **新增路由**。
2. 在对话框中，执行以下操作：

* **名称** 填写 `helloworld.Greeter`。
* **路径** 填写 `helloworld.Greeter/SayHello`。
* **HTTP 方法** 选择 `GET` 和 `POST`。
* 点击 **新增**。

</TabItem>

<TabItem value="adc">

创建一个 ADC 配置文件:

```yaml title="adc.yaml"
services:
  - name: grpc-example
    upstream:
      name: gRPC Upstream
      scheme: grpc
      type: roundrobin
      nodes:
        - host: 192.168.2.103
          port: 50051
          weight: 100
    routes:
      - uris:
          - /helloworld.Greeter/SayHello
        name: helloworld.Greeter
        methods:
          - GET
          - POST
```

将配置同步到 API7 网关：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

使用 ApisixRoute 自定义资源创建一个 Kubernetes mainfest 文件来配置到 gRPC 服务的路由：

```yaml title="grpc-route.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: grpc-route
  # namespace: api7    # replace with your namespace
spec:
  http:
    - name: helloworld-greeter
      match:
        paths:
          - /helloworld.Greeter/SayHello
        methods:
          - GET
          - POST
      backends:
        - serviceName: grpc-service
          servicePort: 50051
```

使用 ApisixUpstream 自定义资源创建另一个 Kubernetes mainfest 文件，将上游配置为 `grpc`：

```yaml title="grpc-upstream.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixUpstream
metadata:
  name: grpc-service
# namespace: api7    # replace with your namespace
spec:
  scheme: grpc
```

将配置应用到你的集群：

```shell
kubectl apply -f grpc-route.yaml -f grpc-upstream.yaml
```

</TabItem>

</Tabs>

## 更新 API7 网关实例以支持 HTTP/2

默认情况下，API7 网关实例在端口 `9443` 上支持 TLS 加密的 HTTP/2。在本教程中，你可以添加端口 `9081`，支持不加密的 HTTP/2，然后将端口 `9081` 映射到主机上的同一端口。

在本节中，你将更新 API7 网关配置和部署以支持 `9081` 端口上的非加密 HTTP/2。

<Tabs
groupId="platform"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'k8s'},
]}>

<TabItem value="docker">

由于 Docker 不支持在容器运行时更新端口映射，因此首先请移除 `api7-ee-gateway-1` 网关容器（[随安装一起启动](../getting-started/install-api7-ee.md#install-api7-enterprise)）。

接下来，[在 Docker 中启动一个新的网关实例](../getting-started/add-gateway-instance.md)。在运行生成的部署命令之前，添加 `-p 9081:9081` 标志。修改后的命令应类似于：

```shell
docker run -d -e API7_CONTROL_PLANE_ENDPOINTS='["https://<YOUR_IP_ADDR>:7943"]' \
  -e API7_GATEWAY_GROUP_SHORT_ID=default \
  -e API7_CONTROL_PLANE_CERT="-----BEGIN CERTIFICATE-----
  <CERT_CONTENT>
  -----END CERTIFICATE-----
  " \
  -e API7_CONTROL_PLANE_KEY="-----BEGIN PRIVATE KEY-----
  <PRIVATE_KEY_VALUE>
  -----END PRIVATE KEY-----
  " \
  -e API7_CONTROL_PLANE_CA="-----BEGIN CERTIFICATE-----
  <CERT_CONTENT>
  -----END CERTIFICATE-----
  " \
  -e API7_CONTROL_PLANE_SNI="api7ee3-dp-manager" \
  -p 9080:9080 \
  # highlight-next-line
  -p 9081:9081 \
  -p 9443:9443 \
  api7/api7-ee-3-gateway:<VERSION>
```

运行命令启动网关。

网关运行后，更新网关配置以允许 `9081` 端口上的 HTTP/2：

``shell
docker exec <api7-ee-gateway-container-name> /bin/sh -c "echo '
nginx_config:
  error_log_level: warn

apisix:
  node_listen:
    - port: 9080
      enable_http2: true
# highlight-start
    - port: 9081
      enable_http2: true
# highlight-end
' > /usr/local/apisix/conf/config.yaml"
```

重新加载容器以使配置更改生效：

```shell
docker exec <api7-ee-gateway-container-name> apisix reload
```

</TabItem>

<TabItem value="k8s">

编辑网关 ConfigMap：

```shell
kubectl edit cm api7-ee-3-gateway
```

在 ConfigMap 中添加允许 `9081` 端口上 HTTP/2 的配置：

```yaml
apisix:
  node_listen:
    - port: 9080
      enable_http2: false
# highlight-start
    - port: 9081
      enable_http2: true
# highlight-end
```

保存 ConfigMap 并重新启动部署：

```shell
kubectl rollout restart deployment api7-ee-3-gateway
```

要将 `9081` 添加为服务端口，请编辑服务：

```shell
kubectl edit svc/api7-ee-3-gateway-gateway
```

将以下配置添加到 `ports`：

```yaml
spec:
  ports:
    ...
    # highlight-start
    - name: http2-non-tls
      port: 9081
      protocol: TCP
      targetPort: 9081
    # highlight-end
    ...
```

保存服务 mainifest 以使更改生效。

</TabItem>

</Tabs>

## 验证 gRPC 服务


[下载 `helloworld.proto` 文件](https://github.com/api7/grpc_server_example/blob/master/proto/helloworld.proto) 。

此示例使用 `helloworld.proto` 文件来确保 gRPCurl CLI 工具使请求和响应格式与 gRPC 服务定义一致。

<Tabs
groupId="api"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'k8s'},
]}>

<TabItem value="docker">

如果你在 Docker 中安装了网关实例并使用控制台或 ADC 进行配置，请向路由发送请求：

</TabItem>

<TabItem value="k8s">

如果你在 Kubernetes 上安装了网关实例并使用 Ingress Controller 进行配置，请先通过端口转发将服务端口暴露给你的本地机器：

```shell
kubectl port-forward svc/api7-ee-3-gateway-gateway 9081:9081 &
```

向路由发送请求：

```shell
grpcurl -plaintext \
  -proto helloworld.proto \
  -d '{"name":"API7"}' \
  "127.0.0.1:9081" \
  "helloworld.Greeter.SayHello"
```

你应该能看到如下类似的响应：

```text
{
  "message": "Hello API7"
}
```

## 相关阅读

* Key Concepts
  * [Services](../key-concepts/services.md)
  * [Routes](../key-concepts/routes.md)
  * [Plugins](../key-concepts/plugins.md)
