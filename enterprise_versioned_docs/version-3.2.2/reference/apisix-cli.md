---
title: APISIX CLI
slug: /reference/apisix-cli
---

The APISIX CLI (Command Line Interface) is a tool that allows you to start, stop, and manage your APISIX instances.

```bash
apisix [action]
```

## Commands

### `apisix help`

Print the APISIX CLI help menu.

### `apisix init`

Initialize the `nginx.conf` configuration.

### `apisix init_etcd`

Initialize data in etcd.

### `apisix start`

Initialize and start the APISIX instance.

### `apisix stop`

Stop the running APISIX instance immediately. APISIX will stop all worker processes without waiting for them to finish serving any outstanding requests.

### `apisix quit`

Quit the running APISIX instance gracefully. APISIX will wait for all worker processes to finish serving any outstanding requests before stopping.

### `apisix restart`

Restart the APISIX instance. This command checks the generated `nginx.conf` configuration first before stopping and restarting APISIX.

### `apisix reload`

Reload the APISIX instance. Reinitialize `nginx.conf` and apply configuration changes without interrupting existing connections.

### `apisix test`

Test the generated `nginx.conf` to validate the configuration.

### `apisix version`

Print APISIX version.
