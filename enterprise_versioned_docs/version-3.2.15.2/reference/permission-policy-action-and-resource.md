---
title: 权限策略 Actions 和 Resources
slug: /reference/permission-policy-action-and-resource
---

### 网关组

| Action                     | Resource                         | API                                                                                                                                                      |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gateway:DeleteGatewayGroup | arn:api7:gateway:gatewaygroup/%s | [DELETE /api/gateway_groups/:gateway_group_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/deleteGatewayGroup)      |
| gateway:GetGatewayGroup    | arn:api7:gateway:gatewaygroup/%s | [GET /api/gateway_groups/:gateway_group_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/createGatewayGroup)         |
| gateway:CreateGatewayGroup | arn:api7:gateway:gatewaygroup/\* | [POST /api/gateway_groups](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/createGatewayGroup)                          |
| gateway:UpdateGatewayGroup | arn:api7:gateway:gatewaygroup/%s | [PUT /api/gateway_groups/:gateway_group_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/updateGatewayGroup)         |
| gateway:UpdateGatewayGroup | arn:api7:gateway:gatewaygroup/%s | [PUT /api/gateway_groups/:gateway_group_id/admin_key](https://docs.api7.ai/enterprise/reference/admin-api#tag/Gateway-Groups/operation/GenerateAdminKey) |

### 网关实例

| Action                         | Resource                         | API                                                                                                                                                                 |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gateway:GetGatewayInstance     | arn:api7:gateway:gatewaygroup/%s | [GET /api/gateway_groups/:gateway_group_id/instances](https://docs.api7.ai/enterprise/reference/admin-api#tag/Instances/operation/listInstances)                    |
| gateway:GetGatewayInstanceCore | arn:api7:gateway:gatewaygroup/\* | GET /api/instances/cores                                                                                                                                            |
| gateway:CreateGatewayInstance  | arn:api7:gateway:gatewaygroup/%s | [POST /api/gateway_groups/:gateway_group_id/dp_client_certificates](https://docs.api7.ai/enterprise/reference/admin-api#tag/Data-Plane-Certificates)                |
| gateway:CreateGatewayInstance  | arn:api7:gateway:gatewaygroup/%s | [POST /api/gateway_groups/:gateway_group_id/instance_token](https://docs.api7.ai/enterprise/reference/admin-api#tag/Instances/operation/CreateGatewayInstanceToken) |

### 消费者

| Action                 | Resource                         | API                                                                                                                                                                            |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| gateway:GetConsumer    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/consumers](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers/paths/~1apisix~1admin~1consumers/get)                                          |
| gateway:GetConsumer    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/consumers/:consumer_username](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers/paths/~1apisix~1admin~1consumers~1%7Busername%7D/get)       |
| gateway:CreateConsumer | arn:api7:gateway:gatewaygroup/%s | [POST /apisix/admin/consumers](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers/paths/~1apisix~1admin~1consumers/post)                                        |
| gateway:UpdateConsumer | arn:api7:gateway:gatewaygroup/%s | [PATCH /apisix/admin/consumers/:consumer_username](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers/paths/~1apisix~1admin~1consumers~1%7Busername%7D/patch)   |
| gateway:UpdateConsumer | arn:api7:gateway:gatewaygroup/%s | [PUT /apisix/admin/consumers/:consumer_username](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers/paths/~1apisix~1admin~1consumers~1%7Busername%7D/put)       |
| gateway:DeleteConsumer | arn:api7:gateway:gatewaygroup/%s | [DELETE /apisix/admin/consumers/:consumer_username](https://docs.api7.ai/enterprise/reference/admin-api#tag/Consumers/paths/~1apisix~1admin~1consumers~1%7Busername%7D/delete) |

### SSL 证书

| Action                       | Resource                         | API                                                                                                                                                |
| ---------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| gateway:GetSSLCertificate    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/ssls](https://docs.api7.ai/enterprise/reference/admin-api#tag/SSLs/paths/~1apisix~1admin~1ssls/get)                             |
| gateway:GetSSLCertificate    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/ssls/:ssl_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/SSLs/paths/~1apisix~1admin~1ssls~1%7Bssl_id%7D/get)       |
| gateway:CreateSSLCertificate | arn:api7:gateway:gatewaygroup/%s | [POST /apisix/admin/ssls](https://docs.api7.ai/enterprise/reference/admin-api#tag/SSLs/paths/~1apisix~1admin~1ssls/post)                           |
| gateway:UpdateSSLCertificate | arn:api7:gateway:gatewaygroup/%s | [PUT /apisix/admin/ssls/:ssl_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/SSLs/paths/~1apisix~1admin~1ssls~1%7Bssl_id%7D/put)       |
| gateway:DeleteSSLCertificate | arn:api7:gateway:gatewaygroup/%s | [DELETE /apisix/admin/ssls/:ssl_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/SSLs/paths/~1apisix~1admin~1ssls~1%7Bssl_id%7D/delete) |

### 插件全局规则

| Action                         | Resource                         | API                                                                                                                                                                                        |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| gateway:GetGlobalPluginRule    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/global_rules](https://docs.api7.ai/enterprise/reference/admin-api#tag/Global-Rules/paths/~1apisix~1admin~1global_rules/get)                                             |
| gateway:GetGlobalPluginRule    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/global_rules/:global_rule_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Global-Rules/paths/~1apisix~1admin~1global_rules~1%7Bglobal_rule_id%7D/get)       |
| gateway:CreateGlobalPluginRule | arn:api7:gateway:gatewaygroup/%s | [POST /apisix/admin/global_rules](https://docs.api7.ai/enterprise/reference/admin-api#tag/Global-Rules/paths/~1apisix~1admin~1global_rules/post)                                           |
| gateway:UpdateGlobalPluginRule | arn:api7:gateway:gatewaygroup/%s | [PUT /apisix/admin/global_rules/:global_rule_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Global-Rules/paths/~1apisix~1admin~1global_rules~1%7Bglobal_rule_id%7D/put)       |
| gateway:DeleteGlobalPluginRule | arn:api7:gateway:gatewaygroup/%s | [DELETE /apisix/admin/global_rules/:global_rule_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Global-Rules/paths/~1apisix~1admin~1global_rules~1%7Bglobal_rule_id%7D/delete) |

### 插件元数据

| Action                       | Resource                         | API                                                                                                                                                                                           |
| ---------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gateway:GetPluginMetadata    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/plugin_metadata](https://docs.api7.ai/enterprise/reference/admin-api#tag/Global-Rules/paths/~1apisix~1admin~1global_rules~1%7Bglobal_rule_id%7D/delete)                    |
| gateway:GetPluginMetadata    | arn:api7:gateway:gatewaygroup/%s | [GET /apisix/admin/plugin_metadata/:plugin_name](https://docs.api7.ai/enterprise/reference/admin-api#tag/Plugin-Metadata/paths/~1apisix~1admin~1plugin_metadata~1%7Bplugin_name%7D/delete)    |
| gateway:UpdatePluginMetadata | arn:api7:gateway:gatewaygroup/%s | [PUT /apisix/admin/plugin_metadata/:plugin_name](https://docs.api7.ai/enterprise/reference/admin-api#tag/Plugin-Metadata/paths/~1apisix~1admin~1plugin_metadata~1%7Bplugin_name%7D/put)       |
| gateway:DeletePluginMetadata | arn:api7:gateway:gatewaygroup/%s | [DELETE /apisix/admin/plugin_metadata/:plugin_name](https://docs.api7.ai/enterprise/reference/admin-api#tag/Plugin-Metadata/paths/~1apisix~1admin~1plugin_metadata~1%7Bplugin_name%7D/delete) |

### 密钥

| Action               | Resource                         | API                                                     |
| -------------------- | -------------------------------- | ------------------------------------------------------- |
| gateway:GetSecret    | arn:api7:gateway:gatewaygroup/%s | GET /apisix/admin/secrets                               |
| gateway:GetSecret    | arn:api7:gateway:gatewaygroup/%s | GET /apisix/admin/secrets/:secret_manager/:secret_id    |
| gateway:PutSecret    | arn:api7:gateway:gatewaygroup/%s | PUT /apisix/admin/secrets/:secret_manager/:secret_id    |
| gateway:DeleteSecret | arn:api7:gateway:gatewaygroup/%s | DELETE /apisix/admin/secrets/:secret_manager/:secret_id |

### 服务注册中心

| Action                            | Resource                         | API                                                                                                                                                                                              |
| --------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | [GET /api/gateway_groups/:gateway_group_id/service_registries](https://docs.api7.ai/enterprise/reference/admin-api#tag/Service-Registry/operation/listServiceRegistry)                           |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | [GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Service-Registry/operation/getServiceRegistry)       |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id/connected_services                                                                                             |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id/health_check_history                                                                                           |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id/kubernetes/internal_services                                                                                   |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id/nacos/namespaces                                                                                               |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id/nacos/namespaces/:nacos_namespace/groups                                                                       |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id/nacos/namespaces/:nacos_namespace/groups/:nacos_group/services                                                 |
| gateway:GetServiceRegistry        | arn:api7:gateway:gatewaygroup/%s | GET /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id/nacos/namespaces/:nacos_namespace/groups/:nacos_group/services/:nacos_service/instances_metadata               |
| gateway:ConnectServiceRegistry    | arn:api7:gateway:gatewaygroup/%s | [POST /api/gateway_groups/:gateway_group_id/service_registries](https://docs.api7.ai/enterprise/reference/admin-api#tag/Service-Registry/operation/createServiceRegistry)                        |
| gateway:UpdateServiceRegistry     | arn:api7:gateway:gatewaygroup/%s | [PUT /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Service-Registry/operation/updateServiceRegistry)    |
| gateway:DisconnectServiceRegistry | arn:api7:gateway:gatewaygroup/%s | [DELETE /api/gateway_groups/:gateway_group_id/service_registries/:service_registry_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Service-Registry/operation/deleteServiceRegistry) |

### 服务中心（模板）

| Action                        | Resource                            | API                                                                                  |
| ----------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/routes/template/:route_id                                                   |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/service_versions/:service_version_id                                        |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/service_versions/:service_version_id/routes                                 |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/service_versions/:service_version_id/routes/:route_version_id               |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/service_versions/:service_version_id/stream_routes                          |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/service_versions/:service_version_id/stream_routes/:stream_route_version_id |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/services/:service_id/versions/:version                                      |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/services/template/:service_id                                               |
| gateway:GetServiceTemplate    | arn:api7:gateway:servicetemplate/%s | GET /api/stream_routes/template/:stream_route_id                                     |
| gateway:CreateServiceTemplate | arn:api7:gateway:servicetemplate/\* | POST /api/import/services/template                                                   |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | PUT /api/services/template/:service_id                                               |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | PATCH /api/services/template/:service_id                                             |
| gateway:DeleteServiceTemplate | arn:api7:gateway:servicetemplate/%s | DELETE /api/services/template/:service_id                                            |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | POST /api/routes/template                                                            |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | PATCH /api/routes/template/:route_id                                                 |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | PUT /api/routes/template/:route_id                                                   |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | DELETE /api/routes/template/:route_id                                                |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | POST /api/stream_routes/template                                                     |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | PUT /api/stream_routes/template/:stream_route_id                                     |
| gateway:UpdateServiceTemplate | arn:api7:gateway:servicetemplate/%s | DELETE /api/stream_routes/template/:stream_route_id                                  |

### 已发布服务

| Action                         | Resource                                             | API                                                                                                  |
| ------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| gateway:GetPublishedService    | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | GET /api/gateway_groups/:gateway_group_id/services/:service_version_service_id                       |
| gateway:GetPublishedService    | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | GET /api/gateway_groups/:gateway_group_id/services/:service_version_service_id/healthcheck           |
| gateway:GetPublishedService    | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | GET /api/gateway_groups/:gateway_group_id/services/:service_version_service_id/runtime_configuration |
| gateway:GetPublishedService    | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | GET /api/gateway_groups/:gateway_group_id/services/:service_version_service_id/versions              |
| gateway:GetPublishedService    | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | GET /apisix/admin/routes/:apisix_route_id                                                            |
| gateway:GetPublishedService    | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | GET /apisix/admin/services/:apisix_service_id                                                        |
| gateway:GetPublishedService    | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | GET /apisix/admin/stream_routes/:apisix_stream_route_id                                              |
| gateway:PublishServices        | arn:api7:gateway:gatewaygroup/%s/publishedservice/\* | POST /api/services/publish                                                                           |
| gateway:CreatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | POST /apisix/admin/services                                                                          |
| gateway:UpdatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | PATCH /apisix/admin/services/:apisix_service_id                                                      |
| gateway:UpdatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | PUT /apisix/admin/services/:apisix_service_id                                                        |
| gateway:DeletePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | DELETE /apisix/admin/services/:apisix_service_id                                                     |
| gateway:UpdatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | PUT /apisix/admin/routes/:apisix_route_id                                                            |
| gateway:UpdatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | PATCH /apisix/admin/routes/:apisix_route_id                                                          |
| gateway:UpdatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | DELETE /apisix/admin/routes/:apisix_route_id                                                         |
| gateway:UpdatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | PUT /apisix/admin/stream_routes/:apisix_stream_route_id                                              |
| gateway:UpdatePublishedService | arn:api7:gateway:gatewaygroup/%s/publishedservice/%s | DELETE /apisix/admin/stream_routes/:apisix_stream_route_id                                           |

### 部署设置

| Action                          | Resource                           | API                                                                                                                                  |
| ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| gateway:GetDeploymentSetting    | arn:api7:gateway:gatewaysetting/\* | [GET /api/system_settings](https://docs.api7.ai/enterprise/reference/admin-api#tag/System-Settings/paths/~1api~1system_settings/get) |
| gateway:UpdateDeploymentSetting | arn:api7:gateway:gatewaysetting/\* | [PUT /api/system_settings](https://docs.api7.ai/enterprise/reference/admin-api#tag/System-Settings/operation/updateSystemSettings)   |

### 自定义插件

| Action                     | Resource                           | API                                                                                                                                                 |
| -------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| gateway:GetCustomPlugin    | arn:api7:gateway:gatewaysetting/\* | [GET /api/custom_plugins](https://docs.api7.ai/enterprise/reference/admin-api#tag/Custom-Plugins/operation/ListCustomPlugins)                       |
| gateway:GetCustomPlugin    | arn:api7:gateway:gatewaysetting/\* | [GET /api/custom_plugins/:custom_plugin_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Custom-Plugins/operation/GetCustomPlugin)       |
| gateway:CreateCustomPlugin | arn:api7:gateway:gatewaysetting/\* | [POST /api/custom_plugins](https://docs.api7.ai/enterprise/reference/admin-api#tag/Custom-Plugins/operation/CreateCustomPlugin)                     |
| gateway:UpdateCustomPlugin | arn:api7:gateway:gatewaysetting/\* | [PUT /api/custom_plugins/:custom_plugin_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Custom-Plugins/operation/UpdateCustomPlugin)    |
| gateway:DeleteCustomPlugin | arn:api7:gateway:gatewaysetting/\* | [DELETE /api/custom_plugins/:custom_plugin_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Custom-Plugins/operation/DeleteCustomPlugin) |

### 告警

| Action                        | Resource                  | API                                                                                                                                                                                                                        |
| ----------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gateway:GetAlertPolicy        | arn:api7:gateway:alert/\* | [GET /api/alert/policies](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Policy/paths/~1api~1alert~1policies/get)                                                                                           |
| gateway:GetAlertPolicy        | arn:api7:gateway:alert/\* | [GET /api/alert/policies/:alert_policy_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Policy/paths/~1api~1alert~1policies~1%7Balert_policy_id%7D/get)                                                   |
| gateway:GetAlertPolicy        | arn:api7:gateway:alert/\* | [GET /api/alert/policies/histories](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Policy-History/paths/~1api~1alert~1policies~1histories/get)                                                              |
| gateway:CreateAlertPolicy     | arn:api7:gateway:alert/\* | [POST /api/alert/policies](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Policy/paths/~1api~1alert~1policies/post)                                                                                         |
| gateway:UpdateAlertPolicy     | arn:api7:gateway:alert/\* | [PUT /api/alert/policies/:alert_policy_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Policy/paths/~1api~1alert~1policies~1%7Balert_policy_id%7D/put)                                                   |
| gateway:UpdateAlertPolicy     | arn:api7:gateway:alert/\* | PUT /api/alert/policies/:alert_policy_id/triggers                                                                                                                                                                          |
| gateway:UpdateAlertPolicy     | arn:api7:gateway:alert/\* | [PATCH /api/alert/policies/:alert_policy_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Policy/paths/~1api~1alert~1policies~1%7Balert_policy_id%7D/patch)                                               |
| gateway:DeleteAlertPolicy     | arn:api7:gateway:alert/\* | [DELETE /api/alert/policies/:alert_policy_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Policy/paths/~1api~1alert~1policies~1%7Balert_policy_id%7D/delete)                                             |
| gateway:GetWebhookTemplate    | arn:api7:gateway:alert/\* | [GET /api/alert/webhook_templates/:webhook_template_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Webhook-Templates/paths/~1api~1alert~1webhook_templates~1%7Bwebhook_template_id%7D/get)              |
| gateway:GetWebhookTemplate    | arn:api7:gateway:alert/\* | [GET /api/alert/webhook_templates/:webhook_template_id/refer](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Webhook-Templates/paths/~1api~1alert~1webhook_templates~1%7Bwebhook_template_id%7D~1refer/get) |
| gateway:CreateWebhookTemplate | arn:api7:gateway:alert/\* | [POST /api/alert/webhook_templates](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Webhook-Templates/paths/~1api~1alert~1webhook_templates/post)                                                            |
| gateway:UpdateWebhookTemplate | arn:api7:gateway:alert/\* | [PUT /api/alert/webhook_templates/:webhook_template_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Webhook-Templates/paths/~1api~1alert~1webhook_templates~1%7Bwebhook_template_id%7D/put)              |
| gateway:DeleteWebhookTemplate | arn:api7:gateway:alert/\* | [DELETE /api/alert/webhook_templates/:webhook_template_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Alert-Webhook-Templates/paths/~1api~1alert~1webhook_templates~1%7Bwebhook_template_id%7D/delete)        |

### 权限策略

| Action                     | Resource                         | API                                                   |
| -------------------------- | -------------------------------- | ----------------------------------------------------- |
| iam:GetPermissionPolicy    | arn:api7:iam:permissionpolicy/%s | GET /api/permission_policies/:permission_policy_id    |
| iam:CreatePermissionPolicy | arn:api7:iam:permissionpolicy/\* | POST /api/permission_policies                         |
| iam:UpdatePermissionPolicy | arn:api7:iam:permissionpolicy/%s | PUT /api/permission_policies/:permission_policy_id    |
| iam:DeletePermissionPolicy | arn:api7:iam:permissionpolicy/%s | DELETE /api/permission_policies/:permission_policy_id |

### 角色

| Action               | Resource             | API                                                 |
| -------------------- | -------------------- | --------------------------------------------------- |
| iam:GetRole          | arn:api7:iam:role/%s | GET /api/roles/:role_id                             |
| iam:GetRole          | arn:api7:iam:role/%s | GET /api/roles/:role_id/permission_policies         |
| iam:CreateCustomRole | arn:api7:iam:role/\* | POST /api/roles                                     |
| iam:UpdateCustomRole | arn:api7:iam:role/%s | POST /api/roles/:role_id/attach_permission_policies |
| iam:UpdateCustomRole | arn:api7:iam:role/%s | POST /api/roles/:role_id/detach_permission_policies |
| iam:UpdateCustomRole | arn:api7:iam:role/%s | PUT /api/roles/:role_id                             |
| iam:DeleteCustomRole | arn:api7:iam:role/%s | DELETE /api/roles/:role_id                          |

### 用户

| Action             | Resource             | API                                                                                                                                      |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| iam:GetUser        | arn:api7:iam:user/%s | [GET /api/users/:user_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Users/operation/listUsers)                             |
| iam:InviteUser     | arn:api7:iam:user/\* | [POST /api/invites](https://docs.api7.ai/enterprise/reference/admin-api#tag/Users/operation/inviteUser)                                  |
| iam:UpdateUserRole | arn:api7:iam:user/%s | [PUT /api/users/:user_id/assigned_roles](https://docs.api7.ai/enterprise/reference/admin-api#tag/Users/operation/addAssignedRole)        |
| iam:ResetPassword  | arn:api7:iam:user/%s | [PUT /api/users/:user_id/password_reset](https://docs.api7.ai/enterprise/reference/admin-api#tag/Users/operation/passwordResetToDefault) |
| iam:DeleteUser     | arn:api7:iam:user/%s | [DELETE /api/users/:user_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Users/operation/deleteUser)                         |

### 证书

| Action            | Resource                     | API                                                                                                          |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| iam:UpdateLicense | arn:api7:iam:organization/\* | [PUT /api/license](https://docs.api7.ai/enterprise/reference/admin-api#tag/License/paths/~1api~1license/put) |

### 审计

| Action           | Resource                     | API                                                                                                                        |
| ---------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| iam:GetAudit     | arn:api7:iam:organization/\* | [GET /api/audit_logs](https://docs.api7.ai/enterprise/reference/admin-api#tag/Audit-Logs/operation/listAuditLogs)          |
| iam:ExportAudits | arn:api7:iam:organization/\* | [GET /api/audit_logs/export](https://docs.api7.ai/enterprise/reference/admin-api#tag/Audit-Logs/operation/exportAuditLogs) |

### 设置

| Action                     | Resource                     | API                                                                                                                                              |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| iam:GetSCIMProvisioning    | arn:api7:iam:organization/\* | [GET /api/system_settings/scim](https://docs.api7.ai/enterprise/reference/admin-api#tag/System-Settings/paths/~1api~1system_settings~1scim/get)  |
| iam:UpdateSCIMProvisioning | arn:api7:iam:organization/\* | [PUT /api/system_settings/scim](https://docs.api7.ai/enterprise/reference/admin-api#tag/System-Settings/operation/updateSCIMSettings)            |
| iam:UpdateSCIMProvisioning | arn:api7:iam:organization/\* | [PUT /api/system_settings/scim/token](https://docs.api7.ai/enterprise/reference/admin-api#tag/System-Settings/operation/generateSCIMToken)       |
| iam:GetLoginOption         | arn:api7:iam:organization/\* | [GET /api/login_options/:login_option_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Login-Option/operation/get_login_option)       |
| iam:CreateLoginOption      | arn:api7:iam:organization/\* | [POST /api/login_options](https://docs.api7.ai/enterprise/reference/admin-api#tag/Login-Option/operation/create_login_option)                    |
| iam:UpdateLoginOption      | arn:api7:iam:organization/\* | [PUT /api/login_options/:login_option_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Login-Option/operation/update_login_option)    |
| iam:UpdateLoginOption      | arn:api7:iam:organization/\* | [PATCH /api/login_options/:login_option_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Login-Option/operation/patch_login_option)   |
| iam:DeleteLoginOption      | arn:api7:iam:organization/\* | [DELETE /api/login_options/:login_option_id](https://docs.api7.ai/enterprise/reference/admin-api#tag/Login-Option/operation/delete_login_option) |
