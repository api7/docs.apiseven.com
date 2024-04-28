---
title: DevOps with API7 Enterprise Gateway, Declarative Configurations, and Pipelines
slug: /best-practices/devops-adc
---

## 引言

本文档指导您如何使用声明式配置工具（ADC，APISIX/API7声明式配置 CLI）设置 API7 企业版。为了自动化这个过程，使用 `adc.yaml` 文件作为唯一的真实来源，以利用 GitOps。

### ADC 简介

ADC 将 `adc.yaml` 文件作为唯一的来源，并相应地将配置转换为 API 网关。换句话说，API 网关的状态与 `adc.yaml` 中描述的状态相同。

### 步骤

1. 配置 ADC 并将其连接到网关实例
2. 发布配置、代理请求并为消费者启用密钥认证
3. 修改配置并应用更改

### 注意事项

1. 在本文档中，您将使用 API7 企业版网关 v3.2.10.0，该版本基于 Apache APISIX 3.2，尚未提供配置验证 API。因此，您无法使用 ADC validate 命令。此功能从 Apache APISIX v3.5+ 开始提供。
2. ADC 支持加载您的 OpenAPI 3.0 规范文件并将其转换为 `adc.yaml`。但是，您应相应地更新转换后的文件。例如，您需要添加身份验证策略并绑定服务 ID。API7 已计划改进这些功能，以提供更好的用户体验。
3. 企业可能使用不同的 Git/SVN 版本控制服务和防火墙策略。但只要 ADC 工具能够访问网关的管理 API，它应该可以正常工作。本文档演示了如何在本地计算机上操作 ADC。

## 先决条件

- API7 企业版：3.2.10.0
- ADC：0.7.3

### 部署 API7 企业版

API7 企业版支持 Docker 和 [Kubernetes](../deployment/kubernetes.md)。您可以根据自己的需求选择不同的部署方法。

部署 API7 企业版后，您应该具有以下组件和信息：

- 仪表板组件：`7443/7080 端口`
- API7 网关组件：`http://152.42.234.39:9080`
- 管理 API：`https://152.42.234.39:7443`

![ee-component-diagram](https://static.apiseven.com/uploads/2024/04/11/5ZUDl6rt_ee-sec-0411.png)

### 下载 ADC

- https://run.api7.ai/adc/release/adc_0.7.3_linux_amd64.tar.gz
- https://run.api7.ai/adc/release/adc_0.7.3_linux_arm64.tar.gz
- https://run.api7.ai/adc/release/adc_0.7.3_darwin_arm64.tar.gz

```bash
$ ./adc -h

用法: adc [选项] [命令]

选项:
  -V, --version   输出版本号
  -h, --help      显示帮助信息

命令:
  ping [选项]  验证与后端的连接
  dump [选项]  从后端转储配置
  diff [选项]  显示本地和后端配置之间的差异
  sync [选项]  将本地配置同步到后端
  convert         将其他 API 规范转换为 ADC 配置
  lint [选项]  检查提供的配置文件，仅在本地执行，确保输入符合 ADC 要求
  help [command]  显示命令的帮助信息
```

## 步骤

### 生成 API 令牌

ADC 需要一个 API 令牌来访问管理 API。您可以通过仪表板或管理 API 生成 API 令牌。

- 从仪表板生成 API 令牌：登录 -> 组织 -> 令牌 -> 生成新令牌
- 从[管理 API](https://docs.api7.ai/enterprise/reference/admin-api#tag/Tokens)生成 API 令牌

### 配置 ADC 凭据

1. 在与 ADC 二进制文件相同的目录中创建一个 `.env` 文件。

本文档创建了一个 `.env` 文件来存储 API 令牌和管理 API 端点。您还可以将这些值作为标志传递或存储在 GitHub Action、Jenkins 或 GitLab 中。

```bash
ADC_BACKEND=api7ee
ADC_SERVER=https://152.42.234.39:7443
ADC_TOKEN=a7ee-6baF8488i8wJ5aj7mEo3BT705573eC8GH905qGrdn889zUWcR37df66a34e9954b61918c5dfd13abce3e
```

2. 验证管理 API 是否可访问。

```bash
$ ./adc ping

成功连接到后端！
```

### 发布配置

1. 创建 `adc.yaml` 文件：

## 服务配置

本文档提供了一组服务配置，用于配置 API7 企业版网关。这些配置定义了不同服务的行为和属性，包括其上游节点、路由规则以及与消费者之间的关联。

```yaml
services:
  - name: SOAP 服务
    description: "该服务用于 SOAP 请求"
    upstream:
      name: default
      scheme: https
      type: roundrobin
      hash_on: vars
      nodes:
        - host: apps.learnwebservices.com
          port: 443
          weight: 1
          priority: 0
      retry_timeout: 0
      pass_host: pass
    routes:
      - uris:
          - /services/hello
        name: SOAP 代理
        methods:
          - POST
      - uris:
          - /SayHello
        name: REST 到 SOAP
        methods:
          - POST
        plugins:
          soap:
            wsdl_url: https://apps.learnwebservices.com/services/hello?wsdl

  - name: httpbin 服务
    description: "这是 httpbin 服务的代理服务"
    labels:
      app: httpbin
      custom_key: custom_value
    routes:
      - name: 生成 UUID
        methods:
          - GET
        uris:
          - /uuid
      - name: 任意
        methods:
          - GET
        uris:
          - /anything
        plugins:
          key-auth:
            _meta:
              disable: false
      - name: 速率限制 IP
        methods:
          - GET
        uris:
          - /ip
        plugins:
          limit-count:
            _meta:
              disable: false
            count: 2
            time_window: 10
            rejected_code: 429
            policy: local
    upstream:
      name: default
      scheme: http
      type: roundrobin
      hash_on: vars
      nodes:
        - host: httpbin.org
          port: 80
          weight: 1
          priority: 0
      retry_timeout: 0
      pass_host: pass

  - name: SSE 服务
    labels:
      service: sse
    upstream:
      scheme: https
      nodes:
        - host: www.esegece.com
          port: 2053
          weight: 1
          priority: 0
      type: roundrobin
      pass_host: node
    plugins:
      proxy-buffering:
        disable_proxy_buffering: true
    routes:
      - name: SSE API
        uris:
          - /sse
        methods:
          - GET
```

## 消费者配置

本文档还提供了一组消费者配置，用于定义特定用户的插件和属性。

```yaml
consumers:
  - username: tom
    plugins:
      key-auth:
        key: tomskey
```

## SSL 配置

在此配置中，未提供 SSL 配置。

## 全局规则

在此配置中，未提供全局规则。

通过以上配置，可以有效地配置和管理 API7 企业版网关，以满足各种服务需求。

## 2. 同步 `adc.yaml` 到网关实例

```bash
$ ./adc sync -f adc.yaml

✔ 加载本地配置
✔ 加载远程配置
✔ 比较配置差异
✔ 同步配置
```

## 3. 代理验证

```bash
$ curl 152.42.234.39:9080/uuid -v

* 正在尝试连接到 152.42.234.39:9080...
* 已连接到 152.42.234.39 (152.42.234.39) 的端口 9080
> GET /uuid HTTP/1.1
> 主机: 152.42.234.39:9080
> 用户代理: curl/8.4.0
> 接受: */*
> 




## 4. 插件验证：密钥认证

```bash
$ curl 152.42.234.39:9080/anything

{"message":"请求中未找到 API 密钥"}

$ curl 152.42.234.39:9080/anything -H "apikey: tomskey"

{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Apikey": "tomskey", 
    "Host": "152.42.234.39", 
    "User-Agent": "curl/8.4.0", 
    "X-Amzn-Trace-Id": "Root=1-661f9d57-42c4a66b07b361713713da44", 
    "X-Forwarded-Host": "152.42.234.39"
  }, 
  "json": null, 
  "method": "GET", 
  "origin": "182.255.32.50, 152.42.234.39", 
  "url": "http://152.42.234.39/anything"
}
```

### 修改配置并应用更改

1. 将`adc.yaml`更新为以下配置（为httpbin服务添加了一个新路由`/headers`）：

```yaml
services:
  - name: SOAP Service
    description: ""
    upstream:
      name: default
      scheme: https
      type: roundrobin
      hash_on: vars
      nodes:
        - host: apps.learnwebservices.com
          port: 443
          weight: 1
          priority: 0
      retry_timeout: 0
      pass_host: pass
    routes:
      - uris:
          - /services/hello
        name: SOAP proxy
        methods:
          - POST
      - uris:
          - /SayHello
        name: REST to SOAP
        methods:
          - POST
        plugins:
          soap:
            wsdl_url: https://apps.learnwebservices.com/services/hello?wsdl
  - name: httpbin Service
    description: ""
    labels:
      app: httpbin
      custom_key: custom_value
    routes:
      - name: 获取请求头
        methods:
          - GET
        uris:
          - /headers
      - name: Generate UUID
        methods:
          - GET
        uris:
          - /uuid
      - name: Anything
        methods:
          - GET
        uris:
          - /anything
        plugins:
          key-auth:
            _meta:
              disable: false
      - name: Rate Limited IP
        methods:
          - GET
        uris:
          - /ip
        plugins:
          limit-count:
            _meta:
              disable: false
            count: 2
            time_window: 10
            rejected_code: 429
            policy: local
    upstream:
      name: default
      scheme: http
      type: roundrobin
      hash_on: vars
      nodes:
        - host: httpbin.org
          port: 80
          weight: 1
          priority: 0
      retry_timeout: 0
      pass_host: pass
  - name: SSE Service
    labels:
      service: sse
    upstream:
      scheme: https
      nodes:
        - host: www.esegece.com
          port: 2053
          weight: 1
          priority: 0
      type: roundrobin
      pass_host: node
    plugins:
      proxy-buffering:
        disable_proxy_buffering: true
    routes:
      - name: SSE API
        uris:
          - /sse
        methods:
          - GET
consumers:
  - username: tom
    plugins:
      key-auth:
        key: tomskey
ssls: []
global_rules: {}
```

2. 确定本地配置和远程配置之间的差异。

:::info
ADC 正在积极开发中，差异算法将进行改进和优化。
:::

```bash
$ ./adc diff -f ./adc.yaml

✔ 加载本地配置
✔ 加载远程配置
✔ 比较配置
  › 更新 consumer: "tom"
    更新路由: "REST to SOAP"
    更新路由: "SOAP proxy"
    更新路由: "Rate Limited IP"
    更新路由: "Anything"
    更新路由: "Generate UUID"
    创建路由: "获取请求头"
    更新服务: "SSE Service"
    更新路由: "SSE API"
    总结: 将创建1个，更新8个，删除0个
✔ 将详细差异结果写入文件
```

这个命令还生成了一个`diff.yaml`文件，其中详细列出了差异。

```yaml
- 资源类型: 消费者
  类型: 更新
  资源ID: tom
  资源名称: tom
  旧值:
    用户名: tom
    描述: ""
    插件:
      key-auth:
        key: tomskey
  新值:
    用户名: tom
    插件:
      key-auth:
        key: tomskey
  差异:
    添加: {}
    删除: {}
    更新: {}
- 资源类型: 路由
  类型: 更新
  资源ID: bef0a3351a392e74c960f9a58c1d025d803f2aef
  资源名称: REST to SOAP
  旧值:
    uris:
      - /SayHello
    名称: REST to SOAP
    方法:
      - POST
    启用_websocket: false
    插件:
      soap:
        wsdl_url: https://apps.learnwebservices.com/services/hello?wsdl
  新值:
    uris:
      - /SayHello
    名称: REST to SOAP
    方法:
      - POST
    插件:
      soap:
        wsdl_url: https://apps.learnwebservices.com/services/hello?wsdl
  差异:
    添加: {}
    删除: {}
    更新: {}
  父ID: 602dfcf4c39218f87d40c5d1df8b531b49ca88e8
- 资源类型: 路由
  类型: 更新
  资源ID: da37e65d428446d156279156ac3248c00d0a1533
  资源名称: SOAP proxy
  旧值:
    uris:
      - /services/hello
    名称: SOAP proxy
    方法:
      - POST
    启用_websocket: false
  新值:
    uris:
      - /services/hello
    名称: SOAP proxy
    方法:
      - POST
  差异:
    添加: {}
    删除: {}
    更新: {}
  父ID: 602dfcf4c39218f87d40c5d1df8b531b49ca88e8
- 资源类型: 路由
  类型: 更新
  资源ID: b586591b59c13461ed8932228cb23e53040c09d4
  资源名称: Rate Limited IP
  旧值:
    uris:
      - /ip
    名称: Rate Limited IP
    方法:
      - GET
    启用_websocket: false
    插件:
      limit-count:
        _meta:
          disable: false
        count: 2
        policy: local
        rejected_code: 429
        time_window: 10
  新值:
    名称: Rate Limited IP
    方法:
      - GET
    uris:
      - /ip
    插件:
      limit-count:
        _meta:
          disable: false
        count: 2
        time_window: 10
        rejected_code: 429
        policy: local
  差异:
    添加: {}
    删除: {}
    更新: {}
  父ID: 5ce4033cfe1015450e0b81186f7d54b9327cc302
- 资源类型: 路由
  类型: 更新
  资源ID: 5f2de5df1a292b4c8a73f0ec23271233d75707c6
  资源名称: Anything
  旧值:
    uris:
      - /anything
    名称: Anything
    方法:
      - GET
    启用_websocket: false
    插件:
      key-auth:
        _meta:
          disable: false
  新值:
    名称: Anything
    方法:
      - GET
    uris:
      - /anything
    插件:
      key-auth:
        _meta:
          disable: false
  差异:
    添加: {}
    删除: {}
    更新: {}
  父ID: 5ce4033cfe1015450e0b81186f7d54b9327cc302
- 资源类型: 路由
  类型: 更新
  资源ID: ed048a2f75fe33eab67319810fbb94bb778d7d97
  资源名称: Generate UUID
  旧值:
    uris:
      - /uuid
    名称: Generate UUID
    方法:
      - GET
    启用_websocket: false
  新值:
    名称: Generate UUID
    方法:
      - GET
    uris:
      - /uuid
  差异:
    添加: {}
    删除: {}
    更新: {}
  父ID: 5ce4033cfe1015450e0b81186f7d54b9327cc302
- 资源类型: 路由
  资源ID: 6b124aff482499cbf7bdad5a56b13205b24ba58e
  资源名称: 获取请求头
  类型: 创建
  新值:
    名称: 获取请求头
    方法:
      - GET
    uris:
      - /headers
  父ID: 5ce4033cfe1015450e0b81186f7d54b9327cc302
- 资源类型: 服务
  类型: 更新
  资源ID: 54154d3cdf6379ab8686890d27fabb6bf8fa3ace
  资源名称: SSE Service
  旧值:
    名称: SSE Service
    描述: ""
    标签:
      服务: sse
    上游:
      名称: default
      方案: https
      类型: roundrobin
      hash_on: vars
      节点:
        - 主机: www.esegece.com
          端口: 2053
          权重: 1
          优先级: 0
      retry_timeout: 0
      pass_host: node
    插件:
      proxy-buffering:
        disable_proxy_buffering: true
  新值:
    名称: SSE Service
    标签:
      服务: sse
    上游:
      方案: https


      节点:
        - 主机: www.esegece.com
          端口: 2053
          权重: 1
          优先级: 0
      类型: roundrobin
      pass_host: node
    插件:
      proxy-buffering:
        disable_proxy_buffering: true
  差异:
    添加: {}
    删除:
      上游: {}
    更新: {}
  子事件:
    - &a1
      资源类型: 路由
      类型: 更新
      资源ID: 6b808fa543c7c3391321b813d0dc2d658ab02c10
      资源名称: SSE API
      旧值:
        uris:
          - /sse
        名称: SSE API
        方法:
          - GET
        启用_websocket: false
      新值:
        名称: SSE API
        uris:
          - /sse
        方法:
          - GET
      差异:
        添加: {}
        删除: {}
        更新: {}
      父ID: 54154d3cdf6379ab8686890d27fabb6bf8fa3ace
- *a1
```

3. 应用更改

```bash
$ ./adc sync -f ./adc.yaml

✔ 加载本地配置
✔ 加载远程配置
✔ 比较配置
✔ 同步配置
```

4. 验证

注意：因为您为httpbin服务添加了一个新路由`/headers`，您可以访问新路由，并且应该返回请求头信息。

```bash
$ curl 152.42.234.39:9080/headers

{
  "headers": {
    "Accept": "*/*", 
    "Host": "152.42.234.39", 
    "User-Agent": "curl/8.4.0", 
    "X-Amzn-Trace-Id": "Root=1-661f9edd-188a0adf5d3bf0a509f5b034", 
    "X-Forwarded-Host": "152.42.234.39"
  }
}
```

## 结论

本文演示了如何使用ADC工具发布配置、代理请求，并与消费者启用密钥验证。您还可以修改配置并将更改应用到网关实例。ADC工具是一个强大的工具，可以帮助您有效地管理API网关配置。

将ADC与您的CI/CD管道集成时，您可以自动化发布配置和验证过程。这可以帮助您确保您的配置正确，并且您的API是安全的。
