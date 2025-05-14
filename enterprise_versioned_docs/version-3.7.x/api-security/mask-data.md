---
title: 在日志中脱敏敏感数据
slug: /api-security/mask-data
description: 按照本指南使用 API7 企业版在日志中脱敏敏感数据，确保日志文件中不会暴露机密信息。
---

import StorylaneEmbed from '@site/src/MDXComponents/StorylaneEmbed';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

数据脱敏是一种数据保护技术，旨在防止敏感信息在各种环境中暴露，从而在不损害隐私的前提下支持应用程序的安全测试和数据分析。

API7 企业版提供的内置 [`data-mask`](https://docs.api7.ai/hub/data-mask) 插件可以帮助您删除或替换 URL 编码请求体、请求头、URL 查询参数中的敏感信息。

本指南将带您了解如何使用 API7 企业版在 URL 编码的请求体中脱敏敏感信息。示例中使用的 [`file-logger`](https://apisix.apache.org/docs/apisix/plugins/file-logger/) 插件是为了展示信息已成功被脱敏，请根据您的实际用例进行调整。

以下是一个交互式演示，为您介绍如何在日志中脱敏敏感数据。

<StorylaneEmbed src='https://app.storylane.io/demo/xl4f5spwjmu6' />

## 前提条件

- [安装 API7 Enterprise](../getting-started/install-api7-ee.md)
- [在网关组中已有一个正在运行的 API](../getting-started/launch-your-first-api.md)

## 启用 `data-mask` 和 `file-logger` 插件

<Tabs
groupId="api"
defaultValue="dashboard"
values={[
{label: '仪表板', value: 'dashboard'},
{label: 'ADC', value: 'adc'},
{label: 'Ingress Controller', value: 'ingress'}
]}>

<TabItem value="dashboard">

1. 从侧边导航栏中选择您的网关组下的 **已发布服务**，然后点击您要修改的服务，例如一个无版本的 `httpbin` 服务。
2. 在已发布服务下，从侧边栏选择 **路由（Routes）**。
3. 选择您的目标路由，例如 `/anything`。
4. 点击 **+ 添加插件**。
5. 搜索 `data-mask` 插件。
6. 点击 **添加**。
7. 在弹出的对话框中进行如下操作：

    - 在 **JSON 编辑器** 中添加如下配置：

    ```json
    {
    "request": [
    {
        "action": "remove",
        "body_format": "json",
        "name": "$.password",
        "type": "body"
    },
    {
        "action": "replace",
        "body_format": "json",
        "name": "users[*].token",
        "type": "body",
        "value": "*****"
    },
    {
        "action": "regex",
        "body_format": "json",
        "name": "$.users[*].credit.card",
        "regex": "(\\d+)\\-\\d+\\-\\d+\\-(\\d+)",
        "type": "body",
        "value": "$1-****-****-$2"
    }
    ]
    }
    ```

    - 点击 **添加**。

8. 在相同路由下，再次点击 **+ 添加插件**。
9. 搜索 `file-logger` 插件。
10. 点击 **添加**。
11. 在弹出的对话框中进行如下操作：

    - 在 **JSON 编辑器** 中添加如下配置：

    ```json
    {
    "include_req_body": true,
    "path": "/tmp/mask-urlencoded-body.log"
    }
    ```

    - 点击 **添加**。

</TabItem>

<TabItem value="adc">

更新 ADC 配置文件，添加 `data-mask` 和 `file-logger` 插件：

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
          - /anything
        name: getting-started-anything
        methods:
          - GET
        plugins:
          data-mask:
            request:
              - action: remove
                body_format: json
                name: $.password
                type: body
              - action: replace
                body_format: json
                name: users[*].token
                type: body
                value: "*****"
              - action: regex
                body_format: json
                name: $.users[*].credit.card
                regex: (\d+)\-\d+\-\d+\-(\d+)
                type: body
                value: $1-****-****-$2
          file-logger:
            include_req_body: true
            path: /tmp/mask-urlencoded-body.log
```

将配置同步到 API7 Enterprise：

```shell
adc sync -f adc.yaml
```

</TabItem>

<TabItem value="ingress">

更新您选择的路由的 Kubernetes 配置文件，添加 `data-mask` 和 `file-logger` 插件：

```yaml title="httpbin-route.yaml"
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: httpbin-route
  # namespace: api7    # 替换为您的命名空间
spec:
  http:
    - name: httpbin-route
      match:
        paths:
          - /anything
        methods:
          - GET
      backends:
        - serviceName: httpbin
          servicePort: 80
      plugins:
        - name: data-mask
          enable: true 
          config:
            request:
              - action: remove
                body_format: json
                name: $.password
                type: body
              - action: replace
                body_format: json
                name: "users[*].token"
                type: body
                value: "*****"
              - action: regex
                body_format: json
                name: $.users[*].credit.card
                regex: (\\d+)\\-\\d+\\-\\d+\\-(\\d+)
                type: body
                value: $1-****-****-$2
        - name: file-logger
          enable: true 
          config:
            include_req_body: true
            path: /tmp/mask-urlencoded-body.log
```

将配置应用到您的 Kubernetes 集群：

```shell
kubectl apply -f httpbin-route.yaml
```

</TabItem>

</Tabs>

## 验证

1. 为验证配置是否生效，请向路由发送如下请求：

```json
curl -i "http://127.0.0.1:9080/anything" \
  --data-urlencode "password=abc" \
  --data-urlencode "token=xyz" \
  --data-urlencode "card=1234-1234-1234-1234"
```

您应该会收到一个 `HTTP/1.1 200 OK` 的响应。

2. 登录到您的 Docker 容器，查看 `/tmp/mask-urlencoded-body.log` 文件内容，您应该看到类似如下的日志条目：

```json
{
  "request": {
    "uri": "/anything",
    "body": "token=*****&card=1234-****-****-1234",
    "method": "POST",
    "url": "http://127.0.0.1:9080/anything"
  }
}
```

## 补充资源

- 快速入门
  - [启动您的第一个 API](../getting-started/launch-your-first-api.md)
- 插件中心
  - [data-mask](https://docs.api7.ai/hub/data-mask)
