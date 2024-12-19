---
title: 更新用户角色
slug: /getting-started/rbac
---

import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';

基于角色的访问控制（RBAC）将权限链接到角色而不是直接链接到用户。然后为用户分配这些角色，从而简化访问管理，提高效率并减少错误。本指南将引导你使用 API7 企业版的自定义角色、权限策略和权限边界来管理基于角色的访问控制。

## 更新用户角色

1. 从顶部导航栏中选择 **组织**，然后选择 **用户**。
2. 点击目标用户的 **更新角色**。
3. 添加或删除角色。
4. 点击 **更新**。

:::tip

要查看每个角色的权限，请从顶部导航栏中选择 **组织**，然后选择 **角色**。

:::

结合角色和权限策略能有效控制访问权限。以下是使用自定义角色和权限策略隔离环境访问的示例。

<StorylaneEmbed src='https://app.storylane.io/demo/v7ectknqihj4' />

### 定义权限策略

1. 创建三个网关组：`测试`、`UAT` 和 `生产`。
2. 从顶部导航栏中选择**组织**，然后选择**权限策略**。
3. 点击 **+ 新增策略**。
4. 在对话框中，执行以下操作：
   * **名称**填写 `完全操作测试网关组`。
   * 在**策略编辑器**字段中，输入配置：

     ```json
      {
        "statement": [
          {
            "resources": [
              "arn:api7:gateway:gatewaygroup/b6db7341-fc1f-4cee-a318-3e782a163d24"
            ],
            "actions": [
              "<.*>"
            ],
            "effect": "allow"
          },
          {
            "resources": [
              "arn:api7:gateway:gatewaygroup/b6db7341-fc1f-4cee-a318-3e782a163d24/publishedservice/<.*>"
            ],
            "actions": [
              "<.*>"
            ],
            "effect": "allow"
          }
        ]
      } 
     ```
    :::note

     资源 ID 应与创建的网关组一致。请根据你的使用情况进行更改。

     :::

   * 点击**新增**。
5. 点击 **+ 新增策略**。
6. 在对话框中，执行以下操作：
   * **名称**填写 `完全操作 UAT 网关组`。
   * 在**策略编辑器**字段中，输入配置：

     ```json
      {
        "statement": [
          {
            "resources": [
              "arn:api7:gateway:gatewaygroup/45a06edc-4a93-4bea-a437-3f153b56254c"
            ],
            "actions": [
              "<.*>"
            ],
            "effect": "allow"
          },
          {
            "resources": [
              "arn:api7:gateway:gatewaygroup/45a06edc-4a93-4bea-a437-3f153b56254c/publishedservice/<.*>"
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
7. 点击 **+ 新增策略**。
8. 在对话框中，执行以下操作：
   * **名称**填写 `完全操作生产网关组`。
   * 在**策略编辑器**字段中，输入配置：

    ```json
      {
        "statement": [
          {
            "resources": [
              "arn:api7:gateway:gatewaygroup/edc12ecd-94a5-49b2-b82d-8d1113e6cd86"
            ],
            "actions": [
              "<.*>"
            ],
            "effect": "allow"
          },
          {
            "resources": [
              "arn:api7:gateway:gatewaygroup/edc12ecd-94a5-49b2-b82d-8d1113e6cd86/publishedservice/<.*>"
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

### 自定义角色

1. 从顶部导航栏中选择**组织**，然后选择**角色**。
2. 点击 **+ 新增自定义角色**。
3. 在对话框中，执行以下操作：
   * **名称**填写 `研发组成员`。
   * 点击**新增**。
4. 以相同的方式创建另外两个角色 `研发组长` 和 `测试工程师`。

### 分配具有受控访问权限的角色

1. 点击 `研发组成员` 并进入角色页面。
2. 点击 **+ 关联策略**。
3. 在对话框中，执行以下操作：
   * 在**权限策略**字段中，选择 `完全操作测试网关组`。
   * 点击**提交**。这允许他们仅在测试环境中进行更改。
4. 将 `完全操作测试网关组` 和 `完全操作 UAT 网关组` 策略分配给 `研发组长`。这使他们能够在测试和 UAT 环境中工作，可能包括将稳定配置从测试同步到 UAT 的能力。
5. 将 `完全操作 UAT 网关组` 和 `完全操作生产网关组` 策略分配给 `测试工程师`。这将他们的访问权限限制在 UAT 和生产环境，专注于新的 API 测试和发布任务。

### 验证

1. 使用具有 `研发组成员` 角色的帐户登录 API7 企业版，并且只能操作 `测试` 网关组。
2. 使用具有 `研发组长` 角色的帐户登录 API7 企业版，并且只能操作 `测试` 和 `UAT` 网关组。
3. 使用具有 `测试工程师` 角色的帐户登录 API7 企业版，并且只能操作 `UAT` 和 `生产` 网关组。

## 设置角色映射（需要 SSO）

满足定义的键值映射规则的用户将在登录时自动分配相应的角色。有关详细信息，请参阅[设置角色映射](../best-practices/sso.md#设置角色映射)。

:::note

角色映射优先于手动角色分配。当角色映射启用时，对用户角色的任何手动调整都将在下次用户登录时被覆盖。

:::


## 设置用户权限边界

用户的有效权限由其分配的角色与其权限边界的交集决定。
这意味着仅当满足以下条件时才允许用户执行操作：

* 被至少一个角色允许。
* 被至少一个权限边界（如果存在）允许。
* 所有被授权的角色或权限边界均未拒绝。

以下是一个交互演示，通过使用权限边界限制对许可证的访问。

<StorylaneEmbed src='https://app.storylane.io/demo/jebtvpo3qzvf' />

### 创建权限策略并设置权限边界

1. 从顶部导航栏中选择**组织**，然后选择**权限策略**。
2. 点击 **+ 新增策略**。
3. 在对话框中，执行以下操作：
   * **名称**填写 `无法访问许可证`。
   * 在**策略编辑器**字段中，输入配置：
    ```json
      {
        "statement": [
          {
            "resources": [
              "arn:api7:iam:organization/*"
            ],
            "actions": [
              "iam:UpdateLicense"
            ],
            "effect": "deny"
          },
          {
            "resources": [
              "<.*>"
            ],
            "actions": [
              "<.*>"
            ],
            "effect": "allow"
          }
        ]
      }
     ```

    :::note

     此策略允许访问除许可证之外的所有资源。

     :::

   * 点击**新增**。
4. 从顶部导航栏中选择**组织**，然后选择**用户**。
5. 点击 **+ 邀请用户**。
6. 在对话框中，执行以下操作：
   * **用户名**填写 `Tom`。
   * 为 Tom 设置一次性密码。
   * **权限边界**选择 `无法访问许可证`。
   * 点击**邀请**。
7. 点击**更新角色**。
8. 在对话框中，执行以下操作：
   * **角色** 选择 `超级管理员`。
   * 点击**更新**。

### 验证

1. 使用 Tom 的帐户登录 API7 企业版。
2. 从顶部导航栏中选择**组织**，然后选择**许可证**。
3. 点击许可证页面上的编辑图标，可以看到以下提示，表明访问被拒绝：**权限被拒绝。你的角色不允许此操作。如果你需要额外的访问权限，请联系你的管理员。**

### 更新 Tom 的角色

1. 从顶部导航栏选择**组织**，然后选择**角色**。
2. 点击**更新角色**。
3. 在**更新角色**对话框中，执行以下操作：
   * 在**角色**字段中，添加一个新角色并选择**超级管理员**。
   * 点击“更新”。

### 验证

1. 使用 Tom 的帐户登录 API7 企业版。
2. 从顶部导航栏中选择**组织**，然后选择**许可证**。
3. 点击许可证页面上的编辑图标，可以看到以下提示，表明访问被拒绝：**权限被拒绝。你的角色不允许此操作。如果你需要额外的访问权限，请联系你的管理员**。

## 设置权限边界映射（需要 SSO）

满足定义的键值映射规则的用户将在登录时自动分配相应的权限边界。有关详细信息，请参阅[设置权限边界映射](../best-practices/sso.md#设置权限边界映射)。

:::note

权限边界映射优先于手动权限边界修改。当权限边界映射启用时，对用户权限边界的任何手动调整都将在下次用户登录时被覆盖。

:::

## 相关阅读

* 核心概念
  * [角色和权限策略](../key-concepts/roles-and-permission-policies.md)
* 快速入门
  * [创建自定义角色](../getting-started/create-custom-role.md)
* 最佳实践
  * [SSO 第三方登录](../best-practices/sso.md)