---
title: 网关告警通知
slug: /api-observability/alert
---

异常流量模式或 API 网关使用错误可能表明存在问题或恶意攻击。通过为特定阈值和活动设置告警，你可以快速检测并深入了解可能的安全漏洞、滥用或异常使用。

本教程将指导你创建告警策略，以便在特定事件发生时接收邮件和 webhook 通知。

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。
2. [在网关组上运行 API](../getting-started/launch-your-first-api.md)。
3. 获取通知系统的 webhook URL。

## 设置 SMTP 服务器

1. 从顶部导航栏中选择**组织**，然后选择**设置**。
2. 点击**SMTP 服务器**选项卡。
3. 点击**启用**。
4. 在对话框中，执行以下操作：
   * **SMTP 服务器地址**，输入你的 SMTP 服务器的地址。例如，`127.0.0.1`。
   * **用户名**和**密码**，输入连接到你的 SMTP 服务器的凭据。
   * **发件人姓名**，输入 `API7 企业版` 以在邮件中将此名称显示为发件人。
   * **发件人邮箱地址**，输入 `noreply@api7.ai`。这将用作实际的发件人地址。
   * 点击**启用**。

## 添加联系人

_联系人_ 定义了一组可由多个告警策略复用的邮件地址或 webhook URL。

### 添加邮件联系人

1. 从顶部导航栏中选择**组织**，然后选择**联系人**。
2. 点击**新增联系人**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `应急小组邮件列表`。
   * **类型**，选择 `邮件`。
   * **邮件地址**，输入 `emergencyteamlist@api7.ai`。
   * 点击**新增**。

### 添加 Webhook 联系人

使用 [Slack 接收 webhook](https://api.slack.com/messaging/webhooks) 将来自 API7 企业版的消息发布到 Slack。

1. 从顶部导航栏中选择**组织**，然后选择**联系人**。
2. 点击**新增联系人**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `Slack 通知`。
   * **类型**，选择 `Webhook`。
   * **URL**，输入 `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`。
   * 点击**新增**。

## 添加告警策略

有关更多告警邮件内容示例，请参阅[告警变量和模板](../reference/alert-template.md)。告警策略会在创建或更新后立即开始监控，首次检查会在指定的检查间隔后进行。

### 监控控制面证书到期

控制面证书在实例部署时激活，用于验证网关实例身份。这些证书的有效期为 13 个月。

要主动监控即将过期的控制面证书并发出告警，可以配置一个每日告警任务以检查证书到期日期。如果证书即将到期（30 天内），请向应急小组发送邮件告警，并在 Slack 上发布通知。

1. 从侧边栏选择**告警**，然后点击**策略**。
2. 点击**新增告警策略**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `控制面证书将过期`。
   * **告警等级**，选择 `高`。
   * **检查间隔**，输入 `1440` 分钟。
   * **触发条件**，执行以下操作：
      * **条件类型**，选择 `满足下列所有条件 (AND)`。
      * **事件**，选择 `控制面证书即将过期`。
      * **触发网关组**，选择 `全选`。
      * **规则**，填空 `控制面证书将在 30 天内过期`。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `邮件`。
      * **联系人**，选择 `应急小组邮件列表`。
      * **告警邮件主题**，输入 `[API7 告警] [{{.Severity}}] 控制面证书到期警告`。
      * **告警邮件内容**，输入 `告警时间：{{.AlertTime.Format "2024 Dec 31 17:00:00"}}，详情：{{.AlertDetail}}`。
      * 点击**新增**。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `Webhook`。
      * **联系人**，选择 `Slack 通知`。
      * **告警消息**，输入

      ```json
      "text": "{{ .AlertDetail }}"
      ```

      * 点击**新增**。

5. 点击**新增**。

#### 验证

假设网关组 `生产网关组` 中的网关实例 `gateway 123` 的控制面证书将于 2024-12-31 过期。

1. 从侧边栏选择**告警**，然后点击**历史**。
2. 你应该会看到一个告警记录。点击**详情**：
   * 告警策略：控制面证书过期
   * 告警等级：高
   * 告警时间：5 分钟前
   * 触发网关组：生产网关组
   * 告警详情：Certificate of gateway instance: gateway 123 will expire in 21 days.

3. 发送的邮件将类似于：

```text
* 主题：[API7 告警][高] 控制面证书到期警告
* 告警时间：2024 DEC 10 17:00:00，详情：网关实例证书：Certificate of gateway instance: gateway 123 will expire in 21 days.
```

4. 你将在 Slack 中收到一条消息：

```text
Certificate of gateway instance: gateway 123 will expire in 21 days.
```

### 监控控制面到数据面的 mTLS 证书到期

CA 证书支持控制面和数据面之间安全的 mTLS 通信，并在实例部署时激活，有 13 个月的有效期。

要主动监控即将过期的控制面 CA 证书并发出告警，请配置每日告警任务以检查 CA 证书到期日期。如果 CA 证书即将到期（30 天内），请向应急小组发送邮件告警，并在 Slack 上发布通知。

1. 从侧边栏选择**告警**，然后点击**策略**。
2. 点击**新增告警策略**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `控制面 CA 证书过期`。
   * **告警等级**，选择 `高`。
   * **检查间隔**，输入 `1440` 分钟。
   * **触发条件**，执行以下操作：
      * **条件类型**，选择 `满足下列所有条件 (AND)`。
      * **事件**，选择 `控制面和数据面之间的 mTLS 证书将要过期`。
      * **触发网关组**，选择 `选择全部`。
      * **规则**，填空 `数据面和控制面之间的 mTLS 证书将在 30 天内过期`。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `邮件`。
      * **联系人**，选择 `应急小组邮件列表`。
      * **告警邮件主题**，输入 `[API7 告警] 控制面 CA 证书到期警告`。
      * **告警邮件内容**，输入 `告警时间：{{.AlertTime.Format "2024 Dec 31 17:00:00"}}，详情：{{.AlertDetail}}`。
      * 点击**新增**。

   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `Webhook`。
      * **联系人**，选择 `Slack 通知`。
      * **告警消息**，输入

      ```json
      "text": "{{ .AlertDetail }}"
      ```

      * 点击**新增**。

5. 点击**新增**。

#### 验证

假设网关组 `生产网关组` 中的网关实例 `gateway 123` 的控制面 CA 证书将于 2024-12-31 过期。

1. 从侧边栏选择**告警**，然后点击**历史**。
2. 你应该会看到一个告警记录。点击**详情**：
   * 告警策略：控制面 CA 证书过期
   * 告警等级：高
   * 告警时间：5 分钟前
   * 触发网关组：生产网关组
   * 告警详情：CA Certificate of gateway instance: gateway 123 will expire in 21 days.

3. 发送的邮件将类似于：

```text
* 主题：[API7 告警] 控制面 CA 证书到期警告
* 告警时间：2024 DEC 10 17:00:00，详情：CA Certificate of gateway instance: gateway 123 will expire in 21 days.
```

4. 你将在 Slack 中收到一条消息：

```text
CA Certificate of gateway instance: gateway 123 will expire in 21 days.
```

### 检测网关实例离线

如果网关实例（数据面节点）超过 2 小时未向控制面报告心跳, 并且此状态持续 7 天，则数据面节点将被自动删除，并标记为 `离线`。

配置每小时告警任务以检测并在出现问题时向应急小组发送邮件告警和 Slack 通知。然后，应该有人尝试恢复离线的网关实例。

1. 从侧边栏选择**告警**，然后点击**策略**。
2. 点击**新增告警策略**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `网关实例离线`。
   * **告警等级**，选择 `中`。
   * **检查间隔**，输入 `60` 分钟。
   * **触发条件**，执行以下操作：
      * **条件类型**，选择 `满足下列所有条件 (AND)`。
      * **事件**，选择 `网关实例离线`。
      * **触发网关组**，选择 `选择全部`。
      * **规则**，填空 `网关组中的任何网关实例离线超过 1 小时`。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `邮件`。
      * **联系人**，选择 `应急小组邮件列表`。
      * **告警邮件主题**，输入 `[API7 告警] 网关实例离线警告`。
      * **告警邮件内容**，输入 `告警时间：{{.AlertTime.Format "2024 Dec 31 17:00:00"}}，详情：{{.AlertDetail}}`。
      * 点击**新增**。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `Webhook`。
      * **联系人**，选择 `Slack 通知`。
      * **告警消息**，输入

      ```json
      "text": "{{ .AlertDetail }}"
      ```

      * 点击**新增**。

5. 点击**新增**。

#### 验证

假设网关组 `生产网关组` 中的网关实例 `gateway 123` 在 2024-12-31 14:00:00 离线，网关组 `测试网关组` 中的网关实例 `gateway 456` 在 2024-12-31 13:00:00 离线。

1. 从侧边栏选择**告警**，然后点击**历史**。
2. 你应该会看到一个告警记录。点击**详情**：
   * 告警策略：网关实例离线
   * 告警等级：高
   * 告警时间：5 分钟前
   * 触发网关组：生产网关组
   * 告警详情：Gateway instance: gateway 123 in the gateway group: 生产网关组 offline for 3 hours \n Gateway instance: gateway 456 in the gateway group: 测试网关组 offline for 4 hours

3. 发送的邮件将类似于：

```text
* 主题：[API7 告警] 网关实例离线警告
* 告警时间：2024 DEC 31 17:00:00，详情：Gateway instance: gateway 123 in the gateway group: production group offline for 3 hours
Gateway instance: gateway 456 in the gateway group: test group offline for 4 hours
```

4. 你将在 Slack 中收到一条消息：

```text
Gateway instance: gateway 123 in the gateway group: 生产网关组 offline for 3 hours
Gateway instance: gateway 456 in the gateway group: 测试网关组 offline for 4 hours
```

### 检测 CPU 核数超出限制

如果所有网关组的 CPU 核使用量连续七天超过许可的 CPU 核心数限制，则资源添加或修改将受到限制。但是，现有的服务和路由将继续运行。

配置每小时告警任务以检测生产环境的所有网关组，并在出现问题时向应急小组发送邮件告警和 Slack 通知。

1. 从侧边栏选择**告警**，然后点击**策略**。
2. 点击**新增告警策略**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `CPU 核数超出限制`。
   * **告警等级**，选择 `高`。
   * **检查间隔**，输入 `60` 分钟。
   * **触发条件**，执行以下操作：
      * **条件类型**，选择 `满足下列所有条件 (AND)`。
      * **事件**，选择 `CPU 核心数超出 License 限制`。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `邮件`。
      * **联系人**，选择 `应急小组邮件列表`。
      * **告警邮件主题**，输入 `[API7 告警] CPU 核数超出限制`。
      * **告警邮件内容**，输入 `告警时间：{{.AlertTime.Format "2024 Dec 31 17:00:00"}}，详情：{{.AlertDetail}}`。
      * 点击**新增**。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `Webhook`。
      * **联系人**，选择 `Slack 通知`。
      * **告警消息**，输入

      ```json
      "text": "{{ .AlertDetail }}"
      ```

      * 点击**新增**。

5. 点击**新增**。

#### 验证

假设你的 API7 企业版许可证限制为 100 个 CPU 核，并且从 2024-12-1 开始已连续 21 天超出此限制。

1. 从侧边栏选择**告警**，然后点击**历史**。
2. 你应该会看到一个告警记录。点击**详情**：
   * 告警策略：CPU 核数超出限制
   * 告警等级：中
   * 告警时间：5 分钟前
   * 触发网关组：生产网关组
   * 告警详情：Total CPU usage for all gateway groups is 110c, exceeded allowed license CPU quota 100c.

3. 发送的邮件将类似于：

```text
* 主题：[API7 告警] 网关实例离线警告
* 告警时间：2024 DEC 31 17:00:00，详情：Total CPU usage for all gateway groups is 110c, exceeded allowed license CPU quota 100c.
```

4. 你将在 Slack 中收到一条消息：

```text
Total CPU usage for all gateway groups is 110c, exceeded allowed license CPU quota 100c.
```

### 统计网关组中的健康网关实例数

如果网关组中健康网关实例的数量低于临界阈值，则表明可能会出现服务中断并影响流量处理。
这种情况在 Kubernetes 部署中尤其重要，因为网关实例可能会遇到故障或意外缩减。

实施高频告警任务以检测并在出现问题时向应急小组发送邮件告警和 Slack 通知。

1. 从侧边栏选择**告警**，然后点击**策略**。
2. 点击**新增告警策略**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `生产网关组中没有足够的健康网关实例`。
   * **告警等级**，选择 `高`。
   * **检查间隔**，输入 `30` 分钟。
   * **触发网关组**，选择 `生产网关组`。
   * **触发条件**，执行以下操作：
      * **条件类型**，选择 `满足下列所有条件 (AND)`。
      * **事件**，选择 `健康网关实例的数量`。
      * **规则**，填空 `网关组中的健康网关实例数少于 50`。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `邮件`。
      * **联系人**，选择 `应急小组邮件列表`。
      * **告警邮件主题**，输入 `[API7 告警] 生产网关组中没有足够的健康网关实例`。
      * **告警邮件内容**，输入 `告警时间：{{.AlertTime.Format "2024 Dec 31 17:00:00"}}，详情：{{.AlertDetail}}`。
      * 点击**新增**。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `Webhook`。
      * **联系人**，选择 `Slack 通知`。
      * **告警消息**，输入

      ```json
      "text": "{{ .AlertDetail }}."
      ```

      * 点击**新增**。

5. 点击**新增**。

#### 验证

假设你的网关组 `生产网关组` 至少需要 50 个健康的网关实例。但是，截至 2024 年 12 月 31 日 17:00:00，只有 40 个实例正在运行。这种严重的不足可能会导致服务降级和潜在的停机。需要立即关注以解决此问题。

1. 从侧边栏选择**告警**，然后点击**历史**。
2. 你应该会看到一个告警记录。点击**详情**：
   * 告警策略：生产网关组中没有足够的健康网关实例
   * 告警等级：高
   * 告警时间：5 分钟前
   * 触发网关组：生产组
   * 告警详情：Number of healthy gateway instances in the gateway group: 生产网关组 is 40.

3. 发送的邮件将类似于：

```text
* 主题：[API7 告警] 生产组中没有足够的健康网关实例
* 告警时间：2024 DEC 31 17:00:00，详情：Number of healthy gateway instances in the gateway group: 生产网关组 is 40.
```

4. 你将在 Slack 中收到一条消息：

```text
Number of healthy gateway instances in the gateway group: 生产网关组 is 40.
```

### 监控状态码

如果特定 API 响应状态码的数量超过阈值（例如，过多的 `500` 错误），则表明可能会出现服务中断并影响流量处理。

实施高频告警任务以检测并在出现问题时向应急小组发送邮件告警和 Slack 通知。

1. 从侧边栏选择**告警**，然后点击**策略**。
2. 点击**新增告警策略**。
3. 在对话框中，执行以下操作：
   * **名称**，输入 `生产网关组中的 500 状态码过多`。
   * **告警等级**，选择 `高`。
   * **检查间隔**，输入 `30` 分钟。
   * **触发网关组**，选择 `标签匹配`，然后输入键/值 `环境类型: 生产`。
   * **触发条件**，执行以下操作：
      * **条件类型**，选择 `满足下列所有条件 (OR)`。
      * **事件**，选择 `状态码 500 的数量`。
      * **规则**，填空 `网关组的所有已发布服务收到的状态码为 500 的请求数量已达到或超过 100 次在过去 60 分钟内`。
   * 点击**新增条件**。
   * **触发条件**，执行以下操作：
      * **事件**，选择 `状态码 500 的比例`。
      * **规则**，填空 `网关组的所有已发布服务收到的状态码为 500 的请求比率已达到或超过 10% 在过去 60 分钟内`。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `邮件`。
      * **联系人**，选择 `应急小组邮件列表`。
      * **告警邮件主题**，输入 `[API7 告警] {{ .TriggerGatewayGroup }} 中的 500 状态码过多`。
      * **告警邮件内容**，输入 `告警时间：{{.AlertTime.Format "2024 Dec 31 17:00:00"}}，详情：{{.AlertDetail}}`。
      * 点击**新增**。
   * 点击**新增通知**。
   * 在对话框中，执行以下操作：
      * **类型**，选择 `Webhook`。
      * **联系人**，选择 `Slack 通知`。
      * **告警消息**，输入

      ```json
      "text": "{{ .AlertDetail }}"
      ```

      * 点击**新增**。

5. 点击**新增**。

#### 验证

假设你的网关组 `VIP 网关组` 具有标签 `环境类型：生产`，在 2024 年 12 月 31 日 16:00 到 17:00 之间达到了 15% 的错误率，在 1000 个请求中，有 150 个响应为 500 错误。

并且网关组 `US 网关组` 具有标签 `环境类型：生产`，在 2024 年 12 月 31 日 16:00 到 17:00 之间达到了了 10% 的错误率，在 500 个请求中，有 50 个响应为 500 错误。

1. 从侧边栏选择**告警**，然后点击**历史**。
2. 你应该会看到一个告警记录。点击**详情**：
   * 告警策略：生产网关组中的 500 状态码过多
   * 告警等级：高
   * 告警时间：5 分钟前
   * 触发网关组：VIP 组
   * 告警详情：Number of requests with status code 500 received by all published services of the gateway group: VIP 网关组 is 150 times in the last 60 minutes.\n Ratio of requests with status code 500 received by all published services of the gateway group: VIP 网关组 is 15% in the last 60 minutes.\n Ratio of requests with status code 500 received by all published services of the gateway group: US 网关组 is 10% in the last 60 minutes.

3. 发送的邮件将类似于：

```text
* 主题：[API7 告警] [API7 告警] VIP 网关组、US 网关组组中的 500 状态码过多
* 告警时间：2024 DEC 31 17:00:00，详情：Number of requests with status code 500 received by all published services of the gateway group: VIP 网关组 is 150 times in the last 60 minutes.
Ratio of requests with status code 500 received by all published services of the gateway group: VIP 网关组 is 15% in the last 60 minutes.
Ratio of requests with status code 500 received by all published services of the gateway group: US 网关组 is 10% in the last 60 minutes.
```

4. 你将在 Slack 中收到一条消息：

```text
Number of requests with status code 500 received by all published services of the gateway group: VIP 网关组 is 150 times in the last 60 minutes.
Ratio of requests with status code 500 received by all published services of the gateway group: VIP 网关组 is 15% in the last 60 minutes.
Ratio of requests with status code 500 received by all published services of the gateway group: US 网关组 is 10% in the last 60 minutes.
```
