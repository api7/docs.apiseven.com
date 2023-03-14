---
title: Service Governance
slug: /features/service-governance
tags:
  - API7 Enterprise
  - API7 Whitepaper
  - Service Governance
---

API7 has built-in service governance features such as flow and rate limiting, service meltdown, IP blacklist and whitelist, and fault isolation.

## Flow Limit and Rate Limit

API7 limits the flow and rate based on the Leaky Bucket algorithm, with three built-in limit-count, limit-req, and limit-conn plugins to limit the flow and rate:

|    Name     |                      Description                       |
| :---------: | :----------------------------------------------------: |
| limit-count |            Rate limit based on fixed window            |
|  limit-req  | Request rate limit based on the leaky bucket principle |
| limit-conn  |               Limit concurrent requests                |

Take limit-req for example, which contains the following parameters:

|   Parameter   |  Type   | Required |                                    Range                                    |                                                          Description                                                          |
| :-----------: | :-----: | :------: | :-------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: |
|     rate      | integer |   Yes    |                                     >0                                      | The maximum allowed request rate. Requests greater than rate but less than rate + burst will be delayed. The unit is seconds. |
|     burst     | integer |   Yes    |                                     >=0                                     |                                     The rate of requests that are allowed to be delayed.                                      |
|      key      | string  |   Yes    | `remote_addr,server_addr,http_x_real_ip,http_x_forwarded_for,consumer_name` |                               The keyword used to limit the request rate (request count basis).                               |
| rejected_code | integer |   Yes    |                                   200~599                                   |         This status code will be returned when the request rate exceeds rate + burst. The default status code is 503.         |

After creating the route through the control panel, bind the limit-req plugin for it, assuming that the rate is set to 1, burst to 2, and rejected_code to 503, which means that the rate per second is 1. When the rate exceeds 1 but is less than 3, the request will be delayed; when the rate exceeds 3, the request will be rejected and the rejected_code will be returned, such as 503.

## IP blacklist and whitelist 

API7 has a built-in IP blacklist and whitelist plugin that allows administrators to set it through the control panel. By setting up a blacklist IP list or a whitelist IP list, you can control the access to resources of routes and services.

## Meltdown

When a request arrives at the API gateway, there are 3 sorts of possibile outcomes:

- A normal request and a normal response.
- The request is normal and the response is abnormal.
- The request is abnormal.

When a large number of requests arrive, if the upstream service cannot respond to the requests in time and is in a blocking state, there will be a situation where the upstream service is defeated. As an API gateway, it should be able to detect and handle abnormal problems in time to avoid more serious problems. In this case, API gateway service degradation will come into play.
