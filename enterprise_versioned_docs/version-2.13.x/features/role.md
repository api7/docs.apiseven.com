---
title: Role Management
slug: /features/role
tags:
  - API7 Enterprise
  - Role Management
---

RBAC is a role-based resource access control mechanism. The API7 Dashboard controls the permissions that users can access resources by assigning roles to different users.
 
### Query role

Click "Access Control" menu in the top menu bar to enter the access control page, click " Roles " on the left to enter the list. The roles in API7 Dashboard are divided into System Role and Cluster Role.

The list page will display the multiple resources that have been created separately in the form of tabs.

- System Role: A role with cluster management privileges, access permission control, or system settings permissions. System Role is created by default after API7 Dashboard is initialized:

|  Role name   |                        Description                         |
| :----------: | :--------------------------------------------------------: |
| system_admin | System admin, which can manage all resources in the system |

![System Roles](https://static.apiseven.com/2022/12/30/63ae5227e5a19.png)

- Cluster Role: In the multi clusters scenario, API7 Dashboard supports fine grain authority control of the resources under the cluster. The role with the management rights of the resources in the cluster, and the cluster role in API7 Dashboard belongs to the specific cluster. After the cluster is initialized, API7 Dashboard will create three cluster roles by default for users to perform functional operations in the cluster. At the same time, after the working partition in the cluster is initialized, two roles in the working partition will also be created by default for users to perform functional operations in the working partition.

|        Role name         |                                                                 Description                                                                 |
| :----------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |
|      cluster_admin       | The administrator of the cluster can perform cluster node, cluster user authorization and management operations of resources in the cluster |
|     cluster_observer     |                             The observer of the cluster can view all the resource information under the cluster                             |
|     cluster_operator     |                                               Cluster operator, can manage cluster resources                                                |
|  {workspacename}_admin   |                    Working partition administrator, can perform resource management operations in the working partition                     |
| {workspacename}_observer |                    The observer of the working partition can view all the resource information in the working partition                     |

### Create a role

- Create System Role: When the default system role does not fulfill your needs, you can customize the system roles.

API7 Dashboard has a detailed classification of system permissions
- System settings view: have read-only permission for system settings 
- System settings update: have read and write permission for system settings 
- User View: have read-only permission for user management 
- User management: have read and write permission for user management 
- Role View: have read-only permission for  role management
- Role management: have read and write permission for role management 

- Create Cluster Role: When the default cluster role does not fulfill your needs, you can customize the cluster roles.

API7 Dashboard provides a detailed classification of cluster permissions
- Cluster resource management permissions
  - Cluster operation: have operation permission for cluster authorization and copying cluster information 
  - Resource view: have read-only permissions for Workspace, Certificate, and Consumer in the cluster
  - Resource management: have read and write permissions for Workspace, certificates, and Consumer in the cluster
  - Gateway node view: have read-only permissions for gateway node
  - Gateway node management: have read and write permissions for gateway node 
  - Alarm view: have read-only permission for alarm history, alarm policy and notification template 
  - Alarm management: have read and write permissions for alarm policy and notification template 
  - For each working partition in the cluster
    - Resource view: have read-only permissions for the API, upstream, and global plugins rules of the working partition in the cluster
    - Resource management: have read and write permissions for the API, upstream, and global plugins rules of the working partition in the cluster
    - Audit log view: has read-only access to the audit log of the working partition in the cluster
    - Audit log management: have read and write permissions to the audit log of the working partition in the cluster
    - Alarm viewing: have read-only access to the alarm calendar, alarm policy, and notification template of the working partition in the cluster
    - Alarm management: have read and write permissions for the alarm policy and notification template of the working partition in the cluster

### Modify role

If you want to configure a resource:

First, you need to visit the list page, then select the resource that needs to be modified, and click the Configuration button on the right to enter the configuration process.

Note: Default system roles cannot be configured.

![Configure System Role](https://static.apiseven.com/2022/12/30/63ae52d434641.png)

### Delete role

If you want to delete a resource:

First, you need to visit the list page, then find the resource that needs to be deleted, click the Delete button on the right to confirm whether to delete it.
