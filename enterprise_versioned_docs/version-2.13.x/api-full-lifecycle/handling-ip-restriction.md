---
title: 阻止特定 ip 访问 API
slug: /api-full-lifecycle/handling-ip-restriction
tags:
- API7 Enterprise
---

在当今数字化时代，API 已成为珍贵的资产。它的作用跨越了许多领域，但这也使其成为网络攻击的目标。为了保护某些敏感 API 的安全，阻止特定 IP 地址访问 API 和使用 IP 白名单成为了延长 API 生命周期的最佳实践之一。
阻止特定 IP 地址访问 API 可以有效地限制来自某些地区或者某个网络的恶意攻击者的访问，而 IP 白名单则可以限制 API 只能从可信的来源接收请求。因此，这两种措施的混合使用可以提高 API 的安全性，减少恶意攻击对 API 的威胁。
开发团队和网络管理员应该采取这些措施来保证 API 的可靠性和安全性。

在本文中，我们将探讨如何使用 API7 Enterprise 平台实现 API 的 IP 限制功能。

## 背景知识

为了实现 ip restriction 功能，我们需要在了解 Apache APISIX 的 [ip restriction](https://apisix.apache.org/docs/apisix/plugins/ip-restriction/) 插件的配置属性。

通过阅读官方文档，我们可以了解到 ip restriction 有 3 个属性：whitelist、blacklist、message。接下来详细了解一下。

### whitelist: 白名单

白名单属性对于只希望特定 IP 地址或 CIDR 范围能够访问我们的 API 的情况非常有用。我们可以在这个属性中添加具体的 IP 地址或 CIDR 范围，以便只有这些地址才能够访问您的 API。例如：

```json
"ip-restriction": {
  "whitelist": ["10.0.0.0/8", "192.168.1.1"]
},
```

在这个配置中，只有IP地址为 192.168.1.1 或者 CIDR 范围为 10.0.0.0/8 的用户才能够访问该 API 接口。如果用户不在白名单中，则会收到一条错误信息。

### blacklist: 黑名单

黑名单属性允许我们限制特定 IP 地址或 CIDR 范围的访问后，拒绝它们的访问请求。如果希望避免特定用户或组织访问我们的 API，可以使用这个属性进行限制。例如：

```json
"ip-restriction": {
  "blacklist": ["10.0.0.0/8", "192.168.1.1"]
},
```

在这个配置中，CIDR 范围为 10.0.0.0/8 或 IP 为 192.168.1.1 的用户将无法访问该 API 接口。如果用户在黑名单中，则会收到一条错误信息。

:::info

- whitelist 和 blacklist 属性无法同时在同一个服务或路由上使用，只能使用其中之一。

:::

### message: 自定义错误信息

在未经允许的 IP 访问 API 时 ip-restriction 插件允许您自定义返回消息。通过配置 message 属性，我们可以自定义返回给用户错误信息，以便更好地提示未允许访问的用户。例如：

```json
"ip-restriction": {
  "whitelist": ["10.0.0.0/8", "192.168.1.1"],
  "message": "Sorry, your IP address is not allowed."
},
```

在这个配置中，只有CIDR 范围为 10.0.0.0/8 或 IP 为 192.168.1.1 的用户可以访问该 API 接口。如果用户不在白名单中，则会收到错误消息：`Sorry, your IP address is not allowed.`。

## 前置要求

1. 参考对应文档[插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template)。

## 创建包含 ip-restriction 插件的插件模板

接下来，我们将以配置 API IP 白名单为例。

参考对应文档[新建插件模板](https://docs.apiseven.com/enterprise/user-manual/cluster/plugin-template#新建插件模板)。

在【**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮】中，选择`ip-restriction`插件。
在【**步骤11**： 在`配置Raw Data`中，编辑插件的参数】中，填入如下配置：

```json
{
  "whitelist": ["你的本地外网IP"],
  "message": "Sorry, your IP address is not allowed."
}
```

### 将插件模板应用到 API

假设我们需要给创建商品（`${BASE_URL}/products`）的接口配置一个配置 IP 白名单。

我们需要在`API 列表`中，找到对应的 API。参考对应文档[配置 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#配置-api)。

在【**步骤9**：编辑 API 的属性】中，将插件模板修改为上一步创建的包含 ip-restriction 插件的插件模板。

## 验证

前面我们配置了以仅仅允许本机 IP 地址访问 API，接下来我们将验证这个配置。

**步骤1**：打开终端，使用curl命令发送 API 请求：
```shell
curl -X POST -d "{xxx}" -v http://${BASE_URL}/products
```
其中，`http://${BASE_URL}/products` 是我们创建的 API 的访问地址。

**步骤2**：此时应该可以正常请求并获得 API 响应。这说明我们的 IP 是可以正常访问 API 的。

**步骤3**：在同一终端中，使用curl命令并带上代理参数再次发送 API 请求：

```shell
curl -x http://proxy-server:port -d "{xxx}" -X POST http://${BASE_URL}/products
```

其中，`-x http://proxy-server:port` 表示对 curl 命令启用 http 代理（当然，前提是在此步骤之前，本地需要有一个代理服务），这样访问 API 的 IP 就会发生变化。

**步骤4**：此时应该返回一个`Sorry, your IP address is not allowed.`的错误，因为这个新的 IP 地址不允许访问这个 API。
