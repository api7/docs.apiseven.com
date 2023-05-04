---
title: API 限流限速
slug: /api-full-lifecycle/limit-count
tags:
- API7 Enterprise
---

本文将指导您如何在 API7 控制台中使用 limit-count 插件对 API 进行限流限速配置，以及如何验证结果。

## 前置要求

1. 配置好 $DP_SERVER 变量
```shell
export DP_SERVER=<你部署的DP访问地址>
```
2. 参考对应文档[新建 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#新建-api)。
3. 参考对应文档[插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template)。


## 配置 limit-count 插件
### 创建包含 limit-count 插件的插件模板

参考对应文档[新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。
在【**步骤9**： 选择需要启用的插件，点击对应的 `启用` 按钮】中，选择 `limit-count` 插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数】中，填入如下配置：

```json
{
  "count": "3",
  "time_window": "60",
  "key_type": "var",
  "rejected_code": "429",
  "rejected_msg": "Too many request",
  "policy": "local",
  "allow_degradation": false,
  "show_limit_quota_header": true,
}
```
在这个例子中，我们限制被绑定该插件 API 只能在 60 秒内被访问 3 次，超过 3 次则返回 429 状态码，响应体为 `Too many request`。

### 将插件模板应用到 API

假设我们需要给创建商品（`/product/1`）的接口配置一个配置限流限速。

我们需要在` API 列表`中，找到对应的 API。参考对应文档[配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【**步骤9**：编辑 API 的属性】中，将插件模板修改为上一步创建的包含 limit-count 插件的插件模板。


### 验证 limit-count 插件

**步骤1**：打开终端，使用连续 4 次 curl 命令发送 API 请求：
```shell
curl -H 'HOST: example.com' -v http://${DP_ADDRESS}/product/1
```
前三次请求正常响应，第四次请求会返回 429 状态码，响应体为 `Too many request`。


**步骤2**：等待 60 秒，再次使用 curl 命令发送 API 请求：
```shell
curl -H 'HOST: example.com' -v http://${DP_ADDRESS}/product/1
```
等待60秒后，请求可以正常响应。
