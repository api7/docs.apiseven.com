---
title: Install API7 Enterprise v2.8 via Docker
slug: /poc/installation
tags:
  - API7 Enterprise
  - Installation
---

## Topology

![Typology](https://static.apiseven.com/2022/12/30/63ae8ddc41739.png)

## Prerequisite(s)

|       Resource        |                             Description                             |
| :-------------------: | :-----------------------------------------------------------------: |
| Server Instance Count |              2 (1 for Data Plane, 1 for Control Plane)              |
|          CPU          |                            CPU >= 4 core                            |
|        Memory         |                            Memory >= 8GB                            |
|          OS           |                          CentOS 7.6 ~ 7.9                           |
|        Docker         |                               20.10.7                               |
|    Docker Compose     |                               1.29.2                                |
|    Data Plane Port    |                            80, 443, 9091                            |
|  Control Plane Port   |                          9000, 2379, 9090                           |
|         Other         | Please monitor instances usage like CPU, Disk, Memory (recommended) |

### Server Instance Security

Disable SELinux service and disable firewalld or iptables in the PoC environment only.

#### Disable SELinux

Edit /etc/selinux/config and set SELINUX to disabled.

```text
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=disabled
# SELINUXTYPE= can take one of three values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```

#### Disable Firewall

##### firewalld

Run the following command to disable firewalld

```sh
$ systemctl stop firewalld
```

Run the following command to check and make sure it's disabled

```sh
$ systemctl status firewalld

● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
     Docs: man:firewalld(1)
```

NOTE: If systemctl is not found, please use service firewalld stop to stop firewalld, and use service firewalld status to check firewalld status.

##### iptables

Run the following command to disable iptables

```sh
$ systemctl stop iptables
```

Run the following command to check if iptables is diabled.

```sh
$ systemctl status iptables

● iptables.service
   Active: inactive (dead)
```

NOTE: If systemctl is not found, please use service iptables stop to stop iptables, and use service iptables status to check iptables status.

### Docker and Docker Compose

Install Docker first

```sh
$ sudo yum install -y yum-utils

$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

$ sudo yum install -y docker-ce-20.10.7-3.el7 docker-ce-cli-20.10.7-3.el7 containerd.io
```

Install Docker Compose 1.29.2

```sh
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose

$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

Run the following command to check if they're installed successfully.

```sh
$ sudo docker version

Client: Docker Engine - Community
 Version:           20.10.7
 API version:       1.41
 Go version:        go1.13.15
 Git commit:        f0df350
 Built:             Wed Jun  2 11:58:10 2021
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true
```

```sh
$ sudo docker-compose -v

docker-compose version 1.29.2, build 5becea4c
```

### API7 Enterprise Packages

#### Control Plane

Control Plane contains Dashboard, ETCD, OpenSearch (optional), Prometheus, confd, and Alertmanager.

|  Component   |                  Description                  |
| :----------: | :-------------------------------------------: |
|  Dashboard   |                Easy to use GUI                |
|     etcd     |       KV store to store configurations        |
|  Prometheus  |           Monitor Gateway instances           |
|    confd     |              Alarm configuration              |
| AlertManager |                 Alarm system                  |
|  OpenSearch  | (Optional) Store Audit and Alarm history logs |

Download `packages_api7_2.8.2206_api7-2.8.2206-cp.tar.gz` and upload to Control Plane Instance. Following is the structure:

```text
├── images                 // Docker Images
├── cli.sh                 
├── alertmanager_conf      
├── confd_conf             
├── dashboard_conf         
      └── conf.yaml        
├── dashboard_logs         
├── etcd_data              
├── opensearch_data
├── prometheus_conf
├── prometheus_data
```

:::tip
The opensearch_data and prometheus_data directories need write permissions. 

For the convenience of PoC, we can directly change their permissions to 666. 

```sh
sudo chmod -R 666 opensearch_data
sudo chmod -R 666 prometheus_data
```

In the production environment, it is recommended to configure a special user to run OpenSearch and Prometheus, and only give the user write permissions
:::

#### Data Plane

Data Plane contains API7 Gateway, and it's used to handle API traffic.

Download `packages_api7_2.8.2206_api7-2.8.2206-dp.tar.gz` and upload to Data Plane Instance. Following is the structure:

```text
├── images                 // Docker Images
├── cli.sh                 
├── gateway_conf           
        └── config.yaml    
├── gateway_logs
```

## Start Docker

Run the following command to start Docker.

```sh
$ sudo systemctl start docker
```

Run the following command to check if Docker is running.

```sh
$ sudo systemctl status docker

● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; disabled; vendor preset: disabled)
   Active: active (running) since Tue 2021-08-17 08:18:46 UTC; 32min ago
     Docs: https://docs.docker.com
 Main PID: 3244 (dockerd)
    Tasks: 75
   Memory: 35.0M
   CGroup: /system.slice/docker.service
```

## Deploy API7 Enterprise

### Control Plane

1. Put Control Plane package under the /usr/local/api7_ent directory.
2. Run sudo sh cli.sh start to start service.
3. Run sudo docker ps to check service status.
4. Visit {Control_Plane_IP}:9000 in browser. Username and Password are admin by default.
5. Create a Cluster on Dashboard, and copy the Cluster ID.

:::tip
Cluster ID acts as etcd key prefix in Data Plane.
:::

### Data Plane

1. Put Data Plane Package under the /usr/local/api7_ent directory.
2. Edit gateway_conf/config.yaml and update apisix.enable_ipv6 to false.
3. Edit gateway_conf/config.yaml and update etcd.prefix to Control Plane's Cluster ID.
4. Run the following command to start service.

```sh
$ sudo sh cli.sh start --cp-ip {Control_Plane_IP}
```

5. Run `sudo docker ps` to check the service status
6. Visit Dashboard and navigate to `Gateways` to check if API7 Gateway is online.

## Stop API7 Enterprise

### Control Plane

Run the following command to stop Control Plane.

```sh
$ sudo sh cli.sh stop

Stopping poc_api7-dashboard_1 ... done
Stopping poc_opensearch_1     ... done
Stopping poc_etcd_1           ... done
Stopping poc_confd_1          ... done
Stopping poc_alertmanager_1   ... done
Stopping poc_prometheus_1     ... done
Removing poc_api7-dashboard_1 ... done
Removing poc_opensearch_1     ... done
Removing poc_etcd_1           ... done
Removing poc_confd_1          ... done
Removing poc_alertmanager_1   ... done
Removing poc_prometheus_1     ... done
Removing network poc_api7
```

### Data Plane

Run the following command to stop Data Plane.

```sh
$ sudo sh cli.sh stop

Stopping poc_api7-gateway_1 ... done
Removing poc_api7-gateway_1 ... done
Removing network poc_api7
```

If you have any questions, feel free to contact us by Email or Slack.
