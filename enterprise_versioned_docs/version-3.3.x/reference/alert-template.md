---
title: 告警变量和模板
slug: /reference/alert-template
---

告警策略通知（电子邮件和消息）可以使用预定义变量进行自定义，以提供动态内容。

## 告警变量

告警变量是模板中的数据评估，用 `{{` 和 `}}` 分隔。

以下变量可用于创建告警通知（告警消息、告警电子邮件主题、告警电子邮件内容）

| **变量**                     | **描述**                  |
|----------------------------------|----------------------------------|
| `{{ .AlertPolicyName }}`        | 告警策略的名称。        |
| `{{ .Description }}`            | 告警策略的描述。 |
| `{{ .Severity }}`               | 告警策略的严重性。    |
| `{{ .TriggerGatewayGroup }}`    | 触发告警的网关组的名称。可以指定多个组，用逗号分隔。 |
| `{{ .AlertTime }}`              | 告警时间。               |
| `{{ .AlertDetial }}`            | 触发告警的特定事件的详细描述。多个事件将单独列出。|

* AlertTime 可以自定义 [时间格式](https://go.dev/src/time/format.go)：

```text
{{ .AlertTime.Format }}
```

* AlertDetail 是一个整体字符串，多个事件详情将用 `\n` 分隔。因此，如果要在 JSON 正文中引用 AlertDetail，请添加 `escape` 函数：

```text
{{ .AlertDetail | escape }}
```

## 模板

配置告警通知的示例。

### 告警电子邮件主题

```text
`[API7 告警] {{{ .TriggerGatewayGruop}}} 中没有足够的健康网关实例 - [{{.Severity }}]`。
```

### 告警电子邮件内容

```text
亲爱的 [收件人姓名]，

我们写信通知你，API7 网关在 {{ .AlertTime.Format "2024 Dec 31 17:00:00" }} 触发了告警。具体的告警严重程度为 {{ .Severity }}。

告警详情：

网关组：{{ .TriggerGatewayGroup }}
告警消息：{{ .AlertDetail }}
```

建议操作：

进一步调查：请查看相关日志和指标以获取更多详细信息。
重新启动服务：考虑重新启动服务。
上报值班团队：如果问题仍然存在，请联系值班团队。

### 告警消息（JSON）

```json
"text": "{{{ .AlertDetail \| escape }}}"。
"timestamp": "{{{ .AlerTime.Format "2024 Dec 31 17:00:00" }}}"
"system": "API7 网关，{{ .TriggerGatewayGroup }}"
```
