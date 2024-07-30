---
title: 使用网关组在多环境中发布服务
slug: /best-practices/publish-services-in-multi-environments
---

[网关组](../key-concepts/gateway-groups.md)是一个由一个或多个共享相同配置的网关实例组成的逻辑分组，这些网关实例在处理 API 请求时表现一致。用户可以为网关组命名，并为其添加标签，以此来区分和管理不同的环境和集群。

API7 企业版支持 API 网关和 Ingress Controller 两种类型的网关组管理，能帮助企业进行环境和集群的隔离，多区域多集群管理，以及根据业务线实现服务级别目标管理。

这篇指南将向您展示如何通过网关组实现发布服务在 Test、UAT、 Prod 三个环境中的迁移。

## 背景介绍

为确保服务稳定、合规及数据安全，服务的上线经历多个环境，包括测试环境、UAT 环境和生产环境。研发人员需要部署 3 套独立的 API7 企业版，开发工程师、QA 工程师和运维工程师需要分别登录不同域名下的 API7 企业版控制台，对同一个 API 进行开发、测试和上线，在业务线非常多的情况下，会浪费大量机器和管理资源。

API7 企业版的网关组功能为研发人员提供了一个统一的入口，避免在多控制台中切换，可以实现简单便捷的发布操作，从而提高工作效率并减少操作错误。

![Multi-Environment Service Publishing](https://static.apiseven.com/uploads/2024/07/08/uxX5p7xl_multi-environment%20release.PNG)

## 前提条件

1. [安装 API7 企业版](../getting-started/install-api7-ee.md)。

2. 准备好服务在三个环境内的不同域名：`test.acme.com`、`uat.acme.com`、`prod.acme.com`。

## 实施步骤

### 创建网关组

1. 参考[新增网关组](../getting-started/add-gateway-group.md)文档，创建 Test、UAT、 Prod 三个网关组。

2. 在 API7 企业版 Dashboard 的组织板块，为每个研发用户分配明确的角色，并通过访问控制列表（ACL）中为每个角色定义精细的访问权限，进行细粒度的访问控制。

### 部署到测试环境

1. 确保测试环境已配置好， upstream 地址指向 `http://test-backend-1`，指向测试环境的后端服务集群。

2. 通过自动化脚本或手动操作，将打包好的 UserService 应用部署到测试环境的服务器上。

3. 在 Test 网关组内创建服务，在同一个无版本服务版本上反复调试。模拟真实用户场景，进行功能测试、性能测试和安全测试。

4. 在测试环境中运行自动化测试套件，包括单元测试和集成测试，验证 UserService 是否按预期工作。

### 用户验收测试（UAT）

1. 准备 UAT 环境， upstream 地址配置为负载均衡器地址 `http://uat-backend-pool`，背后连接多台 UAT 环境的后端服务器。

2. UserService 服务调试完成后[将当前服务版本同步到 UAT 网关组](../getting-started/sync-service.md)，同时变更域名为：`uat.acme.com`。

3. 在 UAT 网关组中，配置网关组的安全策略和合规性检查功能，如开启[日志审计](../api-observability/logging.md)。

4. 邀请业务用户或 QA 团队进行 UAT 测试，验证 UserService 是否满足业务需求。

5. 收集用户反馈，并根据反馈进行必要的调整。

### 部署到生产环境

1. 确保生产环境已准备好， upstream 地址配置为生产环境的虚拟 IP 地址 `http://prod-backend-vip`，背后是高性能的服务器集群。

2. UserService 服务调试完成后[将当前版本同步到 Prod 网关组](../getting-started/sync-service.md)，同时变更域名为：`prod.acme.com`。

3. 在 Prod 网关组中，启用 `prometheus` 插件作为全局规则，进行 [API 指标监控](../api-observability/logging.md)，确保所有服务和路线都得到一致的监控和跟踪，实时跟踪 UserService 的性能和稳定性。

4. 制定详细的回滚计划，包括回滚步骤、所需时间、责任人等，在必要进行回滚的时候，回滚已发布的服务版本。

5. 定期审查和分析 UserService 的日志，进行日志管理，以发现潜在的问题和改进点。

## 结论

原本需要部署成套的控制面和数据面，现在通过在 API7 企业版的 Dashboard 上创建网关组进行区分，即可实现物理和逻辑上的隔离，能确保服务迁移过程的安全、可控和高效，减少服务中断的风险。同时，通过灵活的路由规则调整，能够实现对服务版本的快速切换和回滚。
