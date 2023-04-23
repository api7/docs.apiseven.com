---
title: API 管理
slug: /user-manual/cluster/api
tags:
  - API7 Enterprise
---

## 新建 API
#### 使用场景

创建一条路由并作为对外的一个 API。

#### 使用限制

1. 每个路由/API 必须选择一个上游，不允许为空。
2. 一个上游可以被搭配多个路由/ API。
3. API 不发布上线，则无法调用。
4. 如果消费者和路由/ API 中都配置了同一个插件，则路由/ API 中的插件配置更优先。

#### 操作步骤

**步骤1**：登录 API7 Enterprise 控制台。

**步骤2**： 如果还未准备好上游，请先参考对应文档[新建上游](https://docs.apiseven.com/enterprise/cluster/upstream#新建上游)。

**步骤3**：在顶部导航菜单，点击`集群管理`。

**步骤4**：在左侧菜单，点击`集群列表`。

**步骤5**：点击对应集群的`访问`按钮。

**步骤6**：在左侧菜单，点击`工作分区`。

**步骤7**：点击对应工作分区的`访问`按钮。

**步骤8**：在左侧菜单，点击`API 管理-API 列表`。

**步骤9**：点击`新建`按钮。

**步骤10**：根据[名词解释](https://docs.apiseven.com/enterprise/background-information/glossary#%E4%B8%8A%E6%B8%B8)，填写表单；

**步骤11**：点击`提交`按钮。

**验证方式**：在 API 列表中，可以看到新的 API 记录。如果 API 发布上线，可以被成功调用。

## 配置 API
#### 使用场景

编辑 API 的属性。

#### 使用限制

1. API 上线属性不支持编辑。
2. 不建议直接修改状态为”已发布“的 API。

#### 操作步骤

**步骤1**：登录 API7 Enterprise 控制台。

**步骤2**：在顶部导航菜单，点击`集群管理`。

**步骤3**：在左侧菜单，点击`集群列表`。

**步骤4**：点击对应集群的`访问`按钮。

**步骤5**：在左侧菜单，点击`工作分区`。

**步骤6**：点击对应工作分区的`访问`按钮。

**步骤7**：在左侧菜单，点击`API 管理-API列表`。

**步骤8**：点击对应 API 的`配置`按钮，或者点击对应 API 的`更多`下拉菜单，然后点击`配置 Raw data`。

**步骤9**：编辑 API 的属性。

**步骤10**：点击`提交`按钮。

**验证方式**：API 的业务逻辑随之变化。

## 删除 API
#### 使用场景

API 永久下线，不再使用。

#### 使用限制

1. 删除后不可恢复，请谨慎操作。
2. 建议先下线 API，确认对业务无损后，再删除。

#### 操作步骤

**步骤1**：登录 API7 Enterprise 控制台。

**步骤2**：在顶部导航菜单，点击`集群管理`。

**步骤3**：在左侧菜单，点击`集群列表`。

**步骤4**：点击对应集群的`访问`按钮。

**步骤5**：在左侧菜单，点击`工作分区`。

**步骤6**：点击对应工作分区的`访问`按钮。

**步骤7**：在左侧菜单，点击`API 管理-API 列表`。

**步骤8**：点击对应 API 的`更多`下拉菜单，然后点击`删除`。

**验证方式**：在 API 列表中，已看不到被删除的 API，且此 API 无法再被调用。

## 复制 API
#### 使用场景

快速创建一个与已有 API 相似的新 API，减少重复配置工作量。

#### 使用限制

复制 API 并不会立刻生成一个已发布的 API，只是会使用已有 API 的配置作为预输入。

#### 操作步骤

**步骤1**：登录 API7 Enterprise 控制台。

**步骤2**：在顶部导航菜单，点击`集群管理`。

**步骤3**：在左侧菜单，点击`集群列表`。

**步骤4**：点击对应集群的`访问`按钮。

**步骤5**：在左侧菜单，点击`工作分区`。

**步骤6**：点击对应工作分区的`访问`按钮。

**步骤7**：在左侧菜单，点击`API 管理-API 列表`。

**步骤8**：点击对应 API 的`更多`下拉菜单，然后点击`复制`。

**步骤9**：编辑 API 的属性。

**步骤10**：点击`提交`按钮。

**验证方式**：在 API 列表中，可以看到新增的 API 记录。

## API 下线
#### 使用场景

API 临时下线，保留配置数据但不可被调用。

#### 使用限制

仅状态为”已发布“的 API 可以执行此操作。

#### 操作步骤

**步骤1**：登录 API7 Enterprise 控制台。

**步骤2**：在顶部导航菜单，点击`集群管理`。

**步骤3**：在左侧菜单，点击`集群列表`。

**步骤4**：点击对应集群的`访问`按钮。

**步骤5**：在左侧菜单，点击`工作分区`。

**步骤6**：点击对应工作分区的`访问`按钮。

**步骤7**：在左侧菜单，点击`API 管理-API 列表`。

**步骤8**：点击对应 API 的`更多`下拉菜单，然后点击`下线`。

**验证方式**：在 API 列表中，此 API 的状态变为”未发布“，且此 API 无法再被调用。

## API 上线
#### 使用场景

API 临时下线，保留配置数据但不可被调用。

#### 使用限制

仅状态为”未发布“的 API 可以执行此操作。

#### 操作步骤

**步骤1**：登录 API7 Enterprise 控制台。

**步骤2**：在顶部导航菜单，点击`集群管理`。

**步骤3**：在左侧菜单，点击`集群列表`。

**步骤4**：点击对应集群的`访问`按钮。

**步骤5**：在左侧菜单，点击`工作分区`。

**步骤6**：点击对应工作分区的`访问`按钮。

**步骤7**：在左侧菜单，点击`API 管理-API 列表`。

**步骤8**：点击对应 API 的`更多`下拉菜单，然后点击`API 上线`。

**验证方式**：在 API 列表中，此 API 的状态变为”已发布“，且此 API 可以被正常调用。