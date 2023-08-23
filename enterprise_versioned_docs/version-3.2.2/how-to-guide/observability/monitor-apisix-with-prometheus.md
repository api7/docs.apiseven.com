---
title: Monitor APISIX with Prometheus
slug: /how-to-guide/observability/monitor-apisix-with-prometheus
---

Prometheus is a popular systems monitoring and alerting toolkit. It collects and stores multi-dimensional time series data like metrics with key-value paired labels.

APISIX offers the capability to expose a significant number of metrics to Prometheus [with low latency](https://api7.ai/blog/1s-to-10ms-reducing-prometheus-delay-in-api-gateway), allowing for continuous monitoring and diagnostics.

This guide will show you how to enable the `prometheus` plugin to integrate with Prometheus and Grafana services, where APISIX HTTP metrics are collected and visualized.

<br/>
  <div style={{textAlign: 'center'}}>
    <img src="https://static.apiseven.com/uploads/2023/05/16/5Z5bIUwF_grafana-prometheus.jpg" alt="REST to gRPC Diagram" width="70%"/>
  </div>
<br/>

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker/).
* Install [cURL](https://curl.se/) to send requests to the services for validation.
* Follow the [Getting Started tutorial](./../../getting-started/) to start a new APISIX instance in Docker.

## Enable Prometheus Plugin

Create a global rule to enable the `prometheus` plugin on all routes by adding `"prometheus": {}` in the plugins option.

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/global_rules" -X PUT -d '{
  "id": "rule-for-metrics",
  "plugins": {
    "prometheus":{}
  }
}'
```

APISIX gathers internal runtime metrics and exposes them through port `9091` and path `/apisix/prometheus/metrics` by default. The port and path are supported to be customized in APISIX.

Send a request to the route `/apisix/prometheus/metrics` to fetch metrics from APISIX:

```shell
docker exec apisix-quickstart curl -sL "http://apisix-quickstart:9091/apisix/prometheus/metrics"
```

Responded metrics are similar to the following, holding all routes (such as an existing route `/ip` here) metrics:

```text
# HELP apisix_etcd_modify_indexes Etcd modify index for APISIX keys
# TYPE apisix_etcd_modify_indexes gauge
apisix_etcd_modify_indexes{key="consumers"} 0
apisix_etcd_modify_indexes{key="global_rules"} 0
apisix_etcd_modify_indexes{key="max_modify_index"} 16
apisix_etcd_modify_indexes{key="prev_index"} 15
apisix_etcd_modify_indexes{key="protos"} 0
apisix_etcd_modify_indexes{key="routes"} 16
apisix_etcd_modify_indexes{key="services"} 0
apisix_etcd_modify_indexes{key="ssls"} 0
apisix_etcd_modify_indexes{key="stream_routes"} 0
apisix_etcd_modify_indexes{key="upstreams"} 0
apisix_etcd_modify_indexes{key="x_etcd_index"} 16
# HELP apisix_etcd_reachable Config server etcd reachable from APISIX, 0 is unreachable
# TYPE apisix_etcd_reachable gauge
apisix_etcd_reachable 1
...
# HELP apisix_http_status HTTP status codes per service in APISIX
# TYPE apisix_http_status counter
apisix_http_status{code="200",route="ip",matched_uri="/ip",matched_host="",service="",consumer="",node="52.20.124.211"} 1
...
```

## Configure Prometheus

Targets are monitored objects in Prometheus. You can configure the APISIX metric endpoint as a target in the Prometheus configuration file `prometheus.yml`.

```shell
echo 'scrape_configs:
  - job_name: "apisix"
    scrape_interval: 15s
    metrics_path: "/apisix/prometheus/metrics"
    static_configs:
      - targets: ["apisix-quickstart:9091"]
' > prometheus.yml
```

Start a Prometheus instance in Docker. The exposed port is mapped to `9092` on the host because `9090` is reserved for APISIX. The local configuration file `prometheus.yml` is mounted to the Prometheus container.

```shell
docker run -d --name apisix-quickstart-prometheus \
  -p 9092:9090 \
  --network=apisix-quickstart-net \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:latest
```

You can now check if the state is "UP" on the Prometheus webpage. Prometheus will collect metrics from APISIX by scraping its metric HTTP endpoint.

![Prometheus](https://static.apiseven.com/uploads/2023/03/02/mRbZ4Hxm_prometheus.png)

## Configure Grafana

Grafana can visualize metrics stored in Prometheus. Start a Grafana instance on port `3000` in Docker.

```shell
docker run -d --name=apisix-quickstart-grafana \
  -p 3000:3000 \
  --network=apisix-quickstart-net \
  grafana/grafana-oss
```

Add the Prometheus instance created above to Grafana as a data source:

![Grafana Data Source](https://static.apiseven.com/uploads/2023/03/02/E9PNMkdv_grafana-data-source.png)

The official APISIX metric dashboard is published to [Grafana dashboards](https://grafana.com/grafana/dashboards/) with ID [11719](https://grafana.com/grafana/dashboards/11719-apache-apisix/). You can then import the dashboard into Grafana with the ID.

![Import Dashboard](https://static.apiseven.com/uploads/2023/03/02/21YcUlui_grafana-import-dashboard.png)

If everything is OK, the dashboard will automatically visualize metrics in real time.

![Grafana Dashboard](https://static.apiseven.com/uploads/2023/03/02/8hcTkwWW_grafana-dashboard.png)

## Next Steps

You have now learned how to monitor APISIX metrics with Prometheus and visualize them in Grafana.

Explore other resources in How-To Guides to monitor APISIX logs and traces (coming soon).

[//]: <TODO: Introduce metrics in L4 proxy (TCP/UDP) are also supported.>
[//]: <TODO: Add the link to the prometheus plugin>
