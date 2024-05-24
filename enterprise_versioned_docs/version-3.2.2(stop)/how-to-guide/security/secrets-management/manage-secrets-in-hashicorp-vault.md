---
title: Manage APISIX Secrets in HashiCorp Vault
slug: /how-to-guide/security/secrets-management/manage-secrets-in-hashicorp-vault
---

[HashiCorp Vault](https://www.vaultproject.io/) is a centralized platform for managing secrets and encryption across different environments and applications. It provides a unified secrets management for storing and accessing, such as API keys, passwords, certificates, and more.

APISIX supports storing sensitive data in the configuration file as secrets, such as `admin_key`, etcd `username`, `password`.

This guide will show you how to configure HashiCorp Vault as a secrets manager, then store the APISIX `admin_key` in Vault and reference the key in APISIX configuration file.

![Integration with Vault](https://static.apiseven.com/uploads/2023/03/24/vdQ2rKxq_Vault.jpg)

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker/).
* Install [cURL](https://curl.se/) to send requests to the services for validation.
* Install [ZIP](https://infozip.sourceforge.net/Zip.html) to unzip the Vault binary from the [official distributed zipped file](https://developer.hashicorp.com/vault/downloads).
* Follow the [Getting Started tutorial](../../../getting-started/) to start a new APISIX instance in Docker.

## Configure Vault Server

Start a Vault instance in dev mode in Docker named `apisix-quickstart-vault` with the token `apisix-quickstart-vault-token`. The exposed port is mapped to `8200` on the host machine:

```shell
docker run -d --cap-add=IPC_LOCK \
    -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200' \
    -e 'VAULT_ADDR=http://127.0.0.1:8200' \
# highlight-start
    -e 'VAULT_DEV_ROOT_TOKEN_ID=apisix-quickstart-vault-token' \
    -e 'VAULT_TOKEN=apisix-quickstart-vault-token' \
    --network=apisix-quickstart-net \
    --name apisix-quickstart-vault \
# highlight-end
    -p 8200:8200 vault:1.13.0
```

APISIX needs permission to access Vault and retrieve secrets. You should create a policy file in [HashiCorp Configuration Language (HCL)](https://github.com/hashicorp/hcl) to generate a Vault access token for APISIX.

Create a Vault policy file named `apisix-policy.hcl` in the Vault instance to grant read permission of the path `secret/` to APISIX. You can put secrets under the path `secret/` to allow APISIX to read them:

```shell
docker exec apisix-quickstart-vault /bin/sh -c "echo '
# highlight-start
path \"secret/data/*\" {
    capabilities = [\"read\"]
}
# highlight-end
' > /etc/apisix-policy.hcl"
```

Apply the policy file to the Vault instance:

```shell
docker exec apisix-quickstart-vault vault policy write apisix-policy /etc/apisix-policy.hcl
```

Next, generate the access token attached to the newly defined policy for APISIX to access Vault:

```shell
docker exec apisix-quickstart-vault vault token create -policy="apisix-policy"
```

Every execution of the above command will generate a different token. If successful, the output should be similar to the following:

```text
Key                  Value
---                  -----
# highlight-start
token                hvs.CAESIHUznrV4wgcifUia0FROd6iprK7NjipAiHBYwiZDQP9TGh4KHGh2cy5ndHc5dzBPbXd5Y1pzblZXd2ZuQXA3ZHI
# highlight-end
token_accessor       YY4iCj2lICDNd50ZJDsBjvZK
token_duration       768h
token_renewable      true
token_policies       ["apisix-policy" "default"]
identity_policies    []
policies             ["apisix-policy" "default"]
```

Copy the value of token and create a file named `apisix-vault-token` to store it in the APISIX instance:

```shell
docker exec apisix-quickstart /bin/sh -c "echo '
# highlight-start
hvs.CAESIHUznrV4wgcifUia0FROd6iprK7NjipAiHBYwiZDQP9TGh4KHGh2cy5ndHc5dzBPbXd5Y1pzblZXd2ZuQXA3ZHI
# highlight-end
' > /usr/local/apisix/conf/apisix-vault-token"
```

Vault Agent uses the token `apisix-vault-token` to authenticate with Vault in the next step.

## Configure Vault Agent

Vault Agent is a client daemon that runs with your applications and automates authentication with Vault and token renewal. It acts as a proxy for Vault's API and renders Vault secrets as files.

Sensitive configurations in APISIX can be stored in the Vault, and then the Vault Agent reads them and inject them into the APISIX configuration file, such as the `admin_key`.

Download the Vault binary and copy it into the APISIX instance:

```shell
wget https://releases.hashicorp.com/vault/1.13.0/vault_1.13.0_linux_amd64.zip
unzip vault_1.13.0_linux_amd64.zip
docker cp vault apisix-quickstart:/usr/local/bin/
```

Create a file in APISIX instance named `vault-agent-apisix.hcl` to configure how the Vault Agent accesses the server and renders the secrets.

```shell
docker exec apisix-quickstart /bin/sh -c "echo '
pid_file = \"./pidfile\"

vault {
  # highlight-start
  // Annotate 1
  address = \"http://apisix-quickstart-vault:8200\"
  # highlight-end
  retry {
    num_retries = 5
  }
}

auto_auth {
  method {
    type   = \"token_file\"
    config = {
      # highlight-start
      // Annotate 2
      token_file_path = \"/usr/local/apisix/conf/apisix-vault-token\"
      # highlight-end
    }
  }
}

# highlight-start
// Annotate 3
listener \"tcp\" {
  address = \"127.0.0.1:8100\"
  tls_disable = true
}
# highlight-end

template {
  # highlight-start
  // Annotate 4
  source      = \"/usr/local/apisix/conf/config.ctmpl\"
  // Annotate 5
  destination = \"/usr/local/apisix/conf/config.yaml\"
  # highlight-end
}
' > /usr/local/apisix/conf/vault-agent-apisix.hcl"
```

❶ Vault address

❷ Token for authentication

❸ Vault Agent daemon listening attributes

❹ Template file for rendering

❺ Rendered APISIX configuration file

Vault Agent injects secrets into the APISIX configuration file `config.yaml` according to the template file `config.ctmpl` after it is started. Both two files are stored in the APISIX default configuration path `/usr/local/apisix/conf/`.

## Store a Secret

Create a secret `adminKey=apisix-quickstart-key` and store it in the path `secret/apisix/` of Vault:

```shell
docker exec apisix-quickstart-vault vault kv put secret/apisix adminKey=apisix-quickstart-key
```

The expected response is similar to the following:

```text
=== Secret Path ===
secret/data/apisix

======= Metadata =======
Key                Value
---                -----
created_time       2023-03-15T11:42:17.123175125Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
```

## Use the Secret

Create an APISIX template configuration file named `config.ctmpl` in the APISIX instance. Populate the `admin_key` using [Consul Template syntax](https://github.com/hashicorp/consul-template/blob/v0.28.1/docs/templating-language.md), which will be replaced with `secret/apisix/adminKey` at runtime.

[//]: <TODO: Fix the insecure `allow_admin` in future>

```shell
docker exec apisix-quickstart /bin/sh -c "echo '
deployment:
  role: traditional
  role_traditional:
    config_provider: etcd
  admin:
    allow_admin:
      - 0.0.0.0/0
    admin_key:
      -
        name: admin
        # highlight-start
        key: {{ with secret \"secret/apisix\"}} {{ .Data.data.adminKey }} {{ end }}
        # highlight-end
        role: admin
plugin_attr:
  prometheus:
    export_addr:
      ip: 0.0.0.0
      port: 9091
' > /usr/local/apisix/conf/config.ctmpl"
```

The following command starts the Vault Agent daemon in the APISIX instance with the configuration file `vault-agent-apisix.hcl` created above. The Agent will retrieves the secret `admin_key` and injects it into the APISIX configuration file `config.yaml`.

```shell
docker exec -d apisix-quickstart vault agent -config=/usr/local/apisix/conf/vault-agent-apisix.hcl
```

Reload the APISIX container for configuration changes to take effect:

```shell
docker exec apisix-quickstart apisix reload
```

## Validate

To verify that the new `admin_key` is in effect:

1. Request Admin API with the correct `admin_key`:

  ```shell
  curl -i "http://localhost:9180/apisix/admin/routes" -H 'X-API-KEY: apisix-quickstart-key'
  ```

  The expected response is similar to the following:

  ```text
  HTTP/1.1 200 OK
  ...
  ```

2. Request Admin API with a wrong `admin_key`:

  ```shell
  curl -i "http://localhost:9180/apisix/admin/routes" -H 'X-API-KEY: wrong-key'
  ```

  The expected response is similar to the following:

  ```
  HTTP/1.1 401 Unauthorized
  ...
  ```

## Next Steps

APISIX supports Vault as the backend to manage other types of secrets, such as JWT tokens and certificates.

See other guides in this chapter (coming soon) to learn more about integrating Vault with APISIX for authentication and certificates management.
