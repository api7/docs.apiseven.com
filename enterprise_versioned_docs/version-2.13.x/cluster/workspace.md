---
title: 工作分区
slug: /cluster/workspace
tags:
  - API7 Enterprise
---

## 名词解释

### 工作分区名称
帮助用户识别不同工作分区。

### 主机名
对工作分区内所有路由/API的格式要求。

### 工作分区备注
对工作分区的进一步说明，通常包括用途定位、使用注意事项等。

### 更新时间
用户最后一次编辑工作分区信息的时间。只限通过”配置工作分区“操作了修改工作分区名称/备注/主机名等信息，不包括更新工作分区内资源的时间。

## 新建工作分区
### 使用场景
当需要隔离不同部门/组织的业务数据和使用习惯，但又不需要隔离底层网关资源（数据面/控制面/etcd）时，可以创建多个工作分区，由每个工作分区独立管理自己的上游、路由/API、消费者资源，并进行统一的主机名管理和插件配置。
### 使用限制
1. 集群发生故障时，集群内所有工作分区都将同等受到影响。
2. 同一集群下不同工作分区的主机名不可重复。
### 操作步骤
**步骤1**：访问【集群详情页】，在左侧点击「工作分区」菜单。

**步骤2**：点击「新建」按钮。

**步骤3**：根据名词解释，填写表单；

**步骤3**：点击「提交」按钮。

### 验证方式

在工作分区列表中，可以看到新的工作分区记录。

## 配置工作分区
### 使用场景
编辑工作分区的名称、备注、主机名。
### 使用限制
工作分区内已有路由/API时，无法修改主机名。
### 操作步骤

**步骤1**：点击对应工作分区的「配置」按钮。

**步骤2**：编辑工作分区的名称/备注/主机名。

**步骤3**：点击「提交」按钮。

### 验证方式
在工作分区列表中，可以看到工作分区的名称/备注/主机名已更新。

## 删除工作分区
### 使用场景
工作分区内所有业务下线，不再使用。
### 使用限制
必须先删除工作分区内所有路由/API。
### 操作步骤
**步骤1**:确认工作分区内所有路由/API已删除。

**步骤2**：点击对应工作集群的「删除」按钮。

**步骤3**：点击「确定」按钮。

### 验证方式
在工作分区列表中，已看不到被删除的工作分区。