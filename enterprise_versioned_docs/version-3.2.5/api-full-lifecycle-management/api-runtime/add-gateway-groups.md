---
title: 创建网关组
slug: /api-full-lifecycle-management/api-runtime/add-gateway-groups
---

[网关组](../../key-concepts/gateway-groups.md) 用于分段。以下是网关组其他的应用场景：

**根据开发环境**：

为每个开发环境创建单独的网关组：测试、预生产和生产环境

- 测试环境：供 API 提供者在发布之前验证 API
- 预生产环境：正式发布前，验证 API
- 生产环境：已发布 API 的实时小组

**根据开发团队**：

为每个开发团队创建网关组，确保各团队拥有自己的 API。

- `团队 A`：后端/API 团队
- `团队 B`：前端消费者团队
- `团队 C`：合作伙伴集成团队

**根据地区**：

根据地理区域创建 API：

- `USA-East API`：面向美国东海岸地区
- `欧盟 API`：欧洲组
- `亚洲 API`：亚洲组

**自定义组**：

根据需要创建自定义网关组类别：

- `私有`：仅在你组织内使用的 API
- `公有`：面向向公众开放的 API 
- `第三方`：外部/合作伙伴 API

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。

## 创建网关组

如需创建网关组，遵循以下步骤：

1. 从左侧导航栏中选择**网关组**，然后单击**添加网关组**。

    ![添加网关组](https://static.apiseven.com/uploads/2023/12/08/zTO9siFR_add_gateway_group_zh.png)

2. 在**名称**字段中，输入 `Production`。
3. 单击**添加**。
4. 单击新创建的 `Production` 网关组，然后单击**添加网关实例**。
5. 按照页面上的说明进行操作。
6. 完成[跟踪网关实例状态](track-gateway-instance-status.md)。
