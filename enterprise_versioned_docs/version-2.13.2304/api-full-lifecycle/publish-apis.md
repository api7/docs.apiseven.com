---
title: 发布 API 到 API7 网关
slug: /api-full-lifecycle/publish-apis
tags:
- API7 Enterprise
---

API 开发完毕后，需要发布到 API7 网关中，以获得 API7 带来的各种强大能力。本文将指导您如何在 API7 控制台中发布一个 API，以及如何验证发布结果。

在 API 发布上线之前，应当进行充分的测试和配置调试，以保证线上业务的稳定。

:::info

本文将使用根据 [设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis)，在 Postman 上创建的 Mock API进行演示。

:::

## 前置要求

参考部署指南完成安装 API7 Enterprise，并创建好集群与工作分区。

## 手动录入 API

### 新建上游

将 Postman 上的 Mock Server 设置为上游。

参考文档 [新建上游](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E6%96%B0%E5%BB%BA%E4%B8%8A%E6%B8%B8)。

在【**步骤9**: 填写表单】中，使用如下配置：

**名称**：shop_server

**目标节点**: Mock Server 的地址

**Host 请求头**：使用目标节点列表中的主机名或 IP.

**端口**： 443

**协议**： HTTPs

**权重**： 1

![Create Upstream shopserver](https://static.apiseven.com/uploads/2023/05/17/JLzjpLXG_createupstream.png)

### 新建 API 并发布

根据设计，我们总共需要创建三个 API。以`CreateProduct`为例。
参考文档 [新建 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#%E6%96%B0%E5%BB%BA-api)。

在【**步骤10**: 填写表单】中，使用如下配置：

**名称**： shop_server_CreateProduct

**上游服务**： 选择上一步中创建的 `shop_server`

**路径**:  /products

**HTTP 方法**：GET

**API 上线**：开启

![Create API - CreateProduct](https://static.apiseven.com/uploads/2023/05/16/ItYstSl6_createapi-createproduct.png)

## 批量导入 API 

可以通过导入的方式快速创建多个 API，无需手动录入。

### 导入 OpenAPI

参考文档 [导入 OpenAPI](https://docs.apiseven.com/enterprise/user-manual/cluster/api#%E6%96%B0%E5%BB%BA-api)。

在【**步骤10**: 填写表单】中，使用如下配置：

**导入任务名称**： shop_server

**上传文件**：shop.yaml

![Import API](https://static.apiseven.com/uploads/2023/05/21/8TSqA4BE_importapi.png)


### 配置上游

参考文档 [配置上游](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E9%85%8D%E7%BD%AE%E4%B8%8A%E6%B8%B8)， 修改为正确的目标节点。
在【8. 点击对应上游的 **配置** 按钮】中，选择刚才导入 OpenAPI 时自动生成的`shop_server` 上游。

在【9. 编辑上游的属性】中，编辑以下属性：

**目标节点**: Mock Server 的地址

**端口**： 443

**协议**： HTTPs

**权重**： 1

![Configure Upstream](https://static.apiseven.com/uploads/2023/05/16/P3IRzYFZ_configureupstream.png)

### API 上线

参考文档 [API 上线](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E9%85%8D%E7%BD%AE%E4%B8%8A%E6%B8%B8)， 将刚才导入的 API 变为发布状态。

## 验证

通过 API7 网关地址访问对应 API：

```shell

curl '${API7_GATEWAY_ADDRESS}/products' \
-H "Host: www.test.com" \
-X POST
--data '{
  "name": "iPhone 13 Pro",
  "price": 999.99
}'

```

收到符合预期的返回：

```shell

{
  "id": 1
}

```
