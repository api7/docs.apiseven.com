---
title: API 版本控制
slug: /api-full-lifecycle-management/api-publishing/api-version-control
---

API7 企业版提供强大的版本控制功能，可在服务级别发布和管理 API 变更。你可以将最新的 API 配置发布到不同环境、地区或团队的各个网关组。特定的版本号代表一致的业务逻辑。用户可以简单可靠地回滚到历史版本。

通常情况下，API 是按后端服务进行组织，因此 API7 以服务维度管理 API。发布到网关组时，同一版本中的所有 API 共享相同的版本号。

## API 版本控制原则

在对 API 进行更改时，使用适当的版本控制策略有助于避免对 API 消费者产生破坏性影响。以下是有效管理 API 版本的一些关键原则。

### 使用合理的版本号

- 只有在需要进行必要的破坏性更改时，才增加主要版本（v1、v2）。
- 对于向后兼容的变更，首选小版本增量（v1.1）。
- 错误修复版本的递增（v1.1.1）应对 API 用户无害。
- 不要重复使用已废弃的版本号，以免产生误解。

### 同步而不是直接发布到生产

API 发布从服务模板开始，因此每次都会生成新版本。每个版本在投入生产前都应在测试环境中进行全面测试，不给他人留下更改配置的机会。

## API 版本控制工作流程的最佳实践

1. [为测试和生产环境添加两个网关组](../api-runtime/add-gateway-groups.md)。
2. [将 API 发布到测试网关组](../api-publishing/publish-apis-by-service.md)，服务版本为 `1.0.0`。
3. 在测试环境中验证 API。
4. 更新服务模板中的 API 配置。
5. 再次向测试网关组发布服务版本 `1.0.1`，修复错误。
6. [将 API 同步到生产网关组](../api-publishing/sync-apis-betweenn-gateway-groups.md)，服务版本为 `1.0.1`。

    请注意，[运行时配置](../../key-concepts/services.md#运行时配置)可能因网关组不同而不同，但它们不会影响版本号。

    :::info

    例如

    - 测试环境中的 API URL 是 `https://api7-test.ai/v1/pet`，节点地址是 `127.0.0.1:80`。
    - 生产环境中的 API URL 是 `https://api7.ai/petstore/pet`，节点地址是 `192.168.0.1:80`。

    :::

7. 在新的迭代中，编辑服务模板，添加更多路由。
8. [将 API 发布到测试网关组](../api-publishing/publish-apis-by-service.md)，服务版本为 `1.1.0`。
9. 在测试环境中验证 API，有可能发生紧急情况。
10. [回滚版本](../api-publishing/rollback-apis.md)至 `1.0.0`，恢复 API。