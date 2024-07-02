---
title: 在 Kubernetes 上部署网关和 Ingress Controller
slug: /getting-started/kubernetes-api7-ingress-controller
---

本教程将向你展示如何在 Kubernetes 上部署 API7 网关和 Ingress Controller。API7 Ingress Controller 允许你在 Kubernetes 中以声明方式配置 API7 网关。

如果你不希望使用 Kubernetes 和 API7 Ingress Controller，你可以跳过本教程，开始[创建一个简单的 API](./launch-your-first-api.md).

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 准备好一个运行中的 Kubernetes 集群。
3. 安装 [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)。

## 创建并设置命名空间

你可以选择为资源创建一个新的命名空间，并将其设置为首选命名空间，这样就不需要在每个命令中明确指定命名空间。

创建一个新的命名空间 `api7` 并将其设置为首选命名空间：

```shell
kubectl create namespace api7 && \
  kubectl config set-context --current --namespace=api7
```

验证默认命名空间是否已被成功修改：

```shell
kubectl config view --minify | grep namespace:
```
你应该能看到命名空间已经被设置：

```text
namespace: api7
```

## 新增一个网关组

打开控制台:

1. 在左侧菜单中选择 **网关组** ，然后下拉弹出网关组列表，点击 **新增网关组**。
2. 在新增网关组对话框中，执行如下操作：
    1.  **网关类型** 选择 **Ingress Controller**。
    2. **名称** 输入 `api7-ingress`。
    3. 点击 **新增**。

## 安装 Ingress Controller

复制生成的部署脚本，然后在终端中运行它。如果部署成功，你应该会看到类似以下内容的响应：

```text
NAME: api7-ingress
LAST DEPLOYED: Wed Jun 19 17:20:24 2024
NAMESPACE: api7
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

## 安装网关实例

打开控制台：

1. 在左侧 **网关组** 下的子菜单中，选择 **网关实例**， 然后点击 **新增网关实例**。
2. 切换到 **Kubernetes** 栏。
3. 填写命名空间及其他参数，然后点击 **生成** 来获取部署脚本。
3. 在终端中运行部署脚本。

:::info

当你完成 [安装 API7 企业版](./install-api7-ee.md) 教程后，会得到一个默认的网关组，里面会有一个部署好的网关实例。 为了避免端口冲突，你可以修改新网关实例的监听端口，或者在默认网关组中移除掉这个没有使用的网关实例。

:::

## 验证

1. 检查 pod 状态：

```shell
kubectl get pods
```

你应该可以看到所有 pod 都处于 `Running` 状态：

```text
NAME                                                  READY   STATUS    RESTARTS      AGE
api7-ee-3-gateway-698f85d98b-jxrwp                    1/1     Running      0          6m
api7-ingress-api7-ingress-controller-b4487c7c-p5qzk   1/1     Running      0          10m
```

2. 检查服务：

```shell
kubectl get services
```

你应该会看到类似以下内容的响应：

```text
NAME                                                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
api7-ee-3-gateway-gateway                             NodePort    10.96.106.11   <none>        80:32469/TCP                 6m
api7-ingress-api7-ingress-controller                  ClusterIP   10.96.61.45    <none>        80/TCP                       10m
api7-ingress-api7-ingress-controller-apisix-gateway   NodePort    10.96.85.233   <none>        80:32160/TCP,443:31815/TCP   10m
kubernetes                                            ClusterIP   10.96.0.1      <none>        443/TCP                      10m
```

回到控制台，在左侧 **网关组** 下的子菜单中，选择 **网关实例**，你应该能看到一个 `healthy` 状态的网关实例。请注意，通过 API7 Ingress Controller 创建的资源，在控制台中都是只读的。

## 相关阅读

- 快速入门
 - [新增网关实例](./add-gateway-instance.md)
 - [创建一个简单的 API](./launch-your-first-api.md)