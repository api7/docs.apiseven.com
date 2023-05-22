---
title: 阻止特定 IP 访问 API
slug: /api-full-lifecycle/ip-restriction
tags:
- API7 Enterprise
---

在本文中，我们将探讨如何使用 API7 Enterprise 平台实现 API 的 IP 限制功能。通过这个功能，我们可以实现阻止或者允许 IP 地址访问 API。

## 前置要求

1. [部署 API7 Enterprise](https://docs.apiseven.com/enterprise/installation/docker)。
2. [创建工作分区](https://docs.apiseven.com/enterprise/user-manual/cluster/workspace#create-workspace)。
3. [设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis)。
4. [发布 API 到网关](https://docs.apiseven.com/enterprise/api-full-lifecycle/publish-apis)。

## 配置 API IP 白名单

### 创建包含 ip-restriction 插件的插件模板

参考对应文档 [新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【9. 选择需要启用的插件，点击对应的 **启用** 按钮】中，选择 `ip-restriction` 插件。

在【11. 在 **配置Raw Data** 中，编辑插件的参数】中，填入如下配置：

```json

{
  "whitelist": ["8.8.8.8"],
  "message": "Sorry, your IP address is not allowed."
}

```
在这个例子中，我们只允许 `8.8.8.8` 这个 IP 访问 API。

### 将插件模板应用到 API

以 `CreateProduct` 为例，参考对应文档 [配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【9. 编辑 API 的属性】中，将插件模板修改为上一步创建的包含 ip-restriction 插件的插件模板。

### 验证 IP 白名单

发送 API 请求：

```shell

curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${API7_GATEWAY_ADDRESS}/products

```

此时应该返回一个`Sorry, your IP address is not allowed.`的错误，因为这个我们的 IP 地址不是 8.8.8.8，所以不允许访问这个 API。

## 配置 API IP 黑名单

### 配置包含 ip-restriction 插件的插件模板

修改之前例子，将 `8.8.8.8` 改到黑名单中。

参考对应文档 [配置插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#配置插件模板)。

在【11. 在 **配置Raw Data** 中，编辑插件的参数】中，修改配置为：

```json

{
  "blacklist": ["8.8.8.8"],
  "message": "Sorry, your IP address is not allowed."
}

```

### 验证 IP 黑名单

发送 API 请求：

```shell

curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${API7_GATEWAY_ADDRESS}/products

```

因为我们的 IP 没有被黑名单限制，所以我们能正常的访问到该 API 接口。此时你可以看到正常的 API 返回：

```json

{
    "id":1
}

```
