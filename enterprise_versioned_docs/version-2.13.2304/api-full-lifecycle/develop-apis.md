---
title: 开发 API
slug: /api-full-lifecycle/develop-apis
tags:
- API7 Enterprise
---

本文将指导您作为 API 的生产者及管理员，如何根据已经完成的 API 设计文档来开发出性能健康的 API。

## 前置要求

在上一节中，我们已经完成 API 的设计，此阶段您已收获到一份各方（前端、后端、产品、测试等）对齐的 API 设计文档，
我们给的样例中主要包含三个 API：创建商品（CreateProduct）、 创建订单（CreateOrder）、获取商品详情（GetProductById），
三者依次是依赖关系。下面各方就可以按照这份文档进行后续流程，主要包含定排期、开发和自测、联调、QA测试、产品验收、发布等阶段。

## 开发流程

1. 定排期：API 开发流程的重点，有些复杂的工程甚至需要甘特图来追踪项目的进度，后续项目参与者需要根据排期定制的时间节点完成/汇报自己的工作，
确保项目如期完成交付。
2. 开发和自测：开发阶段通常包括编码和调试，自测阶段则是开发人员对自己开发的 API 进行测试和验证，以确保 API 的功能符合预期。
3. 联调：指将不同模块之间的 API 进行调试和测试，确保它们之间的交互和通信都正确、稳定。
4. QA 测试：也称为质量保证测试，主要目标是 API 发布给最终用户之前，发现并消除其中的缺陷或漏洞。
5. 产品验收：通过对 API 进行全面的测试、评估和确认，以确定 API 是否符合预期目标和标准的过程。
6. 发布：指将 API 部署到生产环境，让用户或客户能够使用和访问。

至此我们已经完成了 API 的开发工作。

## 模拟 API

我们将使用 Postman 的 [Mock Server](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/) 和 [Example](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/mocking-with-examples/) 来模拟商城服务的三个 API 的行为，后续将模拟的 API 发布到网关上。在真实的业务中，你需要替换成真实的已开发好的 API。

### 创建 Collection

登录 Postman，进入 [设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis) 中创建好的 `shop` API，选择从 API definition 创建 Collection:

![Postman Create Collection](https://static.apiseven.com/uploads/2023/05/21/xnPCw9kd_postmancreatecollection.png)

选择 **Copy to collections** ：

![Postman Copy to collections](https://static.apiseven.com/uploads/2023/05/21/iBRyromx_postmancopy.png)

### 创建 Mock Server

为 `shop collection` 创建一个 Mock Server:

![Create Mock Server](https://static.apiseven.com/uploads/2023/05/21/6qLaSG3u_postmanmockserver.png)

![Create Mock Server 2](https://static.apiseven.com/uploads/2023/05/21/MqCjrfSA_postmanmockserver2.png)

创建成功后，点击 **Copy URL** 按钮复制 Mock Server 的地址，在 `shop collection` 的 **Variables** 中将 `baseUrl` 的值设置为 Mock Server 的地址，然后保存：

![Postman Baseurl](https://static.apiseven.com/uploads/2023/05/21/rQy8GCaM_postmanbaseurl.png)

### 添加 Example

在 `shop collection` 中，为三个请求分别添加 Example 并保存.

### GetProductById

在 **Path Variables** 中，为 `id` 设置 Value 为 `1`，然后设置 Response:

```shell

{
    "id": 1,
    "name": "iPhone 13 Pro",
    "price": 999.99,
    "updated_at": "2023-04-17T05:49:54.029Z",
    "created_at": "2023-04-17T05:49:54.029Z"
}

```

![Get Product By Id - Example](https://static.apiseven.com/uploads/2023/05/21/DOTSGNqy_postmangetproduct.png)

### CreateProduct

设置请求 Body 为:

```shell

{
  "name": "iPhone 13 Pro",
  "price": 999.99
}

```

设置Response:

```shell

{
  "id": 1
}

```

### CreateOrder

设置请求 Body 为:

```shell

{
    "customer_id":"user_ascx8e21nsd", 
    "product_id": 1,
    "quantity": 1
}

```

添加返回 example:

```shell

{
  "order_id": 123
}

```
