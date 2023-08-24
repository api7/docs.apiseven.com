---
title: API7 Portal Architecture
---


## 架构图

![Portal Architecture](https://static.apiseven.com/uploads/2023/08/24/9HqAN9qa_portal%20%E6%9E%B6%E6%9E%84.jpg
)


## 架构介绍


### 组件说明

如上图所示，是c整体系统架构图，从上到下可以分为 UI 展示层、API7 portal 网关层、API7 portal dashboard 层、API7 portal 数据面层：
1. Provider 通过 apisix 和 apisix-ingress-controller 进入  Provider Portal Dashboard；
2. 同理 Developer 通过 apisix 和 apisix-ingress-controller 进入  Developer Portal Dashboard；
3. 整个 PAI7 Portal Dashboard 包含的组件有：provider-portal-ui、provider-portal、developer-portal、developer-portal-ui、PostgreSQL、ETCD、keycloak、ES、Logstash 、Filebeat、API7-Gateway；
4. PAI7 Portal Dashboard  与 数据面网关 API7-Gateway 通过 ETCD 进行连接；
5. Filebeat 组件采集 API7-Gateway 的日志发送给 logstash，然后由 logstash 写入 ES；
6. 如最后一层显示，Developer 的 user，在访问 Provider 提供的上游服务时，首先会经历 API7-Gateway 这个前置网关，该中间层可以实现访问控制、限流限速等功能。

### 系统可靠性说明

注意线上环境相比测试环境、预发环境需要注意以下几点：

1. 稳定性，线上环境的稳定性要求更高，当出现问题时能够及时的反馈；
2. 可扩展性，线上环境的部署需要考虑未来随着用户数量逐渐增多之后如何进行扩容；
3. 可维护性，相关组件需要有能力进行运维，如果没有则采用 SaaS 服务来降低运维人力。

因此，针对以下组件 API7 Portal 选择了 Saas 服务来保证系统的高可用能力：SendGrid（提供邮件发送能力）；Postgresql；Elastcisearch。
所以， API7 Portal 整体系统的高可用体现在各个需要我们自己部署的组件的高可用上，有 provider-portal、developer- portal、provider-portal-ui 、developer-portal-ui、 Keycloak、ETCD、FileBeat、Logstash、APISIX、APISIX-Ingress、API7-Gateway。

1. provider-portal、developer- portal、provider-portal-ui 、developer-portal-ui 这四个组件属于无状态的组件、可通过多节点部署来保证节点的高可用；此外，在流量入口处有网关层，可以在网关层添加 LB、限流等机制来增加系统的稳定性；
2. APISIX、APISIX-Ingress、API7-Gateway、keycloak 这几个组件也属于无状态组件，也可通过多节点部署来保证节点的高可用；
3. ETCD 、FileBeat、Logstash 属于有状态节点，可采用集群模式管理实现节点高可用；
4. ETCD 借助 Raft 协议 ，通过数据复制方案，可以提高服务可用性，避免单点故障，提升读吞吐量，降低访问延迟；
5. FileBeat 和 Logstash 聚合的高可用方案，单个 logstash 的聚合处理能力有限，logstash 将成为整个系统的瓶颈；另一方面，一旦这个 logstash 崩溃退出，整个系统就将无法正常运行，同时 filebeat 采集的数据得不到及时消费，造成数据丢失。为了解决当 logstash 宕机时，数据丢失的问题，在 filebeat 与 logstash 中间加入 kafka 做为消息中间件。

### 数据存储说明

数据存储介绍分为两个模块介绍：业务数据和 API 行为数据。

#### 业务数据

业务数据指的是用户在 API7 portal dashboard 的各个组件内产生或者查询的数据，比如：
1. 用户管理相关的数据，会使用 PostgreSQL 和 Keycloak 进行存储；
2. 一般的业务数据，比如 API source 的创建、产品的发布和订阅、API7 key 的管理等需要借助 PostgreSQL 存储业务数据，同时也需将生产的 API 行为数据写入 ETCD，从而与数据面进行交互。

#### API 行为数据

1. API 行为数据指的是用户在 API7 portal Portal Dashboard 的一些操作在数据面 APISIX 产生的数据。API7 Portal  提供了丰富的 API 运营分析能力，因此，需要追踪用户的一些 API 行为数据，用以统计展示。以 Developer 的 user 访问了 Developer 订阅的一个 API 为例；
2. User 首先经过 API7 Portal  提供的中间层网关 APISIX，再到 Provider 的一个上游服务。在这一过程中，Filebeat 组件会采集 user 的 API 行为数据发送给 Logstash，由 Logstash 最终写入 ES，最后由 API7 Portal Dashboard 提供的 API 运行分析服务查询 ES 中 user 关于 API 行为的指标数据，再进行聚合展示。
