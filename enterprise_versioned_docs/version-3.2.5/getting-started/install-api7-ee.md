---
title: 安装指南
slug: /getting-started/install-api7-ee
---

本文档介绍如何安装 API7 企业版。

## 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install) 。
- 安装 [cURL](https://curl.se/)。
- 获取为期 30 天的[免费试用许可证](https://api7.ai/try?product=enterprise)。

## 安装 API7 企业版

```bash
curl -sL "https://run.api7.ai/api7/quickstart" | bash
```

你应该看到以下响应：

```bash
✔ Container api7-ee-postgresql
✔ Container api7-ee-prometheus
✔ Container api7-ee-etcd
✔ Container api7-ee-keycloak
✔ Container api7-ee-api7-ee-dashboard
✔ Container api7-ee-api7-ee-dp-manager
✔ Container api7-ee-api7-ee-gateway
...
✔ API7-EE is ready!
```

## 激活 API7 企业版

1. 访问API7 控制面板 `http://{本机地址}:7080`。使用默认用户名 `admin` 和密码 `admin` 登录。

2. 选择要上传的许可证，然后单击**上传**激活 API7 企业版。

## 下一步

如果您对 API7 企业版感兴趣，请与我们的专家[预约会面](https://api7.ai/contact)。
