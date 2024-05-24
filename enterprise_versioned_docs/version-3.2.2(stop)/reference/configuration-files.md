---
title: Configuration Files
slug: /reference/configuration-files
---

APISIX has the following configuration files under `/conf`:

- `config-default.yaml`
- `config.yaml`
- `apisix.yaml`
- `debug.yaml`

This document provides a reference for how configuration files are used and how to manage configuration files by environments.

## Usage

### `config-default.yaml` and `config.yaml`

APISIX comes with a default configuration file called `config-default.yaml` and a user-defined configuration file called `config.yaml`.

The configurations in `config-default.conf` are used by default and **should not be modified**. It contains default configurations and comments for documentation:

```yaml
apisix:
  # node_listen: 9080               # APISIX listening port (single)
  node_listen:                      # APISIX listening ports (multiple)
    - 9080
  #   - port: 9081
  #     enable_http2: true          # If not set, the default value is `false`.
  #   - ip: 127.0.0.2
  #     port: 9082
  #     enable_http2: true
  enable_admin: true
  enable_dev_mode: false
  enable_reuseport: true 
  ...
```

For a complete list of configuration options, see [`config-default.yaml`](https://github.com/apache/apisix/blob/master/conf/config-default.yaml).

Custom configurations should be added to `config.yaml`, which take takes precedence over the configurations in `config-default.yaml`.

APISIX loads these configuration files once at startup. If you make changes to these files, [reload APISIX](./apisix-cli.md#apisix-reload) for changes to take effect.

### `apisix.yaml`

In APISIX standalone deployment mode, `apisix.yaml` is used to configure APISIX resources, such as [routes](../background-information/key-concepts/routes.md), [upstreams](../background-information/key-concepts/upstreams.md), [consumers](../background-information/key-concepts/consumers.md), and others.

These configurations are loaded by APISIX into memory at startup. Changes to this file do not require a reload of APISIX as the file is monitored for changes at a regular interval.

For more information about how to configure `apisix.yaml`, see Standalone Mode (coming soon).

[//]: <TODO: add link to standablone mode>

### `debug.yaml`

You can enable and customize APISIX debug mode using configuration options in `debug.yaml`.

Changes to this file do not require a reload of APISIX as the file is monitored for changes at a regular interval.

For more information about how to use debug mode, see Debug and Troubleshooting (coming soon).

[//]: <TODO: add link to debug and troubleshooting>

## Manage Configuration Files by Environments

Keeping configuration files separate for different environments, such as development, staging, and production, can provide several benefits, including increased flexibility, improved security, and easier maintenance.

APISIX supports separation of configuration files by environment. While the `config-default.yaml` file is always recognized as the default configuration, you can set the `APISIX_PROFILE` environment variable to determine which set of other configuration files APISIX should use.

By default, when `APISIX_PROFILE` is not set, APISIX looks for the following configuration files:

- `conf/config.yaml`
- `conf/apisix.yaml`
- `conf/debug.yaml`

If the value of `APISIX_PROFILE` is set to `prod`, APISIX looks for the following configuration files:

- `conf/config-prod.yaml`
- `conf/apisix-prod.yaml`
- `conf/debug-prod.yaml`

You can set `APISIX_PROFILE` to any other value that matches your environment.
