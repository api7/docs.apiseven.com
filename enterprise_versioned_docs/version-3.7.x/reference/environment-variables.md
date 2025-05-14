---
title: 环境变量
slug: /reference/environment-variables
description: 了解如何在 API7 企业版中使用环境变量配置消费者凭证、 SSL 证书和插件。
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

API7 企业版支持使用 [消费者凭证](../key-concepts/consumers.md#authentication--authorization)、[SSL 证书](../key-concepts/ssl-certificates.md) 以及部分插件。系统保留了一些特殊用途的环境变量，同时也支持创建自定义名称的环境变量并进行引用。

## 保留环境变量

API7 企业版目前保留以下环境变量：

| 变量名                  | 描述                                                                 |
|-------------------------|---------------------------------------------------------------------|
| `APISIX_DEPLOYMENT_ETCD_HOST` | etcd 主机地址。            |
| `APISIX_WORKER_PROCESSES`    | 工作进程数量。            |

使用这些配置时，需在启动 APISIX 前为环境变量赋值。

## 自定义环境变量

您可以在配置文件和部分插件中使用自定义环境变量。

:::warning

环境变量直接配置在各数据平面（网关实例）上，重启后立即生效。由于这种配置方式，您无法从控制平面查看实际值。此外，网关组内不同网关实例间的环境变量配置不一致可能导致不可预测的行为和 API 故障。

:::

### 消费者凭证

以下消费者凭证中的敏感字段可通过 [NGINX `env` 指令](https://nginx.org/en/docs/ngx_core_module.html#env) 存储于环境变量：

* 密钥认证凭证中的 `key`
* 基础认证凭证中的 `password`
* JWT 认证凭证中的 `secret` 和 `public key`
* HMAC 认证凭证中的 `secret key`

以下示例展示如何配置密钥认证凭证从环境变量获取用户认证密钥。

#### 设置环境变量

<Tabs>
<TabItem value="docker" label="Docker" default>

部署网关实例时设置环境变量。参照 [添加网关实例](../getting-started/add-gateway-instance.md)，然后将环境变量添加到生成的脚本中。

Docker 示例，在 `docker run` 命令中添加自定义环境变量：

```shell
docker run -d -e API7_CONTROL_PLANE_ENDPOINTS='["https://your-host-or-ip:443"]' \
-e API7_GATEWAY_GROUP_SHORT_ID=default \
# highlight-start
-e ALICE_AUTH_KEY=alice-key \
# highlight-end
-e API7_CONTROL_PLANE_CERT="-----BEGIN CERTIFICATE-----
MIIBiDCCATqgAwIBAgICBAAwBQYDK2VwMEQxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
EwpDYWxpZm9ybmlhMQ0wCwYDVQQKEwRBUEk3MREwDwYDVQQDEwhBUEk3IEluYzAe
Fw0yNDEwMjkwMzM4NTJaFw0yNTExMjgwMzM4NTJaMDAxDTALBgNVBAoTBEFQSTcx
HzAdBgNVBAMTFmFwaTdlZTMtYXBpc2l4LWdhdGV3YXkwKjAFBgMrZXADIQBpBV0D
YBeCedUrIWvyk2YHORcmzBeCiActHJk3u4ZkyKNkMGIwDgYDVR0PAQH/BAQDAgeA
MBMGA1UdJQQMMAoGCCsGAQUFBwMCMC0GA1UdDgQmBCQyOWEzZmVlZi1hNzM2LTQy
OTEtODlmZS0xOWI4MDFjODNjZWQwDAYDVR0jBAUwA4ABMDAFBgMrZXADQQA0aeIB
5Gy5cVYrRgM+PRduSumjDMyDFNbH01GNQ/5RTeyMaH3lAj64JLOO4sQe7gy3dDxx
b7N9mKGl8iMzSLwF
-----END CERTIFICATE-----" \
-e API7_CONTROL_PLANE_KEY="-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIJ6hn4EQKXSh4U+2SFPJhBh3RxN/1trnsu2Zjp6hRB5A
-----END PRIVATE KEY-----" \
-e API7_CONTROL_PLANE_CA="-----BEGIN CERTIFICATE-----
MIIBdTCCASegAwIBAgIQVXqTFu/hH4caZptKdGp04zAFBgMrZXAwRDELMAkGA1UE
BhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcxETAPBgNV
BAMTCEFQSTcgSW5jMB4XDTI0MDkwNzA4MTc0NVoXDTM0MDkwNTA4MTc0NVowRDEL
MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcx
ETAPBgNVBAMTCEFQSTcgSW5jMCowBQYDK2VwAyEAkTj447bpztG1dc0HVW74za+v
NEAhU7mySYSmUSwdRfCjLzAtMA4GA1UdDwEB/wQEAwIChDAPBgNVHRMBAf8EBTAD
AQH/MAoGA1UdDgQDBAEwMAUGAytlcANBAKxxBg/CEnOoxQnVd8ixHKJCgChZ2IZE
BLCHaQTEbmfy8RQ+po0cKOthWFDx8gsx2AjdkLO5PPaHPujIXyfz8QI=
-----END CERTIFICATE-----" \
-p 9080:9080 \
-p 9443:9443 \
api7/api7-ee-3-gateway:dev
```

:::note

部署后，网关实例的环境变量需重启实例才能修改。

:::

</TabItem>

<TabItem value="k8s" label="Kubernetes">

部署网关实例时设置环境变量。参照 [添加网关实例](../getting-started/add-gateway-instance.md)，然后将环境变量添加到生成的脚本 YAML 中。

脚本示例，在 `helm upgrade` 命令中添加自定义环境变量：

```shell
helm repo add api7 https://charts.api7.ai
helm repo update
cat > /tmp/tls.crt <<EOF
-----BEGIN CERTIFICATE-----
MIIBiDCCATqgAwIBAgICBAAwBQYDK2VwMEQxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
EwpDYWxpZm9ybmlhMQ0wCwYDVQQKEwRBUEk3MREwDwYDVQQDEwhBUEk3IEluYzAe
Fw0yNDEwMjkwMjM2NDZaFw0yNTExMjgwMjM2NDZaMDAxDTALBgNVBAoTBEFQSTcx
HzAdBgNVBAMTFmFwaTdlZTMtYXBpc2l4LWdhdGV3YXkwKjAFBgMrZXADIQC/VNWu
FG+9OiY1/oq3FQerIY5EPIxf/IBOwtVjwBB2gqNkMGIwDgYDVR0PAQH/BAQDAgeA
MBMGA1UdJQQMMAoGCCsGAQUFBwMCMC0GA1UdDgQmBCQ3NDdjMTRiZS1jMjkxLTQ4
MzktYmY1OC1hOGI5NzEyMzFlNGUwDAYDVR0jBAUwA4ABMDAFBgMrZXADQQBmdE9t
Y33uJexnJ268Hk8RhMP/tO5ieogCwvlv2Hdv9r5FMZ+i/46k/aCOExoy+APGh95v
R0Hdari+JQeub7oB
-----END CERTIFICATE-----
EOF
cat > /tmp/tls.key <<EOF
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIPq6J0PDW7N4p0lTpPpsbNhYXF6mTCQWcoDC0je5xHAO
-----END PRIVATE KEY-----
EOF
cat > /tmp/ca.crt <<EOF
-----BEGIN CERTIFICATE-----
MIIBdTCCASegAwIBAgIQVXqTFu/hH4caZptKdGp04zAFBgMrZXAwRDELMAkGA1UE
BhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcxETAPBgNV
BAMTCEFQSTcgSW5jMB4XDTI0MDkwNzA4MTc0NVoXDTM0MDkwNTA4MTc0NVowRDEL
MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcx
ETAPBgNVBAMTCEFQSTcgSW5jMCowBQYDK2VwAyEAkTj447bpztG1dc0HVW74za+v
NEAhU7mySYSmUSwdRfCjLzAtMA4GA1UdDwEB/wQEAwIChDAPBgNVHRMBAf8EBTAD
AQH/MAoGA1UdDgQDBAEwMAUGAytlcANBAKxxBg/CEnOoxQnVd8ixHKJCgChZ2IZE
BLCHaQTEbmfy8RQ+po0cKOthWFDx8gsx2AjdkLO5PPaHPujIXyfz8QI=
-----END CERTIFICATE-----
EOF
kubectl create namespace test --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic -n test api7-ee-3-gateway-tls --from-file=tls.crt=/tmp/tls.crt --from-file=tls.key=/tmp/tls.key --from-file=ca.crt=/tmp/ca.crt
helm upgrade --install -n test --create-namespace api7-ee-3-gateway api7/gateway \
  --set "etcd.auth.tls.enabled=true" \
  --set "etcd.auth.tls.existingSecret=api7-ee-3-gateway-tls" \
  --set "etcd.auth.tls.certFilename=tls.crt" \
  --set "etcd.auth.tls.certKeyFilename=tls.key" \
  --set "etcd.auth.tls.verify=true" \
  --set "gateway.tls.existingCASecret=api7-ee-3-gateway-tls" \
  --set "gateway.tls.certCAFilename=ca.crt" \
  --set "apisix.extraEnvVars[0].name=API7_GATEWAY_GROUP_SHORT_ID" \
  --set "apisix.extraEnvVars[0].value=default" \
  # highlight-start
  --set "apisix.extraEnvVars[1].name=ALICE_AUTH_TOKEN" \
  --set "apisix.extraEnvVars[1].value=alice-key" \
  # highlight-end
  --set "etcd.host[0]=https://your-host-or-ip:443" \
  --set "apisix.replicaCount=1" \
  --set "apisix.image.repository=api7/api7-ee-3-gateway" \
  --set "apisix.image.tag=dev"
```

YAML 示例：

```yaml
apiVersion: v1
data:
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJpRENDQVRxZ0F3SUJBZ0lDQkFBd0JRWURLMlZ3TUVReEN6QUpCZ05WQkFZVEFsVlRNUk13RVFZRFZRUUkKRXdwRFlXeHBabTl5Ym1saE1RMHdDd1lEVlFRS0V3UkJVRWszTVJFd0R3WURWUVFERXdoQlVFazNJRWx1WXpBZQpGdzB5TkRFd01qa3dNak0yTkRaYUZ3MHlOVEV4TWpnd01qTTJORFphTURBeERUQUxCZ05WQkFvVEJFRlFTVGN4Ckh6QWRCZ05WQkFNVEZtRndhVGRsWlRNdFlYQnBjMmw0TFdkaGRHVjNZWGt3S2pBRkJnTXJaWEFESVFBZTlJR3UKUFphOVcwS3RYcnVNRmpXMEdvUjdsc3oxNUVwQ1B3bnhnTU9ENWFOa01HSXdEZ1lEVlIwUEFRSC9CQVFEQWdlQQpNQk1HQTFVZEpRUU1NQW9HQ0NzR0FRVUZCd01DTUMwR0ExVWREZ1FtQkNRd09UbGlOVGcyTXkwNU1XSXlMVFF3Ck5HSXRZamsxTnkxa01UbGlaRE13TmpZek1HSXdEQVlEVlIwakJBVXdBNEFCTURBRkJnTXJaWEFEUVFEVVpsOTYKZTJOUUd6QXNwaUQ5Y0FlY2w5QmZTNFdTWFIwb1R3M1NBZytEN0lYVTVzT09meWlWVjR1SnRBeldIOVJaN3lNSwo5dkR1V2RlWEFhTlI4T01DCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=
  tls.key: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUdkTTBGT2VMNGk4T2dLTjNGd3JhL1NZQnNWWnZoWWVHVXlKd05YdnIwdXUKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==
  ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkVENDQVNlZ0F3SUJBZ0lRVlhxVEZ1L2hINGNhWnB0S2RHcDA0ekFGQmdNclpYQXdSREVMTUFrR0ExVUUKQmhNQ1ZWTXhFekFSQmdOVkJBZ1RDa05oYkdsbWIzSnVhV0V4RFRBTEJnTlZCQW9UQkVGUVNUY3hFVEFQQmdOVgpCQU1UQ0VGUVNUY2dTVzVqTUI0WERUSTBNRGt3TnpBNE1UYzBOVm9YRFRNME1Ea3dOVEE0TVRjME5Wb3dSREVMCk1Ba0dBMVVFQmhNQ1ZWTXhFekFSQmdOVkJBZ1RDa05oYkdsbWIzSnVhV0V4RFRBTEJnTlZCQW9UQkVGUVNUY3gKRVRBUEJnTlZCQU1UQ0VGUVNUY2dTVzVqTUNvd0JRWURLMlZ3QXlFQWtUajQ0N2JwenRHMWRjMEhWVzc0emErdgpORUFoVTdteVNZU21VU3dkUmZDakx6QXRNQTRHQTFVZER3RUIvd1FFQXdJQ2hEQVBCZ05WSFJNQkFmOEVCVEFECkFRSC9NQW9HQTFVZERnUURCQUV3TUFVR0F5dGxjQU5CQUt4eEJnL0NFbk9veFFuVmQ4aXhIS0pDZ0NoWjJJWkUKQkxDSGFRVEVibWZ5OFJRK3BvMGNLT3RoV0ZEeDhnc3gyQWpka0xPNVBQYUhQdWpJWHlmejhRST0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ==
kind: Secret
metadata:
  name: api7-ee-3-gateway-tls
  namespace: test
type: kubernetes.io/tls
---
apisix:
  replicaCount: 1
  image:
    repository: api7/api7-ee-3-gateway
    tag: dev
  extraEnvVars:
  - name: API7_GATEWAY_GROUP_SHORT_ID
    value: "default"
  # highlight-start
  - name: ALICE_AUTH_KEY
    value: "alice-key"
  # highlight-end
etcd:
  host:
  - "https://your-host-or-ip:443"
  auth:
    tls:
      enabled: true
      existingSecret: api7-ee-3-gateway-tls
      certFilename: tls.crt
      certKeyFilename: tls.key
      verify: true
gateway:
  tls:
    existingCASecret: api7-ee-3-gateway-tls
    certCAFilename: ca.crt
```

:::note

部署后，网关实例的环境变量需重启实例才能修改。

:::

</TabItem>
</Tabs>

#### 配置使用环境变量的消费者凭证

1. 从侧边栏选择您网关组的 **Consumers**。
2. 点击 **+ Add Consumer**。
3. 在对话框中：
   * 在 **Name** 字段输入 `Alice`
   * 点击 **Add**

4. 在 **Credentials** 标签页下，点击 **+ Add Key Authentication Credential**
5. 在对话框中：
   * 在 **Name** 字段输入 `primary-key`
   * 在 **Key** 字段选择 **Manually Input**，然后输入 `$env://ALICE_AUTH_KEY`
   * 点击 **Add**

6. 验证：参照 [为 API 启用密钥认证](../api-security/api-authentication#enable-key-authentication-for-apis) 的说明，在服务级别启用 [Key Auth Plugin](https://docs.api7.ai/hub/key-auth)。然后按照 [验证密钥认证](../api-security/api-authentication#validate-key-authentication) 的步骤操作。

### SSL 证书

SSL 证书中的敏感字段 `private key` 和 `certificate` 可通过 [NGINX `env` 指令](https://nginx.org/en/docs/ngx_core_module.html#env) 存储于环境变量。

以下示例展示如何配置 SSL 证书从环境变量获取敏感数据。

#### 设置环境变量

<Tabs>
<TabItem value="docker" label="Docker" default>

部署网关实例时设置环境变量。参照 [添加网关实例](../getting-started/add-gateway-instance.md)，然后将环境变量添加到生成的脚本中。

Docker 示例，在 `docker run` 命令中添加自定义环境变量：

```shell
docker run -d -e API7_CONTROL_PLANE_ENDPOINTS='["https://your-host-or-ip:443"]' \
-e API7_GATEWAY_GROUP_SHORT_ID=default \
# highlight-start
-e SSL_CERTIFICATE="-----BEGIN CERTIFICATE-----
MIIBiDCCATqgAwIBAgICBAAwBQYDK2VwMEQxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
EwpDYWxpZm9ybmlhMQ0wCwYDVQQKEwRBUEk3MREwDwYDVQQDEwhBUEk3IEluYzAe
Fw0yNDEwMjkwMzM4NTJaFw0yNTExMjgwMzM4NTJaMDAxDTALBgNVBAoTBEFQSTcx
HzAdBgNVBAMTFmFwaTdlZTMtYXBpc2l4LWdhdGV3YXkwKjAFBgMrZXADIQBpBV0D
YBeCedUrIWvyk2YHORcmzBeCiActHJk3u4ZkyKNkMGIwDgYDVR0PAQH/BAQDAgeA
MBMGA1UdJQQMMAoGCCsGAQUFBwMCMC0GA1UdDgQmBCQyOWEzZmVlZi1hNzM2LTQy
OTEtODlmZS0xOWI4MDFjODNjZWQwDAYDVR0jBAUwA4ABMDAFBgMrZXADQQA0aeIB
5Gy5cVYrRgM+PRduSumjDMyDFNbH01GNQ/5RTeyMaH3lAj64JLOO4sQe7gy3dDxx
b7N9mKGl8iMzSLwF
-----END CERTIFICATE-----" \
-e SSL_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIJ6hn4EQKXSh4U+2SFPJhBh3RxN/1trnsu2Zjp6hRB5A
-----END PRIVATE KEY-----" \
# highlight-end
-e API7_CONTROL_PLANE_CERT="-----BEGIN CERTIFICATE-----
MIIBiDCCATqgAwIBAgICBAAwBQYDK2VwMEQxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
EwpDYWxpZm9ybmlhMQ0wCwYDVQQKEwRBUEk3MREwDwYDVQQDEwhBUEk3IEluYzAe
Fw0yNDEwMjkwMzM4NTJaFw0yNTExMjgwMzM4NTJaMDAxDTALBgNVBAoTBEFQSTcx
HzAdBgNVBAMTFmFwaTdlZTMtYXBpc2l4LWdhdGV3YXkwKjAFBgMrZXADIQBpBV0D
YBeCedUrIWvyk2YHORcmzBeCiActHJk3u4ZkyKNkMGIwDgYDVR0PAQH/BAQDAgeA
MBMGA1UdJQQMMAoGCCsGAQUFBwMCMC0GA1UdDgQmBCQyOWEzZmVlZi1hNzM2LTQy
OTEtODlmZS0xOWI4MDFjODNjZWQwDAYDVR0jBAUwA4ABMDAFBgMrZXADQQA0aeIB
5Gy5cVYrRgM+PRduSumjDMyDFNbH01GNQ/5RTeyMaH3lAj64JLOO4sQe7gy3dDxx
b7N9mKGl8iMzSLwF
-----END CERTIFICATE-----" \
-e API7_CONTROL_PLANE_KEY="-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIJ6hn4EQKXSh4U+2SFPJhBh3RxN/1trnsu2Zjp6hRB5A
-----END PRIVATE KEY-----" \
-e API7_CONTROL_PLANE_CA="-----BEGIN CERTIFICATE-----
MIIBdTCCASegAwIBAgIQVXqTFu/hH4caZptKdGp04zAFBgMrZXAwRDELMAkGA1UE
BhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcxETAPBgNV
BAMTCEFQSTcgSW5jMB4XDTI0MDkwNzA4MTc0NVoXDTM0MDkwNTA4MTc0NVowRDEL
MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcx
ETAPBgNVBAMTCEFQSTcgSW5jMCowBQYDK2VwAyEAkTj447bpztG1dc0HVW74za+v
NEAhU7mySYSmUSwdRfCjLzAtMA4GA1UdDwEB/wQEAwIChDAPBgNVHRMBAf8EBTAD
AQH/MAoGA1UdDgQDBAEwMAUGAytlcANBAKxxBg/CEnOoxQnVd8ixHKJCgChZ2IZE
BLCHaQTEbmfy8RQ+po0cKOthWFDx8gsx2AjdkLO5PPaHPujIXyfz8QI=
-----END CERTIFICATE-----" \
-p 9080:9080 \
-p 9443:9443 \
api7/api7-ee-3-gateway:dev
```

:::note

部署后，网关实例的环境变量需重启实例才能修改。

:::

</TabItem>

<TabItem value="k8s" label="Kubernetes">

部署网关实例时设置环境变量。参照 [添加网关实例](../getting-started/add-gateway-instance.md)，然后将环境变量作为 Kubernetes Secrets 添加到生成的脚本或 YAML 文件中。

脚本示例：

```shell
helm repo add api7 https://charts.api7.ai
helm repo update
cat > /tmp/tls.crt <<EOF
-----BEGIN CERTIFICATE-----
MIIBiDCCATqgAwIBAgICBAAwBQYDK2VwMEQxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
EwpDYWxpZm9ybmlhMQ0wCwYDVQQKEwRBUEk3MREwDwYDVQQDEwhBUEk3IEluYzAe
Fw0yNDEwMjkwOTE3NThaFw0yNTExMjgwOTE3NThaMDAxDTALBgNVBAoTBEFQSTcx
HzAdBgNVBAMTFmFwaTdlZTMtYXBpc2l4LWdhdGV3YXkwKjAFBgMrZXADIQDT/g4a
WVWigZG2oWGlDLTtTKBtHVystWQxj6XhG1vANaNkMGIwDgYDVR0PAQH/BAQDAgeA
MBMGA1UdJQQMMAoGCCsGAQUFBwMCMC0GA1UdDgQmBCRhMDQ2NGY4YS1kM2FhLTRk
MTMtODk5MC0xYmE0MWM1NGYxMTgwDAYDVR0jBAUwA4ABMDAFBgMrZXADQQActMzf
rggeykNFWKlqqyyQoqK8c9fFmplSHY7zYbUEydmq0LNLnnZAp2LmesUDVh4cbJCK
9haqhJ7oCgKk5psG
-----END CERTIFICATE-----
EOF
cat > /tmp/tls.key <<EOF
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIA9uC9kLMs11oG50sFpUFrcbHvRu/BtwUGfKISzYiXV+
-----END PRIVATE KEY-----
EOF
cat > /tmp/ca.crt <<EOF
-----BEGIN CERTIFICATE-----
MIIBdTCCASegAwIBAgIQVXqTFu/hH4caZptKdGp04zAFBgMrZXAwRDELMAkGA1UE
BhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcxETAPBgNV
BAMTCEFQSTcgSW5jMB4XDTI0MDkwNzA4MTc0NVoXDTM0MDkwNTA4MTc0NVowRDEL
MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExDTALBgNVBAoTBEFQSTcx
ETAPBgNVBAMTCEFQSTcgSW5jMCowBQYDK2VwAyEAkTj447bpztG1dc0HVW74za+v
NEAhU7mySYSmUSwdRfCjLzAtMA4GA1UdDwEB/wQEAwIChDAPBgNVHRMBAf8EBTAD
AQH/MAoGA1UdDgQDBAEwMAUGAytlcANBAKxxBg/CEnOoxQnVd8ixHKJCgChZ2IZE
BLCHaQTEbmfy8RQ+po0cKOthWFDx8gsx2AjdkLO5PPaHPujIXyfz8QI=
-----END CERTIFICATE-----
EOF
kubectl create namespace demo --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic -n demo api7-ee-3-gateway-tls --from-file=tls.crt=/tmp/tls.crt --from-file=tls.key=/tmp/tls.key --from-file=ca.crt=/tmp/ca.crt
# highlight-start
kubectl apply -n demo -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: env-secrets
type: Opaque
data:
  SSL_CERTIFICATE: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJpRENDQVRxZ0F3SUJBZ0lDQkFBd0JRWURLMlZ3TUVReEN6QUpCZ05WQkFZVEFsVlRNUk13RVFZRFZRUUkKRXdwRFlXeHBabTl5Ym1saE1RMHdDd1lEVlFRS0V3UkJVRWszTVJFd0R3WURWUVFERXdoQlVFazNJRWx1WXpBZQpGdzB5TkRFd01qa3dPVEUwTlRSYUZ3MHlOVEV4TWpnd09URTBOVFJhTURBeERUQUxCZ05WQkFvVEJFRlFTVGN4Ckh6QWRCZ05WQkFNVEZtRndhVGRsWlRNdFlYQnBjMmw0TFdkaGRHVjNZWGt3S2pBRkJnTXJaWEFESVFDcitTZ1gKVW5HT0NZbjRtb3RiRWRLbWpPUkhuMFRjVHBwc1VqVE5BRFdMbmFOa01HSXdEZ1lEVlIwUEFRSC9CQVFEQWdlQQpNQk1HQTFVZEpRUU1NQW9HQ0NzR0FRVUZCd01DTUMwR0ExVWREZ1FtQkNRNE5EZzBNVFkyT1MweVpqQTNMVFF6Ck9UTXRPR0poWWkwMU5tVTRNekEzWm1NNFpXSXdEQVlEVlIwakJBVXdBNEFCTURBRkJnTXJaWEFEUVFDbTFxcmsKMkJ2cDRJdGpiWS82bWJZQlEzbndJRTRjbWxISityb0RDNk9GUVdkMG8rSmNMYjljS1ZnM1J5Q21mWmZVYUZXRQpVRkFocjJ3ZnllNXl1WThKCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=
  SSL_PRIVATE_KEY: 
  TUM0Q0FRQXdCUVlESzJWd0JDSUVJQTl1QzlrTE1zMTFvRzUwc0ZwVUZyY2JIdlJ1L0J0d1VHZktJU3pZaVhWKw==
EOF
# highlight-end
helm upgrade --install -n demo --create-namespace api7-ee-3-gateway api7/gateway \
  --set "etcd.auth.tls.enabled=true" \
  --set "etcd.auth.tls.existingSecret=api7-ee-3-gateway-tls" \
  --set "etcd.auth.tls.certFilename=tls.crt" \
  --set "etcd.auth.tls.certKeyFilename=tls.key" \
  --set "etcd.auth.tls.verify=true" \
  --set "gateway.tls.existingCASecret=api7-ee-3-gateway-tls" \
  --set "gateway.tls.certCAFilename=ca.crt" \
  --set "apisix.extraEnvVars[0].name=API7_GATEWAY_GROUP_SHORT_ID" \
  --set "apisix.extraEnvVars[0].value=default" \
  # highlight-start
  --set "apisix.extraEnvVarsSecret=env-secrets" \
  # highlight-end
  --set "etcd.host[0]=https://your-host-or-ip:443" \
  --set "apisix.replicaCount=1" \
  --set "apisix.image.repository=api7/api7-ee-3-gateway" \
  --set "apisix.image.tag=dev"
```

YAML 示例：

```yaml
apiVersion: v1
data:
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJpRENDQVRxZ0F3SUJBZ0lDQkFBd0JRWURLMlZ3TUVReEN6QUpCZ05WQkFZVEFsVlRNUk13RVFZRFZRUUkKRXdwRFlXeHBabTl5Ym1saE1RMHdDd1lEVlFRS0V3UkJVRWszTVJFd0R3WURWUVFERXdoQlVFazNJRWx1WXpBZQpGdzB5TkRFd01qa3dNak0yTkRaYUZ3MHlOVEV4TWpnd01qTTJORFphTURBeERUQUxCZ05WQkFvVEJFRlFTVGN4Ckh6QWRCZ05WQkFNVEZtRndhVGRsWlRNdFlYQnBjMmw0TFdkaGRHVjNZWGt3S2pBRkJnTXJaWEFESVFBZTlJR3UKUFphOVcwS3RYcnVNRmpXMEdvUjdsc3oxNUVwQ1B3bnhnTU9ENWFOa01HSXdEZ1lEVlIwUEFRSC9CQVFEQWdlQQpNQk1HQTFVZEpRUU1NQW9HQ0NzR0FRVUZCd01DTUMwR0ExVWREZ1FtQkNRd09UbGlOVGcyTXkwNU1XSXlMVFF3Ck5HSXRZamsxTnkxa01UbGlaRE13TmpZek1HSXdEQVlEVlIwakJBVXdBNEFCTURBRkJnTXJaWEFEUVFEVVpsOTYKZTJOUUd6QXNwaUQ5Y0FlY2w5QmZTNFdTWFIwb1R3M1NBZytEN0lYVTVzT09meWlWVjR1SnRBeldIOVJaN3lNSwo5dkR1V2RlWEFhTlI4T01DCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=
  tls.key: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUdkTTBGT2VMNGk4T2dLTjNGd3JhL1NZQnNWWnZoWWVHVXlKd05YdnIwdXUKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==
  ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkVENDQVNlZ0F3SUJBZ0lRVlhxVEZ1L2hINGNhWnB0S2RHcDA0ekFGQmdNclpYQXdSREVMTUFrR0ExVUUKQmhNQ1ZWTXhFekFSQmdOVkJBZ1RDa05oYkdsbWIzSnVhV0V4RFRBTEJnTlZCQW9UQkVGUVNUY3hFVEFQQmdOVgpCQU1UQ0VGUVNUY2dTVzVqTUI0WERUSTBNRGt3TnpBNE1UYzBOVm9YRFRNME1Ea3dOVEE0TVRjME5Wb3dSREVMCk1Ba0dBMVVFQmhNQ1ZWTXhFekFSQmdOVkJBZ1RDa05oYkdsbWIzSnVhV0V4RFRBTEJnTlZCQW9UQkVGUVNUY3gKRVRBUEJnTlZCQU1UQ0VGUVNUY2dTVzVqTUNvd0JRWURLMlZ3QXlFQWtUajQ0N2JwenRHMWRjMEhWVzc0emErdgpORUFoVTdteVNZU21VU3dkUmZDakx6QXRNQTRHQTFVZER3RUIvd1FFQXdJQ2hEQVBCZ05WSFJNQkFmOEVCVEFECkFRSC9NQW9HQTFVZERnUURCQUV3TUFVR0F5dGxjQU5CQUt4eEJnL0NFbk9veFFuVmQ4aXhIS0pDZ0NoWjJJWkUKQkxDSGFRVEVibWZ5OFJRK3BvMGNLT3RoV0ZEeDhnc3gyQWpka0xPNVBQYUhQdWpJWHlmejhRST0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ==
kind: Secret
metadata:
  name: api7-ee-3-gateway-tls
  namespace: test
type: kubernetes.io/tls
---
# highlight-start
apiVersion: v1
kind: Secret
metadata:
  name: env-secrets
  namespace: demo
type: Opaque
data:
  SSL_CERTIFICATE:  LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJpRENDQVRxZ0F3SUJBZ0lDQkFBd0JRWURLMlZ3TUVReEN6QUpCZ05WQkFZVEFsVlRNUk13RVFZRFZRUUkKRXdwRFlXeHBabTl5Ym1saE1RMHdDd1lEVlFRS0V3UkJVRWszTVJFd0R3WURWUVFERXdoQlVFazNJRWx1WXpBZQpGdzB5TkRFd01qa3dPVEUwTlRSYUZ3MHlOVEV4TWpnd09URTBOVFJhTURBeERUQUxCZ05WQkFvVEJFRlFTVGN4Ckh6QWRCZ05WQkFNVEZtRndhVGRsWlRNdFlYQnBjMmw0TFdkaGRHVjNZWGt3S2pBRkJnTXJaWEFESVFDcitTZ1gKVW5HT0NZbjRtb3RiRWRLbWpPUkhuMFRjVHBwc1VqVE5BRFdMbmFOa01HSXdEZ1lEVlIwUEFRSC9CQVFEQWdlQQpNQk1HQTFVZEpRUU1NQW9HQ0NzR0FRVUZCd01DTUMwR0ExVWREZ1FtQkNRNE5EZzBNVFkyT1MweVpqQTNMVFF6Ck9UTXRPR0poWWkwMU5tVTRNekEzWm1NNFpXSXdEQVlEVlIwakJBVXdBNEFCTURBRkJnTXJaWEFEUVFDbTFxcmsKMkJ2cDRJdGpiWS82bWJZQlEzbndJRTRjbWxISityb0RDNk9GUVdkMG8rSmNMYjljS1ZnM1J5Q21mWmZVYUZXRQpVRkFocjJ3ZnllNXl1WThKCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=
  SSL_PRIVATE_KEY: 
  TUM0Q0FRQXdCUVlESzJWd0JDSUVJQTl1QzlrTE1zMTFvRzUwc0ZwVUZyY2JIdlJ1L0J0d1VHZktJU3pZaVhWKw==
# highlight-end
---
apisix:
  replicaCount: 1
  image:
    repository: api7/api7-ee-3-gateway
    tag: dev
  extraEnvVars:
  - name: API7_GATEWAY_GROUP_SHORT_ID
    value: "default"
  # highlight-start
  extraEnvVarsSecret: env-secrets
  # highlight-end
etcd:
  host:
  - "https://your-host-or-ip:443"
  auth:
    tls:
      enabled: true
      existingSecret: api7-ee-3-gateway-tls
      certFilename: tls.crt
      certKeyFilename: tls.key
      verify: true
gateway:
  tls:
    existingCASecret: api7-ee-3-gateway-tls
    certCAFilename: ca.crt
```

:::note

部署后，网关实例的环境变量需重启实例才能修改。

:::

</TabItem>
</Tabs>

#### 配置使用环境变量的 SSL 证书

1. 从侧边栏选择您网关组的 **SSL Certificates**。
2. 点击 **+ Add SSL Certificate**。
3. 在对话框中：
   * 在**Certificate** 字段输入 `$env://SSL_CERTIFICATE`
   * 在**Key** 字段输入 `$env://SSL_PRIVATE_KEY`
   * 点击**Add**
