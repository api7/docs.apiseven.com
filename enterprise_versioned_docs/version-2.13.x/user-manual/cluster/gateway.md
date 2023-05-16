---
title: 网关节点
slug: /user-manual/cluster/gateway
tags:
  - API7 Enterprise
---

## 新增网关节点


网关节点即是数据面节点，是 API7 的核心组件之一，它负责实际处理所有传入的 API 请求并返回响应。在生产实践中，建议部署两个以上的数据面节点以防止单点故障。增加更多节点，可以提供更好的水平扩展性，支撑更多业务流量。



需要部署好数据面节点后，再添加到控制面。



1.  登录 API7 Enterprise 控制台。

2.  在顶部导航菜单，点击 **集群管理** 。

3. 在左侧菜单，点击 **集群列表** 。

4. 在列表中点击集群对应的「更多」按钮，在下拉菜单中，点击`复制集群信息`。

5. [参考文档]，在一个新的节点上安装数据面组件 API7-Gateway。

6. 成功安装 API7-Gateway 后，修改配置文件：

```sh
cat /usr/local/apisix/conf/config.yaml

etcd:
  host:
    - "http://api7-dashboard-etcd.api7.svc.cluster.local:2379"
  prefix: "/api7/452869103972058061"
  timeout: 30

```

7. 重启 API7-Gateway：

```sh
# RPM 安装
apisix restart

# docker 容器部署
docker restart ${containerID}

# k8s 部署
kubectl delete pod ${podID} -n ${namespace}

```

验证：在网关节点列表中，可以看到已经添加了至少一个数据面节点。


## 下线网关节点

To do
