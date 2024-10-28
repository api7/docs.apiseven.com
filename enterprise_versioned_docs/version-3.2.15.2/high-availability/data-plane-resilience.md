---
title: 实现数据面弹性
slug: /high-availability/cp-outage-dp-resilience
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

弹性是指系统承受和从故障、中断或意外事件中恢复的能力。

在本文档中，你将学习为什么你应该在 API7 中考虑数据面 (DP) 弹性模式以及如何实现它，以便当控制面 (CP) 不可用时，DP 实例仍然可以正常运行。这可以帮助你制定灾难恢复计划，并在控制面 (CP) 不可用时快速恢复关键任务功能，从而确保系统的高可用性。

## 为什么考虑 DP 弹性

DP 可能会遇到连接 CP 的问题。以下是一些可能的原因：

* DP 和 CP 实例之间的网络连接不良
* CP 数据库崩溃
* CP 升级
* CP 主机上的资源争用
* CP 主机硬件故障

## DP 弹性模式

API7 企业版支持将 CP 配置为定期将配置转储到 AWS S3 存储桶，以便在 CP 发生故障时，DP 可以以独立模式启动，并从存储中提取最新的网关配置以继续代理请求。

![解决方案图](https://static.apiseven.com/uploads/2024/07/01/yAwwzGkt_dp-resilience.png)

CP 恢复后，DP 应继续从 CP 获取配置。

## 实现 DP 弹性

### 前提条件

* [安装 API7 企业版](../getting-started/install-api7-ee.md)。
* 如果你想在 Kubernetes 上部署资源，请完成[在 Kubernetes 上使用 API7 Ingress Controller 进行部署](../deployment/ingress-controller.md)。
* 完成[启动示例上游服务](../getting-started/launch-your-first-api.md#start-a-sample-upstream-service)和[创建服务和路由](../getting-started/launch-your-first-api.md#create-service-and-route)。

### 配置 AWS 资源

1. 创建一个 AWS 账户并以 IAM 用户身份登录。
2. 创建[两个 S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html)，一个用于网关实例配置，例如密钥环和发现；另一个用于网关资源配置，例如路由和服务。
3. 获取 [IAM 用户访问密钥和秘密访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)。
4. 将[允许对 S3 存储桶中的对象进行读写访问的策略](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html)附加到 IAM 用户。

### 将 CP 配置为备份配置

在你运行[快速入门命令安装 API7 企业版](../getting-started/install-api7-ee.md#install-api7-enterprise)的工作目录中，你应该找到一个 `api7-ee` 目录，其中包含 `docker-compose.yaml` 和各种服务配置文件。

将 `fallback_cp` 配置添加到控制台配置文件：

```yaml title="api7-ee/dashboard_conf/conf.yaml"
# highlight-start
fallback_cp:
  aws_s3:
    // 注释 1
    access_key: your-aws-iam-access-key
    // 注释 2
    region: ap-south-1
    // 注释 3
    config_bucket: bucket-to-push-config-data
    // 注释 4
    resource_bucket: bucket-to-push-resource-data
    // 注释 5
    secret_key: your-aws-iam-secret-access-key
  // 注释 6
  cron_spec: '@every 1m'
# highlight-end
```

❶ 替换为你的 AWS IAM 用户访问密钥。

❷ 替换为你的 AWS 区域。

❸ 替换为你的 S3 存储桶名称，应将实例配置详细信息（例如密钥环和发现）推送到该存储桶。

❹ 替换为你的 S3 存储桶名称，应将 APISIX 资源配置（例如路由和服务）推送到该存储桶。

❺ 替换为你的 AWS IAM 用户秘密访问密钥。

❻ 将推送到 S3 存储桶的频率配置为每分钟一次。

重新启动控制台容器：

```shell
docker-compose -f api7-ee/docker-compose.yaml restart api7-ee-dashboard
```

API7 应该开始每分钟将 CP 配置推送到 S3 存储桶。

### 验证

在本节中，你将首先向路由发送请求以查看预期的上游响应。然后，你将在独立模式下重新启动 DP 部署，以便它开始从 S3 存储桶获取配置，并验证 DP 是否照常代理请求。

<Tabs
groupId="api"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'k8s'},
]}>

<TabItem value="docker">

向路由发送请求：

```shell
curl "http://127.0.0.1:9080/ip"
```

你应该会看到类似于以下内容的响应：

```text
{
  "origin": "127.0.0.1"
}
```

假设 CP 现在不可用。将以下配置添加到 DP 配置文件以启动独立模式：

```shell
docker exec <api7-ee-gateway-container-name> /bin/sh -c "echo '
nginx_config:
  error_log_level: warn

# highlight-start
deployment:
  role: data_plane
  role_data_plane:
    config_provider: yaml
  fallback_cp:
    aws_s3:
      access_key: your-aws-iam-access-key
      secret_key: your-aws-iam-secret-access-key
      bucket: bucket-to-push-config-data
      region: ap-south-1
# highlight-end
' > /usr/local/apisix/conf/config.yaml"
```

重新加载容器以使配置更改生效：

```shell
docker exec <api7-ee-gateway-container-name> apisix reload
```

DP 实例应以独立模式启动并从 S3 存储桶获取配置。

向路由发送请求：

```shell
curl "http://127.0.0.1:9080/ip"
```

你应该会看到类似于以下内容的响应，验证 DP 是否正在根据 S3 中的配置路由请求：

```text
{
  "origin": "127.0.0.1"
}
```

当 CP 恢复后，移除之前对部署模式的更改：

```shell
docker exec <api7-ee-gateway-container-name> /bin/sh -c "echo '
nginx_config:
  error_log_level: warn
' > /usr/local/apisix/conf/config.yaml"
```

重新加载容器以使配置更改生效：

```shell
docker exec <api7-ee-gateway-container-name> apisix reload
```

DP 实例现在应该开始同步来自 CP 的配置。

</TabItem>

<TabItem value="k8s">

通过端口转发将服务端口暴露给你的本地机器：

```shell
kubectl port-forward svc/api7ee3-apisix-gateway 9080:80 &
```

向路由发送请求：

```shell
curl "http://127.0.0.1:9080/ip"
```

你应该会看到类似于以下内容的响应：

```text
{
  "origin": "127.0.0.1"
}
```

假设 CP 现在不可用。编辑 DP ConfigMap：

```shell
kubectl edit cm api7-ee-3-gateway
```

在 ConfigMap 中将配置更新为独立模式：

```yaml
apiVersion: v1
data:
  config.yaml: |
   ...
    # highlight-start
    deployment:
      role: data_plane
      role_data_plane:
        config_provider: yaml
    # highlight-end
...
```

```markdown
```shell
curl "http://127.0.0.1:9080/ip"
```

你应该会看到类似于以下内容的响应，验证 DP 是否正在根据 S3 中的配置路由请求：

```text
{
  "origin": "127.0.0.1"
}
```

当 CP 恢复后，编辑 DP ConfigMap：

```shell
kubectl edit cm api7-ee-3-gateway
```

将部署模式更新回之前的配置：

```yaml
apiVersion: v1
data:
  config.yaml: |
   ...
    # highlight-start
    deployment:
      role: traditional
      role_traditional:
        config_provider: etcd

      admin:
        allow_admin:
          - 127.0.0.1/24
      etcd:
        host:
          - "http://192.168.101.10:7900"  # 替换为你的地址
        prefix: "/apisix"
        timeout: 30
    # highlight-end
...
```

保存 ConfigMap 并重新启动资源：

```shell
kubectl rollout restart deployment api7-ee-3-gateway
```

DP 实例现在应该开始同步来自 CP 的配置。

</TabItem>

</Tabs>
```
