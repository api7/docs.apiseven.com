---
title: 创建一个简单的 API
slug: /getting-started/launch-your-first-api
---

本教程介绍如何创建一个简单的 API 并对其进行验证。你将完成以下步骤：

1. 创建指向 `httpbin.org` 的[服务](../key-concepts/services)，并为其创建[路由](../key-concepts/routes)和[上游](../key-concepts/upstreams)。
2. 通过发送一个请求，验证创建的 API 是否正常工作。

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 确保网关组中至少有一个[网关实例](../key-concepts/gateway-instances)。

## 启动一个示例上游服务

如果你想在 Kubernetes 上运行 API7 企业版，你需要将在本节中将一个 `httpbin` 应用部署到你的 Kunbernetes 集群中作为示例上游服务。否则，请跳到下一节，直接使用托管的 `httpbin` 应用作为上游。

启动一个 [httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) 应用：

```shell
kubectl run httpbin --image kennethreitz/httpbin --port 80
```

你应该能收到一个响应： `pod/httpbin created`。

将`httpbin` 应用的 `80` 通过服务暴露：

```shell
kubectl expose pod httpbin --port 80
```

你应该能收到一个响应： `service/httpbin exposed`。

## 创建服务与路由

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

<h3>创建服务</h3>

1. 在左侧菜单选择目标网关组下的 **已发布服务** 菜单，然后点击 **新增服务**。 
2. 选择 **手动新增**。
3. 在新增服务表单页中, 执行以下操作：
    1. **名称** 填写 `httpbin`。
    2. **服务类型** 选择 `HTTP （七层代理）`。 
    3. **上游 Scheme** 选择 `HTTP`。
    4. **如何找到上游** 选择 `使用节点`。
    5. 点击 **新增节点**。
    6. 在新增节点对话框中，执行以下操作：
        1. **主机** 填写 `httpbin.org`。
        2. **端口** 填写 `80`。
        3. **权重** 填写 `100`。
4. 点击 **新增**。 此时创建出的新服务处于“无版本” 状态。

<h3>创建一条路由</h3>

1. 进入刚才创建好的服务，然后点击 **新增路由**。
2. 在新增路由对话框中，执行以下操作：
    1. **名称** 填写 `getting-started-ip`。
    2. **路径** 填写 `/ip`。
    3. **HTTP 方法** 选择 `GET`。
3. 点击 **新增**。

</TabItem>

<TabItem value="adc">

Create the following configuration file:

```yaml title="adc.yaml"
services:
  - name: httpbin
    upstream:
      name: default
      scheme: http
      nodes:
        - host: httpbin.org
          port: 80
          weight: 100
    routes:
      - uris:
          - /ip
        name: getting-started-ip
        methods:
          - GET
```

Synchronize the configuration to API7 Enterprise:

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

Create a configuration file containing the API7 Ingress Controller custom resource of a route:

```yaml
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: httpbin-route
  namespace: api7
spec:
  http:
    - name: httpbin-route
      match:
        paths:
          - /ip
      backends:
        - serviceName: httpbin
          servicePort: 80
```

Apply the configuration to your cluster:

```shell
kubectl apply -f httpbin-route.yaml
```

You should see a response of the following:

```text
apisixroute.apisix.apache.org/httpbin-route created
```

</TabItem>

</Tabs>


1. 从左侧导航栏中选择**服务**，然后单击**新增服务**。
2. 选择**手动新增**，弹出**新增服务**对话框，如下所示：
3. 在**新增服务**对话框中，执行以下操作：
    - 在**名称**字段中，输入 `httpbin`。
    - 在**上游 Scheme** 字段中，选择 `HTTP`。
4. 单击**新增**。

## 步骤 2：创建路由

1. 单击上一步中创建的服务，然后单击**添加路由**。弹出**新增路由**对话框，如下所示：
2. 在**新增路由**对话框中，执行以下操作：
    - 在**路由名称**字段中，输入 `getting-started-ip`。
    - 在**路径**字段中，输入 `/ip`。
    - 在 **HTTP 方法**字段中，选择 `GET`。
3. 单击**新增**。

## 步骤 3：发布服务

1. 从左侧导航栏中选择**服务**，然后选择 `httpbin` 服务并单击**立即发布**。
2. 选择 `缺省网关组`，然后单击**下一步**。
3. 在弹出的对话框中，执行以下操作：
    - 在**新版本**字段中，输入 `1.0.0`。
    - 在**如何找到上游**字段中，选择`使用节点`。
4. 单击**新增节点**，弹出**新增节点**对话框，如下所示：
5. 在**新增节点** 对话框中，执行以下操作：
    - 在**主机** 字段中，输入 `httpbin.org`。
    - 在**端口** 字段中，输入 `80`。
    - 在**权重** 字段中，使用默认值 `100`。
6. 单击**新增**。
7. 确认服务信息，然后单击**发布**。

## 步骤 4：验证 API

发送 API 请求：

```bash
curl "http://127.0.0.1:9080/ip" 
```

你应该会看到以下输出：

```bash
{
  "origin": "127.0.0.1"
}
```
