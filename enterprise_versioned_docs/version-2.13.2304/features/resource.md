---
title: Management of resources
slug: /features/resources
tags:
  - API7 Enterprise
  - Management of resources
---

More and more enterprises will run multiple API7 clusters and etcd clusters internally, and the API7 Dashboard supports the ability to visually configure gateways in the case of multiple clusters.

### Cluster management

#### Query cluster

Click the Cluster Management menu item on the left to enter the list.

The list page will display multiple resources that have been created. Through the query area, you can query by the following parameters.

- Cluster name

![Cluster Name](https://static.apiseven.com/2022/12/30/63ae4c49df9ce.png)

#### Create a cluster

If you need to create a resource:

First, you need to access the cluster list , then click the " Create " button to enter the creation process with information, and finally click " Add " to complete the creation.

![Query Cluster](https://static.apiseven.com/2022/12/30/63ae4c49df9ce.png)

The API7 Dashboard has a built-in default etcd resource for you to create clusters.

#### Modify the cluster

If you want to set up a resource:

First, you need to visit the list page, then select the resource that needs to be modified, click the " More " button, and click the " Configure " button in the drop-down list to enter the configuration process.

![Modify Cluster](https://static.apiseven.com/2022/12/30/63ae4ca5b035d.png)

You can modify the name of the cluster through the configuration feature. In order to protect your data integrity, the etcd resource of the cluster is not configurable.

#### Delete cluster

If you want to delete a resource:

First, you need to visit the list page, then find the resource that needs to be deleted, click the " More " button, and click the " Delete " button in the drop-down list to enter the deletion process.


#### Authorization

If you want to grant users permissions to use a cluster:

First, you need to visit the list page, then find the target resource, click the " More " button, and click the " Authorize " button in the drop-down list to enter the authorization process.

![Authorization](https://static.apiseven.com/2022/12/30/63ae4cca116ef.png)

Select the user who needs the authorization, select the cluster role, and click the Update button in the lower right corner of the page to complete the authorization process. For more information on cluster roles, see the "Role Management" chapter.

### etcd management

#### Create etcd cluster

If you need to create a resource:

First, you need to access the resource list, then click the "Create" button on the right to enter the creation process.

![Create etcd cluster](https://static.apiseven.com/2022/12/30/63ae4cf3072e3.png)

Note: The etcd node Internet Protocol address:port needs to be filled in "Address"

#### Modify etcd cluster

If you want to configure a resource:

First, you need to visit the list page, then select the resource that needs to be modified, and click the Configure button on the right to enter the configuration process.

![Modify etcd cluster](https://static.apiseven.com/2022/12/30/63ae4d1af103d.png)

#### Delete etcd cluster

If you want to delete a resource:

First, you need to visit the list page, then find the resource that needs to be deleted, and click the Delete button on the right to enter the deletion process.
