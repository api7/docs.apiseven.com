---
title: API7 Portal Architecture
---


## 架构图

![Portal Architecture](https://static.apiseven.com/uploads/2023/08/25/uhobaQ1Y_api7%20portal%20%E6%9E%B6%E6%9E%84%20%281%29.jpg)


## 架构介绍


### 组件说明

上图展示了 API7 portal 的整体系统架构图，从上到下可以分为 UI 展示层、API7 Portal 网关层、API7 Portal Dashboard 层、API7 Portal 数据面层：
1. Provider 和 Developer 通过网关层进入 Provider Portal Dashboard； 
2. API7 Portal Dashboard 包含的组件主要有：provider-portal-ui、provider-portal、developer-portal、developer-portal-ui、API7-Gateway；
3. provider-portal、developer-portal 组件与数据面网关 API7-Gateway 通过 etcd 进行连接； 
4. 如最后一层显示，Developer 的 user，在访问 Provider 提供的上游服务时，首先会经历 API7-Gateway 这个前置网关，该中间层可以实现访问控制、限流限速等功能，然后才进入 provider 的网关（如果存在），再到 provider 的后端服务。

### 系统可靠性说明

系统可靠性主要体现在以下几点：

1. 成熟性，是指系统避免因错误的发生而导致失效的能力；
2. 容错性，系统发生故障或违反指定接口的情况下，系统维持规定的性能级别的能力；
3. 易恢复性，系统发生失效的情况下，重建规定的性能级别并恢复受直接影响的数据的能力，并且当出现问题时需要及时的反馈；
4. 可扩展性，系统的部署模型需要考虑未来随着用户数量逐渐增多之后如何进行扩容； 
5. 可维护性，相关组件需要有能力进行运维，如果没有则采用 SaaS 服务来降低运维人力。

对于部分难维护的组件 API7 Portal 选择了对应的 Saas 服务来保证系统的高可用能力。因此，API7 Portal 整体系统的高可用体现在各个需要自己部署的组件的高可用上，具体方案如下：

1. 比如对于无状态的组件可通过多节点部署来保证节点的高可用；此外，在流量入口处有网关层，可以在网关层添加 LB、限流等机制来增加系统的稳定性；
2. 对于有状态的组件，根据各个组件的自身的特性，可采用集群模式管理实现节点高可用，比如：
   a. etcd 借助 Raft 协议，通过数据复制方案，可以提高服务可用性，避免单点故障，提升读吞吐量，降低访问延迟；
   b. 关于 Filebeat 和 Logstash 聚合的高可用方案，单个 Logstash 的聚合处理能力有限，Logstash 将成为整个系统的瓶颈；另一方面，一旦 Logstash 崩溃退出，整个系统就将无法正常运行，同时 Filebeat 采集的数据得不到及时消费，造成数据丢失。为了解决当 Logstash 宕机时，数据丢失的问题，在 Filebeat 与 Logstash 中间加入 Kafka 做为消息中间件。

### 数据存储说明

数据存储介为两个模块介绍：业务数据和 API 行为数据。

#### 业务数据

1. 业务数据指的是用户在 API7 Portal Dashboard 的各个组件内产生的数据； 
2. 一般的业务数据，比如 API Source 的创建、产品的发布和订阅、API7 Key 的管理等需要借助关系型数据库存储业务数据，同时也需将生产的 API 行为数据写入 etcd，从而与数据面进行交互。

#### API 行为数据

1. API 行为数据指的是用户在 API7 Portal Dashboard 的一些操作在数据面 API7-Gateway 产生的数据。API7 Portal 提供了丰富的 API 运营分析能力，因此，需要追踪用户的一些 API 行为数据，用以统计展示。
2. 以 Developer 的 user 访问了 Developer 订阅的一个 API 为例，user 首先经过 API7 Portal 提供的中间层网关 API7-Gateway，再到 Provider 网关（如果存在），最后到 Provider 的一个上游服务。在这一过程中，会在数据面 API7-Gateway 采集 user 的 API 行为数据通过某种方式发送给 API7 Portal Dashboard，最后由 API7 Portal Dashboard 提供的 API 运行分析服务再进行聚合展示。
