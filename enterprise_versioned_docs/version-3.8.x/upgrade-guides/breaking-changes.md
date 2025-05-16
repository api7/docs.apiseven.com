---  
title: 触发网关告警  
slug: /api-observability/alert  
description: 遵循本指南在 API7 企业版 中创建告警策略，以便接收特定事件通知并监控系统性能。  

---

异常流量模式或 API 网关使用中的错误可能预示着问题或恶意攻击。通过为某些阈值和活动设置告警，您可以快速检测并洞察可能表明安全漏洞、滥用或异常使用情况的模式。  

本教程将指导您创建告警策略，以接收特定事件的电子邮件和 Webhook 通知。以下是一个交互式演示，介绍了网关组中健康网关实例计数的场景。  

<StorylaneEmbed src='https://app.storylane.io/demo/uzu4diu6asm2' />  

## 前提条件  

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。  
2. [在网关组上运行一个 API](../getting-started/launch-your-first-api.md)。  
3. 获取通知系统的 Webhook URL。  

## 设置 SMTP 服务器  

1. 从顶部导航栏选择 **组织**，然后选择 **Settings**。  
2. 点击 **SMTP 服务器** 选项卡。  
3. 点击 **启用**。  
4. 在对话框中执行以下操作：  
   * 在 **SMTP 服务器地址** 字段中输入 SMTP 服务器地址，例如 `127.0.0.1`。  
   * 在 **用户名** 和 **密码** 字段中输入连接 SMTP 服务器的凭据。  
   * 在 **发件人名称** 字段中输入 `API7 企业版`，作为电子邮件中显示的发送者名称。  
   * 在 **发件人邮箱地址** 字段中输入 `noreply@api7.ai`，作为实际的发送者地址。  
   * 点击 **启用**。  

## 添加联系点  

_联系点_ 定义了可以被多个告警策略使用的一组电子邮件地址或 Webhook URL。  

### 添加电子邮件联系点  

1. 从顶部导航栏选择 **组织**，然后选择 **联系人**。  
2. 点击 **新增联系人**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `应急团队邮箱列表`。  
   * 在 **类型** 字段中选择 `邮箱`。  
   * 在 **邮箱地址** 字段中输入收件人的电子邮件地址，例如 `emergencyteamlist@api7.ai`。  
   * 点击 **新增**。  

### 添加 Webhook 联系点  

使用 [Slack 入站 Webhook](https://api.slack.com/messaging/webhooks) 将 API7 企业版 的消息发布到 Slack。  

1. 从顶部导航栏选择 **组织**，然后选择 **联系人**。  
2. 点击 **新增联系人**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `Slack 通知`。  
   * 在 **类型** 字段中选择 `Webhook`。  
   * 在 **URL** 字段中输入 `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`（替换为您的实际 ID）。  
   * 点击 **新增**。  

## 添加关键告警策略  

以下告警策略强烈建议配置，因为它们对大多数用户至关重要。  

### 监控控制面与数据面之间的 mTLS 证书过期  

API7 控制面证书和 API7 控制面 CA 证书实现了控制面与数据面之间的安全 mTLS 通信，这些证书在网关实例部署时激活，有效期为 13 个月。  

为了主动监控并提醒即将过期的网关实例证书，可以设置每日任务检查证书过期时间。如果某个网关实例的证书即将过期（30 天内），则向紧急团队发送电子邮件告警，并在 Slack 中发布通知。  

1. 从侧边导航栏选择 **告警**，然后点击 **告警策略**。  
2. 点击 **新增告警策略**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `网关实例证书过期`。  
   * 在 **告警等级** 字段中选择 `高`。  
   * 在 **检查间隔** 字段中输入 `1440` 分钟。  
   * 在 **条件** 字段中执行以下操作：  
     * 在 **条件类型** 字段中选择 `满足下列所有条件 (且)`。  
     * 在 **事件** 字段中选择 `mTLS 证书在控制面和数据面之间即将过期`。  
     * 在 **触发网关组** 字段中选择 `选择全部`。  
     * 在 **规则** 字段中填写 `控制面和数据面之间的 mTLS 证书即将过期`。  
   * 点击 **新增通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `邮箱`。  
     * 在 **联系人** 字段中选择 `应急团队邮箱列表`。  
     * 在 **告警邮件主题** 字段中输入：  
       ```text  
       [API7 Alert] 网关实例证书过期告警 
       ```  
     * 在 **告警邮件内容** 字段中输入：  
       ```text  
       告警时间: {{.AlertTime.Format "2006 Jan 02 15:04:05"}}, 详情:{{.AlertDetail}}.  
       ```  
     * 点击 **新增**。  
   * 点击 **新增通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `Webhook`。  
     * 在 **联系人** 字段中选择 `Slack 通知`。  
     * 在 **告警消息** 字段中输入：  
       ```json  
       "text": "{{.AlertDetail}}."  
       ```  
     * 点击 **新增**。  
5. 点击 **新增**。  

#### 验证  

假设控制面证书将于 2024-12-31 过期。在 2024-12-10，告警策略将触发：  

1. 一封电子邮件，内容如下：  
   ```text  
   * 主题: [API7 Alert] 网关实例证书过期告警  
   * 告警时间: 2024 DEC 10 17:00:00, 详情: The certificate for gateway instance: gateway 123 will expire in 21 days.  
   ```  

2. Slack 中的一条消息：  
   ```text  
   The certificate for gateway instance: gateway 123 will expire in 21 days.  
   ```  

3. 告警历史记录。从侧边导航栏选择 **告警**，然后点击 **告警历史** 查看记录。  
4. 记录详情。点击 **详情** 可以看到：  
   * 告警策略: 网关实例证书过期  
   * 告警等级: 高  
   * 告警时间: 5 分钟前  
   * 触发网关组: 生产网关组  
   * 告警详情: The certificate for gateway instance: gateway 123 will expire in 21 days.  

### 检测网关实例离线  

如果网关实例（数据面节点）超过 2 小时未向控制面发送心跳，并且此状态持续 7 天，则该数据面节点将被自动移除并标记为 `离线`。  

设置每小时任务检测问题，并在出现问题时向紧急团队发送电子邮件告警和 Slack 通知。随后应尝试恢复离线的网关实例。  

1. 从侧边导航栏选择 **告警**，然后点击 **策略**。  
2. 点击 **新增告警策略**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `网关实例离线`。  
   * 在 **告警等级** 字段中选择 `高`。  
   * 在 **检查间隔** 字段中输入 `60` 分钟。  
   * 在 **条件** 字段中执行以下操作：  
     * 在 **条件类型** 字段中选择 `满足下列所有条件 (且)`。  
     * 在 **事件** 字段中选择 `网关实例离线`。  
     * 在 **触发网关组** 字段中选择 `选择全部`。  
     * 在 **规则** 字段中填写 `网关组中的网关实例离线时间超过 1 小时`。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `邮箱`。  
     * 在 **联系人** 字段中选择 `应急团队邮箱列表`。  
     * 在 **告警邮件主题** 字段中输入：  
       ```text  
       [API7 Alert] 网关实例离线告警 
       ```  
     * 在 **告警邮件内容** 字段中输入：  
       ```text  
       Alert Time: {{.AlertTime.Format "2006 Jan 02 15:04:05"}}, Detail:{{.AlertDetail}}.  
       ```  
     * 点击 **新增**。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `Webhook`。  
     * 在 **联系人** 字段中选择 `Slack 通知`。  
     * 在 **告警消息** 字段中输入：  
       ```json  
       "text": "{{.AlertDetail}}"  
       ```  
     * 点击 **新增**。  
4. 点击 **新增**。  

#### 验证  

假设两个网关实例分别于 2024-12-31 14:00:00 和 2024-12-31 13:00:00 离线。在 2024-12-31 17:00:00，告警策略将触发：  

1. 一封电子邮件，内容如下：  
   ```text  
   * 主题: [API7 Alert] 网关实例离线告警
   * 告警时间: 2024 DEC 31 17:00:00, 详情: Gateway instance: gateway 123 in the gateway group: 生产网关组 has been offline for 3 hours. Gateway instance: gateway 456 in the gateway group: test group has been offline for 4 hours.  
   ```  

2. Slack 中的一条消息：  
   ```text  
   Gateway instance: gateway 123 in the gateway group: 生产网关组 has been offline for 3 hours. Gateway instance: gateway 456 in the gateway group: test group has been offline for 4 hours.  
   ```  

3. 告警历史记录。从侧边导航栏选择 **告警**，然后点击 **历史** 查看记录。  
4. 记录详情。点击 **详情** 可以看到：  
   * 告警策略: Gateway Instance Offline  
   * 告警等级: 高  
   * 告警时间: 5 分钟前  
   * 触发网关组: 生产网关组  
   * 告警详情: Gateway instance: gateway 123 in the gateway group: 生产网关组 has been offline for 3 hours. Gateway instance: gateway 456 in the gateway group: test group has been offline for 4 hours.  

### 检测 CPU 核心超出配额  

如果所有网关组的 CPU 核心使用量连续七天超过许可的 CPU 核心限制，将限制资源的新增或修改。但现有服务和路由可以继续正常运行。  

设置每小时任务检测生产环境的所有网关组，并在出现问题时向紧急团队发送电子邮件告警和 Slack 通知。  

1. 从侧边导航栏选择 **告警**，然后点击 **策略**。  
2. 点击 **新增告警策略**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `CPU 核心超出 License 限制`。  
   * 在 **告警等级** 字段中选择 `高`。  
   * 在 **检查间隔** 字段中输入 `60` 分钟。  
   * 在 **条件** 字段中执行以下操作：  
     * 在 **条件类型** 字段中选择 `满足下列所有条件 (且)`。  
     * 在 **事件** 字段中选择 `CPU 核心数超出 License 限制`。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `邮箱`。  
     * 在 **联系人** 字段中选择 `应急团队邮箱列表`。  
     * 在 **告警邮件主题** 字段中输入：  
       ```text  
       [API7 Alert] CPU 核心数超出限额
       ```  
     * 在 **告警邮件内容** 字段中输入：  
       ```text  
       Alert Time: {{.AlertTime.Format "2006 Jan 02 15:04:05"}}, Detail:{{.AlertDetail}}.  
       ```  
     * 点击 **新增**。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `Webhook`。  
     * 在 **联系人** 字段中选择 `Slack 通知`。  
     * 在 **告警消息** 字段中输入：  
       ```json  
       "text": "{{.AlertDetail}}"  
       ```  
     * 点击 **新增**。  
5. 点击 **新增**。  

#### 验证  

假设您的 API7 企业版 许可证限制为 100 个 CPU 核心。在 2024-12-31 17:00:00，告警策略将触发：  

1. 一封电子邮件，内容如下：  
   ```text  
   * 主题: [API7 Alert]CPU 核心数超出限额  
   * 告警时间: 2024 DEC 31 17:00:00, 详情: Total CPU usage 110c has exceeded the allowed license CPU quota 100c.  
   ```  

2. Slack 中的一条消息：  
   ```text  
   Total CPU usage 110c has exceeded the allowed license CPU quota 100c.  
   ```  

3. 告警历史记录。从侧边导航栏选择 **告警**，然后点击 **历史** 查看记录。  
4. 记录详情。点击 **详情** 可以看到：  
   * 告警策略: CPU 核心数超出限额 
   * 告警等级: 高  
   * 告警时间: 5 分钟前  
   * 告警详情: Total CPU usage 110c has exceeded the allowed license CPU quota 100c.  

## 更多告警策略实例  

### 监控 SSL 证书过期  

为了主动监控并提醒即将过期的 SSL 证书，可以设置每日任务检查证书过期时间。如果证书即将过期（30 天内），则向紧急团队发送电子邮件告警，并在 Slack 中发布通知。  

1. 从侧边导航栏选择 **告警**，然后点击 **策略**。  
2. 点击 **新增告警策略**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `SSL/CA 证书过期`。  
   * 在 **告警等级** 字段中选择 `中`。  
   * 在 **检查间隔** 字段中输入 `1440` 分钟。  
   * 在 **条件** 字段中执行以下操作：  
     * 在 **条件类型** 字段中选择 `满足下列所有条件 (且)`。  
     * 在 **事件** 字段中选择 `SSL 证书即将过期`。  
     * 在 **触发网关组** 字段中选择 `选择全部`。  
     * 在 **规则** 字段中填写 `SSL/CA 证书将在 30 天后到期`。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `邮箱`。  
     * 在 **联系人** 字段中选择 `应急团队邮箱列表`。  
     * 在 **告警邮件主题** 字段中输入：  
       ```text  
       [API7 Alert] SSL 证书过期告警  
       ```  
     * 在 **告警邮件内容** 字段中输入：  
       ```text  
       Alert Time: {{.AlertTime.Format "2006 Jan 02 15:04:05"}}, Detail:{{.AlertDetail}}.  
       ```  
     * 点击 **新增**。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `Webhook`。  
     * 在 **联系人** 字段中选择 `Slack 通知`。  
     * 在 **告警消息** 字段中输入：  
       ```json  
       "text": "{{.AlertDetail}}."  
       ```  
     * 点击 **新增**。  
5. 点击 **新增**。  

#### 验证  

假设 SSL 证书将于 2024-12-31 过期。在 2024-12-10，告警策略将触发：  

1. 一封电子邮件，内容如下：  
   ```text  
   * 主题: [API7 Alert] SSL 证书过期告警
   * 告警时间: 2024 DEC 10 17:00:00, 详情: SSL Certificate: sslcert123 in gateway group: 生产网关组 expires in 21 days.  
   ```  

2. Slack 中的一条消息：  
   ```text  
   SSL Certificate: sslcert123 in gateway group: 生产网关组 will expire in 21 days.  
   ```  

3. 告警历史记录。从侧边导航栏选择 **告警**，然后点击 **历史** 查看记录。  
4. 记录详情。点击 **详情** 可以看到：  
   * 告警策略: SSL/CA 证书过期  
   * 告警等级: 中  
   * 告警时间: 5 分钟前  
   * 触发网关组: 生产网关组  
   * 告警详情: SSL Certificate: sslcert123 in gateway group: 生产网关组 expires in 21 days.  

### 统计网关组中的健康网关实例数量  

如果网关组中的健康网关实例数量低于关键阈值，则表明可能存在服务中断和流量处理影响。这种情况在 Kubernetes 部署中尤为常见，因为网关实例可能会意外失败或缩减。  

设置高频任务检测问题，并在出现问题时向紧急团队发送电子邮件告警和 Slack 通知。  

1. 从侧边导航栏选择 **告警**，然后点击 **策略**。  
2. 点击 **新增告警策略**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `生产网关组中健康网关实例数量不足`。  
   * 在 **告警等级** 字段中选择 `中`。  
   * 在 **检查间隔** 字段中输入 `30` 分钟。  
   * 在 **触发网关组** 字段中选择 `生产网关组`。  
   * 在 **条件** 字段中执行以下操作：  
     * 在 **条件类型** 字段中选择 `满足下列所有条件 (且)`。  
     * 在 **事件** 字段中选择 `健康网关实例数量的数量`。  
     * 在 **规则** 字段中填写 `生产网关组中健康网关实例数量小于 50`。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `邮箱`。  
     * 在 **联系人** 字段中选择 `应急团队邮箱列表`。  
     * 在 **告警邮件主题** 字段中输入：  
       ```text  
       [API7 Alert] 生产网关组中健康网关实例数量不足  
       ```  
     * 在 **告警邮件内容** 字段中输入：  
       ```text  
       Alert Time: {{.AlertTime.Format "2006 Jan 02 15:04:05"}}, Detail:{{.AlertDetail}}.  
       ```  
     * 点击 **新增**。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `Webhook`。  
     * 在 **联系人** 字段中选择 `Slack 通知`。  
     * 在 **告警消息** 字段中输入：  
       ```json  
       "text": "{{.AlertDetail}}"  
       ```  
     * 点击 **新增**。  
5. 点击 **新增**。  

#### 验证  

假设您的网关组需要至少 50 个健康网关实例。然而，截至 2024-12-31，只有 40 个实例在运行。这种健康实例严重不足的情况可能导致服务降级和潜在中断，需要立即关注。  

1. 一封电子邮件，内容如下：  
   ```text  
   * 主题: [API7 Alert] 生产网关组中健康网关实例数量不足  
   * 告警时间: 2024 DEC 31 17:00:00, 详情: The number of healthy gateway instances 40 in gateway group: 生产网关组 is less than the minimum requirement of 50.  
   ```  

2. Slack 中的一条消息：  
   ```text  
   The number of healthy gateway instances 40 in gateway group: 生产网关组 is less than the minimum requirement of 50.  
   ```  

3. 告警历史记录。从侧边导航栏选择 **告警**，然后点击 **历史** 查看记录。  
4. 记录详情。点击 **详情** 可以看到：  
   * 告警策略: 生产网关组中健康网关实例数量不足  
   * 告警等级: 中  
   * 告警时间: 5 分钟前  
   * 触发网关组: 生产网关组  
   * 告警详情: The number of healthy gateway instances 40 in gateway group: 生产网关组 is less than the minimum requirement of 50.  

### 监控状态码  

如果特定 API 响应状态码的数量超过阈值（例如过多的 500 错误），则表明可能存在服务中断和流量处理影响。  

设置高频任务检测问题，并在出现问题时向紧急团队发送电子邮件告警和 Slack 通知。  

1. 从侧边导航栏选择 **告警**，然后点击 **策略**。  
2. 点击 **新增告警策略**。  
3. 在对话框中执行以下操作：  
   * 在 **名称** 字段中输入 `生产网关组中过多 500 状态码`。  
   * 在 **告警等级** 字段中选择 `中`。  
   * 在 **检查间隔** 字段中输入 `30` 分钟。  
   * 在 **触发网关组** 字段中选择 `标签匹配`，然后输入键/值 `envType: production`。  
   * 在 **条件** 字段中执行以下操作：  
     * 在 **条件类型** 字段中选择 `满足下列任一条件 (或)`。  
     * 在 **事件** 字段中选择 `状态码 500 的数量`。  
     * 在 **规则** 字段中填写 `网关组的所有已发布服务收到的状态码为 500 的请求数量超过 100 次`。  
   * 点击 **Add Condition**。  
   * 在 **条件** 字段中执行以下操作：  
     * 在 **事件** 字段中选择 `状态码 500 的请求比例`。  
     * 在 **规则** 字段中填写 `网关组的所有已发布服务收到的状态码为 500 的请求比例超过 10%`。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `邮箱`。  
     * 在 **联系人** 字段中选择 `应急团队邮箱列表`。  
     * 在 **告警邮件主题** 字段中输入：  
       ```text  
       [API7 Alert] 生产网关组中过多 500 状态码  
       ```  
     * 在 **告警邮件内容** 字段中输入：  
       ```text  
       Alert Time: {{.AlertTime.Format "2006 Jan 02 15:04:05"}}, Detail:{{.AlertDetail}}.  
       ```  
     * 点击 **新增**。  
   * 点击 **添加通知**。  
   * 在对话框中执行以下操作：  
     * 在 **类型** 字段中选择 `Webhook`。  
     * 在 **联系人** 字段中选择 `Slack 通知`。  
     * 在 **告警消息** 字段中输入：  
       ```json  
       "text": "{{.AlertDetail}}"  
       ```  
     * 点击 **新增**。  
5. 点击 **新增**。  

#### 验证  

假设您的网关组 `VIP Group` 有一个标签 `envType:production`，在 2024 年 12 月 31 日 16:00 至 17:00 期间有 15% 的请求错误率。在 1000 次请求中，有 150 次返回 500 错误。  
网关组 `US Group` 有一个标签 `envType:production`，在 2024 年 12 月 31 日 16:00 至 17:00 期间有 10% 的请求错误率。在 500 次请求中，有 50 次返回 500 错误。  

1. 一封电子邮件，内容如下：  
   ```text  
   * 主题: [API7 Alert] [API7 Alert] 生产网关组中过多 500 状态码
   * 告警时间: 2024 DEC 31 17:00:00, 详情: The number of 500 status code requests received by all published services in gateway group: VIP Group exceeded the threshold of 100 with a count of 150 in the last 60 minutes. Details: 100 requests for get-ip-route within httpbin-service, 40 requests for get-address-route within httpbin-service, and 10 unmatched requests.  
   500 status code request ratio for gateway group: VIP Group was 15% in the last 60 minutes (Total requests: 1000). Details: 100 requests (10%) for get-ip-route in httpbin-service, 40 requests (4%) for get-address-route in httpbin-service, and 10 (1%) for unmatched requests.  
   500 status code request ratio for gateway group: US Group was 10% in the last 60 minutes (Total requests: 500). Details: 100 requests (10%) for get-ip-route in httpbin-service.  
   ```  

2. Slack 中的一条消息：  
   ```text  
   The number of 500 status code requests received by all published services in gateway group: VIP Group exceeded the threshold of 100 with a count of 150 in the last 60 minutes. Details: 100 requests for get-ip-route within httpbin-service, 40 requests for get-address-route within httpbin-service, and 10 unmatched requests.  
   500 status code request ratio for gateway group: VIP Group was 15% in the last 60 minutes (Total requests: 1000). Details: 100 requests (10%) for get-ip-route in httpbin-service, 40 requests (4%) for get-address-route in httpbin-service, and 10 (1%) for unmatched requests.  
   500 status code request ratio for gateway group: US Group was 10% in the last 60 minutes (Total requests: 500). Details: 100 requests (10%) for get-ip-route in httpbin-service.  
   ```  

3. 告警历史记录。从侧边导航栏选择 **告警**，然后点击 **历史** 查看记录。  
4. 记录详情。点击 **详情** 可以看到：  
   * 告警策略: 生产网关组中过多 500 状态码  
   * 告警等级: 中  
   * 告警时间: 5 分钟前  
   * 触发网关组: VIP Group  
   * 告警详情: The number of 500 status code requests received by all published services in gateway group: VIP Group exceeded the threshold of 100 with a count of 150 in the last 60 minutes. Details: 100 requests for get-ip-route within httpbin-service, 40 requests for get-address-route within httpbin-service, and 10 unmatched requests.  
   500 status code request ratio for gateway group: VIP Group was 15% in the last 60 minutes (Total requests: 1000). Details: 100 requests (10%) for get-ip-route in httpbin-service, 40 requests (4%) for get-address-route in httpbin-service, and 10 (1%) for unmatched requests.  
   500 status code request ratio for gateway group: US Group was 10% in the last 60 minutes (Total requests: 500). Details: 100 requests (10%) for get-ip-route in httpbin-service.  

## 其他资源  

* 参考  
  * [告警模板](../reference/alert-template.md)