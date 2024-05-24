---
title: Key Authentication
slug: /getting-started/key-authentication
---

An API gateway's primary role is to connect API consumers and providers. For security reasons, it should authenticate and authorize consumers before access to internal resources.

![Key Authentication](https://static.apiseven.com/uploads/2023/02/08/8mRaK3v1_consumer.png)

APISIX has a flexible plugin extension system and a number of existing plugins for user authentication and authorization. For example:

- [Key Authentication](https://apisix.apache.org/docs/apisix/plugins/key-auth/)
- [Basic Authentication](https://apisix.apache.org/docs/apisix/plugins/basic-auth/)
- [JSON Web Token (JWT) Authentication](https://apisix.apache.org/docs/apisix/plugins/jwt-auth/)
- [Keycloak](https://apisix.apache.org/docs/apisix/plugins/authz-keycloak/)
- [Casdoor](https://apisix.apache.org/docs/apisix/plugins/authz-casdoor/)
- [Wolf RBAC](https://apisix.apache.org/docs/apisix/plugins/wolf-rbac/)
- [OpenID Connect](https://apisix.apache.org/docs/apisix/plugins/openid-connect/)
- [Central Authentication Service (CAS)](https://apisix.apache.org/docs/apisix/plugins/cas-auth/)
- [HMAC](https://apisix.apache.org/docs/apisix/plugins/hmac-auth/)
- [Casbin](https://apisix.apache.org/docs/apisix/plugins/authz-casbin/)
- [LDAP](https://apisix.apache.org/docs/apisix/plugins/ldap-auth/)
- [Open Policy Agent (OPA)](https://apisix.apache.org/docs/apisix/plugins/opa/)
- [Forward Authentication](https://apisix.apache.org/docs/apisix/plugins/forward-auth/)

In this tutorial, you will create a consumer with key authentication, and learn how to enable and disable key authentication.

## What Is a Consumer

A _consumer_ is an application or a developer who consumes the API.

In APISIX, a consumer requires a unique `username` to be created. As part of the key authentication configuration, you would also add one of the authentication plugins from the list above to the consumer's `plugin` field.

## What Is Key Authentication

Key authentication is a relatively simple but widely used authentication approach. The idea is as follows:

1. Administrator adds an authentication key (API key) to the Route.
2. API consumers add the key to the query string or headers for authentication when sending requests.

## Enable Key Authentication

### Prerequisite(s)

1. Complete [Get APISIX](./) to install APISIX.
2. Complete [Configure Routes](./configure-routes#whats-a-route).

### Create a Consumer

Create a consumer named `tom` and enable the `key-auth` plugin with an API key `secret-key`. All requests sent with the key `secret-key` should be authenticated as `tom`.

:::caution

Please use a complex key in the Production environment.

:::

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/consumers" -X PUT -d '
{
  "username": "tom",
  "plugins": {
    "key-auth": {
      "key": "secret-key"
    }
  }
}'
```

You will receive an `HTTP/1.1 201 OK` response if the consumer was created successfully.

### Enable Authentication

Re-using the same route `getting-started-ip` from [Configure Routes](./configure-routes), you can use the `PATCH` method to add the `key-auth` plugin to the route:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes/getting-started-ip" -X PATCH -d '
{
  "plugins": {
    "key-auth": {}
  }
}'
```

You will receive an `HTTP/1.1 200 OK` response if the plugin was added successfully.

### Validate

Validate if authentication is successfully enabled in the following steps.

#### 1. Send a request without any key

Send a request without the `apikey` header.

```shell
curl -i "http://127.0.0.1:9080/ip"
```

Since the key is not provided, you will receive an unauthorized `HTTP/1.1 401 Unauthorized` response.

#### 2. Send a request with a wrong key

Send a request with a wrong key in the `apikey` header.

```shell
curl -i "http://127.0.0.1:9080/ip" -H 'apikey: wrong-key'
```

Since the key is incorrect, you will receive an `HTTP/1.1 401 Unauthorized` response.

#### 3. Send a request with the correct key

Send a request with the correct key in the `apikey` header.

```shell
curl -i "http://127.0.0.1:9080/ip" -H 'apikey: secret-key'
```

Since the correct key is provided, you will receive an `HTTP/1.1 200 OK` response.

### Disable Authentication

Disable the key authentication plugin by setting the `_meta.disable` parameter to `true`.

```shell
curl "http://127.0.0.1:9180/apisix/admin/routes/getting-started-ip" -X PATCH -d '
{
  "plugins": {
    "key-auth": {
      "_meta": {
        "disable": true
      }
    }
  }
}'
```

Send a request without any key to validate:

```shell
curl -i "http://127.0.0.1:9080/ip"
```

Since key authentication is disabled, you will receive an `HTTP/1.1 200 OK` response.

## What's Next

You have learned how to configure key authentication for a route. In the next tutorial, you will learn how to configure rate limiting.
