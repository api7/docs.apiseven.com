---
title: 设计 API
slug: /api-full-lifecycle/design-apis
tags:
- API7 Enterprise
---

作为工程师，我们总是强调在编码前先进行方案的设计。API 也不例外，我们需要根据业务明确一个 API 的功能目的，
然后结合相关技术栈，将业务语言翻译成技术语言。 通常来说，API 规划和设计是围绕着文档进行的。 
关于如何撰写一份合理的 API 文档，人们也开展过很多的研究，目前比较流行的是按照 OpenAPI Specification V3 进行 API 文档的设计。

这份指南将设计若干个 API，为后续进行 API 的发布、导入到网关、以及保护 API 做准备。

## 背景知识

我们将使用 [Postman](https://www.postman.com/) 来演示如何设计 API。因此，在继续之前，请确保您已经安装了 Postman（或者使用 Postman Cloud 服务）。

我们在这份指南中使用了一个商城服务的例子，该商城服务提供了两个核心概念：

* 商品，包含 ID、名称、价格等信息；
* 订单，包含商品 ID、消费者 ID（在这个例子中，我们不展开消费者的概念）和商品数量；

针对这两个核心概念，我们将设计如下的三个 API：

* 获取商品详情（`GetProductById`）

```shell
curl '${BASE_URL}/products/1' 

{
    "id": 1,
    "name": "iPhone 13 Pro",
    "price": 999.99,
    "updated_at": "2023-04-17T05:49:54.029Z",
    "created_at": "2023-04-17T05:49:54.029Z"
}
```

* 创建商品（`CreateProduct`）

```shell
curl '${BASE_URL}/products' \
-X POST
--header 'Authorization: HMAC <ACCESSKEY>:<HMAC>' \
--header 'Content-Type: application/json' \
--data '{
  "name": "iPhone 13 Pro",
  "price": 999.99
}'

{
  "id": 1
}
```
* 创建订单（`CreateOrder`）

```shell
curl '${BASE_URL}/orders' \
-X POST
--header 'Content-Type: application/json' \
--header 'apikey: xxxxx' \
--data '{
    "customer_id":"user_ascx8e21nsd", 
    "product_id": 1,
    "quantity": 1
}'


{
  "order_id": 123
}
```

## 设计 API

接下来，我们在 Postman 上创建一个名为 `shop` 的 Collection，然后在该 Collection 下依次创建三个 API，分别是 `GetProductById`、`CreateProduct`、`CreateOrder`。

**/product/{$product_id}**:

![Get Product By Id](https://static.apiseven.com/uploads/2023/04/25/BRBf7NeX_Screenshot%202023-04-25%20at%2016.40.57.png)

**/products**:

![Create Product](https://static.apiseven.com/uploads/2023/04/25/KETzJO92_Screenshot%202023-04-25%20at%2016.44.11.png)

**/orders**:
![Create Order](https://static.apiseven.com/uploads/2023/04/25/4aXqOr3P_Screenshot%202023-04-25%20at%2016.46.13.png)

至此我们已经完成了 API 的设计，接下来我们需要按照既定的 API 规范来 mock 和开发这几个 API。
