---
title: OpenAPI 转换参考
slug: /reference/openapi-adc
---

ADC 可以使用 `adc convert openapi` 命令将 OpenAPI v3.0 规范转换为 ADC 配置。本文档提供了支持的扩展/自定义属性的参考，用于配置 API7 企业版特定的功能，如路由、插件和标签。

在 API 规范的以下级别支持 ADC OpenAPI 扩展：

- 根级别：API 规范的根级别。根级别的属性将应用于整个服务。
- 路径级别：规范中的路径部分。路径级别的属性将应用于特定路由。
- 操作级别：路径部分中的每个 HTTP 方法。操作级别的属性将应用于路由的特定 HTTP 方法。
- 服务器级别：根级别、路径级别或操作级别中的服务器部分。服务器级别的属性将应用于上游。

## 支持的扩展

下表列出了支持的扩展及其级别：

|扩展|级别|说明|
|:---|:---|:---|
|`x-adc-name`|根级别|设置服务名称。|
|`x-adc-name`|操作级别|设置特定路由名称。|
|`x-adc-labels`|根级别|将标签添加到服务、路由或方法，如级别指定的那样。值可以是字符串或字符串数组（用于多个标签）。|
|`x-adc-labels`|路径级别|将标签添加到服务、路由或方法，如级别指定的那样。值可以是字符串或字符串数组（用于多个标签）。|
|`x-adc-labels`|操作级别|将标签添加到服务、路由或方法，如级别指定的那样。值可以是字符串或字符串数组（用于多个标签）。|
|`x-adc-plugins`|根级别|将插件全局添加到服务。值是一个包含一个或多个插件的对象。|
|`x-adc-plugins`|路径级别|将插件添加到路由或方法，如级别指定的那样。在操作级别添加插件将拆分路由，一个包含插件，另一个不包含插件。|
|`x-adc-plugins`|操作级别|将插件添加到路由或方法，如级别指定的那样。在操作级别添加插件将拆分路由，一个包含插件，另一个不包含插件。|
|`x-adc-plugin-[plugin-name]`|根级别|类似于 `x-adc-plugins`，但适用于单个插件。这些插件将覆盖在 `x-adc-plugins` 中配置的同名插件。|
|`x-adc-plugin-[plugin-name]`|路径级别|类似于 `x-adc-plugins`，但适用于单个插件。这些插件将覆盖在 `x-adc-plugins` 中配置的同名插件。|
|`x-adc-plugin-[plugin-name]`|操作级别|类似于 `x-adc-plugins`，但适用于单个插件。这些插件将覆盖在 `x-adc-plugins` 中配置的同名插件。|
|`x-adc-service-defaults`|根级别|在服务、路由或方法上设置服务参数，如级别指定的那样。|
|`x-adc-service-defaults`|路径级别|在服务、路由或方法上设置服务参数，如级别指定的那样。|
|`x-adc-service-defaults`|操作级别|在服务、路由或方法上设置服务参数，如级别指定的那样。|
|`x-adc-upstream-defaults`|根级别|在服务、路由或方法上设置上游参数，如级别指定的那样。|
|`x-adc-upstream-defaults`|路径级别|在服务、路由或方法上设置上游参数，如级别指定的那样。|
|`x-adc-upstream-defaults`|操作级别|在服务、路由或方法上设置上游参数，如级别指定的那样。|
|`x-adc-upstream-node-defaults`|根级别 - 服务器|在服务、路由或方法上设置上游的节点参数，如级别指定的那样。|
|`x-adc-upstream-node-defaults`|路径级别 - 服务器|在服务、路由或方法上设置上游的节点参数，如级别指定的那样。|
|`x-adc-upstream-node-defaults`|操作级别 - 服务器|在服务、路由或方法上设置上游的节点参数，如级别指定的那样。|
|`x-adc-route-defaults`|根级别|在服务、路由或方法上设置路由参数，如级别指定的那样。|
|`x-adc-route-defaults`|路径级别|在服务、路由或方法上设置路由参数，如级别指定的那样。|
|`x-adc-route-defaults`|操作级别|在服务、路由或方法上设置路由参数，如级别指定的那样。|

## 规范示例

以下规范示例显示了如何使用扩展：

```yaml
openapi: 3.1.0
info:
  title: httpbin API
  description: httpbin API for the API7 Enterprise Getting Started guides.
  version: 1.0.0
servers:
  - url: 'http://httpbin.org:80'
x-adc-labels:
  server: production
  api: httpbin
x-adc-plugins:
  key-auth:
    _meta:
      disable: false
paths:
  /anything/*:
    get:
      summary: Returns anything that is passed into the request.
      x-adc-name: httpbin-anything
      x-adc-service-defaults:
        path_prefix: /api/
      x-adc-upstream-defaults:
        timeout:
          connect: 10
          send: 10
          read: 10
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                type: string
```