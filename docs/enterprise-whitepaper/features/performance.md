---
title: Performance
slug: /features/performance
tags:
  - API7 Enterprise
  - API7 Whitepaper
  - Performance
---

API7 adopts excellent performance solutions in all aspects from route matching, JSONSchema validation, and plugin operation.

Take route matching as an example, API7 uses the self-developed radixtree (open-sourced by API7.ai) algorithm for routing, which does not reduce efficiency when the number of routes is very large because its time complexity is O(K) (K is the length of the route string, independent of the number of routes).

The following figure shows the latency comparison between API7 and Kong Enterprise Edition (Kong EE) at 10000 rps.

![Performance](https://static.apiseven.com/2023/01/03/63b3e47f143b3.png)

The latency performance of API7 is very stable, 99.9% of requests are processed within 6 milliseconds; while Kong EE's latency is 10 times higher than API7.

The following figure shows the latency performance for the same 10,000 rps with the JWT authentication plugin enabled:

![Performance](https://static.apiseven.com/2023/01/03/63b3e493309f3.png)

The request latency performance of API7 remains stable with the JWT plugin enabled, while the latency of Kong Enterprise Edition is hundreds of times higher than API7, which is a significant difference.