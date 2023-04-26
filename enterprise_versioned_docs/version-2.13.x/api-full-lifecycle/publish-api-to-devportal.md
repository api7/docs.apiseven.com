---
title: 发布 API 到开发者门户 (Beta)
slug: /api-full-lifecycle/publish-api-to-devportal
tags:
- API7 Enterprise
---

本文将指导您作为 API 的生产者及管理员，如何将已经接入 API7 网关的 API 发布到与网关配套的开发者门户，允许内部或外部的开发者登录后查找到这个 API，查看都已经的 API 文档，并申请订阅 API，获得 API 管理员的同意后，自动获取访问凭证。

现在我们希望将前文创建的其中一个接口：用户下单（CreateOrders）发布到开发者门户，允许自行申请访问所需的 API key。

## 前置要求

1. 已经搭建好供开发者登录使用的站点。
2. 准备好 OpenAPI Spec 文件，包括详细的 API 使用方式和说明。

## 新增 API

参考对应文档[新增 API](https://docs.apiseven.com/enterprise/user-manual/devportal/api#新增API)。

在【**步骤5**: 填写表单】中，关联路由选择创建好的`CreateOrders`。因为路由上已经启用了 key-auth 插件，开发者门户会自动识别出这一认证方式。

在【**步骤5**: 填写表单】中，上传对应的 OpenAPI Spec 文件。

## 验证

### 后端 API 验证

调用`获取所有已发布 API 列表`的 API，其中可以看到包含了`CreateOrders`。

### 控制台展示验证

登录搭建好的业务开放平台站点，可以查找到`CreateOrders`。
