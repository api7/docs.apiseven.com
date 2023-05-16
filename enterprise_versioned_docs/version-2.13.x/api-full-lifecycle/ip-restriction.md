---
title: 阻止特定 ip 访问 API
slug: /api-full-lifecycle/ip-restriction
tags:
- API7 Enterprise
---

在本文中，我们将探讨如何使用 API7 Enterprise 平台实现 API 的 IP 限制功能。通过这个功能，我们可以实现阻止或者允许 IP 地址访问 API。

## 前置要求

1. 参考文档成功部署 API7 Enterprise，并创建好集群与工作分区。
2. 参考文档 [发布 API 到网关](https://docs.apiseven.com/enterprise/api-full-lifecycle/publish-apis)，完成三个 API 的发布。

## 配置 API IP 白名单

### 创建包含 ip-restriction 插件的插件模板

参考对应文档[新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【9. 选择需要启用的插件，点击对应的 **启用** 按钮】中，选择 `ip-restriction` 插件。

在【11. 在 **配置Raw Data** 中，编辑插件的参数】中，填入如下配置：

```json

{
  "whitelist": ["8.8.8.8"],
  "message": "Sorry, your IP address is not allowed."
}

```
在这个例子中，我们只允许 8.8.8.8 这个 IP 访问 API。

### 将插件模板应用到 API

以 `CreateProduct` 为例，参考对应文档[配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【9. 编辑 API 的属性】中，将插件模板修改为上一步创建的包含 ip-restriction 插件的插件模板。

### 验证 IP 白名单

发送 API 请求：

```shell

curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${API7_GATEWAY_ADDRESS}/products

```

此时应该返回一个`Sorry, your IP address is not allowed.`的错误，因为这个我们的 IP 地址不是 8.8.8.8，所以不允许访问这个 API。

## 配置 API IP 黑名单

### 创建包含 ip-restriction 插件的插件模板

刚才的例子中，我们只允许 8.8.8.8 这个 IP 访问我们的API，导致我们自己被阻挡在外了。一般在实际线上环境中，你需要配置这个 IP 为你们自己的内部的 IP 地址。

参考对应文档[新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【9. 选择需要启用的插件，点击对应的 **启用** 按钮】中，选择 `ip-restriction` 插件。

在【11. 在 **配置Raw Data** 中，编辑插件的参数】中，填入如下配置：

```json

{
  "blacklist": ["8.8.8.8"],
  "message": "Sorry, your IP address is not allowed."
}

```

### 将插件模板应用到 API

在前面的步骤中，我们已经对插件模板和 API 做了关联，所以这一步我们就无需做额外的工作。只需保存刚才编辑的插件模板，我们配置的功能即刻就可以生效。

### 验证 IP 黑名单

发送 API 请求：

```shell
curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${DP_ADDRESS}/products
```

因为我们的 IP 没有被黑名单限制，所以我们能正常的访问到该 API 接口。此时你可以看到正常的 API 返回：

```json
{
    "id":1
}
```
