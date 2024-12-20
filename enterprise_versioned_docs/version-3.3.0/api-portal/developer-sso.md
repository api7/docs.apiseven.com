---
title: 配置开发者门户 SSO 登录
slug: /api-portal/developer-sso
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

API7 的开发者门户可以配置为支持单点登录 (SSO)，以便内部和合作伙伴开发者无缝登录，从而增强用户体验和安全性。

* 通常不建议对公共开发者使用 SSO，因为它可能要求他们在你的组织的身份提供者处创建帐户。
* 开发者 SSO 配置独立于用于 API7 网关用户和 API 提供者的 API7 企业版 SSO。

## 与 SSO 集成

对于 API 提供者和开发者都属于同一组织的内部 API 门户，可以集成同一个身份提供者 (IDP) 以支持开发者 SSO 和 API7 企业版 SSO。

<Tabs
  defaultValue="LDAP"
  values={[
    {label: 'LDAP', value: 'LDAP'},
    {label: 'OIDC', value: 'OIDC'},
    {label: 'SAML', value: 'SAML'},
  ]}>
  <TabItem value="LDAP">

1. 使用导航栏左上角的按钮切换到 API7 门户。
2. 从侧边导航栏中选择 **登录设置**，然后选择 **登录选项** 选项卡。
3. 点击 **新增登录选项**。
4. 填写表单：
    * **名称**：唯一的登录名称。该名称应可供用户识别。例如，如果你将名称配置为 `Employee Account`，你将在仪表板登录中看到 `使用 Employee Account 登录` 选项。
    * **提供者**：选择 `LDAP`。
    * **主机**：LDAP 主机域。例如 `ldap.example.com`。
    * **端口**：例如 `1563`。
    * **基本识别名**：例如 `oc=users,dc=org,dc=example`。
    * **绑定识别名**：用于对用户执行 LDAP 搜索的 LDAP 绑定识别名 (DN)。此 LDAP 绑定 DN 应具有搜索要进行身份验证的用户的权限。例如 `cn=admin,dc=org,dc=example`。
    * **绑定密码**：用于向 LDAP 服务器进行身份验证的 LDAP 绑定密码。
    * **标识符**：用于标识 LDAP 用户的属性。例如 `cn`。
    * **属性映射**：将 API7 内部字段映射到相关的 LDAP 属性，以无缝集成和同步数据。
5. 点击 **新增**。

</TabItem>

<TabItem value="OIDC">

1. 使用导航栏左上角的按钮切换到 API7 门户。
2. 从侧边导航栏中选择 **登录设置**，然后选择 **登录选项** 选项卡。
3. 点击 **新增登录选项**。
4. 填写表单：
    * **名称**：唯一的登录名称。该名称应可供用户识别。例如，如果你将名称配置为 `Employee Account`，你将在仪表板登录中看到 `使用 Employee Account 登录` 选项。
    * **提供者**：选择 `OIDC`。
    * **颁发者**：OpenID connect 提供者的标识符。例如 `https://accounts.example.com`。
    * **客户端 ID**：你的应用程序的唯一标识符，由 OIDC 提供者分配。例如 `API7`。
    * **客户端密钥**：用于身份验证的密钥，由 OIDC 提供者分配。
    * **请求范围**：访问令牌通常具有不同的范围，这会限制它们的使用。例如 `profile,email`。
    * **根 URL**：用于访问 API7 以生成回调 URL 的 URL。例如 `https://auth.example.com/oidc`。
    * **SSL 验证**：默认值为开启。
5. 点击 **新增**。

</TabItem>

<TabItem value="SAML">

1. 使用导航栏左上角的按钮切换到 API7 门户。
2. 从侧边导航栏中选择 **登录设置**，然后选择 **登录选项** 选项卡。
3. 点击 **新增登录选项**。
4. 填写表单：
    * **名称**：唯一的登录名称。该名称应可供用户识别。例如，如果你将名称配置为 `Employee Account`，你将在仪表板登录中看到 `使用 Employee Account 登录` 选项。
    * **提供者**：选择 `SAML`。
    * **身份提供者元数据 URL**：用于获取有关身份提供者信息的 URL，例如其公钥、支持的 SAML 版本、签名算法等。例如 `https://idp.example.com/metadata`。
    * **服务提供者根 URL**：从身份提供者 (IdP) 请求身份验证和授权的实体。例如 `https://sp.example.com`。
    * **实体 ID**：服务提供者 (SP) 或身份提供者 (IdP) 实体的唯一标识符。它通常用作 SAML 联合中实体的全局唯一标识符。例如 `https://sp.example.com/saml/metadata`。
5. 点击 **新增**。

</TabItem>
</Tabs>

## 从 IdP 同步开发者数据

SCIM（跨域身份管理系统）是一种协议，可用于将用户和组信息从原始身份提供者 (IdP) 同步到 API7 企业版。这可以消除在多个系统中手动管理开发者和组信息的需要，从而节省时间并降低出错的风险。

使用 SCIM 配置，每当在你的 IdP 中注册或删除新用户时，API7 企业版都会自动同步开发者数据。

:::note
当开发者 SSO 和 API7 企业版 SSO 集成同一个身份提供者 (IDP) 时，请确保为每个 SSO 定义单独的 SCIM 配置。
:::

1. 使用导航栏左上角的按钮切换到 API7 门户。
2. 从侧边导航栏中选择 **登录设置**，然后选择 **SCIM** 选项卡。
3. 点击 **启用**。
4. 复制 `API7 SCIM 端点 URL` 和 `SCIM 令牌`。
5. 配置你的 IdP（如果它支持 SCIM）：
    * 登录到你的 IdP 管理控制台。
    * 找到 SCIM 配置设置（这些设置可能因你的 IdP 而异）。
    * 将复制的 API7 SCIM 端点 URL 和 SCIM 令牌粘贴到相应的字段中。
    * 保存你的配置更改并在你的 IdP 端配置它们（确保你的 IdP 支持 SCIM 协议）。

### 删除开发者登录选项

:::warning

删除登录选项将导致删除与其关联的所有开发者。

:::

1. 使用导航栏左上角的按钮切换到 API7 门户。
2. 从侧边导航栏中选择 **登录设置**，然后选择 **登录选项** 选项卡。
3. 点击目标登录选项的 **删除**。
4. 再次确认。

## 相关阅读

* 核心概念
  * [开发者](../key-concepts/developers)
