---
title: 在 OpenShift 上安装 API7 企业版
slug: /deployment/openshift
---

本指南将引导你完成在 OpenShift 集群上部署 API7 企业版的步骤。

## 架构

### 概述

API7 企业版包括两组组件：

1. 控制面：API7 控制台、API7 DP 管理器、数据库（可以使用 RDS 代替）、其他组件。
2. 数据面：API7 网关

![架构概述](https://static.apiseven.com/uploads/2024/04/12/jdit8lBM_1.png)

### 高可用部署模式

![高可用部署架构图](https://static.apiseven.com/uploads/2024/04/12/71h8UOEy_2.png)

## 前提条件

### 部署 OpenShift 集群

拥有一个正在运行的 OpenShift 集群：

![集群概览](https://static.apiseven.com/uploads/2024/04/12/d0bHSGin_3.png)

![集群机器池](https://static.apiseven.com/uploads/2024/04/12/HGuUkgnc_4.png)

### 管理安全上下文约束 (SCC)

[安全上下文约束 (SCC)](https://docs.openshift.com/container-platform/3.11/architecture/additional_concepts/authorization.html#security-context-constraints) 是 OpenShift 上的一组 API，用于管理 Pod 的安全策略约束。

OpenShift 中默认启用的 SCC 非常严格，要求容器中的进程对文件系统是只读的。按照[管理安全上下文约束](https://docs.openshift.com/dedicated/authentication/managing-security-context-constraints.html) 文档为 API7 企业版使用更灵活的 SCC `nonroot-v2`。

### 配置 OpenShift CLI

安装 [OpenShift CLI (oc)](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/getting-started-cli.html#installing-openshift-cli) 或从控制台下载它：

![在控制台上下载 OpenShift CLI (oc)](https://static.apiseven.com/uploads/2024/04/12/HprnNscc_5.png)

在控制台上找到登录命令：

![从控制台复制登录命令](https://static.apiseven.com/uploads/2024/04/12/r4W6gsFW_6.png)

使用你的令牌和服务器地址登录到 OpenShift 集群：

```shell
oc login \
  --token=sha256~pesd0RAyKiKJLkkKJ4Oh2lmy4KSX9b5J6Fc24FYM2EQ \
  --server=[https://api.api7.93ew.p1.openshiftapps.com:6443](https://api.api7.93ew.p1.openshiftapps.com:6443)
````

:::info

确保你的用户帐户具有 [`cluster-admin` 角色](https://docs.openshift.com/container-platform/3.11/architecture/additional_concepts/authorization.html#roles) 以执行集群管理。

:::

你应该会看到类似于以下内容的响应：

```text
Logged into "[https://api.api7.93ew.p1.openshiftapps.com:6443](https://api.api7.93ew.p1.openshiftapps.com:6443)" as "admin" using the token provided.

You have access to 102 projects, the list has been suppressed. You can list all projects with 'oc projects'

Using project "default".
```

### 创建项目

在控制台中创建一个项目：

![在 OpenShift 控制台中创建项目](about:sanitized)

或者，你可以使用 CLI 创建项目：

```shell
oc new-project api7-enterprise-project
```

项目名称将用作 Kubernetes 命名空间。

将默认项目切换到 `api7-enterprise-project`：

```shell
oc project api7-enterprise-project
```

## 安装 API7 企业版

### 添加 API7 Helm Chart 仓库

添加 API7 仓库 `https://charts.api7.ai`：

![添加 API7 Helm Chart 仓库](about:sanitized)

![填写 Helm Chart 仓库的详细信息](about:sanitized)

### 安装控制面

选择 `Api7ee3` Helm Chart 并创建：

![选择控制面 Helm Chart](about:sanitized)

![安装控制面 Chart](about:sanitized)

选择 Chart 版本：

![选择 Chart 版本](about:sanitized)

粘贴以下代码段以替换默认值：

```yaml
# 如果需要进行其他自定义，请调整这些值
postgresql:
  primary:
    podSecurityContext:
      fsGroup: 1001020000
    containerSecurityContext:
      runAsUser: 1001020000
prometheus:
  server:
    podSecurityContext:
      fsGroup: 1001020000
    containerSecurityContext:
      runAsUser: 1001020000
```

点击 **创建** 完成。你应该会看到已安装的组件：

![完成安装](about:sanitized)

查看所有已创建的服务：

```shell
kubectl get svc -owide -l app.kubernetes.io/name=api7ee3

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE   SELECTOR
api7ee3-dashboard    ClusterIP   172.30.249.55   <none>        7080/TCP            28m  app.kubernetes.io/component=dashboard,app.kubernetes.io/instance=api7ee3,app.kubernetes.io/name=api7ee3
api7ee3-dp-manager   ClusterIP   172.30.43.83    <none>        7900/TCP,7943/TCP   28m   app.kubernetes.io/component=dp-manager,app.kubernetes.io/instance=api7ee3,app.kubernetes.io/name=api7ee3
```

### 在控制台中激活许可证

将控制台服务端口转发到 `localhost:7443`：

```shell
kubectl port-forward svc/api7ee3-dashboard 7443:7443
```

如果成功，你应该能够在 [https://localhost:7443](https://localhost:7443) 访问控制台。

使用 `admin` 作为用户名和密码登录：

<div style={{textAlign: 'center'}}>
<img
  src="https://static.apiseven.com/uploads/2024/04/13/7OvbvbFZ_14.png"
  alt="使用 admin/admin 登录"
  width="50%"
/>
</div>

然后上传你的许可证。如果你没有许可证，可以[申请 30 天试用许可证](https://api7.ai/try?product=enterprise)。

<div style={{textAlign: 'center'}}>
<img
  src="https://static.apiseven.com/uploads/2024/08/09/1V8Tgsw3_generate-licnese-1.png"
  alt="上传许可证"
  width="50%"
/>
</div>

选择 **激活**：

<div style={{textAlign: 'center'}}>
<img
  src="https://static.apiseven.com/uploads/2024/08/09/zMljBUnq_updated-license.png"
  alt="激活许可证"
  width="60%"
/>
</div>

现在你应该会被重定向到控制台主界面。

### 添加控制面地址

在添加更多[网关实例](../key-concepts/gateway-groups.md)之前，首先配置控制面的连接地址。

在同一个集群中，数据面和控制面遵循 \`https://{service-