---
title: 使用 Prometheus 和 Grafana 监控 API 及网关
slug: /api-full-lifecycle/prometheus-and-grafana
tags:
- API7 Enterprise
---

为了让 Web 应用程序跨不同的源发出请求（即向不同于请求页面的方案、主机名或端口的 URL 发出请求），实现了一组名为跨源资源共享 (CORS) 的规则。每当进行跨源请求时，浏览器都会发送一个 Origin 请求头，服务器必须以匹配的 Access-Control-Allow-Origin (ACAO) 响应头进行响应。如果这两个头不匹配，浏览器将拒绝响应，导致任何依赖于该数据的应用程序组件失效。

这份指南将帮助您启用API的CORS插件，以便您的应用程序能够无缝地在跨域请求之间通信。通过使用CORS插件，您可以轻松地解决由于跨域请求导致的浏览器拒绝响应的问题，确保您的应用程序组件能够正常工作，为您的用户提供更加流畅的体验。

## 背景知识

[了解CORS插件](https://apisix.apache.org/zh/docs/apisix/plugins/cors/)。

## 前置要求

1. 参考对应文档[新建 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#新建-api)。

## 为工作分区内所有 API 启用 CORS

假设我们要为工作分区内所有已有 API 及未来可能会增加的 API, 都启用相同的 CORS 配置，只允许`cors.test.com`来源的请求。

为此，我们需要将 CORS 插件作为全局插件启用。

参考对应文档[启用全局插件](https://docs.apiseven.com/enterprise/user-manual/cluster/global-plugin#启用全局插件)。

在【**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮】中，选择`CORS`插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数。（可选，部分插件无需配置任何参数即可使用）】中，修改`allow_origins`字段为`cors.test.com`。

:::info

- `allow_origins`设置的默认值`*`，表示允许来自任何站点的CORS请求。
- 如果需要为不同的 API 设置不同的`allow_origins`设置，则不建议使用全局插件，请参考”为工作区内的特定 API 启用 CORS。“

:::

## 为工作分区内单个 API 启用 CORS

假设我们要为`CreateOrders`这个 API 启用 CORS，只允许`cors.test.com`来源的请求。

### 创建包含 CORS 插件的插件模板

参考对应文档[创建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮】中，选择`CORS`插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数。（可选，部分插件无需配置任何参数即可使用）】中，修改`allow_origins`字段为`cors.test.com`。

:::info

- `allow_origins`设置的默认值`*`，表示允许来自任何站点的CORS请求。

:::

### 将插件模板应用到 API

参考对应文档[配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【**步骤9**：编辑 API 的属性】中，将插件模板修改为上一步创建的包含 CORS 插件的插件模板。

## 验证

借用test-cors网站进行模拟验证。

**步骤1**：在网络浏览器中访问https://test-cors.org/。

**步骤2**：在test-cors.org网站界面上，您将看到设置请求参数的选项，如URL、HTTP方法、请求头、请求体等。根据您的要求，将目标URL设置为您的`CreateOrders`这个 API。

**步骤3**：在请求头中将`Origin`头设置为`cors.test.com`，表示请求来自“cors.test.com”。

**步骤4**：点击`Fetch`或`Submit`按钮，将 CORS 请求发送到目标 URL。

**步骤5**：test-cors.org将模拟 Web 浏览器的 CORS 行为，并在网页上显示来自目标服务器的响应。您不应该收到 CORS 错误。

**步骤6**：将请求头中的`Origin`头更改为`cors.error.com`或其他任意来源，然后单击`Fetch`或`Submit`按钮。

**步骤7**：您将能够在网页上看到相应的错误信息，如“CORS被阻止”，“从源'cors.test.com'到目标URL的XMLHttpRequest访问已被CORS策略阻止”，等等。
















