---
title: Overview
slug: /introduction
tags:
  - API7 Enterprise
  - API7 Whitepaper
---

API7.ai's API Gateway product (hereinafter referred to as API7) is built based on Apache APISIX, a top-level project of the Apache Software Foundation. API7 consists of 3 components: API Gateway, ManagerAPI and Dashboard Control Panel.
 
As an important component in microservice architecture, the API gateway is the core entry and exit point for traffic, it is used to process business-related requests, which can effectively solve the problems of massive requests and malicious access to ensure business security and stability.

![API7 Technical Whitepaper](https://static.apiseven.com/2023/01/03/63b3cb10bd016.png)

API7 consists of 3 components: API Gateway, ManagerAPI, and Dashboard Control Panel. 

## API Gateway

API Gateway is used to carry and process business traffic. After administrators configure routing rules, the gateway will forward requests to upstream services according to the rules. In addition, with more than 60 built-in plugins, API7 is able to meet most business demands, such as authentication, security protection, traffic control, analysis and monitoring, request/response conversion, etc. If the built-in plugins cannot meet the demands, API7 also support custom plugins written in Lua, Java, Go and Python, which can be used at all stages of request entry and upstream response.

## ManagerAPI

ManagerAPI is used to manage API gateways by accessing their exposed RESTful API interfaces to manage resources such as routes, upstreams, certificates, global plugins, consumers, etc.

## Dashboard Control Plane

Dashboard control panel is a user interface used to simplify API gateway management. It supports monitoring and analysis, log auditing, multi-tenant management, multi-cluster switching, multiple work partitions, and other capabilities. Administrators can operate the API gateway through the Dashboard control panel.
