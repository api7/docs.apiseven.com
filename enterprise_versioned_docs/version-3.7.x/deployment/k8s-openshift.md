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

在同一个集群中，数据面和控制面遵循 \`https://{service-name}.{namespace}.svc.cluster:7943\` 的格式，无论它们是否部署在同一命名空间下。

![添加控制面地址](https://static.apiseven.com/uploads/2024/08/09/Zzgc5aic_20240809-150435.jpeg)

默认情况下，API7 网关和控制面将使用 mTLS 进行身份验证。你应该将 `https://{service-name}.{namespace}.svc.cluster:7943` 配置为控制面地址。

````markdown
### 安装数据面

#### 为 API7 网关配置 SCC

API7 网关需要在运行时生成本地文件，包括 `nginx.conf`、日志和缓存文件。`nonroot-v2` SCC 具有所需的权限就足够了。

创建服务帐户：

```shell
oc create serviceaccount api7-gateway
````

创建具有 `nonroot-v2` SCC 的角色：

```shell
oc create role api7-gateway \
  --verb=use \
  --resource=scc 
  --resource-name=nonroot-v2
```

将角色绑定到服务帐户：

```shell
oc create rolebinding api7-gateway \
  --role=api7-gateway
  --serviceaccount=api7-enterprise-project:api7-gateway
```

#### 生成并运行部署脚本

与 Apache APISIX 相比，API7 企业版引入了一个额外的逻辑分组，称为[网关组](../key-concepts/gateway-groups.md)，你可以在其中使用同一个 API7 控制台管理不同的网关实例集。

首先，你应该创建或选择目标网关组。在本指南中，你将使用 `default` 网关组：

![在控制台中查找默认网关组](about:sanitized)

接下来，选择 **添加网关实例**：

![添加网关实例](about:sanitized)

切换到 **Kubernetes** 选项卡并填写参数。完成后，点击**生成**以查看部署脚本。

![生成部署脚本](about:sanitized)

复制生成的脚本并设置额外的 `securityContext`。该命令应类似于以下内容：

```shell
helm repo add api7 [https://charts.api7.ai](https://charts.api7.ai)
helm repo update
cat > /tmp/tls.crt <<EOF
-----BEGIN CERTIFICATE-----
MIIBiDCCATqgAwIBAgICBAAwBQYDK2VwMEQxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
EwpDYWxpZm9ybmlhMQ0wCwYDVQQKEwRBUEk3MREwDwYDVQQDEwhBUEk3IEluYzAe
Fw0yNDA4MDkwOTQwNDJaFw0yNTA5MDgwOTQwNDJaMDAxDTALBgNVBAoTBEFQSTcx
HzAdBgNVBAMTFmFwaTdlZTMtYXBpc2l4LWdhdGV3YXkwKjAFBgMrZXADIQBSZVOn
f8Xu63XylUmRi8jvx0G4XUtPQGoYHdSTeyLF36NkMGIwDgYDVR0PAQH/BAQDAgeA
MBMGA1UdJQQMMAoGCCsGAQUFBwMCMC0GA1UdDgQmBCRlOTcwNDRjNy0xZjM2LTQ5
OTYtOTc1NC1hZDY4OTU2Yjk3ZGMwDAYDVR0jBAUwA4ABMDAFBgMrZXADQQAnpSpi
G+X9AgBYUhY3XBe6q9c75RzDjwTf2g9rkmD0VJxYrWVtT95xRwBufiRUsnRh24WE
7NmLI3rE5aGoY0wH
-----END CERTIFICATE-----
EOF
cat > /tmp/tls.key <<EOF
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIAokQWsCGewdhhxAKjUFWAyJknZqJWhOCChVbJOXBspi
-----END PRIVATE KEY-----
EOF
cat > /tmp/ca.crt <<EOF
-----BEGIN CERTIFICATE-----
MIIBdTCCASegAwIBAgIQRR8k78lPFZM+mtyAUfz5rjAFBgMrZXAwRDELMAkGA1UE
BhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcxETAPBgNV
BAMTCEFQSTcgSW5jMB4XDTI0MDgwOTA2MjUxOFoXDTM0MDgwNzA2MjUxOFowRDEL
MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcx
ETAPBgNVBAMTCEFQSTcgSW5jMCowBQYDK2VwAyEAplXlP4zxS8cq1Qa5Syd7r/ya
SaolzMQBLTMQfcKkb16jLzAtMA4GA1UdDwEB/wQEAwIChDAPBgNVHRMBAf8EBTAD
AQH/MAoGA1UdDgQDBAEwMAUGAytlcANBAJ0ezih/La2Ajc7bi1WdlzIi+T3oIPta
d/l1PkE5rDLxySMzJvowk49earvcz5rVILf2aG/k1YRc7Kc+cmnLlAs=
-----END CERTIFICATE-----
EOF
kubectl create secret generic api7-ee-3-gateway-tls --from-file=tls.crt=/tmp/tls.crt --from-file=tls.key=/tmp/tls.key --from-file=ca.crt=/tmp/ca.crt
helm upgrade --install api7-ee-3-gateway api7/gateway \
  --set "etcd.auth.tls.enabled=true" \
  --set "etcd.auth.tls.existingSecret=api7-ee-3-gateway-tls" \
  --set "etcd.auth.tls.certFilename=tls.crt" \
  --set "etcd.auth.tls.certKeyFilename=tls.key" \
  --set "etcd.auth.tls.verify=true" \
  --set "gateway.tls.existingCASecret=api7-ee-3-gateway-tls" \
  --set "gateway.tls.certCAFilename=ca.crt" \
  --set "apisix.extraEnvVars[0].name=API7_GATEWAY_GROUP_SHORT_ID" \
  --set "apisix.extraEnvVars[0].value=default" \
  --set "etcd.host[0]=https://api7ee3-dp-manager.api7-enterprise-project.svc.cluster.local:7943" \
  --set "apisix.replicaCount=1" \
  --set "serviceAccount.name=api7-gateway" \
  --set "apisix.image.repository=api7/api7-ee-3-gateway" \
  --set "apisix.image.tag=3.2.14.4"
  --set "apisix.securityContext.runAsNonRoot=true" \
  --set "apisix.securityContext.runAsUser=636"
```

在你的集群上安装 API 网关实例。

导航回 `default` 网关组，你应该会看到一个健康的网关实例。

## 验证安装

### 创建示例服务

创建一个服务 `HTTPBIN`：

![创建服务 httpbin](https://static.apiseven.com/uploads/2024/04/12/f70nEdxx_22.png)

添加一个到 `/anything` 端点的路由，并仅允许 `GET` 方法：

![添加带有 GET 方法的路由](https://static.apiseven.com/uploads/2024/04/12/RpMfp0pP_23.png)

你现在应该会看到服务显示了创建的路由：

![控制台显示带有创建的路由的服务](https://static.apiseven.com/uploads/2024/04/12/37UQHBZB_24.png)

### 端口转发网关服务

在你向网关发送请求之前，你应该首先将网关监听端口转发到本地主机。

首先，列出所有服务以检查网关服务名称：

```shell
kubectl get svc
```

网关服务名称是 `api7-ee-3-gateway-gateway`：

```text
NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
// highlight-next-line
api7-ee-3-gateway-gateway   NodePort    172.30.211.30   <none>        80:31649/TCP        3m51s
api7-postgresql             ClusterIP   172.30.215.68   <none>        5432/TCP            56m
api7-postgresql-hl          ClusterIP   None            <none>        5432/TCP            56m
api7-prometheus-server      ClusterIP   172.30.3.68     <none>        9090/TCP            56m
api7ee3-dashboard           ClusterIP   172.30.249.55   <none>        7080/TCP            56m
api7ee3-dp-manager          ClusterIP   172.30.43.83    <none>        7900/TCP,7943/TCP   56m
```

接下来，将网关端口 `80` 转发到 `localhost:9080`：

```shell
kubectl port-forward svc/api7-ee-3-gateway-gateway 9080:80
```

### 发送请求

此请求收到正确的响应，这意味着安装成功。

```shell
curl "http://127.0.0.1:9080/anything" -i
```

你应该会收到一个类似于以下内容的 `HTTP/1.1 200 OK` 响应：

```json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {},
  "headers": {
    "Accept": "*/*",
    "Host": "localhost",
    "User-Agent": "curl/8.4.0",
    "X-Amzn-Trace-Id": "Root=1-65fa9071-7506ab7b0e98d7546e3c0845",
    "X-Forwarded-Host": "localhost"
  },
  "json": null,
  "method": "GET",
  "origin": "::1, 3.1.235.149",
  "url": "http://localhost/anything"
}
```

## 下一步

除了通过控制台 UI 发布服务外，API7 还提供了一个可以操作声明式配置的命令行工具，因此你可以将 API7 操作与内部 GitOps 集成。请参阅[使用 APISIX Declarative CLI (ADC) 以声明方式管理 APISIX](https://api7.ai/blog/managing-apisix-declaratively)。

请参阅[入门教程](../getting-started/install-api7-ee.md)以了解更多关于如何使用 ADC 的信息。

## 常见问题解答

### 如何连接到现有的 PostgreSQL？

在 [Helm values 文件](https://github.com/api7/api7-helm-chart/blob/main/charts/api7/values.yaml) 中配置你的数据库 DSN：

```yaml
dashboard_configuration:
  database:
    dsn: "postgres://api7ee:changeme@api7-postgresql:5432/api7ee"

dp_manager_configuration:
  database:
    dsn: "postgres://api7ee:changeme@api7-postgresql:5432/api7ee"
```
