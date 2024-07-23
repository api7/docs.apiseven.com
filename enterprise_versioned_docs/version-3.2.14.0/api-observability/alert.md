---
title: 告警通知
slug: /api-observability/alert
---

API 使用中的异常流量模式或错误可能表明存在问题或恶意攻击。通过为特定阈值和活动设置警报，你可以快速检测并深入了解可能表明安全漏洞、滥用或异常使用的模式。

本教程将指导你设置警报策略，以便在网关实例离线时通知你。如果网关实例在过去 10 分钟内离线，该策略将调用一个 webhook 来通知相关方。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上有一个运行的 API](../getting-started/launch-your-first-api.md)。
3. 获取通知系统的 Webhook。

## 创建 Webhook 模板

每个告警策略至少需要一个用于通知的 Webhook 模板。 Webhook 模板定义事件发生时通过 Webhook 发送的数据的内容和结构。多个策略可以共享相同的 Webhook 模板。
Webhook 指不同应用程序或服务在发生某些事件时通过向预定义的 URL 发送 HTTP 请求来实时相互通信的一种方式。

1. 从侧边栏选择**告警**，然后点击**Webhook 模板**。
2. 点击**新增模板**。
3. 使用 `Email-notice` 作为模板名称，并使用你的 webhook URL 作为 URL。本教程使用 `webhook.site` 的 URL 作为示例。
4. 在**通知模板**字段（webhook 的请求正文）中，应用以下配置。 `Title`、`Severity` 和 `Detail` 字段来自告警策略：


    ```shell
    hello, here is an alert example. 
    Title: {{ .Title }} 
    AlertTime: {{ .AlertTime.Format "2006 Jan 02 15:04:05" }} 
    Severity: {{.Severity}} 
    Detail: {{.Detail}}
    ```

5. 点击 **新增**。

## 设置告警策略

告警策略是一组预定义的条件和规则，用于在发生某些事件或条件时通过触发 Webhook 发送通知。
本节将举例介绍如何为网关实例离线通知配置告警策略。如果网关实例在过去 10 分钟内离线，该策略将调用 Webhook 通知相关人员。

1. 选择**告警** > **策略**，然后单击 **新增告警策略**。在对话框中，执行以下操作：

* 选择告警策略的生效范围。
* 输入策略名称。本示例将使用`网关实例离线`作为示例。
* 点击**新增**。

2. 点击新创建的告警策略。
3. 在**触发条件**区域，单击**更新**。
4. 选择`网关实例离线`作为类型 1，然后选择 `5 分钟`。
5. 点击**更新**。
6. 在**基本信息**区域，单击**更新**。在对话框中，执行以下操作：

* **告警标题**：`API7 网关实例离线`
* **告警详细信息**：`请检查网关实例运行状况并尽快修复。`

8. 点击**更新**。
9. 在 **Webhook 通知**区域，点击**开启**，启用`邮件通知`模板。

## 验证

手动停止网关实例，你应该看到以下输出：

```bash
hello, here is an alert example. 
Title: API7 网关实例离线 
AlertTime: 2006 Jan 02 15:04:05"
Severity: Medium 
Detail: 请检查网关实例运行状况并尽快修复。
```
