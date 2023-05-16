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

我们将使用 [Postman](https://www.postman.com/) 来演示如何设计 API。因此，在继续之前，请确保您已经安装了 Postman，需要注意的是，我们需要使用到
Postman 提供的 [Mock Server](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/) 功能。因此，你必须
登录 Postman 并且你的所有操作应该都在 [Workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/) 中进行。

### 创建 Collection

在你登录 Postman 后，请创建或者选择某个已有的 Workspace，随后在该 Workspace 下创建一个名为 `shop` 的 Collection。

### 创建 Mock Server

随后需要为 `shop` Collection 创建一个 Mock Server，这样我们就可以在 Postman 中模拟 API 的行为。

![Create Mock Server](https://static.apiseven.com/uploads/2023/04/28/fkwBwbOK_Screenshot%202023-04-28%20at%2010.35.57.png)

在创建 Mock Server 后，点击 **Copy URL** 按钮复制 Mock Server 的地址，随后为你的 Workspace 创建一个环境变量 `MOCK_SERVER`，并将值设置为 Mock Server 的地址。

![Create Mock Server Env](https://static.apiseven.com/uploads/2023/04/28/zhvRQhI2_mock-server-env.png)

## API 介绍

:::tip

在这一节中，我们会使用到 `cURL` 请求所设计的 API，因此需要创建 `MOCK_SERVER` 变量，并设置为 Mock Server 的地址。

```shell
export MOCK_SERVER=<MOCK_SERVER_ADDR>
```

:::

我们在这份指南中使用了一个商城服务的例子，该商城服务提供了两个核心概念：

* 商品，包含 ID、名称、价格等信息；
* 订单，包含商品 ID、消费者 ID（在这个例子中，我们不展开消费者的概念）和商品数量；

针对这两个核心概念，我们将设计如下的三个 API：

* 获取商品详情（`GetProductById`）

```shell
curl '${MOCK_SERVER}/products/1' 

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
curl '${MOCK_SERVER}/products' \
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
curl '${MOCK_SERVER}/orders' \
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

接下来，我们将在 `shop` Collection 下依次创建三个 API，分别是 `GetProductById`、`CreateProduct`、`CreateOrder`。

![Get Product By Id](https://static.apiseven.com/uploads/2023/04/28/5cfdjUO4_GetProductById.png)
![Create Product](https://static.apiseven.com/uploads/2023/05/16/FH5pZZeL_CreateProduct.png)
![Create Order](https://static.apiseven.com/uploads/2023/05/16/Fvoyqm04_CreateOrder.png)

至此我们已经完成了 API 的设计，接下来我们需要按照既定的 API 规范来开发这几个 API。
