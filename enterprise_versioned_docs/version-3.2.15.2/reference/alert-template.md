---
title: 告警模板
slug: /reference/alert-template
---

告警通知模板是一个预设模板，旨在通过在运行时用特定详细信息填充占位符来动态生成告警消息。占位符在模板中配置为变量。它利用 Go 的模板语法来注入值，例如标题、告警时间、严重性和告警的详细描述。

## 变量

模板变量是模板中的数据评估，用 `{{` 和 `}}` 分隔。

以下变量可用于创建告警通知模板。

| **变量**         | **描述**                  |
|----------------------|----------------------------------|
| `{{ .Name }}`        | 告警策略的名称。        |
| `{{ .Description }}` | 告警策略的描述。 |
| `{{ .Severity }}`    | 告警策略的严重性。    |
| `{{ .Class }}`       | 告警策略的类别。       |
| `{{ .Title }}`       | 告警标题。                     |
| `{{ .Detail }}`      | 告警详情。                    |
| `{{ .AlertTime }}`   | 告警时间。               |
| `{{ .AlertEvents }}` | 触发告警的条件。 |

### 告警时间

* `{{ .AlertTime.Format }}`：告警[时间格式](https://go.dev/src/time/format.go)。

### 告警事件

* `{{ .AlertEvents.number_of_status_code.Summary }}`：状态码数量的摘要。
* `{{ .AlertEvents.ratio_of_status_code.Summary }}`：状态码比率的摘要。
* `{{ .AlertEvents.control_plane_certificate_will_expire_in.Summary }}`：即将过期的控制面证书的摘要。
* `{{ .AlertEvents.gateway_certificate_will_expire_in.Summary }}`：即将过期的网关证书的摘要。
* `{{ .AlertEvents.gateway_instance_offline.Summary }}`：离线网关实例的摘要。
* `{{ .AlertEvents.dp_core_exceeded.Summary }}`：网关实例 CPU 核心数超过许可证允许的最大 CPU 核心数的时间段摘要，这可能会影响新的配置更改。

## 示例

### 包含标题、时间、严重性和详情的告警

```text
API7 alert! See details below.
Title: {{ .Title }} 
AlertTime: {{ .AlertTime.Format "2006 Jan 02 15:04:05" }} 
Severity: {{ .Severity }} 
Detail: {{ .Detail }}
```

### 识别告警触发器

```text
Alert triggered by
{{if .AlertEvents.dp_core_exceeded }} {{ .AlertEvents.dp_core_exceeded.Summary }} {{end}}
{{if .AlertEvents.gateway_instance_offline }} {{ .AlertEvents.gateway_instance_offline.Summary }} {{end}}
```
