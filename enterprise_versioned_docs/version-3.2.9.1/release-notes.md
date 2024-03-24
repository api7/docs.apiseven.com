---
title: 版本说明
slug: /release-notes
---

## 版本 3.2.9.1

**发布日期*: 2024-03-19

### 新增功能

本节重点介绍 3.2.9.1 版本的一些新增功能。

#### 支持自定义插件管理

API7 企业版支持上传你自行编写的自定义插件，以扩展 API 管理的功能。详情见[新增自定义插件](./best-practices/custom-plugin.md)

#### 支持 OIDC 第三方登录

API7 企业版即 LDAP 之后，新增支持对接 OIDC 第三方登录。详情见[如何设置第三方登录](./best-practices/sso.md).

#### 将服务标签作为 API 提供者授权范围

通过将服务标签作为为API提供者的范围，你可以授予他们访问带有特定标签的所有服务的权限。这将有助于减轻超级管理员的工作负担。通常，可以使用“部门”标签对服务进行分组。此后该部门的用户将能够访问属于该部门的所有服务。

## 版本 3.2.8.1

**发布日期**： 2024-02-08

### 新增功能

本节重点介绍 3.2.8.1 版本的一些新增功能。

#### 支持 Nacos 服务发现

API7 企业版利用服务发现功能自动检测可用的上游服务，并将其地址保存在数据库（也被称之为服务注册中心）中。因此，API 网关能够通过服务注册中心获取最新的上游地址列表，确保所有请求都被转发到健康的上游节点。

在本版本中，API7 企业版支持与 Nacos 服务发现集成。用户可以使用 Nacos 服务发现来[发布服务](./getting-started/publish-service.md)和[在网关组之间同步服务](./getting-started/sync-service.md)。

#### 支持 LDAP SSO 登录

API7 企业版支持 LDAP 单点登录（Single Sign-On，SSO）。将 API7 企业版与 LDAP 集成后，用户可以直接使用 LDAP 用户名和密码登录 API7 控制台，创建和管理 API7 网关资源。有关如何配置 LDAP SSO 登录方法的具体信息，参见[配置 LDAP 单点登录](./best-practices/sso.md)。

#### 支持使用 Kubernetes 添加网关实例

用户使用[网关实例](/key-concepts/gateway-instances.md)来处理流量。在本版本中，API7 企业版支持使用 Kubernetes 向网关组添加网关实例。有关如何通过 Kubernetes 添加网关实例的具体信息，参见[添加网关实例](./getting-started/add-gateway-instance.md)。
