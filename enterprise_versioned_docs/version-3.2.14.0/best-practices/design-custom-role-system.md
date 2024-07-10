---
title: 设计自定义角色系统
slug: /best-practices/design-custom-role-system
---

本教程将介绍如何为你的组织设计和实现自定义角色系统。自定义角色允许你授予用户细粒度的访问权限，从而增强安全性并提高数据完整性。

## 关键因素

1. 清晰的需求和目标

首先，明确定义设计自定义角色系统的具体需求和目标。例如，你是想提高应用程序安全性？简化访问控制管理？还是满足更复杂的访问控制要求？明确的需求可以帮助你更好地定义角色和权限，并选择正确的实现方式。

2. 合理的角色划分

根据应用程序功能和用户职责合理划分角色。角色划分应粒度适中，既要避免过于细粒度的角色导致管理复杂，又要避免过于粗粒度的角色导致权限控制不够精细。

3. 清晰的权限定义

每个角色都应该有明确的权限定义。权限定义应清晰易懂，并与角色的职责相符。避免向同一角色授予过多或不相关的权限。

在不同的角色中复用权限策略可能是一把双刃剑。它为简化和管理提供了好处，但如果不小心也会带来潜在的安全风险。如果复用的策略受到破坏，则会影响所有继承该策略的角色，从而可能授予对多个资源的未经授权的访问。这会放大安全漏洞的潜在损害。过于宽泛的策略会使最小权限原则难以实施，授予用户超出其严格需要的更多访问权限。

4. 清晰的层次结构和可扩展性

一个用户友好的自定义角色系统应该具有高度的可扩展性和面向未来的能力。这使得职责分离能够为用户分配适当的角色。部门需求可以通过定制的角色和权限策略来满足，减少对单个“超级管理员”的日常权限管理的依赖。或者，小组负责人可以在其团队内分配角色和权限，确保精细控制并将对其他小组的影响降至最低。

## 使用案例

一般来说，API7 企业版建议在团队内采用一种平衡的方法来进行角色管理。在大多数情况下，可以增加并利用好更细分一层的团队领导角色，并且仅在明确需要并且进行了彻底的安全审查时，才考虑创建更小的领导角色。

### 团队各自分配角色

想象一下，你需要一个 RBAC 系统，多个团队需要使用共享的角色（例如，“测试工程师”、“开发工程师”）。然而，当出现以下情况时，可能会遇到挑战：

- 团队组成频繁变化：经常有新成员加入，或者团队成员会经常调整角色。
- 团队分工不同：每个团队可能有独特的工作流程或职责，虽然用到的角色是跨团队共享的，但是需要不同的角色分配原则和不同的细粒度访问控制。
- 有限的用户可见性：用户可能不熟悉其他团队的同事，没有一个人可以为所有团队成员分配合适的角色。

#### 解决方案

1. 设置超级管理员或具有 `角色管理员` 自定义角色的用户（授予以下权限）专门负责维护 API7 企业版中的所有角色：

```json
{
  "statement": [ // 同一个策略中的多个语句之间是 OR 关系
    {
      "resources": [
        "arn:api7:iam:user/<.*>"
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:iam:role/<.*>"  // 即便拥有通用权限也不能修改超级管理员角色
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:iam:permissionpolicy/<.*>" // 即便拥有通用权限也不能修改默认的超级管理员关联的权限策略
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    }
  ]
}
```

2. 创建一个自定义角色 `组长`，关联以下权限策略。被授予这个角色的用户，可以为他的小组成员分配已有的角色。

```json
 {
    "statement": [
        {
            "resources": [
                "arn:api7:iam:users/23w9q4t-ba7e-f310-a1d45b-78jklz1234", // 小组成员的用户 ID
                "arn:api7:iam:users/n5p1u6y-0df3-4a5b-c90fe1-32kasd789b",
                "arn:api7:iam:users/23w9q4t-ba7e-f310-a1d45b-78jklz1234",
                "arn:api7:iam:users/gt8h2x3-1fe4-5678-d21b0a-98zxc1b546",
                "arn:api7:iam:users/y7u8i9o-pasd-fghj-123456-7klmnop12"
            ],
            "actions": [ // 包括所有与小组管理相关的权限，不包括邀请新用户和编辑角色
                "iam:GetUser",
                "iam:UpdateUserRole",
                "iam:ResetPassword",
                "iam:DeleteUser"
            ],
            "effect": "allow" 
        }
    ]
 }
```

### 团队特定角色设计

一个具有团队特定角色和权限创建的模块化 RBAC 系统允许每个团队管理自己的访问需求，从而减少对“超级管理员”或“角色管理员”的依赖。

#### 解决方案

1. 创建一个具有以下两个权限策略的自定义角色 `组长`。分配了此角色的用户将同时负责设计和管理其小团队中的角色并将角色分配给小团队的成员。

权限策略 1 用于为团队成员分配角色：

```json
 {
    "statement": [
        {
            "resources": [
                "arn:api7:iam:users/23w9q4t-ba7e-f310-a1d45b-78jklz1234", // 小组成员的用户 ID
                "arn:api7:iam:users/n5p1u6y-0df3-4a5b-c90fe1-32kasd789b",
                "arn:api7:iam:users/23w9q4t-ba7e-f310-a1d45b-78jklz1234",
                "arn:api7:iam:users/gt8h2x3-1fe4-5678-d21b0a-98zxc1b546",
                "arn:api7:iam:users/y7u8i9o-pasd-fghj-123456-7klmnop12"
            ],
            "actions": [ // 包括所有与小组管理相关的权限，不包括邀请新用户和编辑角色
                "iam:GetUser",
                "iam:UpdateUserRole",
                "iam:ResetPassword",
                "iam:DeleteUser"
            ],
            "effect": "allow" 
        }
    ]
 }
```

权限策略 2 负责为小组创建专属的自定义角色和权限策略：

```json
{
    "statement": [
        {
            "resources": [
                "arn:api7:iam:role/<.*>>",
            ],
            "actions": [ // 包括所有与角色设计和管理相关的权限
                "<.*>"
            ],
            "conditions": {
                "role_label": {
                    "type": "MatchLabel",
                    "options": {
                        "key": "team",
                        "operation": "exact_match",
                        "value": "champion"
                    }
                }
            },
            "effect": "allow" 
        },
        {
            "resources": [
                "arn:api7:iam:permissionpolicy/<.*>>"
            ],
            "actions": [ // 包括所有与权限策略设计和管理相关的权限
                "<.*>"
            ],
            "conditions": {
                "permissionpolicy_label": {
                    "type": "MatchLabel",
                    "options": {
                        "key": "team",
                        "operation": "exact_match",
                        "value": "champion"
                    }
                }
            },
            "effect": "allow" 
        }
    ]
}
```

2. 作为 `组长`，请始终在你创建的资源中包含你团队的指定标签。这可以确保对你的角色和权限策略的正确访问控制，不会和其他团队的角色和权限策略混淆。

3. 你依然可以使用由 `超级管理员` 或 `角色管理员` 设计的共享角色，并将其分配给你的小组成员。

4. API7 企业版允许在团队内部进行进一步的权限分层管理。作为 `组长`，你甚至可以创建一个关联了相同权限策略的自定义角色，让更多角色也可以创建自定义角色和权限策略，不断细分。这种方法可以大大减轻团队领导者管理角色的负担。

虽然权限分层管理提供了效率优势，但需要同时兼顾安全性的考虑。

## 相关阅读

- 核心概念
  - [角色和权限策略](../key-concepts/roles-and-permission-policies.md)
- 快速入门
  - [更新用户角色](../getting-started/rbac.md)
  - [创建自定义角色](../getting-started/create-custom-role.md)
- 开发参考
  - [权限策略操作和资源](../reference/permission-policy-action-and-resource.md)
  - [权限策略示例](../reference/permission-policy-example.md)
