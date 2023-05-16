---
title: 导入 API
slug: /api-full-lifecycle/import-apis
tags:
- API7 Enterprise
---

## 背景知识

在 API 的生命周期中，“导入”是一个关键的步骤。导入 API 的目的是为了在 API7 Enterprise 中发布 API，以供开发人员和最终用户使用。

## 前置要求

1. 参考文档 [设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis) 完成 API 的设计。

## API 导出

在[设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis) 中，我们设计了三个 API 并在 Postman 上创建一个名为 shop 的 Collection，然后在该 Collection 下对应创建了这三个 API。现在我们需要将这三个 API 从 Postman 导出，以便导入到 API7 Enterprise。

### 从 Postman 导出 API

1. 打开 Postman，选择我们在[设计 API](https://docs.apiseven.com/enterprise/api-full-lifecycle/design-apis) 中创建的 Collection，即 `shop`。
2. 点击 Collection 旁边的省略号，在弹出的菜单中选择 `Export` 选项。
![Click Export](https://static.apiseven.com/uploads/2023/05/04/soQWbadx_export-button.png)
3. 在出现的窗口中，选择 `Collection v2.1` 作为输出格式，其他选项保持默认。
![Select Collection v2.1](https://static.apiseven.com/uploads/2023/05/04/8HCsyYvi_export-json.png)
4. 点击 `Export` 按钮，Postman 会自动下载 `shop.postman_collection.json` 文件，包含我们定义的三个 API。

### 将 Postman 的 API 导出文件转换为 OpenAPI 格式

1. 使用 `npm` 或者 `yarn` 安装 `postman-to-openapi` 工具。

```shell
npm i postman-to-openapi -g
```

或

```shell
yarn global add postman-to-openapi
```

2. 在下载的 `shop.postman_collection.json` 文件目录下运行以下命令将 Postman 的导出文件转换为 OpenAPI 格式。

```shell
p2o ./shop.postman_collection.json -f ./shop.yaml
```

此时生成的 `shop.yaml` 文件即为在 EE 上导入 API 使用的文件。

## 在 EE 中导入 API

EE 中的 API 存在于具体的集群和工作分区中，因此在导入 API 之前，我们需要先创建集群和工作分区。

### 在 EE 中新建集群

登录控制台，在  **集群列表**  中选择目标集群点击访问，或者[新建集群](https://docs.apiseven.com/enterprise/user-manual/cluster/list#%E6%96%B0%E5%BB%BA%E9%9B%86%E7%BE%A4)后点击访问。

### 在 EE 中新建工作分区

在集群中的  **工作分区**  部分选择目标工作分区点击访问，或者[新建工作分区](https://docs.apiseven.com/enterprise/user-manual/cluster/workspace#%E6%96%B0%E5%BB%BA%E5%B7%A5%E4%BD%9C%E5%88%86%E5%8C%BA)后点击访问。

### 导入 OpenAPI 文件

1. 在工作分区中选择 `API 管理` 中的 `API 列表`。
2. 点击 `高级特性` 中的 `导入 OpenAPI`。
3. 在弹出的窗口中 `导入任务名称` 填写 `shop`，点击 `请选择上传文件` 并选择 `shop.yaml` 文件。
4. 点击`提交`后可以看到导入成功的提示。
![Import OpenAPI Success](https://static.apiseven.com/uploads/2023/05/04/RGYpIkQR_import-success.png)

导入成功后可以在 API 列表中看到导入的三个 API。

![API 列表](https://static.apiseven.com/uploads/2023/05/04/XvUSWq1Q_api-list.png)

EE 会默认为 API 添加一个默认的上游配置，地址为 `0.0.0.0:80`，可以根据业务实际需要在 `上游管理` 中修改配置。

导入的 API 默认是 `未上线` 状态的，需要在 `API 列表` 中选择目标 API，点击  **更多**  中的 `API 上线` 按钮，将 API 上线。
