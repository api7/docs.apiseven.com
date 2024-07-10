---
title: 转发四层流量
slug: /getting-started/proxy-l4-traffic
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

API7 网关 除了处理应用层（L7）流量外，还可以处理传输层（L4）TCP 和 UDP 流量。

本教程将演示如何配置 [四层路由](../key-concepts/stream-routes.md) 在客户端和 MySQL 服务器之间代理 L4 流量。

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 网关组中至少有一个 [网关实例](./add-gateway-instance.md)。
3. 安装 [MySQL 客户端](https://dev.mysql.com/doc/refman/8.4/en/installing.html) 以验证四层路由。

## 启动 MySQL 服务器

<Tabs
groupId="api"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'k8s'},
]}>

<TabItem value="docker">

如果你在 Docker 中安装了网关实例并使用 Dashboard 或 ADC 进行配置，请在默认的 API7 Enterprise 网络 `api7-ee_api7` 中启动 MySQL 服务器：

```shell
docker run -d \
  --name mysql \
  --network=api7-ee_api7 \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  mysql:8.4 \
  mysqld --mysql-native-password=ON
```

</TabItem>

<TabItem value="k8s">

如果你在 Kubernetes 上安装了网关实例并使用 Ingress Controller 进行配置，请在 Kubernetes 上启动 MySQL 服务器：

```shell
kubectl run mysql --image mysql:8.4 --port 3306 --env="MYSQL_ROOT_PASSWORD=password"
```

通过服务暴露服务器端口：

```shell
kubectl expose pod mysql --port 3306
```

</TabItem>
</Tabs>

## 添加具有四层路由的服务

<Tabs
groupId="config"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>
<TabItem value="dashboard">

1. 从侧导航栏中选择网关组的 **已发布服务**，然后点击 **新增服务**。
2. 选择 **手动新增**。
3. 在表单中执行以下操作：
    * **名称** 填写 `MySQL`。
    * **服务类型** 选择 `Stream(四层代理)`。
    * **上游 Scheme** 选择`TCP`。
    * **如何找到上游** 选择`使用节点`。
    * 点击**新增节点**。
    * 在表单中执行以下操作：
        * **主机** 填写 `127.0.0.1`。
        * **端口** 填写 `3306`。
        * **权重** 使用默认值 `100`。
        * 点击 **新增**。这将新建一个 “无版本” 状态的新服务。
5. 在服务内，点击 **新增四层路由**。
6. 在表单中执行以下操作：
    * **名称** 填写 `stream-route-mysql`。
    * **服务器地址** 填写 `127.0.0.1`。
    * 在**服务器端口** 填写 `2000`。 
    * 点击 **新增**。

</TabItem>

<TabItem value="adc">

要使用 AD C创建四层路由，请使用以下配置：

```yaml title="adc.yaml"
services:
  - name: MySQL
    upstream:
      name: default
      scheme: tcp
      nodes:
        - host: 127.0.0.1
          port: 3306
          weight: 100
    stream_routes:
      - name: stream-route-mysql
        server_addr: 127.0.0.1
        server_port: 2000
```

将配置同步到 API7 企业版：

```shell
adc sync -f adc.yaml
```

</TabItem>


<TabItem value="ingress">

创建一个 Kubernetes 清单文件，使用 ApisixRoute 自定义资源来配置一个四层路由：

```yaml title="stream-route.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: stream-route-mysql
  namespace: api7
spec:
  stream:
    - name: stream-route-mysql
      protocol: TCP
      match:
        ingressPort: 2000
      backend:
        serviceName: mysql
        servicePort: 3306
```

将配置应用到你的集群：

```shell
kubectl apply -f stream-route.yaml
```

你应该能看到如下类似的响应：

```text
apisixroute.apisix.apache.org/stream-route-mysql created
```

</TabItem>

</Tabs>

## 验证四层路由

<Tabs
groupId="api"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'k8s'},
]}>

<TabItem value="docker">

如果你在 Docker 中安装了网关实例并使用控制台或 ADC 进行配置，在继续验证步骤之前，请确保将服务器端口 2000 暴露给宿主机(`-p2000:2000`)。

</TabItem>

<TabItem value="k8s">

如果你已经在 Kubernetes 上安装了网关实例，并使用 Ingress Controller 进行配置，那么要添加服务端口，你需要编辑对应的 Service。

```shell
kubectl edit svc/api7-ee-3-gateway-gateway
```

为 MySQL 添加服务端口：

```yaml
spec:
  ports:
    ...
    # highlight-start
    - name: apisix-gateway-mysql
      port: 2000
      protocol: TCP
      targetPort: 2000
    # highlight-end
    ...
```

为服务转发端口 `2000` ：

```shell
kubectl port-forward svc/api7-ee-3-gateway-gateway 2000:2000 &
```

</TabItem>

</Tabs>

使用 MySQL 客户端通过 API7 Gateway 与 MySQL 服务器建立连接。以 root 身份连接，并使用之前配置的密码。

```shell
mysql --host=127.0.0.1 --port=2000 -u root -p
```

你应该会看到如下的 MySQL 提示符：

```text
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 9
Server version: 8.4.0 MySQL Community Server - GPL
 
Copyright (c) 2000, 2024, Oracle and/or its affiliates.
 
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
 
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
 
mysql>
```

## 相关阅读

- 核心概念
  - [服务](../key-concepts/services.md)
  - [路由](../key-concepts/routes.md)
  - [上游](../key-concepts/upstreams.md)
- 快速入门
  - [发布服务版本](publish-service.md)
- 最佳实践
  - [API 版本控制](../best-practices/api-version-control.md)
