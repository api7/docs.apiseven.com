---
title: 触发告警
slug: /api-full-lifecycle-management/api-runtime/trigger-alerts
---

异常流量模式或 API 使用错误可能表明存在问题或恶意攻击。设置告警有助于快速检测此类异常活动。通过为某些阈值和活动设置告警，你可以深入了解表示安全漏洞、滥用或异常使用的模式。

## 前提条件

1. 获取一个具有[超级管理员](../../administration/role-based-access-control.md#超级管理员)或 [API 提供者](../../administration/role-based-access-control.md#api提供者)角色的用户账户。
2. [按服务发布 API](../api-publishing/publish-apis-by-service.md)。
3. 获取通知系统的 Webhook。

## 创建 Webhook 模板

每个告警策略至少需要一个用于通知的 Webhook 模板。 Webhook 模板定义事件发生时通过 Webhook 发送的数据的内容和结构。多个策略可以共享相同的 Webhook 模板。
Webhook 指不同应用程序或服务在发生某些事件时通过向预定义的 URL 发送 HTTP 请求来实时相互通信的一种方式。

如需创建 Webhook 模板，遵循以下步骤：

1. 从左侧导航栏中选择**告警** > **Webhook 模板**，然后单击**新增模板**。在对话框中，执行以下操作：
    - 在**名称**字段中，输入 `Email-notice`。
    - 在 `URL`字段中，输入 webhook URL。本教程使用 `webhook.site` URL 作为示例。
    - 在**通知模板**字段中（Webhook 的请求正文）中，应用以下配置。 `Title`、`Severity` 和 `Detail` 字段来自告警策略：

    ```bash
    hello, here is an alert example. 
    Title: {{ .Title }} 
    AlertTime: {{ .AlertTime.Format "2006 Jan 02 15:04:05" }} 
    Severity: {{.Severity}} 
    Detail: {{.Detail}}
    ```

    ![添加 Webhook 模板](https://static.apiseven.com/uploads/2023/12/08/G8WZTwvR_add-webhook-template_zh.png)

2. 单击**新增**。

## 设置告警策略

告警策略是一组预定义的条件和规则，用于在发生某些事件或条件时触发特定操作或通知。
本节介绍如何为网关实例离线通知配置告警策略。如果网关实例在过去 10 分钟内离线，该策略将调用 Webhook 通知相关人员。

1. 选择**告警** > **策略**，然后单击 **新增告警策略**。在对话框中，执行以下操作：
    - 选择告警策略的生效范围。
    - 输入策略名称。本示例将使用 `gateway-instance-offline` 作为示例。
    - 单击**新增**。
2. 单击新创建的告警策略。
3. 在**触发条件**区域，单击**更新**。
4. 选择`网关实例离线`作为类型 1，然后选择 `5 分钟`。

    ![更新告警条件](https://static.apiseven.com/uploads/2023/12/08/oyy7C8tg_update-alrm-policy_zh.png)

5. 单击**更新**。
6. 在**基本信息**区域，单击**更新**。在对话框中，执行以下操作：

    - **告警标题**：`API7 Gateway Instance Offline`
    - **告警详细信息**：`Please check the instance and recover immediately`

    ![更新告警基本信息](https://static.apiseven.com/uploads/2023/12/08/cguym8cq_update-alarm-policy-basic_zh.png)

8. 单击**更新**。
9. 在 **Webhook 通知**区域，单击**开启**，启用 `Email-notice` 模板。

## 验证

手动停止网关实例，你应该看到以下输出：

```bash
hello, here is an alert example. 
Title: API7 Gateway Instance Offline 
AlertTime: 2006 Jan 02 15:04:05"
Severity: Medium 
Detail: Please check the instance and recover immediately
```

