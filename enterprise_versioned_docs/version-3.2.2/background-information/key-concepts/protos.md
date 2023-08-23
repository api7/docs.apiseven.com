---
title: Protos
slug: /key-concepts/protos
---

In this document, you will learn the basic concept of protos in APISIX and why you may need them.

Explore additional resources at the end of the document for more information on related topics.

## Overview

In APISIX, _proto_ objects contain [protocol buffer (protobuf)](https://protobuf.dev) definitions which define the service interface and message types used in communication with upstream [gRPC](https://grpc.io) services.

The following diagram illustrates the concept of a proto object using an example of APISIX transcoding between HTTP and gRPC. In this example, the route `/grpc-echo` is associated with the plugin `grpc-transcode` and a proto object:

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/05/06/8X50cIcx_protos.svg" alt="Diagram of APISIX transcoding between HTTP and gRPC" width="100%" />
</div>
<br />

The gRPC server is registered with `EchoService` defined in `echo.proto` file, which echoes back string input from incoming requests.

To enable gRPC communication between APISIX and server, the protocol buffer definitions specified in the `echo.proto` file are added to the proto object in APISIX. This ensures that APISIX and the gRPC server agree on the specifications of data exchange, allowing APISIX to effectively communicate with the gRPC server and relay the responses back to the client over HTTP.

To learn more about how to use `grpc-transcode` for protocol transcoding, see [Transcode HTTP to gRPC](../../how-to-guide/transformation/transcode-http-to-grpc.md).

[//]: <TODO: how-to for .pb file format?>

## Additional Resource(s)

* Key Concepts - [Routes](./routes.md)
* How-To Guide - [Transcode HTTP to gRPC](../../how-to-guide/transformation/transcode-http-to-grpc.md)

[//]: <TODO: Protos Admin API>
