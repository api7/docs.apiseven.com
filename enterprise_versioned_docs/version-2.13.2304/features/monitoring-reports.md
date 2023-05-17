---
title: Monitoring Reports
slug: /features/monitoring
tags:
  - API7 Enterprise
  - Monitoring Reports
---

You can quickly understand the routing situation under the current cluster on the monitoring page, which includes the following indicators:

1. Number of API calls;
2. API average latency;
3. API error rate;
4. Hotspot API (Top5);
5. Hot consumer information (Top5);
6. Distribution of API status codes;
7. ...

![Monitoring reports](https://static.apiseven.com/2022/12/30/63ae4d4e6780c.png)

### How to use it

Verify that the following services have started and can get data normally:

|   Service    |                                                           Start                                                           |
| :----------: | :-----------------------------------------------------------------------------------------------------------------------: |
| API7-Gateway |                                                   Successfully started                                                    |
|  Promethus   | Can successfully get the data of API7-Gateway (you can see the API7-Gateway node on the API7-Dashboard gateway node page) |

Step 1: Adjust the Grafana configuration

Modify the Grafana configuration to confirm that embedding is allowed.

```nginx
[security]
allow_embedding = true
```

Step 2: Generate the Grafana panel

1. Configure the Grafana data source for Prometheus

![Grafana](https://static.apiseven.com/2022/12/30/63ae4dbb99300.png)

2. Fill in the access address of prometheus

![Grafana](https://static.apiseven.com/2022/12/30/63ae4dd8df775.png)

3. Configure Dashboard

https://github.com/api7/api7/tree/master/docs/assets/other/json

Select the corresponding file content to upload, or fill in.

![Grafana](https://static.apiseven.com/2022/12/30/63ae4df6ae363.png)

![Grafana](https://static.apiseven.com/2022/12/30/63ae4dff7329b.png)

![Grafana](https://static.apiseven.com/2022/12/30/63ae4e0957835.png)

![Grafana](https://static.apiseven.com/2022/12/30/63ae4e13c305c.png)

![Grafana](https://static.apiseven.com/2022/12/30/63ae4e21157ad.png)

Step 3: Embed the Grafana panel

Fill in the Dashboard link address in the Grafana URL in the API7-Dashboard

![System Management](https://static.apiseven.com/2022/12/30/63ae4e899b6fb.png)
