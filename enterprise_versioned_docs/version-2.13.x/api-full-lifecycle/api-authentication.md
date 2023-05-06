---
title: 开启 API 身份认证
slug: /api-full-lifecycle/api-authentication
tags:
- API7 Enterprise
---

身份认证是 API 基础需求之一，在 API7 Enterprise 中支持非常丰富的身份认证方式，例如：key-auth、basic-auth、ldap-auth 等等，本指南中将会以 key-auth 插件为例介绍如何为 API 增加身份认证能力。

## 前置要求

1. 配置好 $DP_SERVER 变量
```shell
export DP_SERVER=<你部署的DP访问地址>
```
2. 参考对应文档[新建 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#新建-api)。
3. 参考对应文档[插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template)。


## 配置 key-auth 插件
### 创建包含 key-auth 插件的消费者

参考对应文档[新建消费者](https://docs.apiseven.com/enterprise/user-manual/cluster/consumer#新建消费者)。

在【**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮】中，选择`key-auth`插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数】中，填入如下配置：

```json
{
  "key": "auth-one"
}
```
以上配置表示 `auth-one` 为一个合法的 key-auth 插件访问凭证。

### 创建包含 key-auth 插件的插件模板

参考对应文档[新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮】中，选择`key-auth`插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数】中，填入如下配置：

```json
{
  "header": "Authorization"
}
```
以上配置表示 key-auth 插件将会尝试从 HTTP Request 的 `Authorization` Header 中获取访问凭证，如果获取失败或者凭证无法对应到真实存在的消费者，则认证失败，反之则会认证成功。


### 将插件模板应用到 API

假设我们需要给创建商品（`/products`）的接口配置身份认证。

我们需要在`API 列表`中，找到对应的 API。参考对应文档[配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【**步骤9**：编辑 API 的属性】中，将插件模板修改为上一步创建的包含 key-auth 插件的插件模板。

### 验证身份认证效果

**步骤1**：打开终端，使用 curl 命令发送 API 请求：
```shell
curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -v http://${DP_ADDRESS}/products
```
该请求会返回一个 HTTP 401 `{"message":"Invalid API key in request"}` 的错误，因为请求中没有携带合法的 API Key。

**步骤2**：使用 curl 携带正确的 API Key 发起请求：
```shell
curl -X POST -d '{"name": "iPhone 13 Pro", "price": 999.99}' -H 'HOST: test.com' -H "Authorization: auth-one" -v http://${DP_ADDRESS}/products
```
该请求会返回一个 HTTP 200，表示请求被网关正常放行。
