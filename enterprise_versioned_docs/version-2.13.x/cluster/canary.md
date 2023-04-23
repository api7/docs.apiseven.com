---
title: 发布管理
slug: /cluster/canary
tags:
  - API7 Enterprise
---

## 什么是灰度发布

灰度发布又名金丝雀发布，是指在稳定的生产环境之外，额外部署一个小规模的灰度集群，通过控制流量的方式将部分流量在灰度集群进行验证。如果验证失败，可以立即将所有流量切换到稳定集群中；如果验证无异常，可以将流量全量发布到新的集群中，完成灰度发布任务。

## 新建发布管理
#### 使用场景

API 的后端服务更新时，在调用方无需调整配合的情况下，先用灰度发布的方式进行验证。

内部研发/测试人员先自测目标上游服务：使用`按规则`流量分配方式，自测调用时带上特定header/请求头/cookie，并定向转发到目标上游。
自测通过后正式上线前灰度测试：使用`按百分比`流量分配方式，逐步将目标上游服务比例从小增大，反复多次测试，验证目标上游服务稳定后，进行全量发布。

#### 使用限制

1. 必须先准备好新（目标上游）、旧（当前上游）两个上游。[了解如何新建上游](https://docs.apiseven.com/enterprise/cluster/upstream#%E6%96%B0%E5%BB%BA%E4%B8%8A%E6%B8%B8).

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`API 管理-发布管理`。

**步骤8**： 点击`新建`按钮。

 **步骤9**：根据[名词解释](https://docs.apiseven.com/enterprise/background-information/glossary#%E4%B8%8A%E6%B8%B8)，填写表单。

**步骤10**： 点击`提交`按钮。

**验证方式**：调用目标API，按照百分比有一定概率转发到目标上游服务。

## 配置发布管理
#### 使用场景

1. 新建发布管理并验证目标上游服务正常后，通过不断增加目标上游的百分比多次测试。
2. 通过修改参数，让带不同header/请求头/cookie的请求定向转发到目标上游。

#### 使用限制

1. 调整百分比/规则可反复进行多次，没有次数限制。
2. 可直接切换流量分配方式。
3. 如果使用`按规则`流量分配方式，但没有任何请求命中规则，则无法达到灰度发布效果。

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`API 管理-发布管理`。

**步骤8**： 修改发布管理的配置。

**步骤10**： 点击`提交`按钮。

**验证方式**：新的灰度发布规则生效，调用目标 API 效果改变。

## 取消任务
#### 使用场景

验证发现目标上游不符合预期或不稳定，放弃更新上游，目标 API 的所有请求仍然转发到当前上游。

#### 使用限制

1. 仅状态为”进行中“的任务可以被取消。
2. 取消成功的任务，无法再被恢复使用。

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`API 管理-发布管理`。

**步骤8**： 点击对应任务的`更多`下拉菜单，然后点击`取消任务`按钮。

**步骤9**： 点击`确认`按钮。

**验证方式**：访问目标 API，全部请求转发到当前上游。

## 删除任务
#### 使用场景

取消灰度发布任务，并删除任务记录。

#### 使用限制

状态为”进行中“和”已取消“的任务都可以被删除。

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`API 管理-发布管理`。

**步骤8**： 点击对应任务的`更多`下拉菜单，然后点击`删除`按钮。

**步骤9**： 点击`确认`按钮。

**验证方式**：访问目标 API，全部请求转发到当前上游。

## 全量发布
#### 使用场景

验证发现目标上游符合预期且运行稳定，将目标 API 的全部请求转发到目标上游，替换路由/ API 中的上游配置。

#### 使用限制

1. 仅状态为”进行中“的任务都可以被全量发布。

#### 操作步骤

**步骤1**： 登录 API7 Enterprise 控制台。

**步骤2**： 在顶部导航菜单，点击`集群管理`。

**步骤3**： 在左侧菜单，点击`集群列表`。

**步骤4**： 点击对应集群的`访问`按钮。

**步骤5**： 在左侧菜单，点击`工作分区`。

**步骤6**： 点击对应工作分区的`访问`按钮。

**步骤7**： 在左侧菜单，点击`API 管理-发布管理`。

**步骤8**： 点击对应任务的`更多`下拉菜单，然后点击`全量发布`按钮。

**步骤9**： 点击`确认`按钮。

**验证方式**：访问目标 API，全部请求转发到目前上游；跳转到目标 API 的详情中，上游已经更新为目标上游。
