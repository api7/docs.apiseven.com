---
title: User Management
slug: /features/user
tags:
  - API7 Enterprise
  - User Management
---

Dashboard supports user management system for managing internal staff information.

### Query user

Click the " Access Control " menu item in the top menu, and click " Users " on the left to enter the list.

The page will display multiple resources that have been created. Through the query area, you can query with the following parameters:

- Name

![Access Control](https://static.apiseven.com/2022/12/30/63ae53011a0a5.png)

### Create user

If you want to create a resource:

First, you need to access the resource list and click the  Create  button on the right to enter the creation process.

### Modify user

If you want to configure a resource:

First, you need to visit the list page and click the Configure button on the right side of the resource to enter the configuration process.

### Delete user

If you want to delete a resource:

First, you need to visit the list page, click the Delete button in the More drop-down menu to the right of the resource to confirm whether to delete.

### User locked

1. Login failed to lock


We can use the configuration item to set how long to lock after accumulating how many failed logins in a long time. such as:

```yaml
allow_login_failed_times: 5     # The maximum allowable login failure time
login_failed_stat_duration: 1h  # The maximum allowable login failure time statistical time
login_failed_lock_duration: 2h  # Account locking time
```

The above example means: within 1 hour, the cumulative login fails 5 times, and the account will be locked for 2 hours. After 2 hours of locking, the system will automatically unlock the user, and the administrator can also manually unlock the user on the Users page. The specific operation is as follows:

![Users](https://static.apiseven.com/2022/12/30/63ae53487976f.png)

2. Manually lock the account

Administrators can lock the specified user on the Users page.

Users who are manually locked will not be automatically unlocked. The administrator needs to unlock it on the Users page.

3. Super admin unlocked

In order to prevent the super administrator password from being blasted, the system will also monitor the number of super administrator password errors and lock it. In this case, we provide a command line tool, you can log in to the server deployed by Dashboard, and execute the following command to unlock it:

```sh
manager-api unlock --username=admin --work-dir /usr/local/apisix/dashboard/
```

### Authorization

The user role supports the subsequent configuration, and you can change the role of the user through the authorization feature. Click the Authorization button in the More drop-down menu to configure the target role, and click the Submit button on the Authorized User page to complete the authorization operation.
