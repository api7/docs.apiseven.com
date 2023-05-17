---
title: Docker 部署
slug: /installation/docker
tags:
  - API7 Enterprise
---

本指南将指引你将 API7 Enterprise 的所有必要组件快速部署到同一个 Docker 容器中，以便进行 PoC 功能验证。

:::info

对于生产环境的使用，高可用性至关重要，因此所有组件应该以集群配置的方式进行部署，而不是在单台机器上。请联系我们获取生产环境部署支持。

:::

## 前置要求

- Docker 使用 20.10.7 及以上版本。 
- CentOS 使用 7.6 及以上版本。
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

## 运行 Docker 容器

```shell

docker run -d -p 80:80 -p 443:443 -p 9000:9000 api7/api7-ee:2.13.2302

```

## 登录 API7 Enterprise 控制台

访问 `http://<API7_GATEWAY_ADDRESS>:9000` 登录 API7 Enterprise 控制台。默认用户名和密码都是 `admin`。

## 新建集群

参考文档 [新建集群](https://docs.apiseven.com/enterprise/user-manual/cluster/list#%E6%96%B0%E5%BB%BA%E9%9B%86%E7%BE%A4)

在【5. 填写表单】中，使用如下配置：

**集群名称** ： poc

**etcd 资源**： 选择部署过程中自动创建的 `default` etcd 资源

## 新增网关节点

参考文档 [新增网关节点](https://docs.apiseven.com/enterprise/user-manual/cluster/gateway#%E6%96%B0%E5%A2%9E%E7%BD%91%E5%85%B3%E8%8A%82%E7%82%B9)。

访问 API7 Enterprise 控制台，进入创建好的集群 `poc`，在左侧菜单选择 **网关节点**， 在列表中可以看到添加成功的网关节点。


## 启动控制面依赖组件

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

```shell

docker run -d --name prometheus --network api7-ee \
  -p 9090:9090 \
  -v $(pwd)/prometheus_conf:/etc/prometheus \
  --hostname prometheus \
  --restart always prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml --web.enable-lifecycle

```

### 启动 AlertManager

```shell

docker run -d --name alertmanager --network=api7-ee \
  -p 9093:9093 \
  -v $(pwd)/alertmanager_conf:/etc/alertmanager \
  --restart always prom/alertmanager:latest \
  --log.level=debug --config.file=/etc/alertmanager/alertmanager.yml

```

### 启动 OpenSearch

```shell

docker run -d --name alertmanager --network=api7-ee \
  -p 9093:9093 \
  -v $(pwd)/alertmanager_conf:/etc/alertmanager \
  --restart always prom/alertmanager:latest \
  --log.level=debug --config.file=/etc/alertmanager/alertmanager.yml

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

### 启动 OpenSearch

```shell

docker run -d --name alertmanager --network=api7-ee \
  -p 9093:9093 \
  -v $(pwd)/alertmanager_conf:/etc/alertmanager \
  --restart always prom/alertmanager:latest \
  --log.level=debug --config.file=/etc/alertmanager/alertmanager.yml

```

## 访问 Prometheus 控制台

访问 `http://<API7_GATEWAY_ADDRESS>:9090` 查看 Prometheus 控制台。

![Prometheus Console](https://static.apiseven.com/uploads/2023/05/16/33GRnyCC_prometheusconsole.png)

## 访问 Grafana 控制台

访问 `http://<API7_GATEWAY_ADDRESS>:3000` 登录 Grafana 控制台。默认用户名和密码都是 `admin`。

![Grafana Console](https://static.apiseven.com/uploads/2023/05/16/GEOCPMQc_grafanaconsole.png)
![Grafana Homepage](https://static.apiseven.com/uploads/2023/05/16/XMnHW3Tg_grafanahomepage.png)

## 在 Grafana 中配置 Prometheus 地址

在左侧菜单，选择 **Configuration** > **Data Sources**：

![Grafana Choose Data Source](https://static.apiseven.com/uploads/2023/05/16/oDaO0Xlp_grafanachoosedatasource.png)

点击 **Add data source**:

![Grafana Add Data Source](https://static.apiseven.com/uploads/2023/05/16/OyjGuEfA_grafanaadddatasource.png)

选择 **Prometheus**:

![Grafana Select Prometheus](https://static.apiseven.com/uploads/2023/05/16/CDUVjTjA_grafanaselectprometheus.png)

将 **HTTP** > **URL** 修改为 Prometheus 地址 `http://127.0.0.1:9090` 然后点击 **Save** & **Test**:

![Grafana Configure Prometheus](https://static.apiseven.com/uploads/2023/05/16/h4aU3lRg_grafanaconfigureprometheus.png)

## 创建 Grafana 面板

在左侧菜单, 选择 **Create** > **Import**:

![Import Grafana Dashboard](https://static.apiseven.com/uploads/2023/05/16/yI80cNID_grafanaimport.png)

输入 `18384` 作为 Grafana.com dashboard id, 然后点击右侧的 **Load** 按钮： 

![Grafana 18384](https://static.apiseven.com/uploads/2023/05/16/AfdYv9QR_grafana18384.png)

确认导入的 "APISEVEN Grafana Dashboard" 详情, 选择 Prometheus data source, 然后点击 **Import**:

![Grafana Preview](https://static.apiseven.com/uploads/2023/05/16/jEogYLeq_grafanapreview.png)

预览 Grafana 面板:

![Grafana Dashbaord](https://static.apiseven.com/uploads/2023/05/16/wDIKbcA0_grafanadashboard.png)

点击分享图标, 关闭所有选项的开关, 然后点击 **Copy**:

![图片](https://static.apiseven.com/uploads/2023/05/16/f7nU2UQ5_grafanacopylink.png)

## 配置 API7 Enterprise 系统配置

## 验证监控报表

进入集群，在左侧菜单中选择 **监控报表**。嵌入的 Grafana 面板将显示在此处：

## 访问 AlertManager 控制台

访问 `http://<API7_GATEWAY_ADDRESS>:9093/#/alerts` 查看 AlertManager 控制台。

![AlertManager Console](https://static.apiseven.com/uploads/2023/05/16/OuGl66LF_alertmanagerconsole.png)