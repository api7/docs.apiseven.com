---
title: 配置文件
slug: /reference/configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

API7 企业版在 `/conf` 下有以下配置文件：

* `config-default.yaml`
* `config.yaml`

本文档提供了配置文件如何使用以及如何按环境管理配置文件的参考。

## 概述

API7 企业版附带一个名为 `config-default.yaml` 的默认配置文件和一个名为 `config.yaml` 的用户自定义配置文件。

默认情况下会使用 `config-default.conf` 中的配置，并且**不应修改**。它包含默认配置和文档注释。

自定义配置应添加到 `config.yaml` 中，它优先于 `config-default.yaml` 中的配置。

API7 网关（数据面）在启动时加载这些配置文件一次。如果对这些文件进行了更改，请重新加载 API7 网关以使更改生效：

<Tabs
groupId="api"
defaultValue="docker"
values={[
{label: 'Docker', value: 'docker'},
{label: 'Kubernetes', value: 'kubernetes'},
]}>

<TabItem value="docker">

```shell

docker exec {container_name} apisix reload

```

</TabItem>

<TabItem value="kubernetes">

```shell

kubectl edit configmap $YOUR_GATEWAY_CONFIGMAP
kubectl rollout restart deployment $YOUR_GATEWAY_DEPLOYMENT

```

</TabItem>
</Tabs>

## `config-default.yaml`

```yaml

#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# PLEASE DO NOT UPDATE THIS FILE!
# If you want to set the specified configuration value, you can set the new
# value in the conf/config.yaml file.
##
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# PLEASE DO NOT UPDATE THIS FILE!
# If you want to set the specified configuration value, you can set the new
# value in the conf/config.yaml file.
#

apisix:
  # node_listen: 9080               # API7 GATEWAY listening port
  node_listen:                      # This style support multiple ports
    - 9080
  #   - port: 9081
  #     enable_http2: true          # If not set, the default value is `false`.
  #   - ip: 127.0.0.2               # Specific IP, If not set, the default value is `0.0.0.0`.
  #     port: 9082
  #     enable_http2: true
  enable_admin: true
  enable_dev_mode: false            # Sets nginx worker_processes to 1 if set to true
  enable_reuseport: true            # Enable nginx SO_REUSEPORT switch if set to true.
  show_upstream_status_in_response_header: false # when true all upstream status write to `X-APISIX-Upstream-Status` otherwise only 5xx code
  enable_ipv6: true

  #proxy_protocol:                  # Proxy Protocol configuration
  #  listen_http_port: 9181         # The port with proxy protocol for http, it differs from node_listen and admin_listen.
                                    # This port can only receive http request with proxy protocol, but node_listen & admin_listen
                                    # can only receive http request. If you enable proxy protocol, you must use this port to
                                    # receive http request with proxy protocol
  #  listen_https_port: 9182        # The port with proxy protocol for https
  #  enable_tcp_pp: true            # Enable the proxy protocol for tcp proxy, it works for stream_proxy.tcp option
  #  enable_tcp_pp_to_upstream: true # Enables the proxy protocol to the upstream server
  enable_server_tokens: true        # Whether the version number should be shown in Server header.
                                    # It's enabled by default.

  # configurations to load third party code and/or override the builtin one.
  extra_lua_path: ""                # extend lua_package_path to load third party code
  extra_lua_cpath: ""               # extend lua_package_cpath to load third party code
  lua_module_hook: "agent.hook"  # the hook module which will be used to inject third party code into API7 GATEWAY

  proxy_cache:                      # Proxy Caching configuration
    cache_ttl: 10s                  # The default caching time in disk if the upstream does not specify the cache time
    zones:                          # The parameters of a cache
      - name: disk_cache_one        # The name of the cache, administrator can specify
                                    # which cache to use by name in the admin api (disk|memory)
        memory_size: 50m            # The size of shared memory, it's used to store the cache index for
                                    # disk strategy, store cache content for memory strategy (disk|memory)
        disk_size: 1G               # The size of disk, it's used to store the cache data (disk)
        disk_path: /tmp/disk_cache_one  # The path to store the cache data (disk)
        cache_levels: 1:2           # The hierarchy levels of a cache (disk)
      #- name: disk_cache_two
      #  memory_size: 50m
      #  disk_size: 1G
      #  disk_path: "/tmp/disk_cache_two"
      #  cache_levels: "1:2"
      - name: memory_cache
        memory_size: 50m

  delete_uri_tail_slash: false    # delete the '/' at the end of the URI
  # The URI normalization in servlet is a little different from the RFC's.
  # See https://github.com/jakartaee/servlet/blob/master/spec/src/main/asciidoc/servlet-spec-body.adoc#352-uri-path-canonicalization,
  # which is used under Tomcat.
  # Turn this option on if you want to be compatible with servlet when matching URI path.
  normalize_uri_like_servlet: false
  router:
    http: radixtree_uri         # radixtree_uri: match route by uri(base on radixtree)
                                  # radixtree_host_uri: match route by host + uri(base on radixtree)
                                  # radixtree_uri_with_parameter: like radixtree_uri but match uri with parameters,
                                  #   see https://github.com/api7/lua-resty-radixtree/#parameters-in-path for
                                  #   more details.
    ssl: radixtree_sni          # radixtree_sni: match route by SNI(base on radixtree)
  #stream_proxy:                  # TCP/UDP proxy
  #  only: true                   # use stream proxy only, don't enable HTTP stuff
  #  tcp:                         # TCP proxy port list
  #    - addr: 9100
  #      tls: true
  #    - addr: "127.0.0.1:9101"
  #  udp:                         # UDP proxy port list
  #    - 9200
  #    - "127.0.0.1:9201"
  #dns_resolver:                  # If not set, read from `/etc/resolv.conf`
  #  - 1.1.1.1
  #  - 8.8.8.8
  #dns_resolver_valid: 30         # if given, override the TTL of the valid records. The unit is second.
  resolver_timeout: 5             # resolver timeout
  enable_resolv_search_opt: true  # enable search option in resolv.conf
  ssl:
    enable: true
    listen:                       # API7 GATEWAY listening port in https.
      - port: 9443
        enable_http2: true
    #   - ip: 127.0.0.3           # Specific IP, If not set, the default value is `0.0.0.0`.
    #     port: 9445
    #     enable_http2: true
    #ssl_trusted_certificate: /path/to/ca-cert  # Specifies a file path with trusted CA certificates in the PEM format
                                                # used to verify the certificate when API7 GATEWAY needs to do SSL/TLS handshaking
                                                # with external services (e.g. etcd)
    ssl_protocols: TLSv1.2 TLSv1.3
    ssl_ciphers: ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
    ssl_session_tickets: false              #  disable ssl_session_tickets by default for 'ssl_session_tickets' would make Perfect Forward Secrecy useless.
                                            #  ref: https://github.com/mozilla/server-side-tls/issues/135

    key_encrypt_salt:             #  If not set, will save origin ssl key into etcd.
      - edd1c9f0985e76a2          #  If set this, the key_encrypt_salt should be an array whose elements are string, and the size is also 16, and it will encrypt ssl key with AES-128-CBC
                                  #  !!! So do not change it after saving your ssl, it can't decrypt the ssl keys have be saved if you change !!
                                  #  Only use the first key to encrypt, and decrypt in the order of the array.

    #fallback_sni: "my.default.domain"      # If set this, when the client doesn't send SNI during handshake, the fallback SNI will be used instead
  enable_control: true
  #control:
  #  ip: 127.0.0.1
  #  port: 9090
  disable_sync_configuration_during_start: false  # safe exit. Remove this once the feature is stable
  data_encryption:                # add `encrypt_fields = { $field },` in plugin schema to enable encryption
    enable: false                 # if not set, the default value is `false`.
    keyring:
      - qeddd145sfvddff3          # If not set, will save origin value into etcd.
                                  # If set this, the keyring should be an array whose elements are string, and the size is also 16, and it will encrypt fields with AES-128-CBC
                                  # !!! So do not change it after encryption, it can't decrypt the fields have be saved if you change !!
                                  # Only use the first key to encrypt, and decrypt in the order of the array.

nginx_config:                     # config for render the template to generate nginx.conf
  #user: root                     # specifies the execution user of the worker process.
                                  # the "user" directive makes sense only if the master process runs with super-user privileges.
                                  # if you're not root user,the default is current user.
  error_log: logs/error.log
  error_log_level:  warn          # warn,error
  worker_processes: auto          # if you want use multiple cores in container, you can inject the number of cpu as environment variable "APISIX_WORKER_PROCESSES"
  enable_cpu_affinity: false      # disable CPU affinity by default, if API7 GATEWAY is deployed on a physical machine, it can be enabled and work well.
  worker_rlimit_nofile: 20480     # the number of files a worker process can open, should be larger than worker_connections
  worker_shutdown_timeout: 240s   # timeout for a graceful shutdown of worker processes

  max_pending_timers: 16384       # increase it if you see "too many pending timers" error
  max_running_timers: 4096        # increase it if you see "lua_max_running_timers are not enough" error

  event:
    worker_connections: 10620
  #envs:                          # allow to get a list of environment variables
  #  - TEST_ENV

  meta:
    lua_shared_dict:
      prometheus-metrics: 15m

  stream:
    enable_access_log: false         # enable access log or not, default false
    access_log: logs/access_stream.log
    access_log_format: "$remote_addr [$time_local] $protocol $status $bytes_sent $bytes_received $session_time"
                                            # create your custom log format by visiting http://nginx.org/en/docs/varindex.html
    access_log_format_escape: default       # allows setting json or default characters escaping in variables
    lua_shared_dict:
      etcd-cluster-health-check-stream: 10m
      lrucache-lock-stream: 10m
      plugin-limit-conn-stream: 10m
      worker-events-stream: 10m
      tars-stream: 1m
      config-stream: 5m

  # As user can add arbitrary configurations in the snippet,
  # it is user's responsibility to check the configurations
  # don't conflict with API7 GATEWAY.
  main_configuration_snippet: |
    # Add custom Nginx main configuration to nginx.conf.
    # The configuration should be well indented!
  http_configuration_snippet: |
    # Add custom Nginx http configuration to nginx.conf.
    # The configuration should be well indented!
  http_server_configuration_snippet: |
    # Add custom Nginx http server configuration to nginx.conf.
    # The configuration should be well indented!
  http_server_location_configuration_snippet: |
    # Add custom Nginx http server location configuration to nginx.conf.
    # The configuration should be well indented!
  http_admin_configuration_snippet: |
    # Add custom Nginx admin server configuration to nginx.conf.
    # The configuration should be well indented!
  http_end_configuration_snippet: |
    # Add custom Nginx http end configuration to nginx.conf.
    # The configuration should be well indented!
  stream_configuration_snippet: |
    # Add custom Nginx stream configuration to nginx.conf.
    # The configuration should be well indented!

  http:
    enable_access_log: true         # enable access log or not, default true
    access_log: logs/access.log
    access_log_format: "$remote_addr - $remote_user [$time_local] $http_host \"$request_line\" $status $body_bytes_sent $request_time \"$http_referer\" \"$http_user_agent\" $upstream_addr $upstream_status $upstream_response_time \"$upstream_scheme://$upstream_host$upstream_uri\""
    access_log_format_escape: default       # allows setting json or default characters escaping in variables
    keepalive_timeout: 60s          # timeout during which a keep-alive client connection will stay open on the server side.
    client_header_timeout: 60s      # timeout for reading client request header, then 408 (Request Time-out) error is returned to the client
    client_body_timeout: 60s        # timeout for reading client request body, then 408 (Request Time-out) error is returned to the client
    client_max_body_size: 0         # The maximum allowed size of the client request body.
                                    # If exceeded, the 413 (Request Entity Too Large) error is returned to the client.
                                    # Note that unlike Nginx, we don't limit the body size by default.

    send_timeout: 10s              # timeout for transmitting a response to the client.then the connection is closed
    underscores_in_headers: "on"   # default enables the use of underscores in client request header fields
    real_ip_header: X-Real-IP      # http://nginx.org/en/docs/http/ngx_http_realip_module.html#real_ip_header
    real_ip_recursive: "off"       # http://nginx.org/en/docs/http/ngx_http_realip_module.html#real_ip_recursive
    real_ip_from:                  # http://nginx.org/en/docs/http/ngx_http_realip_module.html#set_real_ip_from
      - 127.0.0.1
      - "unix:"
    custom_lua_shared_dict:       # add custom shared cache to nginx.conf
    #  ipc_shared_dict: 100m       # custom shared cache, format: `cache-key: cache-size`
      config: 5m
      kubernetes: 20m
      nacos: 20m

    # Enables or disables passing of the server name through TLS Server Name Indication extension (SNI, RFC 6066)
    # when establishing a connection with the proxied HTTPS server.
    proxy_ssl_server_name: true
    upstream:
      keepalive: 320                # Sets the maximum number of idle keepalive connections to upstream servers that are preserved in the cache of each worker process.
                                    # When this number is exceeded, the least recently used connections are closed.
      keepalive_requests: 1000      # Sets the maximum number of requests that can be served through one keepalive connection.
                                    # After the maximum number of requests is made, the connection is closed.
      keepalive_timeout: 60s        # Sets a timeout during which an idle keepalive connection to an upstream server will stay open.
    charset: utf-8                  # Adds the specified charset to the "Content-Type" response header field, see
                                    # http://nginx.org/en/docs/http/ngx_http_charset_module.html#charset
    variables_hash_max_size: 2048   # Sets the maximum size of the variables hash table.

    lua_shared_dict:
      internal-status: 10m
      plugin-limit-req: 10m
      plugin-limit-count: 10m
      plugin-limit-conn: 10m
      plugin-graphql-limit-count: 10m
      plugin-graphql-limit-count-reset-header: 10m
      upstream-healthcheck: 10m
      worker-events: 10m
      lrucache-lock: 10m
      balancer-ewma: 10m
      balancer-ewma-locks: 10m
      balancer-ewma-last-touched-at: 10m
      plugin-limit-count-redis-cluster-slot-lock: 1m
      tracing_buffer: 10m
      plugin-api-breaker: 10m
      etcd-cluster-health-check: 10m
      discovery: 1m
      jwks: 1m
      introspection: 10m
      access-tokens: 1m
      ext-plugin: 1m
      tars: 1m
      cas-auth: 10m
      saml_sessions: 10m

graphql:
  max_size: 1048576               # the maximum size limitation of graphql in bytes, default 1MiB

#ext-plugin:
  #cmd: ["ls", "-l"]

plugins:                          # plugin list (sorted by priority)
  - real-ip                        # priority: 23000
  # - toolset                          # priority: 22901
  - ai                             # priority: 22900
  - client-control                 # priority: 22000
  - proxy-buffering                # priority: 21991
  - proxy-control                  # priority: 21990
  - request-id                     # priority: 12015
  - zipkin                         # priority: 12011
  #- skywalking                    # priority: 12010
  #- opentelemetry                 # priority: 12009
  - ext-plugin-pre-req             # priority: 12000
  - fault-injection                # priority: 11000
  - mocking                        # priority: 10900
  - serverless-pre-function        # priority: 10000
  #- batch-requests                # priority: 4010
  - cors                           # priority: 4000
  - ip-restriction                 # priority: 3000
  - ua-restriction                 # priority: 2999
  - referer-restriction            # priority: 2990
  - csrf                           # priority: 2980
  - uri-blocker                    # priority: 2900
  - request-validation             # priority: 2800
  - multi-auth                     # priority: 2600
  - openid-connect                 # priority: 2599
  - saml-auth                      # priority: 2598
  - cas-auth                       # priority: 2597
  - authz-casbin                   # priority: 2560
  - authz-casdoor                  # priority: 2559
  - wolf-rbac                      # priority: 2555
  - ldap-auth                      # priority: 2540
  - hmac-auth                      # priority: 2530
  - basic-auth                     # priority: 2520
  - jwt-auth                       # priority: 2510
  - key-auth                       # priority: 2500
  - acl                            # priority: 2410
  - consumer-restriction           # priority: 2400
  - forward-auth                   # priority: 2002
  - opa                            # priority: 2001
  - authz-keycloak                 # priority: 2000
  - data-mask                      # priority: 1500
  #- error-log-logger              # priority: 1091
  - body-transformer               # priority: 1080
  - proxy-mirror                   # priority: 1010
  - proxy-cache                    # priority: 1009
  - graphql-proxy-cache            # priority: 1009
  - proxy-rewrite                  # priority: 1008
  - workflow                       # priority: 1006
  - api-breaker                    # priority: 1005
  - graphql-limit-count            # priority: 1004
  - limit-conn                     # priority: 1003
  - limit-count                    # priority: 1002
  - limit-req                      # priority: 1001
  #- node-status                   # priority: 1000
  - traffic-label                  # priority: 996
  - gzip                           # priority: 995
  - server-info                    # priority: 990
  - api7-traffic-split             # priority: 966
  - traffic-split                  # priority: 966
  - redirect                       # priority: 900
  - response-rewrite               # priority: 899
  - oas-validator                  # priority: 510
  - degraphql                      # priority: 509
  - kafka-proxy                    # priority: 508
  #- dubbo-proxy                   # priority: 507
  - grpc-transcode                 # priority: 506
  - grpc-web                       # priority: 505
  - public-api                     # priority: 501
  - prometheus                     # priority: 500
  - datadog                        # priority: 495
  - error-page                     # priority: 450
  - elasticsearch-logger           # priority: 413
  - echo                           # priority: 412
  - loggly                         # priority: 411
  - http-logger                    # priority: 410
  - splunk-hec-logging             # priority: 409
  - skywalking-logger              # priority: 408
  - google-cloud-logging           # priority: 407
  - sls-logger                     # priority: 406
  - tcp-logger                     # priority: 405
  - kafka-logger                   # priority: 403
  - rocketmq-logger                # priority: 402
  - syslog                         # priority: 401
  - udp-logger                     # priority: 400
  - file-logger                    # priority: 399
  - clickhouse-logger              # priority: 398
  - tencent-cloud-cls              # priority: 397
  #- log-rotate                    # priority: 100
  # <- recommend to use priority (0, 100) for your custom plugins
  - example-plugin                 # priority: 0
  #- gm                            # priority: -43
  - aws-lambda                     # priority: -1899
  - azure-functions                # priority: -1900
  - openwhisk                      # priority: -1901
  - openfunction                   # priority: -1902
  - serverless-post-function       # priority: -2000
  - ext-plugin-post-req            # priority: -3000
  - ext-plugin-post-resp           # priority: -4000

stream_plugins: # sorted by priority
  - ip-restriction                 # priority: 3000
  - limit-conn                     # priority: 1003
  - mqtt-proxy                     # priority: 1000
  #- prometheus                    # priority: 500
  - syslog                         # priority: 401
  # <- recommend to use priority (0, 100) for your custom plugins

#wasm:
  #plugins:
    #- name: wasm_log
      #priority: 7999
      #file: t/wasm/log/main.go.wasm

#xrpc:
  #protocols:
    #- name: pingpong

plugin_attr:
  log-rotate:
    interval: 3600    # rotate interval (unit: second)
    max_kept: 168     # max number of log files will be kept
    max_size: -1      # max size bytes of log files to be rotated, size check would be skipped with a value less than 0
    enable_compression: false    # enable log file compression(gzip) or not, default false
  skywalking:
    service_name: API7 GATEWAY
    service_instance_name: API7 GATEWAY Instance Name
    endpoint_addr: http://127.0.0.1:12800
  opentelemetry:
    trace_id_source: x-request-id
    resource:
      service.name: API7 GATEWAY
    collector:
      address: 127.0.0.1:4318
      request_timeout: 3
      request_headers:
        Authorization: token
    batch_span_processor:
      drop_on_queue_full: false
      max_queue_size: 1024
      batch_timeout: 2
      inactive_timeout: 1
      max_export_batch_size: 16
  prometheus:
    export_uri: /apisix/prometheus/metrics
    metric_prefix: apisix_
    enable_export_server: true
    export_addr:
      ip: 127.0.0.1
      port: 9091
    #metrics:
    #  http_status:
    #    # extra labels from nginx variables
    #    extra_labels:
    #      # the label name doesn't need to be the same as variable name
    #      # below labels are only examples, you could add any valid variables as you need
    #      - upstream_addr: $upstream_addr
    #      - upstream_status: $upstream_status
    #  http_latency:
    #    extra_labels:
    #      - upstream_addr: $upstream_addr
    #  bandwidth:
    #    extra_labels:
    #      - upstream_addr: $upstream_addr
  server-info:
    report_ttl: 60   # live time for server info in etcd (unit: second)
  dubbo-proxy:
    upstream_multiplex_count: 32
  request-id:
    snowflake:
      enable: false
      snowflake_epoc: 1609459200000   # the starting timestamp is expressed in milliseconds
      data_machine_bits: 12           # data machine bit, maximum 31, because Lua cannot do bit operations greater than 31
      sequence_bits: 10               # each machine generates a maximum of (1 << sequence_bits) serial numbers per millisecond
      data_machine_ttl: 30            # live time for data_machine in etcd (unit: second)
      data_machine_interval: 10       # lease renewal interval in etcd (unit: second)
  proxy-mirror:
    timeout:                          # proxy timeout in mirrored sub-request
      connect: 60s
      read: 60s
      send: 60s
#  redirect:
#    https_port: 8443   # the default port for use by HTTP redirects to HTTPS
  inspect:
    delay: 3            # in seconds
    hooks_file: "/usr/local/apisix/plugin_inspect_hooks.lua"

deployment:
  role: traditional
  role_traditional:
    config_provider: etcd
  admin:
    # Default token when use API to call for Admin API.
    # *NOTE*: Highly recommended to modify this value to protect API7 GATEWAY's Admin API.
    # Disabling this configuration item means that the Admin API does not
    # require any authentication.
    admin_key:
      -
        name: admin
        key: edd1c9f034335f136f87ad84b625c8f1
        role: admin                 # admin: manage all configuration data
                                    # viewer: only can view configuration data
      -
        name: viewer
        key: 4054f7cf07e344346cd3f287985e76a2
        role: viewer

    enable_admin_cors: true         # Admin API support CORS response headers.
    allow_admin:                    # http://nginx.org/en/docs/http/ngx_http_access_module.html#allow
      - 127.0.0.0/24                # If we don't set any IP list, then any IP access is allowed by default.
      #- "::/64"
    admin_listen:                 # use a separate port
      ip: 0.0.0.0                 # Specific IP, if not set, the default value is `0.0.0.0`.
      port: 9180                  # Specific port, which must be different from node_listen's port.

    #https_admin: true            # enable HTTPS when use a separate port for Admin API.
                                  # Admin API will use conf/apisix_admin_api.crt and conf/apisix_admin_api.key as certificate.

    admin_api_mtls:               # Depends on `admin_listen` and `https_admin`.
      admin_ssl_cert: ""          # Path of your self-signed server side cert.
      admin_ssl_cert_key: ""      # Path of your self-signed server side key.
      admin_ssl_ca_cert: ""       # Path of your self-signed ca cert.The CA is used to sign all admin api callers' certificates.

    admin_api_version: v3         # The version of admin api, latest version is v3.

  etcd:
    host:                           # it's possible to define multiple etcd hosts addresses of the same etcd cluster.
      - "http://127.0.0.1:2379"     # multiple etcd address, if your etcd cluster enables TLS, please use https scheme,
                                    # e.g. https://127.0.0.1:2379.
    prefix: /apisix                 # configuration prefix in etcd
    timeout: 30                     # The timeout when connect/read/write to etcd.
    watch_timeout: 50               # The timeout when watch etcd
    #resync_delay: 5                # when sync failed and a rest is needed, resync after the configured seconds plus 50% random jitter
    #health_check_timeout: 10       # etcd retry the unhealthy nodes after the configured seconds
    startup_retry: 2                # the number of retry to etcd during the startup, default to 2
    #user: root                     # root username for etcd
    #password: 5tHkHhYkjr6cQY       # root password for etcd
    tls:
      # To enable etcd client certificate you need to build APISIX-Base, see
      # https://apisix.apache.org/docs/apisix/FAQ#how-do-i-build-the-apisix-base-environment
      #cert: /path/to/cert          # path of certificate used by the etcd client
      #key: /path/to/key            # path of key used by the etcd client

      verify: true                  # whether to verify the etcd endpoint certificate when setup a TLS connection to etcd,
                                    # the default value is true, e.g. the certificate will be verified strictly.
      #sni:                         # the SNI for etcd TLS requests. If missed, the host part of the URL will be used.

api7ee:
  telemetry:
    enable: true # enable telemetry data report to the control plane
    interval: 15 # interval in seconds to send telemetry data to the control plane
    max_metrics_size: 33554432 # max size in bytes(32M) of the metrics data sent to the control plane, if the size exceeds, the data will be truncated
  healthcheck_report_interval: 120 # healthcheck data report interval in seconds

```