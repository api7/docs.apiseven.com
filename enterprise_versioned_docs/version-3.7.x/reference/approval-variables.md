---
title: 审批变量与模板
slug: /reference/approval-variables
description: 了解如何在 API7 企业版中使用审批变量，为审批通知和模板创建动态内容。
---

审批通知（邮件和消息）可以通过预定义的变量进行自定义，以提供动态内容。

## 审批变量

审批变量是模板中的数据评估，由 `{{` 和 `}}` 分隔。

以下变量可用于创建告警通知（消息、邮件主题、邮件内容）。

| **变量**                     | **描述**                  |
|----------------------------------|----------------------------------|
| `{{ .ApprovalID}}`               | 审批的唯一 ID。       |
| `{{ .ApplicantName}}`             | 申请人的名称。       |
| `{{ .Event}}`                   | 可以是 `API 产品订阅` 或 `开发者注册` |
| `{{ .AppliedAt}}`              | 提交的时间     |
| `{{ .ResourceName}}`            | 事件相关资源的名称。对于 `API 产品订阅` 是 API 产品，对于 `开发者注册` 是开发者        |

* `AppliedAt` 可以自定义[时间格式]:(<https://go.dev/src/time/format.go>)

```text
{{ .AppliedAt.Format }}
```

## 模板

### 消息(JSON)

```json
"applicant": "{{.ApplicantName}}"
"timestamp": "{{.AppliedAt.Format "2006 Jan 02 15:04:05"}}"
"id": "{{.ApprovalID}}"
"event": "{{.Event}}"
"resource": "{{.ResourceName}}"
```
