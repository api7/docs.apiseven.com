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

1. 启动示例 gRPC 服务器。

    API7 提供了一个 gRPC 服务示例，用于测试。你可以使用以下命令在端口 `50051` 上启动示例 gRPC 服务器的 Docker 实例 `grpc-service`：

    ```bash
    docker run -d --name grpc-service -p 50051:50051 --restart always api7/grpc-server-example:1.0.0
    ```
  
2. 列出可用的 gRPC 服务和方法，验证 gRPC 服务器是否启动成功：

    - gRPC 服务

        ```bash
        grpcurl -plaintext 127.0.0.1:50051 list
        ```

        你应该看到以下输出：

        ```bash
        grpc.reflection.v1alpha.ServerReflection
        helloworld.Greeter
        helloworld.TestImport
        ```

    - gRPC 方法

        ```bash
        grpcurl -plaintext 127.0.0.1:50051 list helloworld.Greeter
        ```

        你应该看到以下输出：

        ```bash
        helloworld.Greeter.GetErrResp
        helloworld.Greeter.Plus
        helloworld.Greeter.SayHello
        helloworld.Greeter.SayHelloAfterDelay
        helloworld.Greeter.SayHelloBidirectionalStream
        helloworld.Greeter.SayHelloClientStream
        helloworld.Greeter.SayHelloServerStream
        ```

## 更新 API7 网关实例

默认情况下，API7 网关实例在端口 `9443` 上支持 TLS 加密的 HTTP/2。在本教程中，你可以添加端口 `9081`，支持不加密的 HTTP/2，然后将端口 `9081` 映射到主机上的同一端口。

```yaml title="config.yaml"
apisix:
  node_listen:
    - port: 9080
      enable_http2: false
    - port: 9081
      enable_http2: true
```

在 `api7-ee` 目录下重新运行 `docker-compose up -d` 命令，更新 API7 网关配置。

## 创建服务和路由

本示例创建一个名为 `grpc-example` 的服务和一个名为 `helloworld.Greeter` 的路由。

<h3>创建服务</h3>

1. 在左侧菜单选择目标网关组下的 **已发布服务** 菜单，然后点击 **新增服务**。 
2. 选择 **手动新增**。

* **名称** 填写 `grpc-example`。
* **服务类型** 选择 `HTTP （七层代理）`。 
* **上游 Scheme** 选择 `gRPC`。
* **如何找到上游** 选择 `使用节点`。
* 点击 **新增节点**。
* 在新增节点对话框中，执行以下操作：
  * **主机** 填写 `127.0.0.1`。
  * **端口** 填写 `50051`。
  * **权重** 填写 `100`。
* 点击 **新增**。 此时创建出的新服务处于“无版本”状态。

<h3>创建一条路由</h3>

1. 进入刚才创建好的服务，然后点击 **新增路由**。
2. 在新增路由对话框中，执行以下操作：

* **名称** 填写 `ghelloworld.Greeter`。
* **路径** 填写 `/helloworld.Greeter/SayHello`。
* **HTTP 方法** 选择 `GET` 和 `POST`。
* 点击 **新增**。

## 验证 gRPC 服务

本示例通过 `helloworld.proto` 文件确保 `gRPCurl` CLI 工具将请求和响应格式与 gRPC 服务定义保持一致。你可以在[此处](https://github.com/api7/grpc_server_example/blob/master/proto/helloworld.proto)找到 `helloworld.proto` 示例文件。

```bash
grpcurl -plaintext -proto helloworld.proto -d '{"name":"apisix"}' 127.0.0.1:9081 helloworld.Greeter.SayHello  # Replace 127.0.0.1 to your local host IP address
```

你应该看到以下输出：

```text
{
  "message": "Hello apisix"
}
```
