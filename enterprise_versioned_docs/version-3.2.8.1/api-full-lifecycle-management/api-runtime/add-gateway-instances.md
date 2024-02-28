---
title: 添加网关实例
slug: /api-full-lifecycle-management/api-runtime/add-gateway-instances
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

网关实例是处理流量的代理。网关实例属于[网关组](../../key-concepts/gateway-groups.md)。本文介绍如何使用以下方法将网关实例添加到网关组：

- Docker
- Kubernetes

## 前提条件

- 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
- [创建一个网关组](../api-runtime/add-gateway-groups.md)。本文假设你已经创建一个`生产网关组`。
- 如果使用 Docker 添加网关实例，需要安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install) 。
- 如果使用 Kubernetes 添加网关实例，需要安装 [Helm](https://helm.sh/docs/intro/install/) 和 [Kubernetes](https://kubernetes.io/docs/setup/)。如果在 Red Hat OpenShift 等平台上安装 API7 企业版，则需要配置安全上下文约束 （Security Context Constraints，SCC）。

## 步骤

<Tabs>
  <TabItem value="docker" label="Docker" default>
    <ol>
      <li>单击创建的 <strong>生产网关组</strong>，然后单击<strong>新增网关实例</strong>。</li>
      <li>按照页面上的说明进行操作。</li>
        <ul>
          <li>将 HTTP 端口 ID 和 HTTPS 端口 ID 分别设置为 <code>9080</code> 和 <code>9443</code>。</li>
          <li>（可选）将网关实例名称设置为 <code>test</code>。</li>
          <img src="https://static.apiseven.com/uploads/2024/02/27/3aIxKNEZ_add-gateway-instance-docker_zh.png" alt="使用Docker 添加网关实例" width="100%"/>
        </ul>
      <li>单击<strong>生成</strong>，获取用于将网关实例添加到<strong>生产网关组</strong>的命令。</li>
      <li>打开终端并运行生成的命令。</li>
      <li>（可选）<a href="/enterprise/api-full-lifecycle-management/api-runtime/track-gateway-instance-status">追踪网关实例状态</a>。</li>
    </ol>
  </TabItem>
  <TabItem value="k8s" label="Kubernetes">
    <ol>
      <li>单击创建的<strong>生产网关组</strong>，然后单击<strong>新增网关实例</strong>。</li>
      <li>按照页面上的说明进行操作。</li>
        <ul>
          <li>将 <strong>Helm 版本名称</strong>设置为 <code>api7-ee-3-gateway</code>。</li>
          <li>将<strong>命名空间</strong>设置为 <code>api7-ee</code>。</li>
          <li>将<strong>副本数</strong>设置为 <code>1</code>。</li>
          <img src="https://static.apiseven.com/uploads/2024/02/27/g0nIFhqV_add-gateway-instance-k8s_zh.png" alt="使用 K8S添加网关实例" width="100%"/>
        </ul>
      <li>单击<strong>生成</strong>，获取用于将网关实例添加到 <strong>生产网关组</strong>的命令或 YAML 配置。</li>
      <li>对于 CLI 命令行用户，打开终端并运行生成的命令。</li>
      <li>对于 YAML 文件用户，更新并应用新的 YAML 配置文件。</li>
      <li>（可选）<a href="/enterprise/api-full-lifecycle-management/api-runtime/track-gateway-instance-status">追踪网关实例状态</a>。</li>
    </ol>
  </TabItem>
</Tabs>