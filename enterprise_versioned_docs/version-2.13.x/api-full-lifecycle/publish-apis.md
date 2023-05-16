---
title: 发布 API 到网关
slug: /api-full-lifecycle/publish-apis
tags:
- API7 Enterprise
---

API 开发完毕后，需要发布到 API7 网关中，以获得 API7 带来的各种强大能力。本文将指导您如何在 API7 控制台中发布一个 API，以及如何验证发布结果。

在 API 发布上线之前，应当进行充分的测试和配置调试，以保证线上业务的稳定。

:::info

本文将使用根据[设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis)，在 Postman 上创建的 Mock API进行演示。

:::

## 前置要求

参考文档成功部署 API7 Enterprise，并创建好集群与工作分区。

## 手动录入 API

### 新建上游

将 Postman 上的 Mock Server 设置为上游。

参考文档[新建上游](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E6%96%B0%E5%BB%BA%E4%B8%8A%E6%B8%B8)。

在【**步骤9**: 填写表单】中，使用如下配置：

**名称**：shop_server
**目标节点**: Mock Server 的地址
**端口**： 443
**协议**： HTTPs
**权重**： 1

![Create Upstream shopserver](https://static.apiseven.com/uploads/2023/05/16/DxrmrWmF_createupstream-shop_server.png)

### 新建 API 并发布

根据设计，我们总共需要创建三个 API。以`CreateProduct`为例。
参考[新建 API](https://docs.apiseven.com/enterprise/user-manual/cluster/api#%E6%96%B0%E5%BB%BA-api)。

在【**步骤10**: 填写表单】中，使用如下配置：

**名称**： shop_server_CreateProduct
**上游服务**： 选择上一步中创建的 `shop_server`
**路径**:  /products
**HTTP 方法**：GET
**API 上线**：开启

![Create API - CreateProduct](https://static.apiseven.com/uploads/2023/05/16/ItYstSl6_createapi-createproduct.png)

## 批量导入 API 

如果已经有 OpenAPI 文件，可以通过导入的方式快速创建多个 API，无需手动录入。

### 从 Postman 导出 API

打开 Postman，选择我们在[设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis) 中创建的 Collection，即 `Shop`。

点击 Collection 旁边的省略号，在弹出的菜单中点击 **Export** 选项：
![Click Export](https://static.apiseven.com/uploads/2023/05/04/soQWbadx_export-button.png)

在弹窗中，选择 `Collection v2.1` 作为输出格式，其他选项保持默认：
![Select Collection v2.1](https://static.apiseven.com/uploads/2023/05/04/8HCsyYvi_export-json.png)

点击 **Export** 按钮，Postman 会自动下载 `Shop.postman_collection.json` 文件，包含我们定义的三个 API。

### 将 Postman 的 API 导出文件转换为 OpenAPI 格式

使用 `npm` 或者 `yarn` 安装 `postman-to-openapi` 工具：

```shell

npm i postman-to-openapi -g

```

或

```shell

yarn global add postman-to-openapi

```

在下载的 `shop.postman_collection.json` 文件目录下运行以下命令将 Postman 的导出文件转换为 OpenAPI 格式：

```shell

p2o ./Shop.postman_collection.json -f ./shop.yaml

```

此时生成的 `shop.yaml` 文件即为导入 OpenAPI 使用的文件。

### 导入 OpenAPI

参考[导入 OpenAPI](https://docs.apiseven.com/enterprise/user-manual/cluster/api#%E6%96%B0%E5%BB%BA-api)。

在【**步骤10**: 填写表单】中，使用如下配置：

**导入任务名称**： shop_server
**上传文件**：shop.yaml

![Import OpenAPI]](https://static.apiseven.com/uploads/2023/05/16/ItYstSl6_createapi-createproduct.png)

### 配置上游

参考文档[配置上游](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E9%85%8D%E7%BD%AE%E4%B8%8A%E6%B8%B8)， 修改为正确的目标节点。
在【**步骤8：** 点击对应上游的`配置`按钮】中，选择刚才导入 OpenAPI 时自动生成的`shop_server` 上游。

在【**步骤9：** 编辑上游的属性】中，编辑以下属性：

**目标节点**: Mock Server 的地址
**端口**： 443
**协议**： HTTPs
**权重**： 1

![Configure Upstream](https://static.apiseven.com/uploads/2023/05/16/P3IRzYFZ_configureupstream.png)

### API 上线

参考文档[API 上线](https://docs.apiseven.com/enterprise/user-manual/cluster/upstream#%E9%85%8D%E7%BD%AE%E4%B8%8A%E6%B8%B8)， 将刚才导入的 API 变为发布状态。

## 验证

通过 API7 网关地址访问对应 API：

```shell

curl '${MOCK_SERVER}/products' \
-H "Host: www.test.com" \
-X POST
--header 'Authorization: HMAC <ACCESSKEY>:<HMAC>' \
--header 'Content-Type: application/json' \
--data '{
  "name": "iPhone 13 Pro",
  "price": 999.99
}'

```

收到符合预期的返回：

```shell


```
