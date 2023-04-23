---
title: 全局插件
slug: /user-manual/cluster/global-plugin
tags:
  - API7 Enterprise
---

## 启用全局插件
#### 使用场景

当前工作分区中已有的和未来新增的所有路由/ API，都需要共享同一份插件配置。常见的有身份认证插件、安全类插件等。为避免重复配置、漏配错配或配置不统一，可以通过全局插件来进行配置和管理。

#### 使用限制

1. 如果已经在全局插件中启用了某个插件，又在路由/ API 上重复配置了同一个插件，则全局插件中的配置更优先。

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`全局插件`。

**步骤8**： 点击`启用`按钮。

**步骤9**： 选择需要启用的插件，点击对应的`启用`按钮。

**步骤10**： 在`插件配置`表单中，打开`启用`开关。

**步骤11**： 在`配置Raw Data`中，编辑插件的参数。（可选，部分插件无需配置任何参数即可使用）。

**步骤12**： 点击`提交`按钮。

**步骤13**： 可按需要启用多个插件。

**步骤14**： 全部插件启用完毕后，点击`提交`按钮。

**验证方式**：此工作分区下所有路由/API 可以验证已经生效全局插件。

## 配置全局插件
#### 使用场景

编辑插全局插件中启用的插件及其参数。

#### 使用限制

1. 此工作分区下所有路由/API 会动态加载生效编辑后的全局插件，影响所有关联的路由/ API 业务逻辑。

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`全局插件`。

**步骤8**： 点击对应插件的`配置`按钮。

**步骤9**： 在`配置Raw Data`中，编辑插件的参数。（可选，部分插件无需配置任何参数即可使用）。

**步骤10**： 点击`提交`按钮。

**验证方式**：此工作分区下所有路由/API 可以验证插件效果已变更。

## 删除全局插件
#### 使用场景

不再使用全局插件。

#### 使用限制

1. 删除后不可恢复，请谨慎操作。

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`全局插件`。

**步骤8**： 点击对应插件的`删除`按钮。

**步骤9**： 确认后点击`确认`按钮。

**验证方式**：全局插件列表中已经没有已删除的全局插件，同时该工作分区下所有路由/ API 不再有已删除的全局插件的效果。