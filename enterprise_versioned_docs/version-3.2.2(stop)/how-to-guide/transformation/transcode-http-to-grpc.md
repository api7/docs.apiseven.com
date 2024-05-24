---
title: Transcode HTTP to gRPC
slug: /how-to-guide/transformation/transcode-http-to-grpc
---

[gRPC](https://grpc.io/) is an open-source high performance Remote Procedure Call (RPC) framework based on HTTP/2 protocol. It uses [protocol buffers (protobuf)](https://protobuf.dev/) as the interface description language (IDL).

APISIX provides the capability to transform between HTTP and gRPC requests and responses, using the plugin `grpc-transcode` and [proto objects](../../background-information/key-concepts/protos.md). 

This guide will show you how to use the plugin `grpc-transcode` to transform RESTful HTTP requests to gRPC requests.

<br/>
  <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2023/05/06/omYvTUSm_transform-grpc.jpg" alt="REST to gRPC Diagram" width="70%"/>
  </div>
<br/>

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker/).
* Install [cURL](https://curl.se/) to send requests to APISIX for validation.
* Install [gRPCurl](https://github.com/fullstorydev/grpcurl) to send requests to gRPC services for validation.
* Follow the [Getting Started tutorial](./../../getting-started/) to start a new APISIX instance in Docker.

## Deploy an Example gRPC Server

Start an [example gRPC server](https://github.com/api7/grpc_server_example) Docker instance `quickstart-grpc-example` on port `50051`:

```shell
docker run -d \
  --name quickstart-grpc-example \
  --network=apisix-quickstart-net \
  -p 50051:50051 \
  api7/grpc-server-example:1.0.2
```

This example gRPC server holds several services, such as `echo.EchoService`:

```proto title="echo.proto"
syntax = "proto3";

package echo;

service EchoService {
  rpc Echo (EchoMsg) returns (EchoMsg);
}

message EchoMsg {
  string msg = 1;
}
```

In this example, `Echo` is a method in `EchoService` that accepts parameter type `string` defined in `EchoMsg`.

Test the gRPC method `echo.EchoService.Echo` using gRPCurl:

```shell
grpcurl -plaintext -d '{"msg": "Hello"}' "127.0.0.1:50051" "echo.EchoService/Echo"
```

A response similar to the following verifies that the gRPC service is working:

```text
{
  "msg": "Hello"
}
```

## Create a Proto Object to Store Protobuf File

Store the protobuf file `echo.proto` as a proto object in APISIX with the id `quickstart-proto`:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/protos" -X PUT -d '
{
  "id": "quickstart-proto",
  "content": "syntax = \"proto3\";

  package echo;

  service EchoService {
    rpc Echo (EchoMsg) returns (EchoMsg);
  }

  message EchoMsg {
    string msg = 1;
  }"
}'
```

An `HTTP/1.1 201 OK` response verifies that the proto object is created successfully.

## Enable `grpc-transcode` Plugin

Create a route with id `quickstart-grpc` and enable the plugin `grpc-transcode`:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes" -X PUT -d '
{
  "id": "quickstart-grpc",
  "methods": ["GET"],
  "uri": "/echo",
  "plugins": {
# highlight-start
    "grpc-transcode": {
// Annotate 1
      "proto_id": "quickstart-proto",
// Annotate 2
      "service": "echo.EchoService",
// Annotate 3
      "method": "Echo"
    }
# highlight-end
  },
  "upstream": {
    "scheme": "grpc",
    "type": "roundrobin",
    "nodes": {
      "quickstart-grpc-example:50051": 1
    }
  }
}'
```

❶ `proto_id`: the proto object which defines gRPC services

❷ `service`: gRPC service `echo.EchoService` in use

❸ `method`: gRPC method `Echo` in use

An `HTTP/1.1 201 OK` response verifies that the route is created and the plugin `grpc-transcode` is enabled successfully.

APISIX now transcodes the RESTful HTTP requests received at `/echo` route to proto requests and forwards them to the upstream gRPC server `quickstart-grpc-example` to invoke the method `echo.EchoService/Echo`. Once the gRPC server responds, APISIX transcodes the proto responses back to RESTful HTTP responses for clients.

## Test gRPC Services in a RESTful Way

Send an HTTP request to `/echo` with parameters defined in `EchoMsg`:

```shell
curl -i "http://127.0.0.1:9080/echo?msg=Hello"
```

A valid response similar to the following verifies that the plugin `grpc-transcode` works:

```text
{"msg":"Hello"}
```

## Next Steps

Learn more about the `grpc-transcode` plugin in the plugin reference (coming soon).

In addition to transcoding HTTP requests to gRPC requests, APISIX also supports [gRPC-Web](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-WEB.md), a variation of the [native gRPC protocol](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md), with the APISIX plugin `grpc-web`. 

[//]: <TODO: grpc-transcode plugin reference doc>
[//]: <TODO: grpc-web plugin guide>
