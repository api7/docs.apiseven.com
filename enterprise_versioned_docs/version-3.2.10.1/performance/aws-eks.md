---
title: AWS EKS 性能测试指南
slug: /performance/aws-eks
---

## AWS EKS 环境准备

### 创建集群

1. 在 AWS EKS 中添加一个新的测试集群

![](https://static.apiseven.com/uploads/2024/05/13/AcXSkWUI_create-cluster.png)

2. 配置测试集群，如果之前没有使用过 EKS 服务配置过集群服务角色，可以根据文档创建一个 EKS 集群角色：[https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html#create-service-role](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html#create-service-role)

![](https://static.apiseven.com/uploads/2024/05/13/BYWC128m_config-cluster.png)

3. 点击下一步配置网络设置

![](https://static.apiseven.com/uploads/2024/05/13/E2595vPU_cluster-network.png)

4. 配置可观测性

![](https://static.apiseven.com/uploads/2024/05/13/gqpKSq4K_cluster-observability.png)

5. 选择插件（默认配置），点击下一步

![](https://static.apiseven.com/uploads/2024/05/13/EsY6qevQ_cluster-plugin.png)

6. 点击创建集群，等待 EKS 创建

![](https://static.apiseven.com/uploads/2024/05/13/RYL1q741_create-success.png)

### 添加 Node

#### 创建 Key pair（选做）

在 node 中配置了 Key Pair 就可以直接登录 node。如果已经有 Key Pair 的话，可以跳过创建 Key pair 这一步。

1. 在 AWS 中控台选择“EC2”，进入 EC2 界面，点击左边的“Key Pairs”，在右边点击“Create key pair”

![](static/ETuHbUmBNoQ1XExDlNRcTU9xnwc.png)

1. 添加名称

![](static/JnHjboNYto2Xuux3xFlc7bLynEg.png)

1. 创建密钥对，这时浏览器会自动下载 key pair，这个要保存好，方便之后使用命令登陆 node

![](static/OBD8bgciZoVEBJxBWwHcuTrnnlg.png)

#### 创建 Node group

我们需要添加 3 个节点组，分别在不同的节点组部署 API7 EE，NGINX 上游，wrk2。

**注意：**如果之前没有创建过 EKS Node Role 需要先创建，步骤类似 EKS 创建集群服务角色的过程。可以参考文档：[https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/create-node-role.html](https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/create-node-role.html)

1. 选择“计算”，点击添加“节点组”

![](static/Ink1bDTVUoqZMXxYtZ6c8P6HnYg.png)

1. 配置节点组

![](static/CRPYbjRM5oMkhCxv0txcWQXXnGg.png)

1. 这里我们选择 c5.2xlarge 进行测试，测试过程使用单节点。

![](static/Ri7Vb2xVLolih8xqyBXctD7vncd.png)

1. 配置网络，这里我们为了方便登陆到 node 中，开启了节点远程访问控制权限，不需要可以不开启。

![](static/MjHsbBjJxo2COtxoRPUcmdAWnvh.png)

1. 根据上面的步骤，我们需要创建 3 个节点，名字分别为 api7ee，upstream，wrk2 等待创建完成。

![](static/S4y0byNuZomkVNxMKQNcBaIYnSh.png)

#### 使用 aws cli 配置 kubectl config

1. 通过向 `kubectl` `config` 文件添加新上下文来启用 `kubectl` 与我们创建的集群通信。

具体细节参考文档：[https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/create-cluster.html](https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/create-cluster.html)

```shell
aws eks update-kubeconfig --region region-code --name my-cluster
```

1. 执行 `kubectl get svc` 验证成功与集群的通信，输出如下

```shell
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.100.0.1   <none>        443/TCP   39m
```

#### 为 Node 打 label

我们分别为 4 个不同的 Node 打上对应的 label，方便之后的部署

```shell
kubectl label nodes <your-node-name> <label_key=label_value>

# example
kubectl label nodes <your-node1-name> nodeName=api7ee
kubectl label nodes <your-node2-name> nodeName=upstream
kubectl label nodes <your-node3-name> nodeName=wrk2
```

## 安装过程

### 安装 API7 EE

#### 控制面安装

1. 创建一个新的 namespace，之后所有的资源都在同一个 namespace 中管理

```shell
kubectl create namespace api7
```

1. 使用 helm 安装 API7 EE CP

```shell
helm repo add api7 https://charts.api7.ai            
helm repo add apisix https://charts.apiseven.com
helm repo update
# 为安装 api7ee 指定 Node (之前我们为 Node 设置的 label)
helm install api7ee3 api7/api7ee3 --set nodeSelector."nodeName"=api7ee --set postgresql.primary.nodeSelector."nodeName"=api7ee --set prometheus.server.nodeSelector."nodeName"=api7ee --set postgresql.primary.persistence.enabled=false --set prometheus.server.persistence.enabled=false -n api7
```

1. 检查部署情况

```shell
kubectl get svc -owide -l app.kubernetes.io/name=api7ee3 -n api7

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE   SELECTOR
api7ee3-dashboard    ClusterIP   10.100.25.236   <none>        7080/TCP            18s   app.kubernetes.io/component=dashboard,app.kubernetes.io/instance=api7ee3,app.kubernetes.io/name=api7ee3
api7ee3-dp-manager   ClusterIP   10.100.239.32   <none>        7900/TCP,7943/TCP   18s   app.kubernetes.io/component=dp-manager,app.kubernetes.io/instance=api7ee3,app.kubernetes.io/name=api7ee3
```

1. 将端口转发到本机，登陆控制台并上传 license

```shell
kubectl -n api7 port-forward svc/api7ee3-dashboard 7443:7443
```

License 试用申请地址：https://api7.ai/try?product=enterprise

1. 在控制台配置控制面地址：http://api7ee3-dp-manager:7900

![](static/J0qJbrzYVo8aQKx3hRCcbuJXnmd.png)

#### 禁用 prometheus 插件

控制面默认会为网关组启用 prometheus 插件，进行性能测试时，我们需要将它禁用掉。

![](static/FImzbJhNhojol3xL34VcMnp8nne.png)

#### 数据面安装

1. 点击进入网关组中

![](static/LXnRbhwQyo1CSoxbcuxco8eHnoY.png)

1. 点击新增网关实例按钮

![](static/WKhAbMFs0oCxz1xVRXlcVIo5nNg.png)

1. 选择 Kubernetes 方式添加，配置命名空间，生成安装脚本并运行

![](static/UXGib4OZJoj6FrxGQafcvql6n0e.png)

注意我们先修改 API7 Gateway 的 worker_process 数为 1，并指定安装的 Node

```shell
helm install -n api7 --create-namespace api7-ee-3-gateway api7/gateway \
  --set "apisix.extraEnvVars[0].name=API7_CONTROL_PLANE_TOKEN" \
  --set "apisix.extraEnvVars[0].value=a7ee-1onxEIUNvKhihuwLKIfNvP61QzYisftJp7fwU3MBMNx9W4h1kdbdf9031a24d7448da69b6120a526f902" \
  --set "apisix.image.repository=api7/api7-ee-3-gateway" \
  --set "apisix.image.tag=3.2.8.1" \
  --set "etcd.host[0]=http://api7ee3-dp-manager:7900" \
  --set "apisix.replicaCount=1" \
  --set "nginx.workerProcesses"=1 \
  --set apisix.securityContext.runAsNonRoot=false \
  --set apisix.securityContext.runAsUser=0 \
  --set apisix.nodeSelector.nodeName=api7ee
```

### 安装 NGINX 上游

1. 创建 nginx-upstream.yaml 文件

```yaml
---
# nginx conf configmap
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: api7
data:
  nginx.conf: |
    master_process on;

    worker_processes 1;
    events {
        worker_connections 4096;
    }

    http {
        resolver ipv6=off 8.8.8.8;

        #access_log logs/access.log;
        access_log off;
        server_tokens off;
        keepalive_requests 10000000;

        server {
            listen 1980;
            server_name _;

            location / {
                proxy_set_header Connection "";
                return 200 "hello world\n";
            }
        }
    }
---
# nginx deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: api7
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        volumeMounts:
        - name: nginx-config-volume
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
      nodeSelector:
        nodeName: upstream
      volumes:
      - name: nginx-config-volume
        configMap:
          name: nginx-config
---
```

1. 部署 nginx 上游

```shell
kubectl apply -f nginx-upstream.yaml
```

### 安装 wrk2

创建 wrk2.yaml 文件，并运行 kubectl apply -f wrk2.yaml

```yaml
# wrk2 deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wrk2-deployment
  namespace: api7
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wrk2
  template:
    metadata:
      labels:
        app: wrk2
    spec:
      containers:
      - name: wrk2
        image: bootjp/wrk2
      nodeSelector:
        nodeName: wrk2
```

## 测试配置

- [1 条路由且未启用任何插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/1-one-route-without-plugin.yaml)
- [1 条路由只启用 limit-count 插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/2-one-route-with-limit-count.yaml)
- [1 条路由同时启用 limit-count 和 key-auth 插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/3-one-route-with-key-auth-and-limit-count.yaml)
- [1 条路由和 1 个消费者只启用 key-auth 插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/4-one-route-with-key-auth.yaml)
- [100 条路由且未启用任何插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/5-100-route-without-plugin.yaml)
- [100 条路由只启用 limit-count 插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/6-100-route-with-limit-count.yaml)
- [100 条路由和 100 个消费者同时启用 key-auth 和 limit-count 插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/7-100-route-and-consumer-with-key-auth-limit-count.yaml)
- [100 条路由和 100 个消费者只启用 key-auth 插件](https://github.com/api7/api7-gateway-performance-benchmark/blob/main/api7-resources-configuration/8-100-route-and-consumer-with-key-auth.yaml)
