---
title: 阻止特定 ip 访问 API
slug: /api-full-lifecycle/handling-ip-restriction
tags:
- API7 Enterprise
---

在本文中，我们将探讨如何使用 API7 Enterprise 平台实现 API 的 IP 限制功能。通过这个功能，我们可以实现阻止或者允许 IP 地址访问 API。

## 前置要求

1. 配置好 $DP_SERVER 变量
```shell
export DP_SERVER=<你部署的DP访问地址>
```
2. 参考对应文档[新建 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#新建-api)。
3. 参考对应文档[插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template)。


## 设置 IP 白名单
### 创建包含 ip-restriction 插件的插件模板

接下来，我们将以配置 API IP 白名单为例。

参考对应文档[新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮】中，选择`ip-restriction`插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数】中，填入如下配置：

```json
{
  "whitelist": ["8.8.8.8"],
  "message": "Sorry, your IP address is not allowed."
}
```
在这个例子中，我们只允许 8.8.8.8 这个IP访问这个API。


### 将插件模板应用到 API

假设我们需要给创建商品（`/products`）的接口配置一个配置 IP 白名单。

我们需要在`API 列表`中，找到对应的 API。参考对应文档[配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【**步骤9**：编辑 API 的属性】中，将插件模板修改为上一步创建的包含 ip-restriction 插件的插件模板。

### 验证 IP 白名单

**步骤1**：打开终端，使用curl命令发送 API 请求：
```shell
curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${DP_ADDRESS}/products
```

**步骤2**：此时应该返回一个`Sorry, your IP address is not allowed.`的错误，因为这个我们的 IP 地址不是 8.8.8.8，所以不允许访问这个 API。

## 设置 IP 黑名单
### 创建包含 ip-restriction 插件的插件模板

刚才的例子中，我们只允许 8.8.8.8 这个 IP 访问我们的API，导致我们自己被阻挡在外了。一般在实际线上环境中，你需要配置这个 IP 为你们自己的内部的 IP 地址。

现在这个例子中，我们配置黑名单 IP。还是以 8.8.8.8 这个 IP 为例。

参考对应文档[新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮】中，选择`ip-restriction`插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数】中，填入如下配置：

```json
{
  "blacklist": ["8.8.8.8"],
  "message": "Sorry, your IP address is not allowed."
}
```
现在我们正式屏蔽来自 8.8.8.8 这个 IP 地址对我们 API 的访问。

### 将插件模板应用到 API

在前面的步骤中，我们已经对插件模板和 API 做了关联，所以这一步我们就无需做额外的工作。只需保存刚才编辑的插件模板，我们配置的功能即刻就可以生效。

### 验证 IP 黑名单

**步骤1**：打开终端，使用curl命令发送 API 请求：
```shell
curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${DP_ADDRESS}/products
```

**步骤2**：因为我们的 IP 没有被黑名单限制，所以我们能正常的访问到该 API 接口。此时你可以看到正常的 API 返回，例如
```json
{
    "id":1
}
```
