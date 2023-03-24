---
title: Integrate with Apache SkyWalking
slug: /best-practices/apache-skywalking
tags:
  - API7 Enterprise
  - Apache SkyWalking
---

Apache SkyWalking is an application performance monitor and observability analysis platform for distributed systems. It provides multi-dimensional application performance analysis methods and alarm  features from call chain tracing to associative log analysis. At the same time, it is also one of the most popular applications performance monitor systems.

API7 Gateway has added support for the SkyWalking distributed tracing system in version 1.4, using its native Nginx LUA tracer to provide distributed tracing, topology analysis, and metrics information at the service and URI levels.

SkyWalking nginx-lua is an Nginx native distributed tracing system jointly maintained by Apache SkyWalking and Apache APISIX communities, providing the ability to call chain tracing.

### Enable SkyWalking plugin

#### Activate

API7 disables this plugin by default. You need to activate it manually and complete the Apache SkyWalking server configuration. After overloading API7, the skywalking plugin creates a timer to report heartbeat and Tracing data to the Apache SkyWalking server-level periodically.

To enable the plugin, you only need to add the following configuration in ./conf/config.yaml:

```yaml
plugins:
  - skywalking 

plugin_attr:
  skywalking: 
    service_name: API7
    service_instance_name: $hostname
    endpoint_addr: http://127.0.0.1:12800
    report_interval: 15 
```

The following is a description of the SkyWalking server level information configuration item.

|         Name          |  Type   |                    Default Value                     |                                                                  Description                                                                   |
| :-------------------: | :-----: | :--------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------: |
|     service_name      | string  |                        APISIX                        | The service name is equivalent to the APISIX cluster name, a logically unique name used to represent all APISIX instance nodes in the cluster. |
| service_instance_name | string  |                 APISIX Instance Name                 |      The instance name is used to identify the APISIX instance and is set to $hostname if you expect to get the native hostname directly.      |
|     endpoint_addr     | string  |                http://127.0.0.1:12800                |                                    Skywalking's HTTP endpoint address, for example: http://127.0.0.1:12800                                     |
|    report_interval    | integer | Use the values built into the skywalking client side |                                                       Reporting time interval in seconds                                                       |

#### Binding API

The method of enabling the skywalking plugin has been introduced earlier, but enabling the plugin will not report trace data. It is also necessary to specify which APIs enable SkyWalking's Tracing sampling.

When binding the API, the SkyWalking plugin only needs to configure one field, as described below:

|     Name     |  Type  | Required | Default Value | Valid Value  |       Description       |
| :----------: | :----: | :------: | :-----------: | :----------: | :---------------------: |
| sample_ratio | number |   Yes    |       1       | [0.00001, 1] | Percentage of listeners |

It is important to note that sample_ratiovalid values range from 0.00001 to 1 (including boundary values), and the minimum granularity of the current control sample rate for SkyWalking is a single API level.

#### Example

In order to facilitate verification, we need to create an API first, proxy the request to http://httpbin.org, and set the sampling rate of SkyWalking to 1 (100%) to ensure that every request can be collected.

The steps in the API7 Dashboard are as follows:
1. Create plugin templates
  1. Go to the API - > Plugin Template page, click the Create button, and create a plugin template for SkyWalking.
  2. On the new plugin template page, enter the plugin template description, find the skywalking plugin through the search feature, and click the Enable button.

In the skywalking plugin configuration page, enable the plugin and configure the sample rate as follows:

```json
{
    "sample_ratio": 1
}
```

Click the submit button。
  3. Returning to the Create Plugin Template page, you can see that the enable button of skywalking has turned blue, indicating that it is already enabled. Click the submit button to create a plugin template.
 We have created a plugin template that includes the skywalking plugin, which can be used for API creation.

2. Create Upstream upstream1, and the node domain name is http://httpbin.org. 
httpbin.org is an online HTTP testing site, which can convert incoming requests to JSON format and return them to the client.

3. Create API, configure upstream, path, skywalking plugin, etc. The process of creating API is detailed in the API - > Create API section.

4. Test example
After the request http://127.0.0.1:9080/get, the response should be as follows:

```json
{
  "args": {}, 
  "headers": {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
      "Accept-Encoding": "gzip, deflate, br", 
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7", 
      "Cache-Control": "max-age=0", 
      "Dnt": "1", 
      "Host": "127.0.0.1", 
      "Sec-Ch-Ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"", 
      "Sw8": "1-YmRkMjkxZDktYTU4Yy00NmQ0LThkM2YtMDE2YzgxNjgyODkx-YmRkMjkxZDktYTU4Yy00NmQ0LThkM2YtMDE2YzgxNjgyODkx-1-QVBJU0lY-QVBJU0lYIEluc3RhbmNlIE5hbWU=-L2dldA==-dXBzdHJlYW0gc2VydmljZQ==", 
      "Upgrade-Insecure-Requests": "1", 
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36", 
      "X-Amzn-Trace-Id": "Root=1-60bd1280-6b57800c1b1381f44e7fb046", 
      "X-Forwarded-Host": "127.0.0.1"
  }, 
  "origin": "127.0.0.1, 50.7.59.195", 
  "url": "http://127.0.0.1/get"
}
```

Please confirm that in the above request results, you can see that the HTTP response header contains a key-value pair named sw8: if it is included, it means that the sampling of the SkyWalking plugin is working normally, and the corresponding data can be queried in the SkyWalking WebUI. Trace information; if it is not included, you need to check whether the address of SkyWalking Collector in the configuration of the plug-in is correct, etc.

### Disable the SkyWalking plugin

We have already introduced how to enable the SkyWalking plugin, complete the binding of the plugin, and complete the collection and reporting of the call chain. However, in the face of complex network conditions, it is inevitable to adjust the sampling rate of the call chain of some APIs, stop the sampling work of some APIs, or even disable the SkyWalking plug-in globally. You can refer to the following to remove and disable the plugin.

#### Remove SkyWalking plugin with API bindings

If you need to stop the sampling of the call chain of the specified API, you only need to remove the configuration related to the SkyWalking plugin. Similarly, modify the sample rate of the specified API call chain to directly update the value of sample_ratio in the configuration, and the change will take effect directly without reloading API7 Gateway. Of course, you can also configure the API data visually through API7 Dashboard, cancel the SkyWalking configuration, and submit it.

We can modify the API directly through API7 Dashboard, remove the skywalking plugin that has been bound, and click the submit button.

#### Disabled Plugin

Disable the skywalking plugin globally, destroy the Timer, you need to restore ./conf/config.yaml or comment on the plugins below the skywalking section, and it will take effect after reloading API7:

```yaml
plugins:
#  - skywalking 

plugin_attr:
  skywalking: 
    service_name: APISIX
    service_instance_name: $hostname
    endpoint_addr: http://127.0.0.1:12800
    report_interval: 15 
```