---
title: 转发四层流量
slug: /getting-started/proxy-l4-traffic
---

API7 网关同时支持处理传输层（四层）流量，通常是 TCP 或者 UDP 流量。可用于纯四层流量转发，或同时转发四层及七层流量。

这篇操作指南以和 MySQL 服务器建立连接为例，描述了如何配置[四层路由（Stream Route）](../key-concepts/stream-routes.md)来进行四层流量的转发。

## 前提条件

1. [安装 API7 企业版](./install-api7-ee.md)。
2. 获取一个拥有**超级管理员**或者**API 提供者**角色的用户账号。
3. 将默认网关组重命名为`测试网关组`并配置网络。该网关组将作为测试环境的 API 网关。
4. [在网关组中至少新增一个网关实例](add-gateway-instance.md)。
5. 准备好 MySQL 服务器。

## 启动 MySQL 服务器

启动一个 MySQL 实例作为上游服务的样例，并配置好根密码。例如：

```shell
docker run -d \
  --name mysql \
  --network=apisix-quickstart-net \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  mysql \
  mysqld --default-authentication-plugin=mysql_native_password
```

## 新增服务和四层路由

1. 从左侧导航栏选择**服务中心**，然后点击 **新增服务**。
2. 选择**手动新增**。
3. 在**新增服务**对话框中, 执行以下操作：
    - **名称**填写 `MySQL`。
    - **服务类型**选择`Stream(四层代理)`。
    - **上游 Scheme**使用默认值 `TCP`。
4. 点击**新增**。
5. 在服务详情页面中，点击**新增四层路由**。
6. 在**新增四层路由**对话框中，执行以下操作：
    - **路由名称**填写 `stream-route-mysql`。
    - **服务器地址**填写 `127.0.0.111`。
    - **服务器端口**填写 `2000`。 
7. 点击 **新增**。

## 使用上游节点发布服务

1. 从左侧导航栏中选择**服务中心**，然后选择 `MySQL` 服务。
2. 点击**立即发布**。
3. 选择 `测试网关组` 然后点击**下一步**。
4. 在**服务发布**对话框中，执行以下操作：
    - **新版本**填写 `1.0.0`。
    - **如何找到上游** 保持默认值 `使用上游节点`.
    - 点击**新增节点**。在对话框中，执行以下操作：
        - **主机**和**端口**填写你的 MySQL 服务器 IP 地址及`3306`。
        - **权重**使用默认值 `100`。
    - 点击**新增**。
5. 确认服务信息后，点击**发布**。

## 验证 MySQL 连接

连接 MySQL 服务器并使用 root 用户登录，根据提示输入密码：

```shell
mysql --host=127.0.0.1 --port=9100 -u root -p
```

你可以看到，请求被拒绝了：

```text
ERROR 2013 (HY000): Lost connection to MySQL server at 'reading initial communication packet', system error: 0
```

只有把四层路由中的匹配规则，改为`服务器地址` 和 `服务器端口` 分别为 `127.0.0.1` 和 `9100`，才能成功建立连接。
