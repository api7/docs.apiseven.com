---
title: API 限流限速
slug: /api-full-lifecycle/limit-count
tags:
- API7 Enterprise
---

本文将指导您如何在 API7 控制台中使用 limit-count 插件对 API 进行限流限速配置，以及如何验证结果。

## 前置要求

1. [部署 API7 Enterprise](https://docs.apiseven.com/enterprise/installation/docker)。
2. [创建工作分区](hhttps://docs.apiseven.com/enterprise/user-manual/cluster/workspace#新建工作分区)。
3. [设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis)。
4. [发布 API 到 API7 网关](https://docs.apiseven.com/enterprise/api-full-lifecycle/publish-apis)。

## 创建包含 limit-count 插件的插件模板

参考文档 [新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【9. 选择需要启用的插件，点击对应的 **启用** 按钮】中，选择 `limit-count` 插件。

在【11. 在 **配置Raw Data** 中，编辑插件的参数】中，填入如下配置：

```json

{
  "count": 3,
  "time_window": 60,
  "key_type": "var",
  "rejected_code": 503,
  "rejected_msg": "Too many request",
  "policy": "local",
  "allow_degradation": false,
  "show_limit_quota_header": true
}

```
在这个例子中，我们限制被绑定该插件 API 只能在 60 秒内被访问 3 次，超过 3 次则返回 503 状态码，响应体为 `Too many request`。

## 将插件模板应用到 API

以 `CreateProduct` 为例，参考文档 [配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【9. 编辑 API 的属性】中，将插件模板修改为上一步创建的包含 limit-count 插件的插件模板。

## 验证限流限速

连续 4 次发送 API 请求：

```shell

curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${API7_GATEWAY_ADDRESS}/products
```
前三次请求正常响应，第四次请求会返回 503 状态码，响应体为 `Too many request`。

等待 60 秒，再次使用 curl 命令发送 API 请求：

```shell

curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${API7_GATEWAY_ADDRESS}/products

```
请求可以正常响应：

```json

{
    "id":1
}

```
