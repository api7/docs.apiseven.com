---
title: 在网关组之间同步 API
slug: /api-full-lifecycle-management/api-publishing/sync-apis-betweenn-gateway-groups
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

在网关组之间同步 API 有助于跨环境推广 API，尤其是从低阶环境到高阶环境，如从测试环境到生产环境。如果使用多个网关组来划分区域或团队，同步 API 将有助于在全球范围内分发 API。

:::info

- 同步会使网关组之间的服务版本保持一致，而发布则会为每次发布生成新的版本号。
- 你只能同步当前运行的服务版本，不能同步历史版本。

:::

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#API提供者)角色的用户账户。
2. [以服务维度发布 API](../api-publishing/publish-apis-by-service.md)。
3. [添加网关组](../api-runtime/add-gateway-groups)并将其命名为`生产网关组`。使该网关组作为生产环境的 API 网关。

## 将服务版本同步到生产网关组

<Tabs>
  <TabItem value="node" label="使用上游节点" default>
    <ol>
      <li> 从左侧导航栏中选择<strong>服务</strong>，然后单击 <strong>Swagger Petstore</strong>服务版本 <code>1.0.0</code>。</li>
      <li>从<strong>操作</strong>列表中，单击<code>同步到其他网关组</code>。</li>
      <li>在<strong>网关组</strong>字段中，选择<code>生产网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li>在<strong>如何找到上游</strong> 字段中，选择<code>使用节点</code>。</li>
      <li>在<strong>节点</strong>列表中，编辑<strong>主机</strong>和<strong>端口</strong>字段，输入生产环境中的后端节点地址或模拟服务器地址。</li>
      <li>单击<strong>同步</strong>。</li>
    </ol>
  </TabItem>
  <TabItem value="service-discovery" label="使用服务发现">
    <ol>
      <li> 从左侧导航栏中选择<strong>服务</strong>，然后单击 <strong>Swagger Petstore</strong>服务版本 <code>1.0.0</code>。</li>
      <li>从<strong>操作</strong>列表中，单击<code>同步到其他网关组</code>。</li>
      <li>在<strong>网关组</strong>字段中，选择<code>生产网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li>在<strong>如何找到上游</strong> 字段中，选择<code>使用服务发现</code>。</li>
      <li>在<strong>节点</strong>列表中，编辑<strong>主机</strong>和<strong>端口</strong>字段，输入生产环境中的后端节点地址或模拟服务器地址。</li>
      <li>单击<strong>同步</strong>。</li>
    </ol>
  </TabItem>
</Tabs>

## 验证 API

```bash
curl "http://127.0.0.1:9080/pet/1" # 将 127.0.0.1 替换为生产网关组的地址。
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