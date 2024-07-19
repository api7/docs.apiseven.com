---
title: SSO 第三方登录
slug: /best-practices/sso
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

单点登录（SSO）允许用户一次登录即可访问多个系统，而无需重新输入凭据。它通过消除对多个密码的需求，提高了效率，增强了用户体验，并加强了安全性。

在API7 Enterprise中，您可以同时使用多种登录选项。您可以在API7内部创建用户，同时也可以从其他现有系统中导入用户。

## 架构原理

以 LDAP 为例：

![Architecture of LDAP](https://static.apiseven.com/uploads/2024/03/12/B3YpRXbf_LDAP-2.png)

1. **用户登录请求**：用户在登录 API7 企业版时输入他们的用户名和密码。
2. **LDAP验证**：API7 企业版将用户提供的凭据传输到 LDAP 服务器进行验证。LDAP 服务器是一个集中的用户信息管理系统，存储了用户的用户名、密码以及其他相关信息。
3. **身份验证**：LDAP 服务器验证用户的凭据是否与 LDAP 目录中存储的用户信息匹配。如果用户名和密码与 LDAP 服务器中的记录相匹配，那么身份验证就成功了。
4. **授权**：如果身份验证成功，LDAP 服务器将授权信息返回给 API7 企业版。系统基于这些信息授权用户访问相应的资源。这通常涉及到角色和权限的分配，确保用户只能访问他们被授权访问的资源。
5. **访问资源**：用户以经过验证的身份访问API7 企业版，无需重新输入凭据。

## 集成 SSO

API7 企业版支持以下实现的单点登录（SSO）。将 API7 企业版与其他用户系统集成后，你可以让现有用户登录 API7 企业版，而无需注册新的 API7 帐户。

<Tabs
  defaultValue="LDAP"
  values={[
    {label: 'LDAP', value: 'LDAP'},
    {label: 'OIDC', value: 'OIDC'},
    {label: 'SAML', value: 'SAML'},
  ]}>

   <TabItem value="LDAP">

1. 从顶部导航栏中选择 **组织**，然后选择 **设置**。
2. 点击 **新增登录选项**。
3. 填写表单：
   * **名称**：唯一的登录名称，必须与用户相同。例如：`Employee Account`。
   * **Provider**：选择 `LDAP`。
   * **Host**：LDAP 主机域名。例如，`ldap.example.com`。
   * **Port**：例如，`1563`。
   * **Base Distinguished Name**：例如，`oc=users,dc=org,dc=example`。
   * **Bind Distinguished Name**：用于执行 LDAP 搜索用户的 LDAP Bind Distinguished Name (DN)。此 LDAP Bind DN 应具有搜索被身份验证用户的权限。例如，`cn=admin,dc=org,dc=example`。
   * **Bind Password**：用于 LDAP 服务器身份验证的 LDAP 绑定密码。
   * **Identifier**：用于标识 LDAP 用户的属性。例如，`cn`。
   * **Attributes Mapping**：将 API7 内部字段映射到相关的 LDAP 属性，以无缝集成和同步数据。
4. 点击 **新增**。
  
  </TabItem>

<TabItem value="OIDC">

1. 从顶部导航栏中选择 **组织**，然后选择 **设置**。
2. 点击 **新增登录选项**。
3. 填写表单：
   * **Name**：唯一的登录名称，必须与用户相同。例如：`Employee Account`。
   * **Provider**：选择 `OIDC`。
   * **Issuer**：OpenID connect 提供商的标识符。例如，`https://accounts.example.com`。
   * **Client ID**：OIDC 提供商分配的应用程序唯一标识符。例如，`API7`。
   * **Client Secret**：用于身份验证的密钥，由 OIDC 提供商分配。
   * **Request Scope**：访问令牌通常具有不同的范围，这会限制其使用。例如，`profile,email`。
   * **Root URL**：用于访问 API7 以生成回调 URL 的 URL。例如，`https://auth.example.com/oidc`。
   * **SSL verify**：默认值是打开的。
4. 点击 **新增**。
  
下面是一个交互式演示，提供了使用 OpenID Connect (OIDC) 协议进行单点登录 (SSO) 的实践介绍。通过点击并按照步骤操作，你将更好地了解如何在 API7 企业版中使用它。
  
  <StorylaneEmbed src='https://app.storylane.io/demo/qxsyxt5jhdvt' />
  
</TabItem>

<TabItem value="SAML">

1. 从顶部导航栏中选择 **组织**，然后选择 **设置**。
2. 点击 **新增登录选项**。
3. 填写表单：

   * **Name**：唯一的登录名称，必须与用户相同。例如 `Employee Account`。
   * **Provider**：选择 `SAML`。
   * **Identity Provider Metadata URL**：用于获取有关身份提供商信息的 URL，例如其公钥、支持的 SAML 版本、签名算法等。例如，`https://idp.example.com/metadata`。
   * **Service Provider Root URL**：从身份提供商 (IdP) 请求身份验证和授权的实体。例如，`https://sp.example.com`。
   * **Entity ID**：服务提供商 (SP) 或身份提供商 (IdP) 实体的唯一标识符。它通常在 SAML 联合中充当实体的全局唯一标识符。例如，`https://sp.example.com/saml/metadata`。

4. 点击 **新增**。

</TabItem>
</Tabs>

## 用 SSO 登录

一旦配置了登录选项，外部用户将能够直接登录到 API7 企业版控制台，而无需进行注册。

请按照以下步骤操作：

1. 访问位于 http://localhost:7080 的 API7 企业版控制台。
2. 从登录选项名称中选择，例如`使用员工帐户登录`。
3. 输入用户名和密码。
4. 点击登录。

## 删除导入的用户

如果你在 **用户** 中删除了使用 SSO 登录选项的用户，这仅仅意味着该用户将失去其所有角色。但是，他们仍然可以作为新用户登录到 API7 企业版控制台。要完全阻止他们访问 API7 企业版控制台，您必须从来源的用户系统中删除他们。

如果你希望完全阻止某个用户访问 API7 企业版，需要在身份提供系统中删除或禁用该用户的帐户。这样，当该用户尝试通过 SSO 登录 API7 企业版时，身份提供商将不会验证他们的身份，从而阻止他们访问系统。

## 从身份提供商同步用户数据

SCIM（系统跨域身份管理）是一种协议，可用于将用户和组信息从原始身份提供商（IdP）同步到 API7 企业版。这样就无需在多个系统中重复创建和管理用户，从而节省时间并降低出错风险。

通过 SCIM 用户同步，只要在你的 IdP 中注册或删除新用户，API7 企业版 就会自动同步用户数据。

1. 在顶部导航栏中，选择 **组织**，然后选择 **设置**。
2. 点击 **SCIM 配置** 的 **启用** 按钮。
3. 复制 **API7 SCIM 端点 URL** 和 **SCIM 令牌**。
4. 到身份提供商的设置页面进行配置（如果支持 SCIM）：

* 登录到身份提供商管理控制台。
* 找到 SCIM 配置设置（这些可能因你的 IdP 而异）。
* 将复制的 **API7 SCIM 端点 URL** 和 **SCIM 令牌**粘贴到相应的字段中。
* 保存配置更改并在身份提供商端进行配置。

## 为导入的用户分配角色

### 手动更新角色

请参阅[如何更新用户角色](../getting-started/rbac.md)。

### 设置角色映射

导入的用户会根据其原始系统中的相关属性（头衔、职位、部门等）自动分配角色。这些角色会在用户登录时同步和刷新，以实现无缝访问。角色映射可以包含多个规则，这些规则共同决定用户的角色和访问权限。

:::info

启用角色映射后，将无法再为属于该登录选项的用户手动分配角色。系统会根据预定义的规则自动分配角色，以避免冲突。

:::

1. 在顶部导航栏中，选择 **组织**，然后选择**设置**。
2. 选择要设置的登陆选项，点击名称进入。例如，`员工账户`。
3. 点击 **角色映射**的 **开启**按钮。
4. 填写表单：

* ***内部角色**: 例如， `超级管理员`。
* **角色属性**: 在身份提供商系统中的字段名称，例如, `Position`.
* **运算符**: 例如， `=`.
* **角色值**: 例如，`研发组长`.

5. 点击 **开启**.

现在，通过`员工账户` 登陆，且在原始系统中职位为研发组长 (Position = 研发组长) 的所有用户将自动获得 **超级管理员** 角色。

值得注意的是，这种角色映射是动态的。如果用户的职位在身份提供商中发生变化，例如从 "研发组长" 变为 "团队成员"，那么他们下次登录 API7 企业版时，角色将自动更新。

## 删除登录选项

:::warning

删除一个登录选项会同时删除所有使用这个登录选项导入的用户。

:::

1. 在顶部导航栏中，选择**组织**，然后选择**用户**。
2. 检查是否还有用户正在使用此登录选项。如果有，请先通知他们。
3. 在顶部导航栏中，选择**组织**，然后选择**设置**。
4. 单击目标登录选项的**删除**。
5. 二次确认。

## 相关阅读

* 核心概念
  * [角色和权限策略](../key-concepts/roles-and-permission-policies.md)
* 快速入门
  * [创建自定义角色](../getting-started/create-custom-role.md)
* 开发参考
  * [权限策略操作和资源](../reference/permission-policy-action-and-resource.md)
  * [权限策略示例](../reference/permission-policy-example.md)
