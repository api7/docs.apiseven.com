---
title: 通知模板
slug: /user-manual/cluster/notice
tags:
  - API7 Enterprise
---

## 新建通知模板

当告警策略被触发时，通过指定渠道发送通知内容。

- 需要先准备好被通知方的 webhook，或选择 syslog 通知方式。
- 在集群菜单中创建的通知模板，不能被工作分区中的告警策略引用。
- 在工作分区中创建的通知模板，不能被集群中的告警策略引用。

1. 登录 API7 Enterprise 控制台。
2. 在顶部导航菜单，点击 **集群管理** 。
3. 在左侧菜单，点击 **集群列表** 。
4. 点击对应集群的 **访问** 按钮。
5. 如果需要使用此通知模板的告警策略是整个集群（集群内所有 API，及数据面节点）级别的，在左侧菜单，点击 **告警管理-通知模板**，跳过步骤6~8.
6. 在左侧菜单，点击 **工作分区** 。
7. 点击对应工作分区的 **访问** 按钮。
8. 在左侧菜单，点击 **告警管理-通知模板**。
9. 点击 **新建** 按钮。
10. 填写表单。
11. 点击 **提交** 按钮。

:::caution

告警策略如果未配置通知模板，只能在告警历史中看到触发记录，无法及时获得通知。

:::

## 配置通知模板

修改通知模板的属性。配置成功后，直到下一个告警检查周期，才会按新的配置生效。正在进行中的告警任务不会被打断会修改。

1. 登录 API7 Enterprise 控制台。
2. 在顶部导航菜单，点击 **集群管理** 。
3. 在左侧菜单，点击 **集群列表** 。
4. 点击对应集群的 **访问** 按钮。
5. 如果需要使用此通知模板的告警策略是整个集群（集群内所有 API，及数据面节点）级别的，在左侧菜单，点击 **告警管理-通知模板**，跳过步骤6~8.
6. 在左侧菜单，点击 **工作分区** 。
7. 点击对应工作分区的 **访问** 按钮。
8. 在左侧菜单，点击 **告警管理-通知模板**。
9. 点击 **新建** 按钮。
8. 点击对应通知模板的 **配置** 按钮。
9. 编辑通知模板的属性。
10. 点击 **提交** 按钮。

## 删除通知模板

永久停用通知模板并删除记录。有告警策略引用此通知模板时不可删除。

1. 登录 API7 Enterprise 控制台。
2. 在顶部导航菜单，点击 **集群管理** 。
3. 在左侧菜单，点击 **集群列表** 。
4. 点击对应集群的 **访问** 按钮。
5. 如果需要使用此通知模板的告警策略是整个集群（集群内所有 API，及数据面节点）级别的，在左侧菜单，点击 **告警管理-告警策略** ，跳过步骤6~8.
6. 在左侧菜单，点击 **工作分区** 。
7. 点击对应工作分区的 **访问** 按钮。
8. 在左侧菜单，点击 **告警管理-告警策略** 。
9. 点击对应通知模板的 **删除** 按钮。
10. 点击 **确认** 按钮。