---
title: 身份认证
slug: /key-concepts/authentication
---

出于安全原因，API7 企业版支持消费者访问内部资源（API）之前对其进行身份验证和授权。API7 企业版具有灵活的插件扩展系统以及许多用于用户身份验证和授权的插件。

- [Key Authentication](https://docs.api7.ai/hub/key-auth)
- [Basic Authentication](https://docs.api7.ai/hub/basic-auth/)
- [JSON Web Token (JWT) Authentication](https://docs.api7.ai/hub/jwt-auth/)
- [Keycloak](https://docs.api7.ai/hub/authz-keycloak/)
- [Casdoor](https://apisix.apache.org/docs/apisix/plugins/authz-casdoor/)
- [Wolf RBAC](https://apisix.apache.org/docs/apisix/plugins/wolf-rbac/)
- [OpenID Connect](https://apisix.apache.org/docs/apisix/plugins/openid-connect/)
- [Central Authentication Service (CAS)](https://apisix.apache.org/docs/apisix/plugins/cas-auth/)
- [HMAC](https://apisix.apache.org/docs/apisix/plugins/hmac-auth/)
- [Casbin](https://apisix.apache.org/docs/apisix/plugins/authz-casbin/)
- [LDAP](https://apisix.apache.org/docs/apisix/plugins/ldap-auth/)
- [Open Policy Agent (OPA)](https://apisix.apache.org/docs/apisix/plugins/opa/)
- [Forward Authentication](https://apisix.apache.org/docs/apisix/plugins/forward-auth/)

其中，密钥认证（Key Authentcation，简称 key-auth）是一种相对简单但广泛使用的认证方法。理想情况下，它的工作原理如下：

1. 在路由中通过启用 key-auth 插件添加一个认证密钥机制。
2. API 消费者在发送请求时，将密钥添加到查询字符串或请求头中以进行认证。

请注意，每个路由只能使用一种认证机制。不要在单个路由上启用多个认证插件，也不推荐将认证插件作为全局规则启用。

## 相关阅读

- [开启 API 身份认证](../api-security/api-authentication.md)
- [管理消费者访问凭证](../api-consumption/manage-consumer-credentials.md)