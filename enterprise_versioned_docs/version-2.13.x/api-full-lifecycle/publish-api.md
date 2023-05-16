---
title: 发布 API 到网关
slug: /api-full-lifecycle/publish-apis
tags:
- API7 Enterprise
---

API 开发完毕后，需要发布到 API7 网关中，以获得 API7 带来的各种强大能力。本文将指导您如何在 API7 控制台中发布一个 API，以及如何验证发布结果。

在 API 发布上线之前，应当进行充分的测试和配置调试，以保证线上业务的稳定。

:::info

本文将使用根据[设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis)，在 Postman 上创建的 Mock API进行演示。

:::

## 前置要求

成功部署 API7 Enterprise，并创建好集群与工作分区。

## 手动录入 API

### 新建上游

将 Postman 上的 Mock Server 设置为上游。

参考文档[新建上游](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E6%96%B0%E5%BB%BA%E4%B8%8A%E6%B8%B8)。

在【**步骤9**: 填写表单】中，使用如下配置：

**名称**：shop_server
**目标节点**: Mock Server 的地址
**端口**： 443
**协议**： HTTPs
**权重**： 1

![Create Upstream shopserver](https://static.apiseven.com/uploads/2023/05/16/DxrmrWmF_createupstream-shop_server.png)

### 新建 API 并发布

根据设计，我们总共需要创建三个 API。以`CreateProduct`为例。
参考[新建 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#%E6%96%B0%E5%BB%BA-api)。

在【**步骤10**: 填写表单】中，使用如下配置：

**名称**： shop_server_CreateProduct
**上游服务**： 选择上一步中创建的 `shop_server`
**路径**:  /products
**HTTP 方法**：GET
**API 上线**：开启

![Create API - CreateProduct](https://static.apiseven.com/uploads/2023/05/16/ItYstSl6_createapi-createproduct.png)

## 批量导入 API 

如果已经有 OpenAPI 文件，可以通过导入的方式快速创建多个 API，无需手动录入。

### 导入 OpenAPI





## 发布 API

### 直接进行全量发布

全量发布是一种将新版本直接发布给所有用户的方式，它可以在满足以下情况时使用：

1. 新版本对现有用户没有可能造成重大影响，或者针对的是一些不太重要的问题。
2. 测试结果表明新版本的稳定性和可靠性已经足够高，不存在可能的问题和 bug。
3. 没有进行灰度发布的必要性，或者时间规划比较紧，需要快速完成新版本发布。

**步骤1**：在进入工作分区后，点击左侧导航【API 管理】-【API 列表】。

**步骤2**：选择名称为「发布产品」的API ，点击【更多】-【上线 API】。点击后提示上线成功。

全量发布可以是一种直接的更新策略，适用于那些更新内容不太敏感的产品或者紧急情况。但在任何情况下，都应该在发布新版本之前仔细地测试，确保新版本的质量和稳定性达到预期。

### 灰度发布

当某个更新或者功能对整个产品的功能或者性能有比较大的改变时，可以考虑使用灰度发布来降低风险，减少影响范围。另外，如果你有一个已经存在用户群体的产品，你也可以选择先在一部分用户中测试新的功能，以便快速发现和修复问题。

在前面我们创建了一个提供功能的上游（当前上游），为了实现新功能的灰度发布，我们还需要再创建一个已经新增了额外功能的新上游（目标上游），这一步同样可以参考对应文档[新建上游](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E6%96%B0%E5%BB%BA%E4%B8%8A%E6%B8%B8)。

在【**步骤9**: 填写表单】中，「名称」字段中填写 `新商城上游` ，「目标节点」字段填写已实现新的 API 功能的上游主机名或 IP。

接下来进行灰度发布，灰度发布的操作可以参考对应文档[新建发布管理](https://docs.apiseven.com/enterprise/user-manual/cluster/canary#%E6%96%B0%E5%BB%BA%E5%8F%91%E5%B8%83%E7%AE%A1%E7%90%86)。

在【**步骤9**: 填写表单】中，「任务名称」填写 `产品发布新功能灰度`，「目标 API」字段选择名称为「发布产品」的 API，「目标上游服务」字段选择 `新商城上游`，「目标上游流量」字段占比填写 `10%` 点击右下角【提交】按钮，即可开始执行发布任务。

当新建发布管理并验证目标上游服务正常后，通过不断增加目标上游的百分比多次测试，操作过程可以参考文档 [配置发布管理](新建发布管理并验证目标上游服务正常后，通过不断增加目标上游的百分比多次测试)。

在【**步骤8**: 修改发布管理的配置。】中，将「目标上游流量」字段占比修改为更大的百分比，例如 `20%` ，再点击右下角【提交】按钮，即可更新发布配置。

验证发现目标上游不符合预期或不稳定，放弃更新上游，目标 API 的所有请求仍然转发到当前上游。操作可以参考文档[取消任务](https://docs.apiseven.com/enterprise/user-manual/cluster/canary#%E5%8F%96%E6%B6%88%E4%BB%BB%E5%8A%A1)。

在灰度发布过程中，如果测试结果良好，点击对应任务列【更多】-【全量发布】按钮，即可将 API 的上游流量全部迁移至目标上游服务。全量发布后任务状态会变更为「已完成」且无法再编辑发布配置。

## 验证

### 后端 API 验证

在 API 发布成功后，调用 API 可以成功访问相应的上游服务并获取到正确的响应。当设置灰度发布任务时，调用 API 可以成功访问上游，且响应会根据流量占比的设置进行划分，一部分为当前上游的响应，一部分为目标上游的响应。

### 控制台展示验证

在 API 发布后，API 列表中该 API 的状态为 `已发布`。