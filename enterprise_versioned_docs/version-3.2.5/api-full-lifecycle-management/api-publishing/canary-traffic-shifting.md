---
title: 灰度流量
slug: /api-full-lifecycle-management/api-publishing/canary-traffic-shifting
---

通过使用灰度流量，你可以在新上游测试部分 API 流量，而之前的上游则继续处理其余流量。这一测试阶段可作为在将所有流量转移到新功能之前对其进行确认的安全措施。

:::info

灰度流量不同于灰度发布，因为 API 版本没有发生改变。

:::

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#API提供者)角色的用户账户。
2. [以服务维度发布 API](../api-publishing/publish-apis-by-service.md)。

## 按百分比将流量转移到新的灰度上游

:::info

灰度流量不能应用于单个路由。灰度规则会影响服务中的所有路由。

:::

在本教程中，你将把 10% 的随机流量引导到托管在新服务器上的灰度上游。其余 90% 的流量将继续流向基线上游。

测试成功结束后，灰度上游变成新的基线上游，原有的基线上游将被移除，完成整个升级过程。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore** > **1.0.0**。
2. 从左侧导航栏中选择**上游**。
2. 在**灰度规则**字段中，单击**开始灰度**。
3. 在**设置灰度规则**字段中，执行以下操作：
    - 在**条件**字段中，关闭开关。
    - 在**权重**字段中，输入 `10%`。

    ![设置灰度规则](https://static.apiseven.com/uploads/2023/12/08/2D5zRl07_setup-canary-rules_zh.png)

4. 单击**下一步**。
5. 在**选择或创建灰度上游**字段中，选择**创建一个新的上游**。
    - 将新上游的名称设置为`新上游`。
    - 调整节点的主机，使其指向新的后端。
    - 其余属性将与基线上游保持一致。
    
    ![创建灰度上游](https://static.apiseven.com/uploads/2023/12/15/Tp0GYV7Z_createcanaryupstream_zh.png)

6. 确认信息，然后单击**开始**。该灰度规则将立即生效。
7. 发送 API 请求进行测试，然后循环请求 10 次 API：

    ```bash
    for i in {1..5}; do curl 127.0.0.1:9080/pet/1; done # 将 127.0.0.1 替换为测试网关组的地址。
    ```

    其中 9 次响应结果：

    ```bash
    HTTP/1.1 200 OK

    {
      "name": "Dog",
      "photoUrls": [
        "https://example.com/dog-1.jpg",
        "https://example.com/dog-2.jpg"
      ],
      "id": 1,
      "category": {
        "id": 1,
        "name": "pets"
      },
      "tags": [
        {
          "id": 1,
          "name": "friendly"
        },
        {
          "id": 2,
          "name": "smart"
        }
      ],
      "status": "available"
    }
    ```

    其中 1 次响应结果：

    ```bash
    HTTP/1.1 200 OK

    {
      "name": "TestDog on new upstream",
      "photoUrls": [
        "https://example.com/dog-1.jpg",
        "https://example.com/dog-2.jpg"
      ],
      "id": 1,
      "category": {
        "id": 1,
        "name": "pets"
      },
      "tags": [
        {
          "id": 1,
          "name": "friendly"
        },
        {
          "id": 2,
          "name": "smart"
        }
      ],
      "status": "available"
    }
    ```

8. 在**灰度规则**字段中，单击**编辑**。
    - 在对话框中，将权重调整为 50%。
    - 单击**编辑**。
9. 发送更多 API 请求，测试灰度上游。
10. 在**灰度规则**字段中，单击**结束**。在对话框中，执行以下操作：

    - 在**基准上游**字段中，选择 `灰度上游：新上游`。
    - 在**删除未选择的上游**字段中，打开开关。

    ![完成灰度](https://static.apiseven.com/uploads/2023/12/15/1d49RMzT_finishcanary_zh.png)

11. 单击**完成**。

## 根据请求标头将流量转移到新的灰度上游

在本章节中，你将把关键字为 `version = test` 的 API 请求导向灰度上游，而其余流量将继续流向基线上游。

测试成功结束后，灰度上游变成新的基线上游，原有的基线上游将被移除，完成整个升级过程。

1. 从左侧导航栏中选择**服务**，然后选择 **Swagger Petstore** > **1.0.0 on Test Group**。
2. 在**灰度规则**字段中，单击**开始灰度**。
3. 在**设置灰度规则**字段中，执行以下操作：
    - 在**条件**字段中，打开开关并设置 API 请求的条件：
        - API 请求需要具备 `Header`。
        - API 请求关键字为 `version = test`。
    - 在**权重**字段中，输入 `100%`。
    - 单击**下一步**。
  
    ![设置灰度规则](https://static.apiseven.com/uploads/2023/12/08/O4WBQ1Fu_createcanaryupstream-con_zh.png)

4. 确认信息，然后单击**开始**。该灰度规则将立即生效。
5. 发送 API 请求进行测试：

    使用正确的标头发送 API 请求：

    ```bash
    curl 127.0.0.1:9080/pet/1 -H "version:test" # 将 127.0.0.1 替换为测试网关组的地址。
    ```

    ```bash
    HTTP/1.1 200 OK

    {
      "name": "TestDog on new upstream",
      "photoUrls": [
        "https://example.com/dog-1.jpg",
        "https://example.com/dog-2.jpg"
      ],
      "id": 1,
      "category": {
        "id": 1,
        "name": "pets"
      },
      "tags": [
        {
          "id": 1,
          "name": "friendly"
        },
        {
          "id": 2,
          "name": "smart"
        }
      ],
      "status": "available"
    }
    ```

    使用错误的标头发送 API 请求：

    ```bash
    curl 127.0.0.1:9080/pet/1 -H "version:new" # 将 127.0.0.1 替换为测试网关组的地址。
    ```

    ```bash
    HTTP/1.1 200 OK

    {
      "name": "Dog",
      "photoUrls": [
        "https://example.com/dog-1.jpg",
        "https://example.com/dog-2.jpg"
      ],
      "id": 1,
      "category": {
        "id": 1,
        "name": "pets"
      },
      "tags": [
        {
          "id": 1,
          "name": "friendly"
        },
        {
          "id": 2,
          "name": "smart"
        }
      ],
      "status": "available"
    }
    ```

    未使用标头发送 API 请求：

    ```bash
    curl 127.0.0.1:9080/pet/1 # 将 127.0.0.1 替换为测试网关组的地址。
    ```

    ```bash
    HTTP/1.1 200 OK

    {
      "name": "Dog",
      "photoUrls": [
        "https://example.com/dog-1.jpg",
        "https://example.com/dog-2.jpg"
      ],
      "id": 1,
      "category": {
        "id": 1,
        "name": "pets"
      },
      "tags": [
        {
          "id": 1,
          "name": "friendly"
        },
        {
          "id": 2,
          "name": "smart"
        }
      ],
      "status": "available"
    }
    ```

6. 在**灰度规则**字段中，单击**结束**。在对话框中，执行以下操作：

    - 在**基准上游**字段中，选择 `灰度上游：新上游`。
    - 在**删除未选择的上游**字段中，打开开关。

    ![完成灰度](https://static.apiseven.com/uploads/2023/12/15/1d49RMzT_finishcanary_zh.png)

7. 单击**完成**。