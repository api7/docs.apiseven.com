---
title: 消费者
slug: /key-concepts/consumers
---

在本文档中，你将了解 API7 企业版中消费者的基本概念以及为什么需要消费者，包括如何将消费者信息传递给上游服务、消费者访问限制以及消费者认证和授权。

## 概述

消费者对象指向 API 网关发送请求并使用后端服务的用户、应用程序或主机。与认证系统配合使用；也就是说，每个消费者都应该配置至少一个认证插件。

<br/>
<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2024/03/20/v0xDR8tP_%E6%B6%88%E8%B4%B9%E8%80%85%E6%A6%82%E5%BF%B5.png" alt="消费者图表示例" width="95%"/>
</div>
<br/>

此配置确保只有经过认证的请求才能与服务进行交互。

## 相关阅读

- [管理消费者访问凭证](../api-consumption/manage-consumer-credentials.md)
- [基于黑白名单的访问控制](../api-consumption/consumer-restriction.md)

## 将消费者信息传递给上游服务

对于某些用例，例如日志记录、分析和审计，你可能希望将消费者信息传递给上游服务。默认情况下，消费者信息不暴露给上游。但是，你可以使用`proxy-rewrite` 插件在标头中包含所需的信息：

```json
{
  "plugins":{
    ...,
    "proxy-rewrite":{
      "headers":{
        "set":{
          "X-Consumer-Name":"$consumer_name"
        }
      }
    }
  }
}
``` 
