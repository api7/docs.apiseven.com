---
title: 登录 API7 控制台
slug: /administration/configure-login-methods
---

API7 控制台是一款基于 Web 的 GUI 管理和监控工具，帮助用户管理服务、路由、上游、消费者、网关组、插件等。部署 API7 企业版后，你可以登录 API7 控制台管理和监控 API7 网关资源。

本文介绍如何在以下情况下登录 API7 控制台：

- 开启默认认证方式。
- 仅开启轻量级目录访问协议（Lightweight Directory Access Protocol，LDAP）认证方式。

## 默认认证方式

默认情况下，API7 企业版提供一个任意的用户名（`admin`）和密码（`admin`）。你可以使用该用户名和密码登录 API7 控制台。

1. 安装 API7 企业版后，即可访问 API7 控制台登录页面 `http://localhost:7080`。

    ![默认登录方式](https://static.apiseven.com/uploads/2024/02/27/Dee65PGB_login-default_zh.png)

2. 输入用户名和密码。

3. 单击**登录**。

## LDAP 认证

API7 企业版 支持 LDAP 单点登录（Single Sign-On，SSO）。将 API7 企业版与 LDAP 集成后，用户可以直接使用 LDAP 用户名和密码登录 API7 控制台，创建和管理 API7 网关资源。

### 配置 LDAP 单点登录

如需配置 LDAP 单点登录，遵循以下步骤：

1. 从顶部导航栏选择**组织**，然后选择**设置**。

2. 单击**添加登录选项**。

    ![添加 LDAP 登录方式](https://static.apiseven.com/uploads/2024/02/27/2HuQL2Fg_add-login-method_zh.png)

3. 在**添加登录选项**对话框，配置以下属性。

    - **名字**：LDAP 登录名称，例如 `LDAP`。登录名称必须唯一。
    - **主机名**：LDAP 服务器的 IP 地址，例如 `ldap.example.com`。
    - **端口**：连接 LDAP 认证服务器的端口号，例如 `1563`。
    - **基本专有名称**：与 LDAP 认证服务器通信时使用的 Base DN 属性，例如 `oc=users,dc=org,dc=example`。
    - **绑定专有名称**：用于使用 LDAP 服务器进行身份认证和查询的管理员用户，例如 `cn=admin,dc=org,dc=example`。LDAP Bind 用户有权利查询已认证用户。
    - **绑定密码**：LDAP Bind 密码，用于与 LDAP 服务器进行身份认证。
    - **标识符**：用于标识 LDAP 用户的属性，例如 `cn`。
    - **属性映射**：将 API7 内部字段映射成对应的 LDAP 属性，从而实现无缝集成和同步数据。

4. 单击 **添加**。

### LDAP 登录

如需使用 LDAP 用户名和密码登录 API7 控制台，遵循以下步骤：

1. 访问 API7 控制台登录页面 `http://localhost:7080`。

2. 单击**使用 LDAP 进行登录**。

    ![LDAP 登录](https://static.apiseven.com/uploads/2024/02/27/nSOMHiYm_login-ldap_zh.png)

3. 输入用户名和密码。

4. 单击**登录**。
