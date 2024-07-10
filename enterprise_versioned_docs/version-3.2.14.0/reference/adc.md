---
title: APISIX Declarative CLI (ADC)
slug: /reference/adc
---

APISIX Declarative CLI (ADC) 是一个命令行工具，用于声明式地管理 APISIX 和 API7 企业版。它提供了简单明了的方式来定义网关的期望状态，让开发人员和管理员专注于结果而非步骤。

声明式配置作为单一事实来源，开发人员可以通过他们现有的版本控制系统进行管理。

ADC 具有以下通用语法：


```shell
adc [command] [options]
```

以及全局选项：

* `-V, --version` to check the version
* `-h, --help` to print the help menu of the command

## 配置 ADC

在使用 ADC 管理网关之前，需要先进行配置。你可以使用环境变量或命令行参数来配置 ADC。

### 使用环境变量

ADC 将所有配置选项暴露为环境变量。例如，你可以分别使用 `ADC_BACKEND` 和 `ADC_SERVER` 环境变量来配置后端类型和地址。

```shell
export ADC_BACKEND=api7ee
export ADC_SERVER=https://localhost:7443
```

更好的方式是在 `.env` 文件中配置这些选项：

```text title=".env"
ADC_BACKEND=api7ee
ADC_SERVER=https://localhost:7443
```

### 使用命令行参数

你也可以使用命令行参数来配置 ADC 或覆盖环境变量中的配置。例如，为 `ping` 命令配置/覆盖后端类型和地址：

```shell
adc ping --backend api7ee --server "https://localhost:7443"
```

运行 `adc help [command]` 以查看命令的可用配置选项。

## 命令

### `adc ping`

Ping 已配置的后端以验证连接性。

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

#### 使用示例

```shell
adc ping --backend api7ee --server https://localhost:7443
```

### `adc lint`

Validate the provided configuration files locally.

| Option                               | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `-f, --file <file-path>`             |                 | Files to lint.                                          |  |        |

#### 使用示例

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

#### 使用示例

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

#### 使用示例

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

#### 使用示例

```shell
adc diff -f service-a.yaml -f service-b.yaml --backend api7ee --server https://localhost:7443
```

### `adc convert`

Convert API specification to ADC configuration.

| Option                               | Default Value           | Description                                                      | Valid Values         | Env Variable     |
|--------------------------------------|-------------------------|------------------------------------------------------------------|----------------------|-------------------|
| `openapi`             |                 | Convert an OpenAPI specification to ADC configuration.                                          |  |        |

#### 使用示例

```shell
adc convert openapi -f open-api-spec.yaml -o adc.yaml
```

### `adc help`

Print the general help menu or the help menu for the specified command.

#### 使用示例

```shell
adc help [command]
```
