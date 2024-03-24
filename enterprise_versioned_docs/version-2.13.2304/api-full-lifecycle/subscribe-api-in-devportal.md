---
title: 通过开发者门户订阅 API
slug: /api-full-lifecycle/subscribe-api-in-devportal
tags:
- API7 Enterprise
---

本文将指导你作为一个开发者，如何登录开发者门户，申请订阅 API 以获取访问凭证，并成功调用 API。

## 前置要求

开发者门户中已有发布的 API。可以让管理员参考文档 [发布 API 到开发者门户](https://docs.apiseven.com/enterprise/user-manual/devportal/publish-api-to-devportal)。

## 查找 API
登录业务开放平台，可以根据目录，API 名称，API 描述等，定位到自己实际需要的 API。
进一步查看 OpenAPI Spec 文档，确认 API 的用法。

## 创建应用
以应用为主体发起申请订阅 API。请注意，API 的使用许可及 key 不属于某个特定开发者，而是根据业务划分，属于某个应用。同一个组织下的不同应用调用同一个 API 时，也需要使用不同的访问凭证。
例如，同一个组织内，A 部门负责的业务和B 部门负责的业务，都需要申请调用同一个外部 API，但在 API 管理员侧需要区分不同调用来源，未来进一步根据部门分配调用限额等，则应为 A 部门和 B 部门分别创建独立的应用，部门内部负责对应的 API key 的管理和维护。

或者，A 部门内有两个不同的系统，都需要申请调用同一个外部 API，为了识别不同调用来源，未来进一步根据不同系统限定调用频率，则应为两个系统分别创建独立的应用。

## 申请订阅 API
选择目标应用，发起 API 订阅申请，并等待 API 的管理员审批。

## 管理员在开发者门户管理端同意申请
[如何同意 API 申请](https://docs.apiseven.com/enterprise/user-manual/devportal/api#同意API订阅申请)。

## 在应用中查找 API key
订阅申请被管理员通过后，在应用详情中找到对应的 API 订阅记录，查看访问凭证，并按照 API 文档中的使用说明调用 API。对于同一个应用，如果订阅了多个使用同样认证方式（例如 key-auth）的 API，则对应的访问凭证是一样的。

## 撤回订阅 API 申请
申请等待审批期间，可以撤回。后续可再次发起申请。

## 订阅 API 申请被拒
如果申请被拒绝，你可以再次发起申请。
