---
title: 设计 API
slug: /api-full-lifecycle/design-apis
tags:
- API7 Enterprise
---

作为工程师，我们总是强调在编码前先进行方案的设计。API 也不例外，我们需要根据业务明确一个 API 的功能目的，
然后结合相关技术栈，将业务语言翻译成技术语言。 通常来说，API 规划和设计是围绕着文档进行的。 

## API 示例

我们在这份指南中使用了一个商城服务的例子，该商城服务提供了两个核心概念：

* 商品，包含 ID、名称、价格等信息；
* 订单，包含商品 ID、消费者 ID（在这个例子中，我们不展开消费者的概念）和商品数量；

针对这两个核心概念，我们将设计如下的三个 API：

* 获取商品详情（`GetProductById`）

```shell

curl '${baseUrl}/products/1' 

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

curl '${baseUrl}/products' \
-X POST
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

curl '${baseUrl}/orders' \
-X POST \
--data '{
    "customer_id":"user_ascx8e21nsd", 
    "product_id": 1,
    "quantity": 1
}'


{
  "order_id": 123
}

```

## 背景知识

### Postman

我们将使用 [Postman](https://www.postman.com/) 来演示如何设计 API。因此，在继续之前，请确保您已经安装了 Postman，需要注意的是，我们需要使用到
Postman 提供的 [Mock Server](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/) 功能。因此，你必须登录 Postman 并且你的所有操作应该都在 [Workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/) 中进行。

### RESTful API

RESTful 架构风格的主要特点包括：
1. 资源的唯一标识：每个资源都有唯一的标识，如 URL。
2. 统一的接口：使用统一的 HTTP 方法和标准状态码，如 GET、POST、PUT、DELETE 等。
3. 无状态：API 不应该保存客户端的状态信息，每次请求都应该包含完整的信息，便于横向扩展。

## 设计 API 定义文档

我们可以使用 schema 的方式编写符合 RESTful 架构风格和 API 设计原则的 API 定义文件，以 JSON 或 YAML 格式进行描述和交流。这种方式可以保证 API 的可靠性、一致性和可扩展性，同时便于后续的文档编写和其他平台的集成使用。

可以使用一些开源的工具编辑 OpenAPI 规范文件，例如 Swagger Editor、OpenAPI GUI 等。这些工具都提供了编辑 OpenAPI 规范文件的界面和工具，便于创建、编辑和验证符合规范要求的 API。此外，很多IDE或编辑器，例如Visual Studio Code、IntelliJ IDEA等也都有对应的 OpenAPI 插件。

以下是商城服务的 API 文档的示例 `Shop.yaml` ，包含三个 API：

```shell

---
openapi: 3.0.0
info:
  title: Sample API
  description: A sample API for demonstration purposes
  version: 1.0.0
servers:
- url: http://localhost:9080
  description: Development server
paths:
  "/products/{id}":
    get:
      summary: Get product by ID
      parameters:
      - name: id
        in: path
        required: true
        description: ID of the product
        schema:
          type: integer
      responses:
        '200':
          description: Product data
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  price:
                    type: number
                    format: float
                  updated_at:
                    type: string
                    format: date-time
                  created_at:
                    type: string
                    format: date-time
                example:
                  id: 1
                  name: iPhone 13 Pro
                  price: 999.99
                  updated_at: '2023-04-17T05:49:54.029Z'
                  created_at: '2023-04-17T05:49:54.029Z'
  "/products":
    post:
      summary: Create product
      requestBody:
        required: true
        description: Product data
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                price:
                  type: number
                  format: float
              required:
              - name
              - price
              example:
                name: iPhone 13 Pro
                price: 999.99
      responses:
        '201':
          description: Product created
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                example:
                  id: 1
  "/orders":
    post:
      summary: Create order
      requestBody:
        required: true
        description: Order data
        content:
          application/json:
            schema:
              type: object
              properties:
                customer_id:
                  type: string
                product_id:
                  type: integer
                quantity:
                  type: integer
                  minimum: 1
              required:
              - customer_id
              - product_id
              - quantity
              example:
                customer_id: user_ascx8e21nsd
                product_id: 1
                quantity: 1
      responses:
        '201':
          description: Order created



```

## 在 Postman 中创建 API

在你登录 Postman 后，请创建或者选择某个已有的 Workspace，随后在该 Workspace 下创建一个名为 `shop` 的 API。
在 API 中添加定义文件：

![Postman Create API](https://static.apiseven.com/uploads/2023/05/21/tmcGd9HG_postmancreateapi.png)

选择 **Import files** 方式，导入写好的 API 文档 `Shop.yaml`。
