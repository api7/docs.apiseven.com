---
title: Support Dubbo configuration
slug: /best-practices/dubbo
tags:
  - API7 Enterprise
  - Dubbo
---

API7 implements the httpproxy to dubbothrough the dubbo-proxy plugin.

### Enable dubbo-proxy plugin

#### Enable

API7 does not load the dobbo-proxy plugin by default. You need to add the following configuration to the configuration file of the gateway node ./conf/config.yaml. Restart the gateway node and activate the plugin.

```yaml
# Add this in config.yaml
plugins:  
  - ... # plugin you need
  - dubbo-proxy
plugin_attr:
  dubbo-proxy:
    upstream_multiplex_count: 32
```

Parameter description

|           Name           |  Type  | Required | Default Value | Valid Value |                          Description                           |
| :----------------------: | :----: | :------: | :-----------: | :---------: | :------------------------------------------------------------: |
| upstream_multiplex_count | number |   Yes    |      32       |     >=1     | Maximum number of multiplex requests in an upstream connection |

#### Binding API

The activation method of the dubbo-proxy plugin was introduced earlier. After the plugin is activated, it can bind the API to implement the http proxy to dubbo.

When binding the API, the dubbo-proxy plugin only needs to configure one field, as described below:

|      Name       |  Type  | Required | Default Value |      Description      |
| :-------------: | :----: | :------: | :-----------: | :-------------------: |
|  service_name   | string |   Yes    |               |  Dubbo service name   |
| service_version | string |   Yes    |               | Dubbo service version |
|     method      | string |    No    |   URI path    | Dubbo service method  |

#### Example

To facilitate verification, we need to first create an API and proxy requests to the Dubbo service under test.

The steps in the API7 Dashboard are as follows
1. Create plugin templates
  1. Go to the API  > Plugin Template page, click the Create button, and create a plugin template for dubbo-proxy.
  2. On the new plugin template page, enter the plugin template description, find the dubbo-proxy plugin through the search feature, and click the enable button

In the dubbo-proxy plugin configuration page, enable the plugin and configure it as follows:

```json
{
  "service_name": "org.apache.dubbo.sample.tengine.DemoService",
  "service_version": "0.0.0",
  "method": "tengineDubbo"
}
```

Click the submit button
  3. Returning to the Create Plugin Template page, you can see that the enable button of skywalking has turned blue, indicating that it is already enabled, click the submit button to create a plugin template.

Now, we have created a plugin template that includes the dubbo-proxy plugin, which can be used for API creation.

2. Create upstream upstream1, and the node IP port is 127.0.0.1:20880. The process of creating upstream is detailed in the Upstream - > Create Upstream chapter.
127.0.0.1:20880 the server address and open port where the Dubbo service is deployed

3. Create an API and configure the upstream service to upstream1, path, dubbo-proxy plugin, etc. For the process of creating an API, please refer to the API Management - > Create API section, here postscript if the dubbo-proxy plugin is enabled on the API.
In the process of creating the API, the plugin template can be selected from the dubbo-proxy template we have created.

4. Test request

The data returned from the upstream dubbo service must be of type Map < String, String > .
The sample service should return the following data

```json
{    
  "status": "200",    
  "header1": "value1",    
  "header2": "valu2",    
  "body": "blahblah"
}
```

Then the API request is as follows:

```sh
$ curl http://gateway_ip:port/hello

HTTP/1.1 200 OK # "status" will be the status code
...
header1: value1
header2: value2
...
blahblah # "body" will be the body
```

### Disable the dubbo-proxy plugin

#### Remove dubbo-proxy plugin for API binding

Stop specifying the API proxy Dubbo service, visually configure the API data through the API7 Dashboard, and submit it after the relevant configuration of the dubbo-proxy plugin is removed.

Here, modify the API directly through the API7 Dashboard, remove the bound dubbo-proxy plugin, and click the submit button.

#### Plugin disabled

Disable the dubbo-proxy plugin globally. To destroy the Timer, you need to restore ./conf/config.yaml or comment the dubbo-proxy below the plugins section. It will take effect after overloading API7:

```yaml
plugins:
#  - dubbo-proxy "#" means disable this plugin
```

