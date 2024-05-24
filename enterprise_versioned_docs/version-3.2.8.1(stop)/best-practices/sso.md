---
title: SSO 第三方登录
slug: /best-practices/sso
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

API7 企业版支持以下实现的单点登录（SSO）。将 API7 企业版与其他用户系统集成后，您可以让现有用户登录 API7 企业版，而无需注册新的 API7 帐户。

<Tabs
  defaultValue="LDAP"
  values={[
    {label: 'LDAP', value: 'LDAP'},
  ]}>
  <TabItem value="LDAP">
      <ol>
      <li> 在顶部导航栏中，选择<strong>组织</strong>，然后选择<strong>设置</strong>。</li>
      <li> 单击<strong>新增登录选项</strong>。</li>
      <li> 填写<strong>新增登录选项</strong>表单：
        <ol>
          <li><strong>名称</strong>：唯一的登录名称，必须让用户容易识别。例如<code>员工账户</code>。</li>
          <li><strong>提供者</strong>：选择<code>LDAP</code>。</li>
          <li><strong>主机名</strong>：LDAP 的主机域名。例如<code>ldap.example.com</code>。</li>
          <li><strong>端口</strong>：例如<code>1563</code>。</li>
          <li><strong>基本专有名称</strong>：例如<code>oc=users,dc=org,dc=example</code>。</li>
          <li><strong>绑定专有名称</strong>：LDAP 绑定的 DN，用来实现 LDAP 用户搜索。 应该被授予必要的嗖嗖权限。例如<code>cn=admin,dc=org,dc=example</code>。</li>
          <li><strong>绑定密码</strong>：和绑定专有名称一起，用于向 LDAP 服务器进行身份认证。</li>
          <li><strong>标识符</strong>：用在 LDAP 中识别用户的属性。例如<code>cn</code>。</li>
          <li><strong>属性映射</strong>: 将 API7 企业版中字段映射到 LDAP 系统中用于无缝集成和同步数据。</li>
        </ol>
      </li>
      <li> 单击<strong>新增</strong>。</li>
    </ol>
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

如果你在**用户**中删除了使用 SSO 登录选项的用户，这仅仅意味着该用户将失去其所有角色。但是，他们仍然可以作为新用户登录到 API7 企业版控制台。要完全阻止他们访问 API7 企业版控制台，您必须从来源的用户系统中删除他们。

如果你希望完全阻止某个用户访问 API7 企业版，需要在身份提供系统中删除或禁用该用户的帐户。这样，当该用户尝试通过 SSO 登录 API7 企业版时，身份提供商将不会验证他们的身份，从而阻止他们访问系统。

## 为导入的用户分配角色

所有被导入的新用户会默认授予**观察者**角色，直到**超级管理员** [为他们分配其他角色](../getting-started/rbac.md).

## 删除登录选项

:::warning

删除一个登录选项会同时删除所有使用这个登录选项导入的用户。

:::

1. 在顶部导航栏中，选择**组织**，然后选择**用户**。
2. 检查是否还有用户正在使用此登录选项。如果有，请先通知他们。
3. 在顶部导航栏中，选择**组织**，然后选择**设置**。
4. 单击目标登录选项的**删除**。
5. 二次确认。

