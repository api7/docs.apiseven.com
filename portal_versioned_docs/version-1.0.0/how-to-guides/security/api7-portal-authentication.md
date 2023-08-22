---
title: Portal文档：API7 Authentication
---

## 一、认证方案架构说明

API7 认证用于 API7 Portal 系统中，给 Developer 访问 Provider 提供的上游服务提供身份认证能力。
相较于传统的 Developer 直接认证于 API Endpoints （如下图一所示），API7 认证（如下图二所示）升级为 Developer 与 API7 Portal 之间统一通过 API key 认证，API7 Portal 与 API Endpoints 之间保持原有认证方式。

![Protocol Conversion](https://static.apiseven.com/uploads/2023/08/22/6Pjiyfip_%E4%BC%A0%E7%BB%9F%E8%AE%A4%E8%AF%81%20%281%29.jpg)

图一 传统认证方案：Developer 直接认证于 API Endpoints

![Protocol Conversion](https://static.apiseven.com/uploads/2023/08/22/d9Hy1vyM_api7%20%E8%AE%A4%E8%AF%81.jpg)
                                                
图二 API7 认证


## 二、认证方案优势说明

API7 认证具有如下优势：
1. 简化了 Developer 对 API 的调用，无需感知适配 API Endpoints 提供的的各种不同认证方式；
2. 将 Developer 对 API Endpoints 的访问进行解耦、大大增加了 API Endpoints 抵御攻击的能力；
3. Developer 可以自己管控 API key，增加了 Developer 对 API 的调度安全，并且方便 Developer 后续对基于 key 的调度进行运营分析；


## 三、API Key 的安全性保障

### API7 Portal 提供 API Key 的发放和回收机制
1. Developer 可以自己创建 API key，并且自己命名，方便后续使用时分辨，不过 API key 是由 API7 Portal 的后端服务按照一定的规则主动生成的，Developer 不可编辑；
2. API key 列表可以展示它的生成时间和上次使用时间，API7 Portal 还提供了针对 API key 使用情况的运行分析能力，方便 Developer 追踪 API key 的使用情况；
3. 对于现存的 API key，Developer 还可以使用删除操作进行回收；

### API key 采用的安全措施
1. 密钥使用 HTTP Header 传递，不出现在 URL 中，从而增加了 API key 的安全性；
2. 提供了 API Key 的发放和回收机制，保障了密钥可以定期轮换，防止被盗用；
3. 提供了针对 API key 使用情况的运行分析能力，方便 Developer 追踪 API key 的使用情况；
4. 有多种 key 的认证机制可以选择，比如 key-auth、JWT 等，用户可以选择自己信任的机制进行认证；

## 四 API7 与 API Endpoint 之间认证安全性保障

### 认证流程和原理

1. Provider 在 API7 Portal 创建 API Source 时，可以选择 API7 Portal 与 API Endpoints 之间的认证方式，包括：No Auth、API Key、Basic Auth、JWT；
2. API7 Portal 对这些认证机制的实现采用的是 Apache APISIX 的 [key-auth](https://apisix.apache.org/docs/apisix/plugins/key-auth/)、[basic-auth](https://apisix.apache.org/docs/apisix/plugins/basic-auth/)、[jwt-auth](https://apisix.apache.org/docs/apisix/plugins/jwt-auth/) 插件；

### 优点

1. API7 与 API Endpoint 之间认证方式对 Developer 并没有暴露，因此大大降低攻击风险。 
2. API7 Portal 与 API Endpoints 之间通过 API 密钥认证机制进行互信和访问控制，保证 API 调用的安全性，同时结合API Key 对安全性的保障，可以形成完善的安全体系。
