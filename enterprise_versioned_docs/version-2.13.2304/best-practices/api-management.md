---
title: API Management
slug: /best-practices/api-management
tags:
  - API7 Enterprise
  - API Management
---

### API online debugging

#### Feature description

We provide a lightweight online API interface debugging tool that currently supports:

1. Custom request header parameters;
2. Common HTTP methods: GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS;
3. The POST/PUT method supports x-www-form-urlencoded and raw formats.
4. Common authentication methods: basic-auth, jwt-auth, key-auth.

Note: This feature is turned off by default, please contact your administrator to enable it.

### API publish and offline

#### Feature description

We support publishing and offline operations on the API.

#### How to use

First, you need to access the list of resources:

For the created API, you will find the corresponding Publish/Offline button on the list page, click the corresponding button to complete the operation:

![API List](https://static.apiseven.com/2022/12/30/63ae927e377ee.png)

### API Group Management

#### Feature description

Grouping is the basic attribute information of the API, which is convenient for the unified management of APIs of a specific class. We support this feature through the built-in tag feature.

#### How to use

First, you need to access the  API  list:

When we create or configure this resource, we include the management of tags.

### API import and export

#### Feature description

The OpenAPI Specification (OAS) defines a standard, language-independent RESTful API interface that allows us the ability to discover and understand services without accessing source code, docs, or checking through network requests.

API7 Dashboard supports importing OpenAPI 3.0 (OAS 3.0 for short) definition files to create routes (APIs). Currently, we support most of the OpenAPI specifications, but there are some differences in compatibility and extension fields.

#### Compatibility

When we import the API from OAS 3.0, some fields in OAS are missing because there are no corresponding fields in API7 Gateway's route object.

|        Category         |                                                                                             Description                                                                                              |
| :---------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    API General Info     |            Common information used to describe the API, such as API name, API version, description field, etc., more details see: https://swagger.io/docs/specification/api-general-info/            |
| API Server and Base URL | The base URL of an API and its base path, for example: in the Apache API, the upstream address/gateway node address. For details, see: https://swagger.io/docs/specification/api-host-and-base-path/ |
|     Path parameters     |                                                        For details, please see: https://swagger.io/docs/specification/describing-parameters/                                                         |
|    Query parameters     |                                            API parameters are described in QueryString, see: https://swagger.io/docs/specification/describing-parameters/                                            |
|  Response information   |                                           Define the content of the API request response, see: https://swagger.io/docs/specification/describing-responses/                                           |

#### Extended field

Some fields are required in API7 Gateway route, but are not included in the OAS 3.0 standard. We added some extension fields, such as upstream, plugins, hosts, etc. All extension fields are prefixed with x-apisix.

For more details on API7 Gateway routing properties, please refer to:

|      Extended fields      | API7 Gateway Route Properties |
| :-----------------------: | :---------------------------: |
|     x-apisix-plugins      |            plugins            |
|      x-apisix-script      |            script             |
|     x-apisix-upstream     |           upstream            |
| x-apisix-service_protocol |       service_protocol        |
|       x-apisix-host       |             host              |
|      x-apisix-hosts       |             hosts             |
|   x-apisix-remote_addr    |          remote_addr          |
|     x-apisix-priority     |           priority            |
|       x-apisix-vars       |             whose             |
|   x-apisix-filter_func    |          filter_func          |
|      x-apisix-labels      |            labels             |
| x-apisix-enable_websocket |       enable_websocket        |
|      x-apisix-status      |            status             |
|   x-apisix-create_time    |          create_time          |
|   x-apisix-update_time    |          update_time          |

#### Export API

First, you need to create a route by referring to the Create a Route guide.

Next, on the route list page, check the route you want to export:

Then, click the Export OpenAPI button in the lower left corner, select the export format and click Confirm.

Finally, you will be prompted to download the generated OpenAPI file to complete the export API feature.

#### Import API

First, go to the list of routes ( API) and click the Advanced Features - > Import OpenAPI button.

Next, select the OpenAPI file on your computer and confirm. If the import is successful, you will see that the route was created successfully; if the import fails, you will be prompted with an error message.

:::tip
If you import a resource with duplicate paths, the system will prompt for duplicate routes. For a discussion of this issue, please visit: https://github.com/apache/apisix-dashboard/issues/1468
:::

