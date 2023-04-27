---
title: 搭建开发者门户站点 (Beta)
slug: /api-full-lifecycle/build-devportal-site
tags:
- API7 Enterprise
---

本文将指导您作为 API 的生产者及管理员，如何将已经接入 API7 网关的 API 发布到与网关配套的开发者门户，搭建一个站点，允许内部或外部的开发者登录后查找到这个 API，查看都已经的 API 文档，并申请订阅 API，获得 API 管理员的同意后，自动获取访问凭证。


## 为什么需要开发者门户

API 全生命周期管理除了要站在 API “生产者”（API 开发者、维护者）的角度，来简化 API 的管理问题外，还应当覆盖API 的“消费”问题，即如何让外部开发者（也可能是来自同一公司不同团队的开发者）能够方便地集成 API 的问题。我们不妨来看下，如果想让一个外部的开发者调用你的 API，需要解决哪些问题？

第一个问题是，如何让外部的开发者查看到 API 的信息，包括 API 的接入地址、API 的描述、参数约束、使用示例等。这些详细信息能够有效地帮助到外部开发者去理解并使用 API；

第二个问题是，作为 API 的“生产者”，我们往往不希望谁都可以来调用我们开发的 API，即我们希望对 API 进行有效的保护，因此外部的开发者应该仅在获得了有效的 API 凭证以后，才能真正使用 API。更重要的是，我们希望 API 的“消费”应当是尽可能自助的，从而减少沟通协作带来的成本。

为了优化 API “消费”这个环节，人们提出了开发者门户这个概念，借此来解决上述的问题。API7 Enterprise 推出了自己配套的开发者门户产品与网关搭配使用。

## 背景知识

[了解开发者门户基本概念](https://docs.apiseven.com/enterprise/background-information/key-concept#开发者门户-beta)。

## 架构设计

![API7 Devportal architecture](https://static.apiseven.com/uploads/2023/04/25/WEKQQMXc_devportal-architecture.png)

- 图中业务开放平台需要自行开发，或者直接集成到已有的业务平台中，可同时支持多个业务平台。例如，您可以搭建一个内网开放平台，展示并管理仅供内部业务使用的 API，同时搭建一个公开的开放平台，展示并管理对外公开的 API。或者您也可以根据业务属性，为某个组织或部门的开发者搭建独立的站点，展示并管理仅供指定组织或部门使用的API。
- API7 开发者门户展示端仅提供后端 API，且不会存储开发者账号相关信息。
- API7 开发者门户管理端提供前端页面与后端模块，登录 API7 Enterprise 控制台即可使用。

## 调用展示端 API

### 调用时序图

![API7 Devportal process](https://static.apiseven.com/uploads/2023/04/25/8RPlzMWD_devportal-process.png)

### 调用鉴权

调用展示端的后端 API 需要鉴权以保证安全性。API7 开发者门户使用的是jwt鉴权方式，鉴权流程主要分为两部分，获取 access_token 和携带 token。

**步骤1：** 获取 access_token。

- 第一种方式是通过特定的代码片段来生成 access_token, 需要传入`组织 ID` 信息。
其中`secret`需要和 API7-Devportal 中保持一致。 
例如：

``shell

func GenerateToken(userID, secret string, expiredIn int) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
       "org_id": orgID,
       "iat": jwt.NewNumericDate(time.Now()),
       "exp": jwt.NewNumericDate(time.Now().Add(time.Second * time.Duration(expiredIn))),
    })

    return token.SignedString([]byte(secret))
}

``

- 第二种方式是通过调用 token 签发接口来获取 access_token ，同样需要携带组织 ID 信息。
API7 Devportal 将从 access_token 中获取组织 ID 信息，从而返回对应的组织下的信息。
例如:

``shell

curl -XPUT http://127.0.0.1:9000/devportal/sign  -H "Authorization: Bearer $root_access_token" -d 
'{
    "org_id": "$orgID"
}'

``

**步骤2：** 将 access_token 携带于 Authorization 头中访问.
例如：

``shell

curl http://127.0.0.1:9000/devportal/applications -H "Authorization: Bearer $access_token"

``


## 