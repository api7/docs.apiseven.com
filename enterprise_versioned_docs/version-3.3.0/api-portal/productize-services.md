---
title: 服务产品化
slug: /api-portal/productize-services
---

创建和管理 [API 产品](../key-concepts/api-products.md) 以将你发布的服务产品化。每个 API 产品至少包含一个带有 OpenAPI 规范的已发布服务。

通过已发布的 API7 网关服务创建 API 产品可以简化开发工作流程。对已发布服务的更改会自动反映在关联的 API 产品中，无需手动更新，从而节省大量时间和精力。开发者可以专注于 API 使用，而无需关心底层服务配置或插件详细信息。

本教程演示如何为内部开发者创建 API 产品，并概述订阅流程。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee)。
2. 激活启用了 API7 门户的许可证。
3. [拥有一个正在运行的已发布服务](../getting-started/launch-your-first-api)。

## 添加 OpenAPI 规范

1. 从侧边导航栏中选择网关组的 **已发布服务**，然后点击要修改的服务，例如无版本的 `httpbin` 服务。
2. 在已发布服务下，从侧边导航栏中选择 **OpenAPI 规范**。
3. 点击 **上传 OpenAPI 规范**。
4. 填写表单：
    * 使用以下 OpenAPI 示例：

    ```yaml title="httpbin.yaml"
    openapi: 3.0.0
    info:
    title: HTTPBin
    description: A simple HTTP request and response service.
    version: 1.0.0
    servers:
    - url: https://httpbin.org

    paths:
    /ip:
        get:
        summary: Returns GET request information
        responses:
            '200':
            description: Successful response
            content:
                application/json:
                schema:
                    $ref: '#/components/schemas/Get'

    components:
    schemas:
        Get:
        type: object
        properties:
            args:
            type: object
            headers:
            type: object
            origin:
            type: string
    ```
5. 点击 **保存**。
6. 为避免身份验证冲突，请勿在已发布的服务中启用任何身份验证插件。API 产品配置将处理身份验证。

:::note

请确保 OpenAPI 规范与你发布的服务匹配：

* OpenAPI 规范中的 `Servers` 字段对应于已发布服务中的 `Hosts` 字段。
* OpenAPI 规范中定义的每个 `Path` 必须与路由中的特定 `path` 和 `method` 组合匹配。

:::

## 添加 API 产品

1. 使用导航栏左上角的按钮切换到 API7 门户。
2. 点击 **新增 API 产品**，然后选择 **从 API7 网关创建**。
3. 填写表单：
    * **名称** 输入 `httpbin`。
    * **认证方式** 选择 `Key Authentication`。
    * 关闭 **订阅自动审批** 开关。
    * **API Hub 列表可见性** 选择 `仅对登录的开发者可见`。
    * 打开 **未订阅的开发者可以查看 API 详情** 开关。
    * 点击 **添加关联的网关服务**。
    * 在对话框中，执行以下操作：
        * **网关组** 选择你的目标网关组。例如 `default`。
        * **已发布服务** 选择你的目标服务。例如 `httpbin`。
        * 点击 **新增**。
4. 点击 **新增**。
5. 默认情况下，新创建的 API 产品处于 `未发布` 状态，并且在开发者门户上不可见。点击顶部的 **操作** 按钮，然后选择 **发布**。
6. 点击 **确认**。

## 开发者请求订阅

1. 使用开发者帐户登录开发者门户。
2. 从顶部导航栏中选择 **API Hub**。
3. 选择 `httpbin`。
4. 浏览 API 详细信息以确保它们满足特定需求。
5. 点击 **立即订阅**。
6. 等待批准。

## 提供者审批同意

1. 从顶部导航栏中选择 **组织**，然后选择 **审批**。
2. 点击特定请求的 **接受**。

## 开发者验证 API

1. 使用开发者帐户登录开发者门户。
2. 从顶部导航栏中选择 **API Hub**。
3. 选择 `httpbin`。
4. 点击 **Test Request**。
5. 预先选择了 **Auth Type**，并自动填写 API 密钥，从开发者的凭据中复制。
6. 点击 **Send**。
7. 接收 `200` 响应。

## 相关阅读

* 核心概念 
  * [API 产品](../key-concepts/api-products)
  * [开发者](../key-concepts/developers)
  