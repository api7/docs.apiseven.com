---
title: 在 Kubernetes 上使用 API7 Ingress Controller 进行部署
slug: /deployment/ingress-controller
---

本教程将向你展示如何在 Kubernetes 上部署 API7 网关和 Ingress Controller。API7 Ingress Controller 允许你在 Kubernetes 中以声明方式配置 API7 网关。如果你不希望使用 Kubernetes 和 API7 Ingress Controller，则可以跳过本教程，从 [启动你的第一个 API](../getting-started/launch-your-first-api.md) 开始。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. 拥有一个正在运行的 Kubernetes 集群。
3. 已安装 [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)。

## 创建和设置命名空间

你可以选择为资源创建一个新的命名空间并将其设置为首选命名空间，这样你就不需要在每个命令中显式指定命名空间。

创建一个新的命名空间 `api7` 并将其设置为首选命名空间：

```shell
kubectl create namespace api7 && \
  kubectl config set-context --current --namespace=api7
```

要验证默认命名空间是否已修改：

```shell
kubectl config view --minify | grep namespace:
```

你应该会看到命名空间已设置：

```text
namespace: api7
```

## 新增网关组

导航到控制台：

1. 从侧边栏选择**网关组**，然后点击**新增网关组**。
2. 选择 **Ingress Controller** 作为**类型**。
3. **名称**输入 `api7-ingress`。
3. 点击**新增**。

## 安装 Ingress Controller

复制生成的部署脚本并在终端中运行它。如果部署成功，你应该会看到类似于以下内容的响应：

```text
NAME: api7-ingress
LAST DEPLOYED: Wed Jun 19 17:20:24 2024
NAMESPACE: api7
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

## 安装网关实例

导航到控制台：

1. 从侧边栏选择**网关实例**，然后点击**新增网关实例**。
2. 切换到**Kubernetes**选项卡。
3. 填写命名空间和其他参数，然后点击**生成**以查看部署脚本。
3. 在终端中运行部署脚本。

:::info

[安装 API7 企业版](../getting-started/install-api7-ee.md) 时，将使用一个网关实例初始化网关组 `default`。为避免端口冲突，你可以修改新网关实例的监听端口，或移除 `default` 网关组中未使用的实例。

:::

## 验证

检查 Pod 状态：

```shell
kubectl get pods
```

你应该会看到所有 Pod 都处于 `Running` 状态：

```text
NAME                                                  READY   STATUS    RESTARTS      AGE
api7-ee-3-gateway-698f85d98b-jxrwp                    1/1     Running      0          6m
api7-ingress-api7-ingress-controller-b4487c7c-p5qzk   1/1     Running      0          10m
```

检查服务：

```shell
kubectl get services
```

你应该会看到类似于以下内容的响应：

```text
NAME                                                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
api7-ee-3-gateway-gateway                             NodePort    10.96.106.11   <none>        80:32469/TCP                 6m
api7-ingress-api7-ingress-controller                  ClusterIP   10.96.61.45    <none>        80/TCP                       10m
api7-ingress-api7-ingress-controller-apisix-gateway   NodePort    10.96.85.233   <none>        80:32160/TCP,443:31815/TCP   10m
kubernetes                                            ClusterIP   10.96.0.1      <none>        443/TCP                      10m
```

导航回控制台并选择**网关实例**，你应该会看到一个处于 `healthy` 状态的网关实例。请注意，使用 API7 Ingress Controller 创建的资源在控制台中将是只读的。

## 下一步

1. 了解如何在网关组中创建[网关实例](../getting-started/add-gateway-instance.md)。
2. 按照[入门教程](../getting-started/launch-your-first-api.md)了解更多关于在 API7 企业版中使用 API7 Ingress Controller 的信息。
