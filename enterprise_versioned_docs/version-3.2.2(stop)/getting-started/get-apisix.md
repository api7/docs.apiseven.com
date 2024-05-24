---
title: Get APISIX
slug: /getting-started/
---

Apache APISIX is a dynamic, real-time, and high-performance API Gateway. It is a [top-level project](https://projects.apache.org/project.html?apisix) of the Apache Software Foundation.

You can use APISIX API Gateway as a traffic entrance to process all business data. It offers features including dynamic routing, dynamic upstream, dynamic certificates, A/B testing, canary release, blue-green deployment, limit rate, defense against malicious attacks, metrics, monitoring alarms, service observability, service governance, and more.

This tutorial uses a script to quickly install [Apache APISIX](https://api7.ai/apisix) in your local environment and verifies the installation through the Admin API. You can also use [API7 Cloud](https://api7.ai/cloud), a Cloud-host service, to manage APISIX.

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker/) to be used in the quickstart script to create containerized **etcd** and **APISIX**.
* Install [cURL](https://curl.se/) to be used in the quickstart script and to send requests to APISIX for validation.

## Get APISIX

:::caution

To provide a better experience in this tutorial, the requirement of Admin API key is switched off by default. Please turn on the API key requirement of Admin API in the production environment.

:::

APISIX can be easily installed and started with the quickstart script:

```shell
curl -sL https://run.api7.ai/apisix/quickstart-v3.2.0 | sh
```

The script starts two Docker containers, `apisix-quickstart` and `etcd-quickstart` in the `apisix-quickstart-net` Docker network, where etcd is used to store APISIX configurations.

You should see the following message once APISIX is ready:

```text
✔ APISIX is ready!
```

## Validate

Once APISIX is running, you can use curl to send a request to see if APISIX is working properly:

```shell
curl -sI "http://127.0.0.1:9080" | grep Server
```

If everything is ok, you will get the APISIX version similar to the following:

```text
Server: APISIX/3.2.0
```

APISIX is now installed and running.

## Next Steps

The following tutorial is based on the working APISIX, please keep everything running and move on to the next step.

* [Configure Routes](configure-routes.md)
* [Load Balancing](load-balancing.md)
* [Rate Limiting](rate-limiting.md)
* [Key Authentication](key-authentication.md)
