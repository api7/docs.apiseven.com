---
title: APISIX Declarative CLI (ADC)
slug: /reference/adc
---

APISIX Declarative CLI (ADC) is a command-line tool for managing both APISIX and API7 Enterprise declaratively. It offers simplicity and clarity in defining the desired state of the gateway, allowing developers and administrators to focus on the result rather than the steps.

The declarative configurations serves as the single source of truth that developers can manage through their existing version control systems.

ADC has the following general syntax:

```shell
adc [command] [options]
```

with global options:

* `-V, --version` to check the version
* `-h, --help` to print the help menu of the command

## Configuring ADC

ADC needs to be configured before it can be used to manage the gateway. You can configure ADC using environment variables or command-line flags.

### Using Environment Variables

ADC exposes all configuration options as environment variables. For example, you can configure the backend type and address using the `ADC_BACKEND` and `ADC_SERVER` environment variables, respectively.

```shell
export ADC_BACKEND=api7ee
export ADC_SERVER=https://localhost:7443
```

A better way is to configure these options in a `.env` file:

```text title=".env"
ADC_BACKEND=api7ee
ADC_SERVER=https://localhost:7443
```

### Using Command-Line Flags

You can also configure ADC or overwrite the configuration in the environment variables using the command-line flags. For example, to configure/overwrite the backend type and address for the `ping` command:

```shell
adc ping --backend api7ee --server "https://localhost:7443"
```

Run `adc help [command]` to see the available configuration options for a command.

## Commands

### `adc ping`

Ping the configured backend to verify connectivity.

| Option                              | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `--verbose <integer>`             | `1`             | Overrides verbose logging levels.`0` represents no log, `1` represents basic logs, and `2` represents debug logs.                                   | `0`, `1` or `2` |        |
| `--backend <backend>`             | `apisix`                | Backend type to connect.                                          | `apisix` or `api7ee` | `ADC_BACKEND`       |
| `--server <string>`               | `http://localhost:9180` | Backend server address.                                |                      | `ADC_SERVER`        |
| `--token <string>`                      |                         | API token to access the backend.            |                      | `ADC_TOKEN`         |
| `--gateway-group <string>` | `default`               | Gateway group to operate on.       |                      | `ADC_GATEWAY_GROUP` |
| `--label-selector <selectors>`        |                         | Resource labels to filter for.                           |                      |                   |
| `--include-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should only contain the specified type.                          |                      |                   |
| `--exclude-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should exclude the specified type.                           |                      |                   |
| `--timeout <duration>`        |   `10s`     | Request timeout for the client to connect with the backend Admin API in duration, such as 30s, 10m, and 1h10m.                     |                      |                   |
| `--ca-cert-file <string>`        |                         | Path to CA certificate for verifying the backend Admin API.   |                      |       `ADC_CA_CERT_FILE`            |
| `--tls-client-cert-file <string>`        |                         | Path to mutual TLS client certificate for verifying the backend Admin API.                           |                      |      `ADC_TLS_CLIENT_CERT_FILE`             |
| `--tls-client-key-file <string>`        |                         | Path to mutual TLS client key for verifying the backend Admin API.                           |        `ADC_TLS_CLIENT_KEY_FILE`              |                   |
| `--tls-skip-verify`        |        `false`                 | Whether to verify the TLS certificate when connecting to the backend Admin API.                           |           `ADC_TLS_SKIP_VERIFY`           |                   |

#### Sample Usage

```shell
adc ping --backend api7ee --server https://localhost:7443
```

### `adc lint`

Validate the provided configuration files locally.

| Option                               | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `-f, --file <file-path>`             |                 | Files to lint.                                          |  |        |

#### Sample Usage

```shell
adc lint -f service-a.yaml -f service-b.yaml
```

### `adc sync`

Synchronize the local configuration to the connected backend.

| Option                              | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `--verbose <integer>`             | `1`             | Overrides verbose logging levels.`0` represents no log, `1` represents basic logs, and `2` represents debug logs.                                   | `0`, `1` or `2` |        |
| `--backend <backend>`             | `apisix`                | Backend type to connect.                                          | `apisix` or `api7ee` | `ADC_BACKEND`       |
| `--server <string>`               | `http://localhost:9180` | Backend server address.                                |                      | `ADC_SERVER`        |
| `--token <string>`                      |                         | API token to access the backend.            |                      | `ADC_TOKEN`         |
| `--gateway-group <string>` | `default`               | Gateway group to operate on.       |                      | `ADC_GATEWAY_GROUP` |
| `--label-selector <selectors>`        |                         | Resource labels to filter for.                           |                      |                   |
| `-f, --file <file-path>`              |                         | Configuration files to synchronize. |                      |                   |
| `--include-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should only contain the specified type.                          |                      |                   |
| `--exclude-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should exclude the specified type.                           |                      |                   |
| `--timeout <duration>`        |   `10s`     | Request timeout for the client to connect with the backend Admin API in duration, such as 30s, 10m, and 1h10m.                     |                      |                   |
| `--ca-cert-file <string>`        |                         | Path to CA certificate for verifying the backend Admin API.   |                      |       `ADC_CA_CERT_FILE`            |
| `--tls-client-cert-file <string>`        |                         | Path to mutual TLS client certificate for verifying the backend Admin API.                           |                      |      `ADC_TLS_CLIENT_CERT_FILE`             |
| `--tls-client-key-file <string>`        |                         | Path to mutual TLS client key for verifying the backend Admin API.                           |        `ADC_TLS_CLIENT_KEY_FILE`              |                   |
| `--tls-skip-verify`        |        `false`                 | Whether to verify the TLS certificate when connecting to the backend Admin API.                           |           `ADC_TLS_SKIP_VERIFY`           |                   |

#### Sample Usage

```shell
adc sync -f service-a.yaml -f service-b.yaml --backend api7ee --server https://localhost:7443
```

### `adc dump`

Save backend configuration to a local file.

| Option                              | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `--verbose <integer>`             | `1`             | Overrides verbose logging levels.`0` represents no log, `1` represents basic logs, and `2` represents debug logs.                                   | `0`, `1` or `2` |        |
| `--backend <backend>`             | `apisix`                | Backend type to connect.                                          | `apisix` or `api7ee` | `ADC_BACKEND`       |
| `--server <string>`               | `http://localhost:9180` | Backend server address.                                |                      | `ADC_SERVER`        |
| `--token <string>`                      |                         | API token to access the backend.            |                      | `ADC_TOKEN`         |
| `--gateway-group <string>` | `default`               | Gateway group to operate on.       |                      | `ADC_GATEWAY_GROUP` |
| `--label-selector <selectors>`        |                         | Resource labels to filter for.                           |                      |                   |
| `-o, --output <file-path>`                           |                         | Specify the file path where the backend data should be dumped.                                                 |                      |                   |
| `--include-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should only contain the specified type.                          |                      |                   |
| `--exclude-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should exclude the specified type.                           |                      |                   |
| `--timeout <duration>`        |   `10s`     | Request timeout for the client to connect with the backend Admin API in duration, such as 30s, 10m, and 1h10m.                     |                      |                   |
| `--ca-cert-file <string>`        |                         | Path to CA certificate for verifying the backend Admin API.   |                      |       `ADC_CA_CERT_FILE`            |
| `--tls-client-cert-file <string>`        |                         | Path to mutual TLS client certificate for verifying the backend Admin API.                           |                      |      `ADC_TLS_CLIENT_CERT_FILE`             |
| `--tls-client-key-file <string>`        |                         | Path to mutual TLS client key for verifying the backend Admin API.                           |        `ADC_TLS_CLIENT_KEY_FILE`              |                   |
| `--tls-skip-verify`        |        `false`                 | Whether to verify the TLS certificate when connecting to the backend Admin API.                           |           `ADC_TLS_SKIP_VERIFY`           |                   |

#### Sample Usage

```shell
adc dump -o apisix-dump.yaml --backend api7ee --server https://localhost:7443
```

### `adc diff`

Show differences in the configuration between the local file and the backend.

| Option                              | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `--verbose <integer>`             | `1`             | Overrides verbose logging levels.`0` represents no log, `1` represents basic logs, and `2` represents debug logs.                                   | `0`, `1` or `2` |        |
| `--backend <backend>`             | `apisix`                | Backend type to connect.                                          | `apisix` or `api7ee` | `ADC_BACKEND`       |
| `--server <string>`               | `http://localhost:9180` | Backend server address.                                |                      | `ADC_SERVER`        |
| `--token <string>`                      |                         | API token to access the backend.            |                      | `ADC_TOKEN`         |
| `--gateway-group <string>` | `default`               | Gateway group to operate on.       |                      | `ADC_GATEWAY_GROUP` |
| `--label-selector <selectors>`        |                         | Resource labels to filter for.                           |                      |                   |
| `-f, --file <file-path>`              |                         | Configuration files to compare. |                      |                   |
| `--include-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should only contain the specified type.                          |                      |                   |
| `--exclude-resource-type <string>`        |                         | Filter for resource types, such that the resource search results should exclude the specified type.                           |                      |                   |
| `--timeout <duration>`        |   `10s`     | Request timeout for the client to connect with the backend Admin API in duration, such as 30s, 10m, and 1h10m.                     |                      |                   |
| `--ca-cert-file <string>`        |                         | Path to CA certificate for verifying the backend Admin API.   |                      |       `ADC_CA_CERT_FILE`            |
| `--tls-client-cert-file <string>`        |                         | Path to mutual TLS client certificate for verifying the backend Admin API.                           |                      |      `ADC_TLS_CLIENT_CERT_FILE`             |
| `--tls-client-key-file <string>`        |                         | Path to mutual TLS client key for verifying the backend Admin API.                           |        `ADC_TLS_CLIENT_KEY_FILE`              |                   |
| `--tls-skip-verify`        |        `false`                 | Whether to verify the TLS certificate when connecting to the backend Admin API.                           |           `ADC_TLS_SKIP_VERIFY`           |                   |

#### Sample Usage

```shell
adc diff -f service-a.yaml -f service-b.yaml --backend api7ee --server https://localhost:7443
```

### `adc convert`

Convert API specification to ADC configuration.

| Option                               | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `openapi`             |                 | Convert an OpenAPI specification to ADC configuration.                                          |  |        |

#### Sample Usage

```shell
adc convert openapi -f open-api-spec.yaml -o adc.yaml
```

### `adc help`

Print the general help menu or the help menu for the specified command.

#### Sample Usage

```shell
adc help [command]
```
