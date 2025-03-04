---
title: 更新日志
slug: /release-notes
---

## 3.2.16.3 版本

**发布日期：** 2024-10-21

### 新功能

#### 引用在 AWS Secrets Manager 中的密钥（Secrets）

*密钥（Secrets）* 对象是一条需要防止未经授权访问的敏感信息，而 *Secret 提供商（Secret Provider）* 对象用于设置与外部密钥管理器（HashiCorp Vault、AWS Secret Manager 等）的集成，以便 API7 网关可以在运行时动态地建立连接并从密钥管理器中获取密钥。

有关更多详细信息，请参阅 [引用在 AWS Secrets Manager 中的密钥](./api-security/aws-secrets-manager.md)。

#### 用于 API 身份验证的匿名消费者

匿名消费者无需身份验证，但可以限制访问速率。你可以在服务/路由上的身份验证插件中配置匿名消费者，然后与速率限制插件结合使用。

有关详细信息，请参阅以下文档：
    
* [对匿名消费者进行速率限制](./api-security/rate-limiting.md#add-an-anonymous-consumer)

#### 安全

* 在数据面上添加了用于自身健康检查的状态接口。有关详细信息，请参阅 [启用数据面健康检查以实现高可用性](./high-availability/high-availability-installation.md#health-check)。

### 功能优化

* 支持 200 万量级消费者。
* 消费者列表支持按名称排序。
* 从 API7 网关中删除了 `conf_server`。
* 改进了速率限制相关插件以使其更加灵活，允许针对每个服务/路由进行特定于消费者的速率限制。有关详细信息，请参阅 [Limit Count](https://docs.api7.ai/hub/limit-count) 插件 和 [Limit Req](https://docs.api7.ai/hub/limit-req) 插件。
* 升级请求和响应转换插件：
  * 在请求转换期间，支持传递 Lua 代码以获取值。
  * 对齐 Kong 的请求转换和响应转换的功能。
* 显示服务中添加的路由总数。
* 将插件列表从数据面配置更改为控制面配置。**与 3.2.15.0 以下版本不兼容**
* 在告警策略中添加了证书到期提醒。
* 在因多设备登录而重定向到登录页面之前显示通知，说明登出原因。
* 改善了前端页面响应速度和加载速度。
* 优化了“使用上游超时”UI。
* 优化了 API7 Portal (Beta) 列表页渲染速度。

### 缺陷修复

* 解决了问题：现在可以在控制台上为单个路由配置多个路径。
* 解决了问题：[OpenTelemetry](https://docs.api7.ai/hub/opentelemetry) 插件不支持 `set_ngx_var`。
* 解决了问题：[ACL](https://docs.api7.ai/hub/acl) 插件 在正常使用情况下不应输出警告日志。
* 增强了数据面 `lua_ssl_trusted_certificate` 配置项。
* 将 [Body Transformer](https://docs.api7.ai/hub/body-transformer) 插件代码与 APISIX 主线版本同步。
* 解决了问题：当在服务上配置了流模块不可用的插件时，数据面会打印错误日志。
* 将 Token 的 `Edit` 操作更改为 `Edit Name`。
* 解决了问题：编辑服务注册中心时，服务发现类型与表单不符。

## 3.2.16.2 版本

**发布日期：** 2024-10-11

### 缺陷修复

* 修复了消费者中插件配置更新不生效的问题。

## 3.2.16.1 版本

**发布日期：** 2024-10-04

### 功能优化

* 提升了 API7 Portal(Beta) 性能。

### 缺陷修复

* 解决了删除路由时 `radixtree_host_uri` 路由模式下的 panic 问题。
* 解决了自定义认证类型插件与[Multi Auth](https://docs.api7.ai/hub/multi-auth) 插件不兼容的问题。

## 3.2.16.0 版本

**发布日期：** 2024-09-30

### 新功能

#### 引用在 HashiCorp Vault 中的密钥

:::info

这是一项不兼容变更。`secrets` 资源已重命名为 `secret provider（Secret 提供商）`，以符合最佳实践并促进与外部密钥管理工具的集成。所有相关的 API 都已相应更新。

:::

*密钥（Secrets）* 对象是一条需要防止未经授权访问的敏感信息，而 *Secret 提供商（Secret Provider）* 对象用于设置与外部密钥管理器（HashiCorp Vault、AWS Secret Manager 等）的集成，以便 API7 网关可以在运行时动态地建立连接并从密钥管理器中获取密钥。

有关更多详细信息，请参阅 [在 HashiCorp Vault 中引用密钥](./api-security/hashicorp-vault.md)。

### 功能优化

* 【不兼容变更】**删除了 JWT 插件签发令牌的功能，并删除了上传私钥的功能。** 有关详细信息，请参阅 JWT Auth 插件文档。
* 增加了对删除离线网关实例的支持。
* 为使用 Redis 的插件添加了 `sync_rate` 参数，以控制与 Redis 同步计数器的频率。实时同步会给 Redis 带来很大的压力。
* 支持通过 URL 访问特定的路由详情页。
* 支持 API7 Portal(Beta) 的 API 在线测试。
* UI 改进：缩短了自定义主机输入框。
* UI 改进：将负载均衡算法下拉框改为单选框。
* UI 改进：新建标签样式修改。

### 缺陷修复

* 修复了问题：未正确清理的 `config_listen.sock` 导致数据面无法启动。
* 修复了问题：禁用服务后请求接口报 `404` 错误。
* 为 [Splunk-Hec-Logging](https://docs.api7.ai/hub/splunk-hec-logging) 插件添加了 `keepalive_timeout` 配置。
* 修复了消费者的标签分割后各元素还保留分隔符前后的空白问题。
* 修复了问题：[Skywalking](https://docs.api7.ai/hub/skywalking) 插件销毁后无法重新启动。
* 修复了问题：数据面没有正确处理非认证插件配置在消费者上时的加解密。
* 修复了问题：内置权限策略应无法删除。
* 修复了问题：ingress controller 类型网关组应能够删除。
* 修复了问题：数据面 path prefix 应当支持配置 `/`。
* 修复了 UI 问题：点击标签页面跳转到搜索框。
* 修复了 UI 问题：新建令牌并删除令牌后，新建提示没有消失。
* 为插件分类添加了中文翻译。
* 扩大了插件描述文字框，以完整显示插件的介绍。
* 修复了新建令牌并删除令牌后，新建提示没有消失的问题。

## 3.2.15.2.1 版本

**发布日期：** 2024-12-09

### 缺陷修复

* 修复了问题：当 DP 管理器收到截断的 Prometheus 指标时，它会进入无限循环。
* 修复了问题：由于 watch 中断，数据面与控制面的同步可能会中断。

## 3.2.15.2 版本

**发布日期：** 2024-09-19

### 缺陷修复

* 调整 [Attach Consumer Label](https://docs.api7.ai/hub/attach-consumer-label) 插件到 `before_proxy` 阶段执行。

## 3.2.15.1 版本

**发布日期：** 2024-09-18

### 缺陷修复

* 解决了使用令牌获取 `instance_token` 返回 401 的问题。

## 3.2.15.0 版本

**发布日期：** 2024-09-14

### 新功能

#### 消费者凭据

:::info

这是一项不兼容变更。不再支持为消费者创建新的身份验证插件（Key Auth、Basic Auth、JWT Auth 或 HMAC Auth）。请改用消费者凭据。现有的插件配置将保持可访问和可编辑，直到被禁用。

:::

消费者凭据通过允许多个凭据对应每个消费者来增强灵活性。它们取代了传统的身份验证插件，如 [Key Auth](https://docs.api7.ai/hub/key-auth)、[Basic Auth](https://docs.api7.ai/hub/basic-auth)、[JWT Auth](https://docs.api7.ai/hub/jwt-auth) 和 [HMAC Auth](https://docs.api7.ai/hub/hmac-auth)，提供了更友好的用户体验。有关详细信息，请参阅[管理消费者凭据](./api-consumption/manage-consumer-credentials.md)。

### 安全

* 根用户 `admin` 成为受保护帐户，角色、权限策略或其他用户无法对其进行修改。其他用户无法删除它或重置其密码。

### 功能优化

* 现在支持按名称按字母顺序对服务列表进行排序。
* 向每个审计日志添加了网关组 ID，以便你可以按网关组搜索或过滤审计日志。
* 为已离线超过 7 天的自动删除的网关实例记录了审计日志。
* 支持按标签过滤网关组上发布的服务。
* 确保控制面地址不以斜杠结尾。
* 在 Helm 中支持注释。
* 提供配置项控制数据面心跳、遥测请求的超时，并且调整默认值为 30s。

### 缺陷修复

* 优化了在启用 SCIM 后用户通过 SSO 登录但系统中不存在该用户时的错误消息。
* 修复了修改未发布版本的服务后灰度配置调整失败的问题。

## 3.2.14.4.1 版本

**发布日期：** 2024-12-09

### 缺陷修复

* 修复了问题：当 DP 管理器收到截断的 Prometheus 指标时，它会进入无限循环。
* 修复了问题：由于 watch 中断，数据面与控制面的同步可能会中断。

## 3.2.14.4 版本

**发布日期：** 2024-08-14

### 新功能

#### 覆盖每个路由的上游超时

API7 网关允许为各个路由配置不同的上游超时，以覆盖上游侧的超时配置，从而实现对请求处理的精细控制。

#### 用户权限边界

权限边界定义了用户的最大允许权限，作为防止用户越权的保障措施。

### 安全提升

* 升级了前端依赖项。
* 确保单设备登录 - 新登录将撤销之前存在的活跃会话。
* 禁止导入旧许可证。
* 升级了 OpenResty 版本以修复安全漏洞。

### 功能优化

* 在服务中心列表和已发布服务列表中添加了服务描述。
* 为服务注册中心添加了“连接中”状态，以避免误解。
* 自定义插件支持代码混淆和加密存储。
* 在使用测试环境许可证时显示通知。
* 为插件管理和修改实现了基于卡片的 UI。
* 支持配置自定义插件元数据。
* 最小化了 API7 企业版的镜像大小。

### 缺陷修复

* 修复了将服务版本发布到网关组时，服务运行时配置参数（例如，主机、路径前缀）的空值丢失的问题。
* 消除了 dry-run 模式下调用许可证上传时生成的不必要的审计日志。
* 解决了路由创建和修改时间戳不正确的问题。
* 解决了插件元数据 Schema 的校验报错。
* 提高了服务搜索准确性。
* 解决了服务模板发布期间插件丢失的问题。

## 3.2.14.3 版本

**发布日期：** 2024-08-06

### 缺陷修复

* 支持在 SSL 证书中引用 `$env`。
* 解决了标签包含句点时 UI 不稳定的问题。

## 3.2.14.2 版本

**发布日期：** 2024-07-30

### 缺陷修复

* 解决了在控制台上查看 Ingress Controller 路由时的报错。
* 修复了在 Kubernetes 上安装网关实例时缺少默认 Helm release 名称的问题。
* 通过使用 ID 令牌优化了与 Azure AD 的集成。
* 修复了服务模板和已发布的网关组之间可能出现插件不一致的问题。

## 3.2.14.1 版本

**发布日期：** 2024-07-22

### 功能优化

#### 导入 OpenAPI 以在网关组上创建服务

只需将 OpenAPI 文件直接导入网关组，即可创建新服务及其所有路由。

#### 通过 API7 Portal 实现精细的访问控制

利用自定义角色和权限策略对 API 产品的访问进行精细控制。

#### 安全提升

* 控制面地址必须为 HTTPs。
* 移除 `ngx.req.get_post_args(0)` 的使用，改用默认值以避免潜在的攻击。
* 重新生成 Ingress Controller 部署脚本现在需要二次确认。

#### 无需版本控制即可管理已发布服务基础信息

现在可以修改服务名称/描述/标签，而无需发布新版本。

#### 服务设置期间首次创建路由

你可以选择从一开始就定义服务里的第一条初始路由，无需额外的步骤，简化了工作流程。

### 缺陷修复

* 将 [Datadog](https://docs.api7.ai/hub/datadog) 插件修复 (https://github.com/apache/apisix/pull/11354) 合并到 API7 企业版。
* 修复了控制台上数据面不可见的问题。
* 修复了一个问题：将 Prometheus 数据报告方法从远程写入更改为抓取后，服务注册表状态始终显示为“断开连接”。
* 修复了通过控制台部署自定义插件后，数据面遇到错误的问题。
* 修复了前端错误：不应该允许通过控制台在 Ingress Controller 网关组上修改已发布服务的上游。
* 去掉不该出现的报错通知：切换到节点时，即使启用了健康检查，仍然存在提示用户启用健康检查的提示。
* 修复问题：上传自定义插件时，如果出现解析错误，错误消息中显示的插件名称与实际文件名不匹配。

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
- 修复了 API7 Portal (Beta) 库问题。
- 修复了 [HTTP Logger](https://docs.api7.ai/hub/http-logger) 插件内存泄漏。
- 前端和后端密码策略不一致。
- 当 GET 请求与任何路由都不匹配时，[Data Mask](https://docs.api7.ai/hub/data-mask) 插件会报告错误。
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

如果版本控制不是你的要求，你现在可以直接在网关组上创建服务。这些服务会立即生效，无需单独的发布步骤。这简化了部署过程并节省了时间。

但是，重要的是要考虑所涉及的权衡。通过绕过发布阶段，你也失去了轻松回滚到以前版本或跟踪版本更改的能力。

有关详细信息，请参阅最新的入门教程：[启动你的第一个 API](./getting-started/launch-your-first-api.md)。

#### 与 Ingress Controller 集成（UI 支持）

API7 Gateway 正式推出 Ingress Controllers，这是一种新型的网关组。虽然控制台提供了方便的管理功能来创建和查看你的 Ingress Controller，但配置修改需要对任何配置更改采用声明方式。

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

1. service status 字段从“0: 启用，1: 禁用”变更为“0: 禁用，1: 启用”

- [Publish a service](https://docs.api7.ai/enterprise/reference/admin-api#tag/Services/paths/~1api~1services~1publish/post)
- [Update service runtime configurations by ID](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/changeServiceRuntimeConfiguration)
- [Get all published services in Gateway Group](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/listPublishedService)

2. consumer api 移除 id 字段，使用 gateway group id & username 做查询、删除

- [Consumers APIs](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers)

3. ssl 相关 api 强制 gateway group id 参数

- [SSL APIs](https://docs.api7.ai/enterprise/reference/admin-api#tag/SSLs)

### 新增功能

#### 四层路由（Stream Route）

API7 网关现在可以处理四层流量，比如与数据库或 Kafka 的连接。 添加一个四层类型的服务，并在其中添加若干个四层路由（Stream Route，即可[转发四层流量](./getting-started/proxy-l4-traffic.md)。

#### 自定义角色 (控制台支持)

当默认提供的角色无法满足需求时，你可以自行设计自定义角色，实现精细化权限控制。可参阅[添加自定义角色](./getting-started/rbac.md)

#### Ingress Controller（Beta 测试版，仅 API 支持）

集成 Ingress Controller。

### 功能优化

#### 优化左侧导航菜单

- 用户登录后落地页改为网关组菜单中已发布服务。
- **服务** 菜单项改名为 **服务中心**。

### 缺陷修复

- 使用 [Key Auth](https://docs.api7.ai/hub/key-auth) 插件时，禁止出现重复的 API 密钥。
- 使用 [UA Restriction](https://docs.api7.ai/hub/ua-restriction) 插件时，允许同时配置黑名单和白名单。
- 重置用户密码时不会引起访问令牌失效。
- 使用 [Loggly](https://apisix.apache.org/zh/docs/apisix/plugins/loggly/) 插件时配置能校验成功。
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

[Data Mask](https://docs.api7.ai/hub/data-mask) 插件提供了在请求头、请求体和 URL 查询中移除或替换敏感信息的能力。

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

用户使用网关实例来处理流量。在本版本中，API7 企业版支持使用 Kubernetes 向网关组添加网关实例。有关如何通过 Kubernetes 添加网关实例的具体信息，参见[添加网关实例](./getting-started/add-gateway-instance.md)。
