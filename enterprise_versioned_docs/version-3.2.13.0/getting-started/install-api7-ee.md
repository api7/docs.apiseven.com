---
title: 安装指南
slug: /getting-started/install-api7-ee
---

本教程将指导你使用快速入门脚本在 Docker 中安装 API7 企业版。

安装将包括 [API7 企业版组件](../introduction/api7-ee-architecture.md): 数据面、控制面、控制台以及用于管理配置和监控的外部组件 PostgreSQL 和 Prometheus。

:::tip

本教程提供了一个包含 PostgreSQL 和 Prometheus 的容器化一体式解决方案，用于概念验证 (PoC) 测试。这省去了手动数据库和监控设置的需要，简化了你的 PoC 流程。

对于生产环境部署，API7 企业版还支持 MySQL 和 OceanBase 来代替 PostgreSQL。请[联系 API7 专家](https://api7.ai/contact)获取高可用性和可扩展性解决方案。

:::

## 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install) 。建议使用3.10.0-927或更高版本。已知3.10.0-327或更早版本不兼容。
- 安装 [cURL](https://curl.se/)。
- 获取为期 30 天的[免费试用许可证](https://api7.ai/try?product=enterprise)。
- 操作系统：建议使用 Linux CentOS 7.6 或更高版本。已知 Linux CentOS 7.2 或更早版本不兼容。

## 安装 API7 企业版

```bash
curl -sL "https://run.api7.ai/api7/quickstart" | bash
```

你应该看到如下类似响应：

```bash
✔ Container api7-ee-postgresql
✔ Container api7-ee-prometheus
✔ Container api7-ee-api7-ee-dashboard
✔ Container api7-ee-api7-ee-dp-manager
✔ Container api7-ee-api7-ee-gateway
...
✔ API7-EE is ready!

API7-EE Listening: Dashboard(https://192.168.2.102:7443), Control Plane Address(http://192.168.2.102:7900, https://192.168.2.102:7943), Gateway(http://192.168.2.102:9080, https://192.168.2.102:9443)
API7-EE Listening: Dashboard(https://26.26.26.1:7443), Control Plane Address(http://26.26.26.1:7900, https://26.26.26.1:7943), Gateway(http://26.26.26.1:9080, https://26.26.26.1:9443)
If you want to access Dashboard with HTTP Endpoint(:7080), you can turn server.listen.disable to false in dashboard_conf/conf.yaml, then restart dashboard container
```

## 激活 API7 企业版

1. 访问 API7 企业版控制台`https://{your_inet_ip_addr}:7443`，使用默认用户名 `admin` 和密码 `admin` 登录。

:::info

你也可以通过 `https://localhost:7443/login` 访问控制台。然而，控制台中后续生成的部署脚本将默认使用 `localhost` 作为 IP 地址，这可能导致连接问题，例如在 Kubernetes 上部署 API7 网关和 Ingress Controller 时。

:::

2. 选择要上传的许可证，然后单击**上传**激活 API7 企业版。

## 终止 API7 企业版

如果已完成 API7 企业版的测试，可以在 `api7-ee` 目录下使用以下命令终止 API7 企业版：

```bash
bash run.sh stop
```

## 后续步骤

1. 如果你想在 Kubernetes 上部署 API7 网关并使用 Ingress Controller，请参阅[在 Kubernetes 上部署网关和 Ingress Controller](kubernetes-api7-ingress-controller.md)。
2. 按照"快速入门"了解更多关于使用 API7 企业版的信息。
3. 了解 API7 企业版[高可用部署](../high-availability/overview.md)。
4. [预约与 API7 专家会面](https://api7.ai/contact)，开始在生产环境中使用 API7 企业版。
