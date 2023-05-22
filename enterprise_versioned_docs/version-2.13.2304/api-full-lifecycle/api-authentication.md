---
title: 开启 API 身份认证
slug: /api-full-lifecycle/api-authentication
tags:
- API7 Enterprise
---

身份认证是 API 基础需求之一，在 API7 Enterprise 中支持非常丰富的身份认证方式，例如：key-auth、basic-auth、ldap-auth 等等，本指南中将会以 key-auth 插件为例介绍如何为 API 增加身份认证能力。

## 前置要求

1. [部署 API7 Enterprise](https://docs.apiseven.com/enterprise/installation/docker)。
2. [创建工作分区](hhttps://docs.apiseven.com/enterprise/user-manual/cluster/workspace#新建工作分区)。
3. [设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis)。
4. [发布 API 到 API7 网关](https://docs.apiseven.com/enterprise/api-full-lifecycle/publish-apis)。

## 创建包含 key-auth 插件的消费者

参考文档 [新建消费者](https://docs.apiseven.com/enterprise/user-manual/cluster/consumer#新建消费者)。

在【9. 选择需要启用的插件，点击对应的 **启用** 按钮】中，选择 `key-auth` 插件。

在【11. 在 **配置Raw Data** 中，编辑插件的参数】中，填入如下配置：

```json

{
  "key": "auth-one"
}

```
以上配置表示 `auth-one` 为一个合法的 key-auth 插件访问凭证。

## 创建包含 key-auth 插件的插件模板

参考文档 [新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【9. 选择需要启用的插件，点击对应的 **启用** 按钮】中，选择 `key-auth` 插件。

`key-auth` 插件将会尝试从 HTTP Request 的 `apikey` Header 中获取访问凭证，如果获取失败或者凭证无法对应到真实存在的消费者，则认证失败，反之则会认证成功。

## 将插件模板应用到 API

以 `CreateProduct` 为例，参考文档 [配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【9. 编辑 API 的属性】中，将插件模板修改为上一步创建的包含 key-auth 插件的插件模板。

## 验证

### 不带 API Key 发送 API 请求：

```shell

curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${API7_GATEWAY_ADDRESS}/products

```

该请求会返回一个 HTTP 401 `{"message":"Missing API key found in request"}` 的错误，因为请求中没有携带合法的 API Key。

### 携带正确的 API Key 发起请求：

```shell

curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -H "apikey: auth-one" -v http://${API7_GATEWAY_ADDRESS}/products

```

该请求会正常返回。
