---
title: Docker 部署
slug: /installation/docker
tags:
  - API7 Enterprise
---

本指南将指引你将 API7 Enterprise 的所有必要组件快速部署到同一台机器上，以便进行 PoC 功能验证。部署完成后，这台机器的地址就是 API7 Gateway address.

:::info

对于生产环境的使用，高可用性至关重要，因此所有组件应该以集群配置的方式进行部署，而不是在单台机器上。请联系我们获取生产环境部署支持。

:::

## 前置要求

- 安装 [Docker](https://docs.docker.com/get-docker/)，并使用 20.10.7 及以上版本。 
- 操作系统 CentOS 使用 7.6 及以上版本。
- 使用 2核4G 及以上规格的实例。
- 请确保已将以下开放端口添加到安全组或防火墙的允许列表中：

| **组件名**          | **监听端口**     | **开放端口**        | 
| :------------------| :---------------| :---------------- | 
| api7-dashboard     | 9000            | 9000              |  
| etcd               | 2379,2380       | 2379              | 
| api7-gateway       | 80,443,9091,9092| 80,443            | 
| opensearch         | 9200            | -                 |
| confd              | -               | -                 |
| prometheus         | 9090            | 9090              |
| alertmanager       | 9093            | 9093              |
| grafana            | 3000            | 3000              |

## 创建网络

```shell

docker network create api7-ee

```

## 获取 Docker 镜像

```shell

docker pull api7/api7-ee:2.13.2304

```

## 安装 API7 Enterprise

```shell

docker run -d --name api7-ee -p 80:80 -p 443:443 -p 9000:9000 --network=api7-ee api7/api7-ee:2.13.2304

```

## 登录 API7 Enterprise 控制台

访问 `http://<API7_GATEWAY_ADDRESS>:9000` 登录 API7 Enterprise 控制台。默认用户名和密码都是 `admin`。

![API7 Enterprise Login](https://static.apiseven.com/uploads/2023/05/17/KWoR24J2_api7eelogin.png)

安装过程中会自动创建好首个集群`poc`，首个 etcd 资源 `default`，设置集群 `poc` 使用 etcd 资源 `default`，并在集群 `poc` 中添加好首个网关节点（数据面节点）。

![poc Cluster](https://static.apiseven.com/uploads/2023/05/17/3WvpiA9d_poccluster.png)

## 激活许可证

参考文档 [获取许可证](https://docs.apiseven.com/enterprise/installation/get-license)，然后上传并激活。

![Activate License](https://static.apiseven.com/uploads/2023/05/17/zHWAvGJA_activatelicense.png)

## 启动控制面依赖组件

控制面依赖组件包含:
- OpenSearch 1.3.7
- Grafana 7.3.7
- Prometheus 2.25.0
- confd 0.16.0
- AlertManager 0.22.2


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
检查安装状态，保证对应的容器状态为 `Up`：

```shell

docker ps | grep confd

```

### 启动 Prometheus

```shell

docker run -d --name prometheus --network api7-ee \
  -p 9090:9090 \
  -v $(pwd)/prometheus_conf:/etc/prometheus \
  --hostname prometheus \
  --restart always prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml --web.enable-lifecycle

```

检查安装状态，保证对应的容器状态为 `Up`：

```shell

docker ps | grep prometheus

```

访问 `http://<API7_GATEWAY_ADDRESS>:9090` 查看 Prometheus 控制台。

![Prometheus Console](https://static.apiseven.com/uploads/2023/05/16/33GRnyCC_prometheusconsole.png)

### 启动 AlertManager

```shell

docker run -d --name alertmanager --network=api7-ee \
  -p 9093:9093 \
  -v $(pwd)/alertmanager_conf:/etc/alertmanager \
  --restart always prom/alertmanager:latest \
  --log.level=debug --config.file=/etc/alertmanager/alertmanager.yml


```

检查安装状态，保证对应的容器状态为 `Up`：

```shell

docker ps | grep alertmanager

```

访问 `http://<API7_GATEWAY_ADDRESS>:9093/#/alerts` 查看 AlertManager 控制台。

![AlertManager Console](https://static.apiseven.com/uploads/2023/05/16/OuGl66LF_alertmanagerconsole.png)


### 启动 OpenSearch

```shell

docker run -d --name opensearch --network api7-ee \
  -p 9200:9200 \
  --hostname opensearch \
  --restart always \
  --env discovery.type=single-node \
  --env plugins.security.disabled=true \
  --env cluster.routing.allocation.disk.threshold_enabled=true \
  --env ES_JAVA_OPTS="-Xmx4g -Xms4g" \
  opensearchproject/opensearch:2.3.0

```

检查安装状态，保证对应的容器状态为 `Up`：

```shell

docker ps | grep opensearch

```

测试 OpenSearch:

```shell

curl http://localhost:9200 -v

```

得到返回：

```shell

< HTTP/1.1 200 OK
< content-type: application/json; charset=UTF-8
< content-length: 567
< 
{
  "name" : "node-1",
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "PrNDIhRuSOamdu-fs0WfKw",
  "version" : {
    "distribution" : "opensearch",
    "number" : "1.3.7",
    "build_type" : "tar",
    "build_hash" : "db18a0d5a08b669fb900c00d81462e221f4438ee",
    "build_date" : "2022-12-07T22:59:20.186520Z",
    "build_snapshot" : false,
    "lucene_version" : "8.10.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}

```

### 启动 Grafana

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

检查安装状态，保证对应的容器状态为 `Up`：

```shell

docker ps | grep grafana

```

访问 `http://<API7_GATEWAY_ADDRESS>:3000` 登录 Grafana 控制台。默认用户名和密码都是 `admin`。

![Grafana Console](https://static.apiseven.com/uploads/2023/05/16/GEOCPMQc_grafanaconsole.png)

![Grafana Homepage](https://static.apiseven.com/uploads/2023/05/16/XMnHW3Tg_grafanahomepage.png)

### 配置 Grafana

在左侧菜单，选择 **Configuration** > **Data Sources**：

![Grafana Choose Data Source](https://static.apiseven.com/uploads/2023/05/16/oDaO0Xlp_grafanachoosedatasource.png)

点击 **Add data source**:

![Grafana Add Data Source](https://static.apiseven.com/uploads/2023/05/16/OyjGuEfA_grafanaadddatasource.png)

选择 **Prometheus**:

![Grafana Select Prometheus](https://static.apiseven.com/uploads/2023/05/16/CDUVjTjA_grafanaselectprometheus.png)

将 **HTTP** > **URL** 修改为 Prometheus 地址 `http://prometheus:9090` 然后点击 **Save** & **Test**。

![Grafana Docker](https://static.apiseven.com/uploads/2023/05/17/e0w7wMRK_grafana-docker.png)

在左侧菜单, 选择 **Create** > **Import**:

![Import Grafana Dashboard](https://static.apiseven.com/uploads/2023/05/16/yI80cNID_grafanaimport.png)

输入 `18384` 作为 Grafana.com dashboard id, 然后点击右侧的 **Load** 按钮： 

![Grafana 18384](https://static.apiseven.com/uploads/2023/05/16/AfdYv9QR_grafana18384.png)

确认导入的 "APISEVEN Grafana Dashboard" 详情, 选择 Prometheus data source, 然后点击 **Import**:

![Grafana Preview](https://static.apiseven.com/uploads/2023/05/16/jEogYLeq_grafanapreview.png)

预览 Grafana 面板:

![Grafana Dashbaord](https://static.apiseven.com/uploads/2023/05/16/wDIKbcA0_grafanadashboard.png)

点击分享图标, 关闭所有选项的开关, 然后点击 **Copy**， 获得 Grafana 面板地址:

![Grafana Copy](https://static.apiseven.com/uploads/2023/05/17/2Fh6PE1t_grafanacopy.png)

## API7 Enterprise 系统设置

1. 访问 API7 Enterprise 控制台，在顶部菜单选择 **系统管理** ，然后在左侧菜单选择 **系统设置**，进入 **Grafana URL** 标签页。填入上一步中复制的 Grafana 面板地址，点击 **保存更改**。
2. 切换到 **Prometheus** 标签页，在 `Hosts` 中填入 `http://prometheus:9090`，点击 **保存更改**。
3. 切换到 **OpenSearch** 标签页，在 `Hosts` 中填入 `http://opensearch:9200`，点击 **保存更改**。

## 验证监控报表

进入 `poc` 集群，在左侧菜单中选择 **监控报表**。嵌入的 Grafana 面板将显示在此处：

![Metrics](https://static.apiseven.com/uploads/2023/05/17/XaK20dw3_metrics.png)

## 验证网关节点

进入 `poc` 集群，在左侧菜单中选择 **网关节点**，确认有一个节点且状态为正常。

![Gateway Node](https://static.apiseven.com/uploads/2023/05/17/fO4diKu0_gatewaynode.png)