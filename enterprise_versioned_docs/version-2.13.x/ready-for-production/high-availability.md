---
title: 高可用
slug: /生产实践/高可用
tags:
  - API7 Enterprise
---
本文将指导你如何部署具备高可用性的API7 Enter。我们将以构建一个最小可用的高可用性架构为例进行演示，包括数据面(Data Plane)的高可用、控制面(Control Plane)的高可用和etcd集群的高可用。

## 部署架构
用以下组件建立一个高可用架构（最小可用版）。

![](https://static.apiseven.com/uploads/2023/03/16/wPEDJzYG_high_availability_architecture.png)

- 数据面(Data Plane)的高可用是必要的。当数据面上发生一些可预见的故障时，应该保证业务API不中断。我们强烈建议部署两个以上的数据面实例以防止单点故障。
- etcd的高可用是必要的，因为etcd存储着重要的数据和配置。根据etcd Raft协议，最小的etcd集群需要至少三个节点。
- 控制面(Control Plane)的高可用是可选的。当控制面发生故障时，你将无法修改API网关的配置，但它不会影响已在运行的业务API请求。因此，如果需要控制成本且可接受风险，可以只部署一个控制面实例。

## 准备节点
我们通常需要至少七个节点（三个etcd节点+两个数据面节点+两个控制面节点）来完成高可用架构，但本文示例中我们只用了五个节点，通过将etcd集群和API7-Dashboard部署在同一个节点上来减少节点总数。在生产实践中，你可以根据你的预算来选择是否混部以节约节点，或增加更多节点提供更好的保障。

对于每个节点，我们的最低配置要求如下。

| **主机名**             | **部署组件**          | **开放端口**     | **节点规格**       | **操作系统**       | **Docker版本**  |
| :----------------------| :------------------- | :-------------- | :---------------- | :------------------| :------------- |
| api7-highavailability1 | etcd、API7-Dashboard | 9000、2379、2380 |  2C4G             | Centos 7.6及以上   | 20.10.7及以上   |
| api7-highavailability2 | etcd、API7-Dashboard | 9000、2379、2380 |  2C4G             | Centos 7.6及以上   | 20.10.7及以上   |
| api7-highavailability3 | etcd                 | 2379、2380       |  2C4G             | Centos 7.6及以上   | 20.10.7及以上   |
| api7-highavailability4 | API7-Gateway         | 80、443、9091    |  2C4G             | Centos 7.6及以上   | 20.10.7及以上   |
| api7-highavailability5 | API7-Gateway         | 80、443、9091    |  2C4G             | Centos 7.6及以上   | 20.10.7及以上   |

#### 关于操作系统和Docker版本选择
Docker使用20.10.7及以上，已知它与3.10.0-327（CentOS 7.2）及以下版本不兼容。建议使用3.10.0-927（CentOS 7.6）或更高版本。可以执行以下命令检查当前内核版本号。
```sh
$ uname -a
Linux api7-highavailability1 3.10.0-1160.76.1.el7.x86_64 #1 SMP Wed Aug 10 16:21:17 UTC 2022 x86_64 x86_64 x86_64 x86_64 GNU/Linux
```
可以用以下命令升级内核版本:
```sh
yum update -y kernel
```
#### 安全配置
在每个节点上配置SELinux和防火墙服务（firewalld或iptables），以允许对端口的访问。

#### 开放端口
- API7-Gateway :
  - 80: HTTP访问。
  - 443: HTTPs访问。
  - 9091: 连接Prometheus监控。
- API7-Dashboard:
  - 9000: API7 Enterprise控制台入口。
- etcd:
  - 2379:对外提供数据和配置的端口。
  - 2380:集群环境下用于 Peer 通讯的端口。

## 安装软件
请确保每个节点都安装了Docker和Docerk-compose。

Docker安装: https://docs.docker.com/engine/install/centos/

Docker-compose安装: https://docs.docker.com/desktop/install/linux-install/

## 下载API7 Enterprise
https://api7.ai/try?product=enterprise

## 导出ip（可选）
通过提前导出机器的IP，避免在后续步骤中手动修改IP。
```sh
export ha_ip1=${your_host_ip1}
export ha_ip2=${your_host_ip2}
export ha_ip3=${your_host_ip3}
export ha_ip4=${your_host_ip4}
export ha_ip5=${your_host_ip5}
```
## ectd高可用部署
**步骤1**:在三个etcd节点上安装Docker:api7-highavailability1、api7-highavailability2、api7-highavailability3。

**步骤2**:登录api7-highavailability1、api7-highavailability2、api7-highavailability，创建 'etcd_data'目录。
```sh
sudo mkdir -p /usr/local/etcd/etcd_data
```
**步骤3**:启动三个etcd节点。
```sh
sudo docker run --restart always --name etcd -u root -v /usr/local/etcd/etcd_data:/etcd_data -e ALLOW_NONE_AUTHENTICATION=yes -e ETCD_NAME=api7-etcd-1 -e ETCD_LISTEN_PEER_URLS=http://0.0.0.0:2380 -e ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379 -e ETCD_ADVERTISE_CLIENT_URLS=http://$ha_ip1:2379 -e ETCD_INITIAL_ADVERTISE_PEER_URLS=http://$ha_ip1:2380 -e ETCD_INITIAL_CLUSTER_TOKEN=etcd-cluster -e ETCD_INITIAL_CLUSTER=api7-etcd-1=http://$ha_ip1:2380,api7-etcd-2=http://$ha_ip2:2380,api7-etcd-3=http://$ha_ip3:2380 -e ETCD_DATA_DIR=/etcd_data -e ETCD_ENABLE_V2=true --network=host -d bitnami/etcd:3.4.13
```

**步骤4**:验证部署，检查节点的健康状态。
```sh
$ docker exec etcd bash -c "etcdctl --endpoints $ha_ip1:2379,$ha_ip2:2379,$ha_ip3:2379 endpoint health"
172.28.0.14:2379 is healthy: successfully committed proposal: took = 1.468755ms
172.28.0.16:2379 is healthy: successfully committed proposal: took = 2.154079ms
172.28.0.15:2379 is healthy: successfully committed proposal: took = 3.133916ms
```

## 控制面（Control Plane）高可用部署（可选）

如果你不需要控制面的高可用，那么只需部署一个节点（例如，api7-highhavailability1）。

**步骤1**:在两个控制面节点上安装Docker：api7-highhavailability1、api7-highhavailability2。

**步骤2**:将api7-2.13.2209.1-cp.tar.gz（更低版本也适用，以你实际的下载的版本为准）复制到两个控制面节点并解压。
```sh
# 解压
tar -zxvf api7-2.13.2209.1-cp.tar.gz
# 加载Docker镜像
docker load < images/api7-dashboard-2.13.2209.1.tar.gz
```
**步骤3**:部署API7-Dashboard
```sh
# 登录api7-highavailability1、api7-highavailability2 ，修改etcd集群配置。
# vim dashboard_conf/conf.yaml
conf:
  etcd:
    name: "default"
    endpoints:
      - ${ha_ip1}:2379
      - ${ha_ip2}:2379
      - ${ha_ip3}:2379
    enable_auth: false
    username: "root"      # 如果不启用etcd auth，则忽略etcd的用户名
    password: "123456"    # 如果不启用etcd auth，则忽略etcd密码
    mtls:
      enable: false
      key_file: ""          # 自签的客户端密钥的路径
      cert_file: ""         # 自签的客户端证书的路径
      ca_file: ""           # 自签的ca证书的路径，该CA用于签署调用方的证书
    prefix: /api7           # etcd中的密钥前缀
```
**步骤4**:启动API7-Dashboard
```sh
docker compose up api7-dashboard -d
```

**步骤5**: 验证API7-Dashboard
```sh
# 检查容器列表和日志。
$ docker ps 
CONTAINER ID   IMAGE                                          COMMAND                  CREATED         STATUS        PORTS                                       NAMES
17a250b6f6d5   api7ee.azurecr.io/api7-dashboard:2.13.2209.1   "/usr/local/apisix-d…"   2 seconds ago   Up 1 second   0.0.0.0:9000->9000/tcp, :::9000->9000/tcp   api7-21322091-cp-api7-dashboard-1
2166063e6f7e   bitnami/etcd:3.4.13                            "/entrypoint.sh etcd"    6 hours ago     Up 6 hours                                                etcd
[xxx@api7-highavailability1 api7-2.13.2209.1-cp]$ docker logs -f 17a250b6f6d5
The manager-api is running successfully!

Version : 2.13.2209.1
GitHash : f2c8f46
Listen  : 0.0.0.0:9000
Loglevel: warn
Logfile : /usr/local/apisix-dashboard/logs/error.log
```

**步骤6**: 登录API7 Enterprise控制台, 创建一个新的集群并测试功能。

## 数据面(Data Plane)高可用部署

**步骤1**:在两个数据面节点上安装Docker:api7-highavailability4、api7-highavailability5

**步骤2**:将-2.13.2209.1-dp.tar.gz（更低版本也适用，以你实际的下载的版本为准）复制到两个数据面节点并解压。
```sh
# 解压
tar -zxvf api7-2.13.2209.1-dp.tar.gz
# 加载Docker镜像
docker load < images/api7-gateway-2.13.2209.2.tar.gz
```

**步骤3**:部署 API7-Gateway:
```sh
# 登录api7-highavailability4、api7-highavailability5 ，修改API7-Gateway配置。
# vim gateway_conf/config.yaml
etcd:
  host:
    - ${ha_ip1}:2379
    - ${ha_ip2}:2379
    - ${ha_ip3}:2379
  prefix: /api7/${cluster_id} 
```

**步骤4**:启动 API7-Gateway
```sh
docker compose up -d
```

**步骤5**:验证API7-Gateway:
```sh
# 登录api7-highavailability4、api7-highavailability5 ，修改API7-Gateway配置。
$ curl 172.28.0.17:80/get -H "Host: test.com"
{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Host": "test.com", 
    "User-Agent": "curl/7.29.0", 
    "X-Amzn-Trace-Id": "Root=1-63e46ced-6c448fe974210a5f327d268e", 
    "X-Forwarded-Host": "test.com"
  }, 
  "origin": "172.28.0.16, 20.39.184.151", 
  "url": "http://test.com/get"
}
```

## 验证整体的高可用
我们需要在两个API7-Dashboard服务前面安装一个控制面负载均衡，在两个API7-Gateway服务前面安装一个数据面负载均衡。可以使用任意负载均衡产品。

检查以下三种情况以验证API7 Enterprise的高可用性。

### 手动停止一个节点上的API7-Gateway服务
```sh
[xxx@api7-highavailability4 ~]$ cd api7-2.13.2209.1-dp/
[xxx@api7-highavailability4 api7-2.13.2209.1-dp]$ ls
cli.sh  docker-compose.yaml  gateway_conf  gateway_logs  images
[zwx@api7-highavailability4 api7-2.13.2209.1-dp]$ docker compose down 
[+] Running 2/2
 ⠿ Container api7-21322091-dp-api7-gateway-1  Removed                                                                                                                       10.2s
 ⠿ Network api7-21322091-dp_api7              Removed                                                                                                                        0.0s
[zwx@api7-highavailability4 api7-2.13.2209.1-dp]$ docker ps 
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

然后尝试访问数据面负载均衡，看看API7-Gateway服务是否在工作。

### 手动停止一个节点上的API7-Dashboard服务
```sh
$ cd api7-2.13.2209.1-cp/
$ docker compose down
```

然后尝试访问控制面负载均衡，看看API7-Dashboard服务是否在工作。

### 手动停止一个节点上的etcd服务
```sh
[xxx@api7-highavailability1 api7-2.13.2209.1-cp]$ docker ps 
CONTAINER ID   IMAGE                                          COMMAND                  CREATED         STATUS         PORTS                                       NAMES
d3b572696f50   api7ee.azurecr.io/api7-dashboard:2.13.2209.1   "/usr/local/apisix-d…"   4 minutes ago   Up 4 minutes   0.0.0.0:9000->9000/tcp, :::9000->9000/tcp   api7-21322091-cp-api7-dashboard-1
2166063e6f7e   bitnami/etcd:3.4.13                            "/entrypoint.sh etcd"    24 hours ago    Up 24 hours                                                etcd
[xxx@api7-highavailability1 api7-2.13.2209.1-cp]$ docker stop 2166063e6f7e
2166063e6f7e
[xxx@api7-highavailability1 api7-2.13.2209.1-cp]$ docker ps 
CONTAINER ID   IMAGE                                          COMMAND                  CREATED         STATUS         PORTS                                       NAMES
d3b572696f50   api7ee.azurecr.io/api7-dashboard:2.13.2209.1   "/usr/local/apisix-d…"   4 minutes ago   Up 4 minutes   0.0.0.0:9000->9000/tcp, :::9000->9000/tcp   api7-21322091-cp-api7-dashboard-1
```

然后尝试访问控制面负载均衡，检查读写数据是否正常。


