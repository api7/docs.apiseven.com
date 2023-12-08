---
title: 在网关组之间同步 API
slug: /api-full-lifecycle-management/api-publishing/sync-apis-betweenn-gateway-groups
---

在网关组之间同步 API 有助于跨环境推广 API，尤其是从低级环境到高级环境，如从测试环境到生产环境。如果使用多个网关组来划分区域或团队，同步 API 将有助于在全球范围内分发 API。

:::info

- 同步会使网关组之间的服务版本保持一致，而发布则会为每次发布生成新的版本号。
- 你只能同步当前运行的服务版本，不能同步历史版本。

:::

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#API提供者)角色的用户账户。
2. [按服务发布 API](../api-publishing/publish-apis-by-service.md)。
3. [添加网关组](../api-runtime/add-gateway-groups)并将其命名为 `Production Group`。使该网关组作为生产环境的 API 网关。

## 将服务版本同步到生产组

1. 从左侧导航栏中选择**服务**，然后单击 `Swagger Petstore` 服务版本 `1.0.0`。
2. 从**操作**列表中单击**同步**。
3. 在**目标网关组**字段中选择 `Production Group`，然后单击**下一步**。
4. 确认服务信息，然后单击**下一步**。
5. 在**节点**表中，编辑**主机**和**端口**字段，输入生产环境中的后端节点地址或模拟服务器地址。
6. 单击**同步**。

## 在生产环境中验证 API

```bash
curl "http://127.0.0.1:9080/pet/1" # 将 127.0.0.1 替换为 Production Group 的地址。
```

你应该会看到以下输出：

```bash
{
  "name": "Dog",
  "photoUrls": [
    "https://example.com/dog-1.jpg",
    "https://example.com/dog-2.jpg"
  ],
  "id": 1,
  "category": {
    "id": 1,
    "name": "pets"
  },
  "tags": [
    {
      "id": 1,
      "name": "friendly"
    },
    {
      "id": 2,
      "name": "smart"
    }
  ],
  "status": "available"
}
```