---
title: CentOS
slug: /poc/installation/centos
tags:
  - API7 Enterprise
  - Installation
---

:::info

This is the PoC installation guide. API7 Gateway and other components are deployed on the same machine. If you're looking for production solutions, please [contact us](https://api7.ai/contact).

:::

## Prerequisites

- CentOS version: 7.6 or higher.
- 1 Virtual Machine with 2 CPU cores and 4GB memory.

## Get Packages

```shell
wget https://repos.apiseven.com/api7/linux/amd64/api7-ee-2.13.2302.tar.gz

# Unzip the package to api7-ee-2.13.2302 directory
tar -zxvf api7-ee-2.13.2302.tar.gz
```

## Deploy Components

### Audit Logs (Optional)

#### OpenSearch

```shell
cd api7-ee-2.13.2302

cd opensearch && sudo sh install.sh --ip 127.0.0.1
```

```shell
# Verification
systemctl status opensearch

opensearch.service - OpenSearch
   Loaded: loaded (/etc/systemd/system/opensearch.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2023-03-29 15:41:44 UTC; 1h 27min ago
 Main PID: 10451 (java)
   CGroup: /system.slice/opensearch.service
           └─10451 /usr/local/opensearch/jdk/bin/java -Xshare:auto -Dopensearch.networkaddress.cache.ttl=60 -Dopensearch.networkaddress.cache.negative.ttl=10 -XX:+AlwaysPreTouch -Xss1m -Djava.awt.headless=true -Dfile.enc
```

### Observability (Optional)

#### AlertManager

```shell
cd api7-ee-2.13.2302

cd prometheus/alertmanager && sudo sh install.sh
```

```shell
# Verification
systemctl status alertmanager

alertmanager.service - Alertmanager
   Loaded: loaded (/etc/systemd/system/alertmanager.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2023-03-29 15:30:41 UTC; 1h 45min ago
 Main PID: 9232 (alertmanager)
   CGroup: /system.slice/alertmanager.service
           └─9232 /usr/local/bin/alertmanager --config.file=/etc/alertmanager/alertmanager.yml
```

#### Prometheus

```shell
cd api7-ee-2.13.2302

cd prometheus/prometheus && sudo sh install.sh
```

```shell
# Verification
systemctl status prometheus

prometheus.service - Prometheus
   Loaded: loaded (/etc/systemd/system/prometheus.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2023-03-29 15:30:40 UTC; 1h 44min ago
 Main PID: 9181 (prometheus)
   CGroup: /system.slice/prometheus.service
           └─9181 /usr/local/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/var/lib/prometheus --web.console.templates=/etc/prometheus/consoles --web.console.libraries=/etc/prometheus/console_libraries --web.enable-lifecycle
```

#### Grafana

```shell
cd api7-ee-2.13.2302

cd grafana && sudo sh install.sh
```

```shell
# Verification
systemctl status grafana-server

 Loaded: loaded (/usr/lib/systemd/system/grafana-server.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2023-03-30 01:23:38 UTC; 46min ago
     Docs: http://docs.grafana.org
 Main PID: 18520 (grafana)
   CGroup: /system.slice/grafana-server.service
           └─18520 /usr/share/grafana/bin/grafana server --config=/etc/grafana/grafana.ini --pidfile=/var/run/grafana/grafana-server.pid --packaging=rpm cfg:default.paths.logs=/var/log/grafana cfg:default.paths.data=/var/lib/grafana cfg:default.paths.plugins=/var/lib/grafana/plugins
```

#### Confd

```shell
cd api7-ee-2.13.2302

# For PoC we install all components on one node,so they all use the local IP.

cd prometheus/confd && sudo sh install.sh --etcd-ip 127.0.0.1 --dashboard-ip 127.0.0.1 --prometheus-ip 127.0.0.1 --alertmanager-ip 127.0.0.1
```

```shell
# Verification
systemctl status confd

confd.service - Confd
   Loaded: loaded (/etc/systemd/system/confd.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2023-03-29 15:41:53 UTC; 1h 34min ago
 Main PID: 10752 (confd)
   CGroup: /system.slice/confd.service
           └─10752 /usr/local/bin/confd --config-file=/etc/confd/confd.toml
```

### API7 Dashboard (Required)

This step is required to install API7 Dashboard and etcd.

```shell
cd api7-ee-2.13.2302

sudo sh install-cp.sh 
```

```shell
systemctl status api7-dashboard

api7-dashboard.service - api7-dashboard
   Loaded: loaded (/etc/systemd/system/api7-dashboard.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2023-03-29 15:41:56 UTC; 1h 34min ago
 Main PID: 10818 (manager-api)
   CGroup: /system.slice/api7-dashboard.service
           └─10818 /usr/local/apisix-dashboard/manager-api
```

### API7 Gateway (Required)

1. This step is required to install API7 Gateway.
2. Follow this [guide](./README.md) to visit API7 Dashboard and create a cluster, then replace the cluster-id in the following command.

![Create Cluster](https://static.apiseven.com/uploads/2023/03/30/56maNf98_SCR-20230330-k3y.png)

```shell
cd api7-ee-2.13.2302

# Create a cluster and retrieve the IP from the API7 Enterprise console.

cd gateway

sudo sh install.sh --etcd-ip 127.0.0.1 --cluster-prefix /api7/${cluster-id} --self-ip 127.0.0.1
```

```shell
# Verification
ps -ef | grep nginx
 
root     12944     1  0 17:14 ?        00:00:00 nginx: master process /bin/openresty -p /usr/local/apisix -c /usr/local/apisix/conf/nginx.conf
nobody   12945 12944  0 17:14 ?        00:00:00 nginx: worker process
nobody   12946 12944  0 17:14 ?        00:00:00 nginx: worker process
root     12947 12944  0 17:14 ?        00:00:00 nginx: privileged agent process
```

## What's Next?

- [Activate License](./README.md#activate-license)
- [Prepare Environment](../prepare-environment.md)
