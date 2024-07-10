---
title: 创建一个简单的 API
slug: /getting-started/launch-your-first-api
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

你应该会看到类似以下内容的响应：

```shell
pod/httpbin created`
```

将 `httpbin` 应用的 `80` 端口通过服务暴露：

```shell
kubectl expose pod httpbin --port 80
```

你应该会看到类似以下内容的响应：

```shell
 `service/httpbin exposed`
```

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
    * **名称** 填写 `httpbin`。
    * **服务类型** 选择 `HTTP （七层代理）`。 
    * **上游 Scheme** 选择 `HTTP`。
    * **如何找到上游** 选择 `使用节点`。
    * 点击 **新增节点**。
    * 在新增节点对话框中，执行以下操作：
        * **主机** 填写 `httpbin.org`。
        * **端口** 填写 `80`。
        * **权重** 填写 `100`。
    * 点击 **新增**。 此时创建出的新服务处于“无版本” 状态。

<h3>创建一条路由</h3>

1. 进入刚才创建好的服务，然后点击 **新增路由**。
2. 在新增路由对话框中，执行以下操作：
    * **名称** 填写 `getting-started-ip`。
    * **路径** 填写 `/ip`。
    * **HTTP 方法** 选择 `GET`。
    * 点击 **新增**。

</TabItem>

<TabItem value="adc">

创建如下的配置文件：

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

将配置同步到 API7 企业版：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

创建一个包含了 API7 Ingress Controller 路由自定义资源的配置文件：

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

将配置应用到你的集群：

```shell
kubectl apply -f httpbin-route.yaml
```

你应该会看到类似以下内容的响应：

```text
apisixroute.apisix.apache.org/httpbin-route created
```

</TabItem>

</Tabs>

## 验证 API

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '控制台', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'},
]}>

<TabItem value="dashboard">

向刚才创建好的路由发送 API 请求：

```bash
curl "http://127.0.0.1:9080/ip"
```

你应该会看到类似以下内容的响应：

```text
{
  "origin": "127.0.0.1"
}
```

</TabItem>

<TabItem value="adc">

向刚才创建好的路由发送 API 请求：

```bash
curl "http://127.0.0.1:9080/ip"
```

你应该会看到类似以下内容的响应：

```text
{
  "origin": "127.0.0.1"
}
```

</TabItem>

<TabItem value="ingress">

1. 打开控制台，在默认网关组的 **已发布服务** 菜单中，你应该能看到一个叫做 `api7_httpbin_80` 的服务。
2. 将这个服务的端口通过端口转发的方式在你的本地机器上暴露：

```shell
kubectl port-forward svc/api7-ingress-api7-ingress-controller-apisix-gateway 9080:80 &
```

上述命令会在后台运行，将 `api7-ingress-api7-ingress-controller-apisix-gateway`  服务的 `80` 端口 映射到本地机器的 `9080` 端口。

3. 向刚才创建好的路由发送 API 请求：

```shell
curl "http://127.0.0.1:9080/ip"
```

你应该会看到类似以下内容的响应：

```text
{
  "origin": "127.0.0.1"
}
```

</TabItem>

</Tabs>

恭喜你，现在你的第一个 API 已经成功运行。

## 相关阅读

- 快速入门
  - [发布服务版本](publish-service.md)
- 最佳实践
  - [API 版本控制](../best-practices/api-version-control.md)
