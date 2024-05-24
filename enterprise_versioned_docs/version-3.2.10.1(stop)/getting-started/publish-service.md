---
title: 以服务维度发布 API
slug: /getting-started/publish-service
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

设计、开发和部署 API 后，你可以在 API7 企业版中发布这些 API，以便进行访问。你可以将其发布到测试环境、预生产环境、生产环境，或多个区域。

本教程以 `Swagger Petstore` 为例，介绍如何将 API 发布到测试环境。通常情况下，开发人员根据后端服务组织 API，因此 API7 以服务维度管理 API。特定后端的 API 共享配置，并在后端发生变化时一起更新。

## 前提条件

1. [安装API7 企业版](install-api7-ee.md)。
2. 获取一个具有**超级管理员** 或 **API 提供者** 角色的用户账户。
3. 将默认网关组重命名为`测试网关组`并配置网络。该网关组将作为测试环境的 API 网关。
4. [在网关组中至少新增一个网关实例](add-gateway-instance.md)。

## 新增服务和路由

<Tabs
  defaultValue="manually"
  values={[
    {label: '手动新增', value: 'manually'},
    {label: '导入OpenAPI 3.0', value: 'openapi'},
  ]}>
  <TabItem value="manually">
    <ol>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 然后单击<strong>新增服务</strong>。</li>
      <li> 选择 <strong>手动新增</strong>。</li>
      <li> <strong>名称</strong>填写<code>Swagger Petstore</code>。</li>
      <li> 单击<strong>新增</strong>。</li>
      <li> 在服务详情页面中，单击<strong>新增路由</strong>。</li>
      <li> 在<strong>新增路由</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>名称</strong>填写<code>getPetById</code>。</li>
          <li><strong>路径</strong>填写<code>/pet/*</code>。</li>
          <li><strong>HTTP方法</strong>选择<code>GET</code>。</li>
        </ol>
      </li>
      <li>单击<strong>新增</strong>。</li>
    </ol>
  </TabItem>
  <TabItem value="openapi">
    <ol>
      <li> 从左侧导航栏中选择<strong>服务</strong>，然后单击<strong>新增服务</strong>。</li>
      <li> 选择<strong>导入OpenAPI</strong>.</li>
      <li> 上传 YAML/JSON 文件，然后选择<code>HTTP</code>作为<strong>上游 Scheme</strong>。</li>
      <li> 单击<strong>下一步</strong>。</li>
      <li> 确认以下信息都无误后单击<strong>下一步</strong>：
      <ol>
        <li> <strong>名称</strong>：来自 OpenAPI 文件中的<code>title</code>。</li>
        <li> <strong>标签</strong>：来自 OpenAPI 文件中的<code>tag</code>。</li>
        <li> <strong>描述</strong>：来自 OpenAPI 文件中的<code>description</code>。</li>
        <li> <strong>路由</strong>：来自 OpenAPI 文件中的<code>Paths</code>。</li>
      </ol>
      </li>
      <li> 单击<strong>新增</strong>。</li>
    </ol>
  </TabItem>
</Tabs>

## 使用上游节点发布服务

<Tabs
  defaultValue="single"
  values={[
    {label: '发布单个服务', value: 'single'},
    {label: '批量发布服务', value: 'batch'},
  ]}>
  <TabItem value="single">
    <ol>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 然后选择目标服务<code>Swagger Petstore</code>，然后单击<strong>立刻发布</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 在<strong>服务发布</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>新版本</strong>填写<code>1.0.0</code>。</li>
          <li><strong>如何找到上游</strong>选择<code>使用节点</code>。</li>
        </ol>
      </li>
      <li> 单击<strong>新增节点</strong>，在对话框中, 执行以下操作:
        <ol>
          <li><strong>主机</strong>和<strong>端口</strong>，填写 API 在测试环境的后端服务地址。</li>
          <li><strong>权重</strong>使用默认值<code>100</code>。</li>
          <li>单击<strong>新增</strong>。</li>
        </ol>
      </li>
      <li> 确认信息都无误后，单击<strong>发布</strong>。</li>
    </ol>
  </TabItem>
  <TabItem value="openapi">
    <ol>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 单击<strong>批量发布服务</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 按照发布单个服务的类似步骤，添加多个待发布的服务。</li>
      <li> 批量发布服务要求操作者同时具有所选的所有服务的操作权限（API Provider授权范围），且多个服务之间不可以有重复路径的路由，以免发布后引起冲突。</li>
      <li> 确认信息都无误后，单击<strong>发布</strong>。</li>
    </ol>
  </TabItem>
</Tabs>

## 使用服务发现发布服务

Consul、Eureka、Nacos 或 Kubernetes Service Discovery 等服务发现机制可以动态检测后端节点。因此，用户无需手动输入多个上游节点。

:::info

发布后，服务无法在使用定义的上游节点和使用服务发现之间直接切换。不过，可以通过流量灰度在上游节点和服务发现之间进行切换。

:::

<Tabs
  defaultValue="k8s"
  values={[
    {label: 'Kubernetes', value: 'k8s'},
    {label: 'Nacos', value: 'Nacos'},
  ]}>
  <TabItem value="k8s">
    <ol>
      <li> 从左侧导航栏中选择 <strong>网关组</strong>， 然后选择<code>测试网关组</code>。</li>
      <li> 从左侧导航栏中选择<code>服务注册中心</code>，然后单击<strong>新增服务注册中心连接</strong>。</li>
      <li> 在<strong>新增服务注册中心连接</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>名称</strong>填写<code>测试 Kubernetes 注册中心</code>。</li>
          <li><strong>发现类型</strong>选择<code>Kubernetes</code>。</li>
          <li>填写<strong>API 服务器地址</strong>和<strong>令牌</strong>。</li>
        </ol>
      </li>
      <li> 等待连接，确保注册中心连接状态为<code>健康</code>。</li>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 然后选择目标服务<code>Swagger Petstore</code>，然后单击<strong>立刻发布</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 在<strong>服务发布</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>新版本</strong>填写<code>1.0.0</code>。</li>
          <li><strong>如何找到上游</strong>选择<code>使用服务发现</code>。</li>
          <li><strong>服务注册中心</strong>选择<code>测试 Kubernetes 注册中心</code>，并选择好对应的命名空间和服务名称。</li>
        </ol>
      </li>
    </ol>
  </TabItem>
  <TabItem value="Nacos">
    <ol>
      <li> 从左侧导航栏中选择 <strong>网关组</strong>， 然后选择<code>测试网关组</code>。</li>
      <li> 从左侧导航栏中选择<code>服务注册中心</code>，然后单击<strong>新增服务注册中心连接</strong>。</li>
      <li> 在<strong>新增服务注册中心连接</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>名称</strong>填写<code>测试 Nacos 注册中心</code>。</li>
          <li><strong>发现类型</strong>选择<code>Nacos</code>。</li>
          <li>填写<strong>主机地址</strong>和<strong>端口号</strong>。</li>
        </ol>
      </li>
      <li> 等待连接，确保注册中心连接状态为<code>健康</code>。</li>
      <li> 从左侧导航栏中选择 <strong>服务</strong>， 然后选择目标服务<code>Swagger Petstore</code>，然后单击<strong>立刻发布</strong>。</li>
      <li> 选择<code>测试网关组</code>，然后单击<strong>下一步</strong>。</li>
      <li> 在<strong>服务发布</strong> 对话框中, 执行以下操作:
        <ol>
          <li><strong>新版本</strong>填写<code>1.0.0</code>。</li>
          <li><strong>如何找到上游</strong>选择<code>使用服务发现</code>。</li>
          <li><strong>服务注册中心</strong>选择<code>测试 Nacos 注册中心</code>，并选择好对应的命名空间、分组和服务名称。</li>
        </ol>
      </li>
    </ol>
  </TabItem>
</Tabs>

## 验证 API

```bash
curl "http://127.0.0.1:9080/pet/1" 
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