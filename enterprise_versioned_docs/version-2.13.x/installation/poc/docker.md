---
title: Docker for PoC
slug: installation/poc/docker
tags:
  - API7 Enterprise
  - Installation
---

本指南将指引你将 API7 Enterprise 的所有必要组件快速部署到同一个 Docker 容器中，以便进行 PoC 功能验证。你还可以额外选择安装可选组件，来开启附加功能。

## 前置要求

- Docker 使用 20.10.7 及以上版本。 
- CentOS 使用 7.6 及以上版本。

```sh
# 检查当前内核版本
$ uname -a
Linux api7-highavailability1 3.10.0-1160.76.1.el7.x86_64 #1 SMP Wed Aug 10 16:21:17 UTC 2022 x86_64 x86_64 x86_64 x86_64 GNU/Linux
```

```sh
# 升级内核
yum update -y kernel
```

## 创建网络

```shell
docker network create api7-ee
docker network connect api7-ee api7-ee
```

## 获取 Docker 镜像

```shell
# 请替换成需要的版本号
docker pull api7/api7-ee:2.13.2302
```

## 运行 Docker 容器

三个必要组件：API7-Gateway,API7-Dashboard, etcd 都将安装在同一个容器中。

```shell
# 请替换成需要的版本号
docker run -d -p 80:80 -p 443:443 -p 9000:9000 api7/api7-ee:2.13.2302
```

## 开启监控功能（可选）
### 启动 confd

```shell
echo 'backend = "etcdv3"
confdir = "/etc/confd"
nodes = [
  "http://api7-ee:2379",
]
watch = true' > ./confd.toml
```

```shell
docker run -d --network=api7-ee --name confd \
  -v $(pwd)/confd.toml:/etc/confd/confd.toml \
  -v $(pwd)/prometheus_conf:/root/prometheus \
  -v $(pwd)/alertmanager_conf:/root/alertmanager  \
  api7/api7-confd:0.16.0
```

### 启动 Prometheus

你也可以复用已有的 Prometheus 服务。

```shell
docker run -d --name prometheus --network api7-ee \
  -p 9090:9090 \
  -v $(pwd)/prometheus_conf:/etc/prometheus \
  --hostname prometheus \
  --restart always prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml --web.enable-lifecycle
```

## 开启告警功能（可选）
### 启动 AlertManager

你也可以复用已有的 AlertManager 服务。

```shell
docker run -d --name alertmanager --network=api7-ee \
  -p 9093:9093 \
  -v $(pwd)/alertmanager_conf:/etc/alertmanager \
  --restart always prom/alertmanager:latest \
  --log.level=debug --config.file=/etc/alertmanager/alertmanager.yml
```

### 启动 OpenSearch

你也可以复用已有的 OpenSearch 服务。

```shell
docker run -d --name alertmanager --network=api7-ee \
  -p 9093:9093 \
  -v $(pwd)/alertmanager_conf:/etc/alertmanager \
  --restart always prom/alertmanager:latest \
  --log.level=debug --config.file=/etc/alertmanager/alertmanager.yml
```

### 启动 Grafana

你也可以复用已有的 Grafana 服务。

```shell
mkdir grafana_conf

echo "[security]
allow_embedding = true" > ./grafana_conf/grafana.ini
```

```shell
docker run -d --name grafana --network api7-ee \
  -p 3000:3000 \
  -v $(pwd)/grafana_conf/grafana.ini:/etc/grafana/grafana.ini \
  --hostname grafana \
  --restart always \
  grafana/grafana:7.3.7
```

## 开启审计功能（可选）
### 启动 OpenSearch

你也可以复用已有的 OpenSearch 服务。

```shell
docker run -d --name alertmanager --network=api7-ee \
  -p 9093:9093 \
  -v $(pwd)/alertmanager_conf:/etc/alertmanager \
  --restart always prom/alertmanager:latest \
  --log.level=debug --config.file=/etc/alertmanager/alertmanager.yml
  

