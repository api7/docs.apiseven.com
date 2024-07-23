---
title: 创建自定义角色
slug: /getting-started/create-custom-role
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

API7 企业版默认配置了一个锁定的、内置的 `超级管理员` 角色和策略，以提供初始设置的完全访问权限。默认的 `admin` 账户永久绑定到此角色，以便在紧急情况下进行恢复。

通过自定义角色，你可以创建一个适合你特定需求的精细权限系统。本教程将指导你在 API7 企业版中定义自定义角色的过程，让你能够更精确地管理访问控制。

本教程展示了一个具有生产网关组只读访问权限和测试网关组完全访问权限（查看和编辑）的自定义角色。你将完成以下步骤：

1. 创建两个权限策略，一个用于定义生产网关组的只读权限，另一个用于定义测试网关组的完全访问权限。
2. 创建一个名为 `开发团队成员` 的自定义角色，并将其关联到上述两个权限策略。

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 有两个[网关组](./add-gateway-group.md)用于测试和生产环境，每个组中至少有一个网关实例。
3. 在两个网关组中发布一个服务，用于验证。

## 创建权限策略

### 创建生产权限策略

1. 从顶部导航栏中选择 **组织**，然后选择 **权限策略**。
2. 点击 **添加权限策略**。
3. 在表单中执行以下操作：
    * **名称** 填写 `生产网关组只读`。
    * **策略编辑器** 输入JSON：

        ```json
        {
            "statement": [
                {
                    "resources": [
                        "arn:api7:gateway:gatewaygroup/{gateway group id}" // 使用网关组 ID 来匹配资源
                    ],
                    "actions": [ // 列出所有查看类权限
                        "gateway:GetGatewayGroup",
                        "gateway:GetGatewayInstance",
                        "gateway:GetConsumer",
                        "gateway:GetSSLCertificate",
                        "gateway:GetGlobalPluginRule",
                        "gateway:GetPluginMetadata",
                        "gateway:GetServiceRegistry",
                        "gateway:GetPublishedService"
                    ],
                    "effect": "allow" 
                },
                {
                    "resources": [
                        "arn:api7:gateway:gatewaygroup/{gateway group id}/publishedservice/<.*>"  // 查看指定网关组上所有已发布服务
                    ],
                    "actions": [
                        "gateway:GetPublishedService"
                    ],
                    "effect": "allow"
                }
            ]
        }
        ```

        你也可以使用通配符来编写：

        ```json
        {
            "statement": [
                {
                    "resources": [
                        "arn:api7:gateway:gatewaygroup/{gateway group ID}" // 使用网关组 id 来匹配资源
                    ],
                    "actions": [ // 匹配所有包含 "Get" 的权限
                        "<.*>Get<.*>"
                    ],
                    "effect": "allow" 
                },
                {
                    "resources": [
                        "arn:api7:gateway:gatewaygroup/{gateway group id}/publishedservice/<.*>"  // 查看指定网关组上所有已发布服务
                    ],
                    "actions": [
                        "gateway:GetPublishedService"
                    ],
                    "effect": "allow"
                }
            ]
        }
        ```

    * 点击 **新增**。

### 创建测试权限策略

1. 从顶部导航栏中选择**组织**，然后选择**权限策略**。
2. 点击**添加权限策略**。
3. 在表单执行以下操作：
    * **名称** 填写 `测试网关组完全访问`。
    * **策略编辑器** 输入 JSON：

        ```json
        {
            "statement": [
                {
                    "resources": [
                        "arn:api7:gateway:gatewaygroup/{gateway group id}}" // 使用网关组 ID 来匹配资源
                    ],
                    "actions": [ // 包含所有网关组相关权限
                        "<.*>"
                    ],
                    "effect": "allow" 
                },
                {
                    "resources": [
                        "arn:api7:gateway:gatewaygroup/{gateway group id}/publishedservice/<.*>"  // 对指定网关组上所有已发布服务的完全访问权限
                    ],
                    "actions": [
                        "<.*>"
                    ],
                    "effect": "allow"
                }           
            ]
        }
        ```

    * 点击 **新增**。

## 创建自定义角色

1. 从顶部导航栏中选择 **组织**，然后选择 *角色**。
2. 点击 **添加自定义角色**。
3. 在表单中执行以下操作：
    - **名称** 填写 `开发团队成员`。
    - （可选）**描述** 填写 `生产网关组只读访问权限和测试网关组完全访问权限（查看和编辑）`。
    - 点击 **新增**。
4. 在角色详情页面，点击 **关联策略**。
5. 选择 `生产网关组只读` 和 `测试网关组完全访问`。
6. 点击 **提交**。

## 验证自定义角色

1. 按照教程 [更新用户角色](rbac.md) 将 `开发团队成员` 分配给另一个用户，例如 `Tom`。
2. 让 Tom 登录并验证他的权限。

## 相关阅读

* 核心概念
  * [角色和权限策略](../key-concepts/roles-and-permission-policies.md)
* 快速入门
  * [更新用户角色](../getting-started/rbac.md)
* 最佳实践
  * [设计自定义角色系统](../best-practices/design-custom-role-system.md)
* 开发参考
  * [权限策略操作和资源](../reference/permission-policy-action-and-resource.md)
  * [权限策略示例](../reference/permission-policy-example.md)
