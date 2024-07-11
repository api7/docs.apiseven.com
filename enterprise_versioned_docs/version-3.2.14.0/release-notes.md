---
title: 更新日志
slug: /release-notes
---

## 3.2.14.0 版本

**发布日期：** 2024-07-08

### 新功能

#### 全新的访问控制机制

:::info

这是一项不兼容变更。旧版本的规则不能保留。

:::

API7 企业版改进了传统的基于角色的权限，采用了权限策略架构，通过分配给角色的可复用策略来实现精细的访问控制。请参阅[角色和权限策略](./key-concepts/roles-and-permission-policies.md)。

### 功能优化

#### 配置路由优先级

在特定场景下，你可以在两个不同的服务中配置相同的路由。通过优先级确定哪个路由处理请求。具有较高指定优先级的路由将首先被使用。

#### 强化 mTLS 证书安全

改进了以下问题：

- 过长的证书：证书字符串太长，应该缩短。
- 不必要的标记：证书包含不必要的标记，应该删除。
- 共享 CA：为多个证书使用相同的证书颁发机构 (CA) 是不安全的。
- 证书不匹配处理：当发生证书不匹配时，握手应立即失败，拒绝客户端的请求，而不是继续进行进一步的验证。

#### 在 API7 Helm Chart 中包含新的参数 `lua_shared_dict`

为 Helm chart 引入了一个新的参数。

### 缺陷修复

- 从旧版本升级可能会导致上游数据丢失或 404 错误。
- 服务请求 URL 更新期间遇到 UI 错误。
- 修复了开发者门户库问题。
- 修复了 HTTP logger 插件内存泄漏。
- 前端和后端密码策略不一致。
- 当 GET 请求与任何路由都不匹配时，`data-mask` 插件会报告错误。
- ApisixUpstream CRD 的 status 字段记录不正确。
- 数据面支持配置监控数据的报告间隔。
- 修复了配置插件元数据后的警告日志。
- 修复了插件重新加载问题。
- 减少 PostgreSQL 连接数。
- 优化前端资源消耗。
- 删除 FQDN 中的尾随点。
- 插件元数据应该能够被删除。

## 3.2.11.8 版本

**发布日期：** 2024-06-26

### 缺陷修复

- 通过减少 etcd 调用来降低 API 延迟。
- Kine 数据库连接池配置可以正常工作。

## 3.2.11.7 版本

**发布日期：** 2024-06-24

### 缺陷修复

- 提升 API 性能。
- 数据面支持禁用遥测数据收集和配置报告间隔。
- 自定义插件即使没有 schema 定义也可以正常工作。

## 3.2.11.6 版本

**发布日期：** 2024-06-24

### 缺陷修复

- 大数据集不再导致 etcd range API 错误。

## 3.2.13.0 版本

**发布日期：** 2024-06-19

### Admin API 不兼容变更

1. 服务模板 API 已迁移到 "/api/services/template" 路径前缀下。

- [服务模板 API](https://docs.api7.ai/enterprise/reference/admin-api#tag/Services-Template)
- [路由模板 API](https://docs.api7.ai/enterprise/reference/admin-api#tag/Routes-Template)

2. 原始的 "/apisix/admin/services" 端点现在需要 gateway_group_id 参数。

- [网关组上的服务 API](https://docs.api7.ai/enterprise/reference/admin-api#tag/Services)
- [网关组上的路由 API](https://docs.api7.ai/enterprise/reference/admin-api#tag/Routes)

### 新增功能

#### 在网关组上创建/更新服务而不发布

如果版本控制不是您的要求，您现在可以直接在网关组上创建服务。这些服务会立即生效，无需单独的发布步骤。这简化了部署过程并节省了时间。

但是，重要的是要考虑所涉及的权衡。通过绕过发布阶段，您也失去了轻松回滚到以前版本或跟踪版本更改的能力。

有关详细信息，请参阅最新的入门教程：[启动您的第一个 API](./getting-started/launch-your-first-api.md)。

#### 与 Ingress Controller 集成（UI 支持）

API7 Gateway 正式推出 Ingress Controllers，这是一种新型的网关组。虽然控制台提供了方便的管理功能来创建和查看您的 Ingress Controller，但配置修改需要对任何配置更改采用声明方式。

### 功能优化

#### 搜索网关组名称并按标签过滤

使在网关组列表中查找所需的特定网关组变得更加容易。

#### 保护配置文件中的敏感数据

数据库的 DSN 配置（包括访问地址、用户名和密码）可以通过环境变量和 Helm 图表进行配置。

#### 支持 Prometheus 认证

Prometheus 远程写入现在支持 Basic Auth/mTLS。

#### 支持 SSL 变量的 Secret 功能

使用加密的 Secret 保护 `ssl.certs` 和 `ssl.keys`。

### 缺陷修复

- 设置标头后，`ctx.var` 变量将立即更新。
- 无法上传重复的 SSL 证书。

## 3.2.11.5 版本

**发布日期：** 2024-06-18

### 缺陷修复

- ssl_verify 配置现在适用于登录选项 OIDC 和 LDAP 协议。

## 3.2.11.4 版本

**发布日期：** 2024-06-07

### 缺陷修复

- 保护与 API 相关的登录选项中的敏感字段。

## 版本 3.2.12.0

**发布日期**: 2024-05-24

### Admin API 不兼容变更

1. service status 字段从 0: 启用，1: 禁用 变更为 0:禁用，1: 启用

- [Publish a service](https://docs.api7.ai/enterprise/reference/admin-api#tag/Services/paths/~1api~1services~1publish/post)
- [Update service runtime configurations by ID](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/changeServiceRuntimeConfiguration)
- [Get all published services in Gateway Group](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/listPublishedService)

2. consumer api 移除 id 字段，使用 gateway group id & username 做查询、删除

- [Consumers APIs](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers)

3. ssl 相关 api 强制 gateway group id 参数

- [SSL APIs](https://docs.api7.ai/enterprise/reference/admin-api#tag/SSLs)

### 新增功能

#### 四层路由（Stream Route）

API7 网关现在可以处理四层流量，比如与数据库或 Kafka 的连接。 添加一个四层类型的服务，并在其中添加若干个四层路由（Stream Route，即可[转发四层流量](./getting-started/proxy-l4-traffic.md).

#### 自定义角色 (控制台支持)

当默认提供的角色无法满足需求时，你可以自行设计自定义角色，实现精细化权限控制。可参阅[添加自定义角色](./getting-started/rbac.md)

#### Ingress 控制器(Beta 测试版, 仅 API 支持)

集成 Ingress 控制器.

### 功能优化

#### 优化左侧导航菜单

- 用户登录后落地页改为网关组菜单中已发布服务。
- **服务** 菜单项改名为 **服务中心**。

### 缺陷修复

- 使用 [key-auth](https://docs.api7.ai/hub/key-auth) 插件时，禁止出现重复的 API 密钥。
- 使用 [ua-restriction](https://docs.api7.ai/hub/ua-restriction) 插件时，允许同时配置黑名单和白名单。
- 重置用户密码时不会引起访问令牌失效。
- 使用 [loggly](https://apisix.apache.org/zh/docs/apisix/plugins/loggly/) 插件时配置能校验成功。
- API7 网关中的状态字段取值含义和 Apache APISIX 保持一致。

## 版本 3.2.11.3

**发布日期: 2024-05-20

### 缺陷修复

- etcd watch 可以正确地传递 SNI。
- API7 企业版在安装时会先尝试创建新的数据库。如果没有对应权限导致失败，会使用预先指定的已有数据库，避免安装失败。

## 版本 3.2.11.2

**发布日期**: 2024-05-20

### 缺陷修复

- 标签支持最长 64 个字符，且可以包含空格。
- 即使包含 schema 校验错误，也可以正常完成与数据面的配置同步，避免数据丢失或工作流中断。

## 版本 3.2.11.1

**发布日期**: 2024-05-08

### 新增功能

#### SSO 角色映射

设置自动角色映射，可以避免超级管理员需要频繁为 SSO 登陆的用户分配角色。 满足预先设置的映射条件的用户，在登陆 API7 企业版时会自动获得相应的角色权限。详情参阅[设置角色映射](./best-practices/sso.md#设置角色映射)。

#### SCIM 用户同步

使用 SCIM 用户同步协议简化 SSO 用户管理。它可以自动从所有支持了 SCIM 协议的、已经添加了登陆选项的身份提供商同步用户数据，确保用户信息一致性。新用户在身份提供商注册，或用户在身份提供商注销，API7 企业版即可得到及时通知，避免新用户无法登陆或已注销用户非法登陆。详情参阅[Sync User Data from IdP](./best-practices/sso.md#从身份提供商同步用户数据)。

#### 自定义角色 (Beta, 仅 API 支持)

如默认角色不满足业务需求，现在你可以设计自定义角色，自由组合权限，进行细粒度权限控制。
该功能即将在后续版本支持控制台配置。

### 功能优化

#### 升级到 OpenSSL 3

提升安全性，性能，和可靠性。

#### 全局插件执行顺序优化

为了简化全局插件的管理，API7 企业版 会将多个全局插件配置整合到一起，确保插件配置和执行顺序不会产生冲突。

### 缺陷修复

#### 前端补全 HTTP 协议检测

生成的网关实例部署脚本有时无法正确检测是否需要 HTTP 或 HTTPS 协议，这可能会导致部署时出现错误。

#### 上传 SSL 证书错误

为网关组 A 上传的 SSL 证书可能会意外分配给网关组 B。

#### 支持主机级动态设置 TLS 协议版本

同步集成了在 Apache APISIX 中已解决的问题。

## 版本 3.2.10.1

**发布日期**：2024-04-28

### 新增功能

#### 支持 MySQL 5.7

现在起 API7 企业版支持使用 MySQL 5.7 作为持久化数据存储。

## 版本 3.2.10.0

**发布日期**: 2024-04-22

### 不兼容变更

#### 令牌绑定用户

令牌改为和具体用户绑定，且和用户享有相同的角色权限。如果用户被删除，绑定的令牌也将立刻失效被删除。

## 版本 3.2.9.5

**发布日期**：2024-04-16

### 新增功能

#### 上游 mTLS（仅 API 支持）

支持在 API7 网关和上游服务之间配置 mTLS 认证。 mTLS 是一种通信安全形式，要求双方彼此展示证书。这确保了双方都是其声称的身份，并且在它们之间传输的数据是加密的。
该功能即将在后续版本支持控制台配置。

## 版本 3.2.9.4

**发布日期**: 2024-04-07

### 缺陷修复

#### CPU 核心数判断

修复了当 CPU 核心数达到最大限制时出现的问题。

## 版本 3.2.9.3

**发布日期**: 2024-04-03

### 新增功能

#### 集成 Vault(Beta)

将敏感信息存储到 Vault中。仅支持通过 Admin API 使用，UI 使用即将推出。

## 版本 3.2.9.2

**发布日期**: 2024-04-01

### 新增功能

#### 支持 SAML 第三方登录

API7 企业版新增支持对接 SAML 第三方登录。详情见[如何设置第三方登录](./best-practices/sso.md)。

#### 新插件： Data Mask

Data-mask 插件提供了在请求头、请求体和URL查询中移除或替换敏感信息的能力。了解更多： [Data Mask](https://docs.api7.ai/hub/data-mask)。

### 功能优化

#### 忽略路径前缀

你可以选择在向上游发送请求时跳过路径前缀。这种调整对用户来说是不感知的，并且在使用不同的路径前缀来识别发送到不同网关组的 API 时可能很有用。

#### 优化健康检查配置 UI

提供一个更直观友好的健康检查配置交互界面。

#### 升级加密算法

从 AES128 升级到 AES 256。

#### 性能提升

消除了禁用插件后带来的性能损耗。

## 版本 3.2.9.1

**发布日期*: 2024-03-19

### 新增功能

#### 支持自定义插件管理

API7 企业版支持上传你自行编写的自定义插件，以扩展 API 管理的功能。详情见[新增自定义插件](./best-practices/custom-plugin.md).

#### 支持 OIDC 第三方登录

API7 企业版即 LDAP 之后，新增支持对接 OIDC 第三方登录。详情见[如何设置第三方登录](./best-practices/sso.md).

#### 将服务标签作为 API 提供者授权范围

通过将服务标签作为为API提供者的范围，你可以授予他们访问带有特定标签的所有服务的权限。这将有助于减轻超级管理员的工作负担。通常，可以使用“部门”标签对服务进行分组。此后该部门的用户将能够访问属于该部门的所有服务。

## 版本 3.2.8.1

**发布日期**： 2024-02-08

### 新增功能

#### 支持 Nacos 服务发现

API7 企业版利用服务发现功能自动检测可用的上游服务，并将其地址保存在数据库（也被称之为服务注册中心）中。因此，API 网关能够通过服务注册中心获取最新的上游地址列表，确保所有请求都被转发到健康的上游节点。

在本版本中，API7 企业版支持与 Nacos 服务发现集成。用户可以使用 Nacos 服务发现来[发布服务](./getting-started/publish-service.md)和[在网关组之间同步服务](./getting-started/sync-service.md)。

#### 支持 LDAP SSO 登录

API7 企业版支持 LDAP 单点登录（Single Sign-On，SSO）。将 API7 企业版与 LDAP 集成后，用户可以直接使用 LDAP 用户名和密码登录 API7 控制台，创建和管理 API7 网关资源。有关如何配置 LDAP SSO 登录方法的具体信息，参见[配置 LDAP 单点登录](./best-practices/sso.md)。

#### 支持使用 Kubernetes 添加网关实例

用户使用[网关实例](/key-concepts/gateway-instances.md)来处理流量。在本版本中，API7 企业版支持使用 Kubernetes 向网关组添加网关实例。有关如何通过 Kubernetes 添加网关实例的具体信息，参见[添加网关实例](./getting-started/add-gateway-instance.md)。
