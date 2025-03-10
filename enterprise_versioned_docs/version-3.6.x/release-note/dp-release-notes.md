---
title: 数据面更新日志
slug: /dp-release-notes
---

## DP3.6.0 版本

**发布日期**: 2025-02-26

### 新功能

#### 数据面和控制面版本解耦

从 3.6.0 版本开始，数据平面和控制平面的版本将解耦，允许独立升级。控制平面通常会兼容多个数据平面版本，而数据平面版本为了保持稳定性，会以较慢的速度演进。

### Apache APISIX 更新同步

* 修复服务发现问题：[使用节点缓存 original_nodes](https://github.com/apache/apisix/pull/10722)，[更新 upstream.nodes 时的竞争条件问题](https://github.com/apache/apisix/pull/11916)。
