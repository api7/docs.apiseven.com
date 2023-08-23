---
title: Set Up SSO with OIDC and Keycloak
slug: /how-to-guide/authentication/set-up-sso-with-oidc-and-keycloak
--- 

[OpenID Connect (OIDC)](https://openid.net/connect/) is a simple identity layer on top of the [OAuth 2.0 protocol](https://www.rfc-editor.org/rfc/rfc6749). It allows clients to verify the identity of end users based on the authentication performed by the identity provider, as well as to obtain basic profile information about end users in an interoperable and REST-like manner.

[Keycloak](https://www.keycloak.org/) is an open source identity and access management solution for modern applications and services. Keycloak supports single sign-on (SSO), which enables services to interface with Keycloak through protocols such as OIDC and OAuth 2.0. In addition, Keycloak also supports delegating authentication to third party identity providers such as Facebook and Google.

APISIX supports SSO with OIDC to protect APIs by integrating Keycloak as an identity provider.

This guide will show you how to use the plugin `openid-connect` to integrate APISIX with Keycloak. There are [two types of use cases](https://www.keycloak.org/docs/latest/securing_apps/#openid-connect-2) when using OIDC and Keycloak:

* Applications ask the Keycloak server to authenticate users. It is described in [Authentication With User Credentials](#authentication-with-user-credentials).
* Clients want to gain access to remote services. It is described in [Authentication With Access Token](#authentication-with-access-token).

![Diagram of APISIX and Keycloak](https://static.apiseven.com/uploads/2023/03/30/101pf3uK_overview.png)

## Prerequisite(s)

* Install [Docker](https://docs.docker.com/get-docker/).
* Install [cURL](https://curl.se/) to send requests to the services for validation.
* Follow the [Getting Started tutorial](../../getting-started/) to start a new APISIX instance in Docker.

## Configure Keycloak

Start a Keycloak instance named `apisix-quickstart-keycloak` with the administrator name `quickstart-admin` and password `quickstart-admin-pass` in [development mode](https://www.keycloak.org/server/configuration#_starting_keycloak_in_development_mode) in Docker. The exposed port is mapped to 8080 on the host machine:

```shell
docker run -d --name "apisix-quickstart-keycloak" \
# highlight-start
  -e 'KEYCLOAK_ADMIN=quickstart-admin' \
  -e 'KEYCLOAK_ADMIN_PASSWORD=quickstart-admin-pass' \
  -p 8080:8080 \
# highlight-end
  quay.io/keycloak/keycloak:18.0.2 start-dev
```

Keycloak provides an easy-to-use web UI to help the administrator manage all resources, such as clients, roles, and users.

Navigate to `http://localhost:8080` in browser to access the Keycloak web page, then click __Administration Console__:

![web-ui](https://static.apiseven.com/uploads/2023/03/30/ItcwYPIx_web-ui.png)

Enter the administrator’s username `quickstart-admin` and password `quickstart-admin-pass` and sign in:

![admin-signin](https://static.apiseven.com/uploads/2023/03/30/6W3pjzE1_admin-signin.png)

You need to maintain the login status to configure Keycloak during the following steps.

### Create a Realm

_Realms_ in Keycloak are workspaces to manage resources such as users, credentials, and roles. The resources in different realms are isolated from each other. You need to create a realm named `quickstart-realm` for APISIX.

From the left menu, select __Add realm__:

![create-realm](https://static.apiseven.com/uploads/2023/03/30/S1Xvqliv_create-realm.png)

Enter the realm name `quickstart-realm` and click __Create__ to create it:

![add-realm](https://static.apiseven.com/uploads/2023/03/30/jwb7QU8k_add-realm.png)

### Create a Client

_Clients_ in Keycloak are entities that request Keycloak to authenticate a user. More often, clients are applications that want to use Keycloak to secure themselves and provide a single sign-on solution. APISIX is equivalent to a client that is responsible for initiating authentication requests to Keycloak, so you need to create its corresponding client named `apisix-quickstart-client`.

Click __Clients__ > __Create__ to open the __Add Client__ page:

![create-client](https://static.apiseven.com/uploads/2023/03/30/qLom0axN_create-client.png)

Enter __Client ID__ as `apisix-quickstart-client`, then select __Client Protocol__ as `openid-connect` and __Save__:

![add-client](https://static.apiseven.com/uploads/2023/03/30/X5on2r7x_add-client.png)

The client `apisix-quickstart-client` is created. After redirecting to the detailed page, select `confidential` as the __Access Type__:

![config-client](https://static.apiseven.com/uploads/2023/03/30/v70c8y9F_config-client.png)

When the user login is successful during the SSO, Keycloak will carry the state and code to redirect the client to the addresses in __Valid Redirect URIs__. To simplify the operation, enter wildcard `*` to consider any URI valid:

![client-redirect](https://static.apiseven.com/uploads/2023/03/30/xLxcyVkn_client-redirect.png)

Select __Save__ to apply custom configurations.

### Create a User

Users in Keycloak are entities that are able to log into the system. They can have attributes associated with themselves, such as username, email, and address. You need to create a user for login authentication.

Click __Users__ > __Add user__ to open the __Add user__ page:

![create-user](https://static.apiseven.com/uploads/2023/03/30/onQEp23L_create-user.png)

Enter the __Username__ as `quickstart-user` and select __Save__:

![add-user](https://static.apiseven.com/uploads/2023/03/30/EKhuhgML_add-user.png)

Click on __Credentials__, then set the __Password__ as `quickstart-user-pass`. Switch __Temporary__ to `OFF` to turn off the restriction, so that you need not to change password the first time you log in:

![user-pass](https://static.apiseven.com/uploads/2023/03/30/rQKEAEnh_user-pass.png)

## Obtain the OIDC Configuration

In this section, you will obtain the key OIDC configuration from Keycloak and define them as shell variables. Steps after this section will use these variables to configure the OIDC by shell commands.

:::info

Open a separate terminal to follow the steps and define related shell variables. Then steps after this section could use the defined variables directly.

:::

### Get Discovery Endpoint

Click __Realm Settings__, then right click __OpenID Endpoints Configuration__ and copy the link. 

![get-discovery](https://static.apiseven.com/uploads/2023/03/30/526lbJbg_get-discovery.png)

The link should be the same as the following:

```text
http://localhost:8080/realms/quickstart-realm/.well-known/openid-configuration
```

Both APISIX and your client (browser and terminal) should access the discovery URI during OIDC authentication progress. You need to replace `localhost` with the actual host IP, thus the APISIX instance in Docker can access the discovery URI successfully.

Define a variable named `KEYCLOAK_IP` to store the real machine IP, then define a variable named `OIDC_DISCOVERY` to store the URI of discovery:

```shell
KEYCLOAK_IP=192.168.42.145    # Replace this value with your ip
OIDC_DISCOVERY=http://${KEYCLOAK_IP}:8080/realms/quickstart-realm/.well-known/openid-configuration
```

### Get Client ID and Secret

Click __Clients__ > `apisix-quickstart-client` > __Credentials__, then copy the client secret from __Secret__:

![client-id](https://static.apiseven.com/uploads/2023/03/30/MwYmU20v_client-id.png)

![client-secret](https://static.apiseven.com/uploads/2023/03/30/f9iOG8aN_client-secret.png)

Define the variables `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` to store client id and secret, respectively. You need to replace the secret with yours:

```shell
OIDC_CLIENT_ID=apisix-quickstart-client
OIDC_CLIENT_SECRET=bSaIN3MV1YynmtXvU8lKkfeY0iwpr9cH  # Replace this value with yours
```

## Authentication With User Credentials

In this section, you will create a route with OIDC that forwards client requests to [httpbin.org](http://httpbin.org/), a public HTTP request and response service.

The route `/anything/{anything}` of `httpbin.org` returns anything passed in request data in JSON type, such as methods, arguments, and headers.

### Enable OIDC Plugin

Create a route with id `auth-with-oidc` and enable the plugin `openid-connect`, which forwards all requests sent to `/anything/*` to the upstream `httpbin.org`:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes" -X PUT -d '
{
  "id": "auth-with-oidc",
  "uri":"/anything/*",
  "plugins": {
    "openid-connect": {
# highlight-start
      // Annotate 1
      "client_id": "'"$OIDC_CLIENT_ID"'",
      // Annotate 2
      "client_secret": "'"$OIDC_CLIENT_SECRET"'",
      // Annotate 3
      "discovery": "'"$OIDC_DISCOVERY"'",
# highlight-end
      "scope": "openid profile",
# highlight-start
      // Annotate 4
      "redirect_uri": "http://localhost:9080/anything/callback"
# highlight-end
    }
  },
  "upstream":{
    "type":"roundrobin",
    "nodes":{
      "httpbin.org:80":1
    }
  }
}'
```

❶ `client_id`: OAuth client ID.

❷ `client_secret`: OAuth client secret.

❸ `discovery`: Discovery endpoint URL of the identity server.

❹ `redirect_uri`: URI to which the identity provider redirects back to.

Identity provider redirects requests to a pre-configured URI in `redirect_uri` for token exchange after users sign in. Here you can use a valid URI `http://localhost:9080/anything/callback` defined in this route. More details can be found in [Keycloak document of securing apps](https://www.keycloak.org/docs/latest/securing_apps/#redirect-uris).

### Test With Correct Credentials

Navigate to `http://127.0.0.1:9080/anything/test` in browser. The request will be redirected to a login page:

![test-sign](https://static.apiseven.com/uploads/2023/03/30/i38u1x9a_validate-sign.png)

Sign in with correct username `quickstart-user` and password `quickstart-user-pass`. If the authentication is successful, the route will redirect the request to upstream `httpbin.org`. A valid response similar to the following verifies that OIDC plugin works:

```json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {},
  "headers": {
    "Accept": "text/html..."
    ...
  },
  "json": null,
  "method": "GET",
  "origin": "127.0.0.1, 59.71.244.81",
  "url": "http://127.0.0.1/anything/test"
}
```

### Test With Wrong Credentials

Sign in with wrong password:

![test-sign-failed](https://static.apiseven.com/uploads/2023/03/31/YOuSYX1r_validate-sign-failed.png)

Authentication failed verifies that the OIDC plugin works and rejects requests with wrong credentials.

## Authentication With Access Token

In this section, you will create a route with OIDC similar to the previous section [Authentication With Username and Password](#authentication-with-username-and-password), but authenticate with access token in headers instead of asking the Keycloak server.

### Enable OIDC Plugin

Create a route with id `auth-with-oidc` and enable the plugin `openid-connect`, but adding the parameter `bearer_only` with a value of true:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes" -X PUT -d '
{
  "id": "auth-with-oidc",
  "uri":"/anything/*",
  "plugins": {
    "openid-connect": {
# highlight-start
      // Annotate 1
      "client_id": "'"$OIDC_CLIENT_ID"'",
      // Annotate 2
      "client_secret": "'"$OIDC_CLIENT_SECRET"'",
      // Annotate 3
      "discovery": "'"$OIDC_DISCOVERY"'",
# highlight-end
      "scope": "openid profile",
# highlight-start
      // Annotate 4
      "bearer_only": true,
      // Annotate 5
      "redirect_uri": "http://127.0.0.1:9080/anything/callback"
# highlight-end
    }
  },
  "upstream":{
    "type":"roundrobin",
    "nodes":{
      "httpbin.org:80":1
    }
  }
}'
```

❶ `client_id`: OAuth client ID.

❷ `client_secret`: OAuth client secret.

❸ `discovery`: Discovery endpoint URL of the identity server.

❹ `bearer_only`: If its value is true, APISIX only check if the authorization header in the request matches a bearer token.

❺ `redirect_uri`: URI to which the identity provider redirects back to.

### Test With Valid Access Token

Call the Keycloak [Token endpoint](https://www.keycloak.org/docs/latest/securing_apps/#token-endpoint) to obtain the access token with parameters client ID, client secret, username, and password:

```shell
OIDC_USER=quickstart-user
OIDC_PASSWORD=quickstart-user-pass
curl -i "http://$KEYCLOAK_IP:8080/realms/quickstart-realm/protocol/openid-connect/token" -X POST \
  -d 'grant_type=password' \
  -d 'client_id='$OIDC_CLIENT_ID'&client_secret='$OIDC_CLIENT_SECRET'' \
  -d 'username='$OIDC_USER'&password='$OIDC_PASSWORD''
```

The expected response is similar to the following:

```text
{"access_token":"eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6U3FFaXN6VlpuYi1sRWMzZkp0UHNpU1ZZcGs4RGN3dXI1Mkx5V05aQTR3In0.eyJleHAiOjE2ODAxNjA5NjgsImlhdCI6MTY4MDE2MDY2OCwianRpIjoiMzQ5MTc4YjQtYmExZC00ZWZjLWFlYTUtZGY2MzJiMDJhNWY5IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguNDIuMTQ1OjgwODAvcmVhbG1zL3F1aWNrc3RhcnQtcmVhbG0iLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTg4MTVjM2EtNmQwNy00YTY2LWJjZjItYWQ5NjdmMmIwMTFmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBpc2l4LXF1aWNrc3RhcnQtY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImIxNmIyNjJlLTEwNTYtNDUxNS1hNDU1LWYyNWUwNzdjY2I3NiIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1xdWlja3N0YXJ0LXJlYWxtIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImIxNmIyNjJlLTEwNTYtNDUxNS1hNDU1LWYyNWUwNzdjY2I3NiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoicXVpY2tzdGFydC11c2VyIn0.uD_7zfZv5182aLXu9-YBzBDK0nr2mE4FWb_4saTog2JTqFTPZZa99Gm8AIDJx2ZUcZ_ElkATqNUZ4OpWmL2Se5NecMw3slJReewjD6xgpZ3-WvQuTGpoHdW5wN9-Rjy8ungilrnAsnDA3tzctsxm2w6i9KISxvZrzn5Rbk-GN6fxH01VC5eekkPUQJcJgwuJiEiu70SjGnm21xDN4VGkNRC6jrURoclv3j6AeOqDDIV95kA_MTfBswDFMCr2PQlj5U0RTndZqgSoxwFklpjGV09Azp_jnU7L32_Sq-8coZd0nj5mSdbkJLJ8ZDQDV_PP3HjCP7EHdy4P6TyZ7oGvjw","expires_in":300,"refresh_expires_in":1800,"refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0YjFiNTQ3Yi0zZmZjLTQ5YzQtYjE2Ni03YjdhNzIxMjk1ODcifQ.eyJleHAiOjE2ODAxNjI0NjgsImlhdCI6MTY4MDE2MDY2OCwianRpIjoiYzRjNjNlMTEtZTdlZS00ZmEzLWJlNGYtNDMyZWQ4ZmY5OTQwIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguNDIuMTQ1OjgwODAvcmVhbG1zL3F1aWNrc3RhcnQtcmVhbG0iLCJhdWQiOiJodHRwOi8vMTkyLjE2OC40Mi4xNDU6ODA4MC9yZWFsbXMvcXVpY2tzdGFydC1yZWFsbSIsInN1YiI6IjE4ODE1YzNhLTZkMDctNGE2Ni1iY2YyLWFkOTY3ZjJiMDExZiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJhcGlzaXgtcXVpY2tzdGFydC1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiYjE2YjI2MmUtMTA1Ni00NTE1LWE0NTUtZjI1ZTA3N2NjYjc2Iiwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwic2lkIjoiYjE2YjI2MmUtMTA1Ni00NTE1LWE0NTUtZjI1ZTA3N2NjYjc2In0.8xYP4bhDg1U9B5cTaEVD7B4oxNp8wwAYEynUne_Jm78","token_type":"Bearer","not-before-policy":0,"session_state":"b16b262e-1056-4515-a455-f25e077ccb76","scope":"profile email"}
```

Define the variable `OIDC_ACCESS_TOKEN` to store the token:

```shell
# Replace the token with yours
OIDC_ACCESS_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6U3FFaXN6VlpuYi1sRWMzZkp0UHNpU1ZZcGs4RGN3dXI1Mkx5V05aQTR3In0.eyJleHAiOjE2ODAxNjA5NjgsImlhdCI6MTY4MDE2MDY2OCwianRpIjoiMzQ5MTc4YjQtYmExZC00ZWZjLWFlYTUtZGY2MzJiMDJhNWY5IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguNDIuMTQ1OjgwODAvcmVhbG1zL3F1aWNrc3RhcnQtcmVhbG0iLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMTg4MTVjM2EtNmQwNy00YTY2LWJjZjItYWQ5NjdmMmIwMTFmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBpc2l4LXF1aWNrc3RhcnQtY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImIxNmIyNjJlLTEwNTYtNDUxNS1hNDU1LWYyNWUwNzdjY2I3NiIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1xdWlja3N0YXJ0LXJlYWxtIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImIxNmIyNjJlLTEwNTYtNDUxNS1hNDU1LWYyNWUwNzdjY2I3NiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoicXVpY2tzdGFydC11c2VyIn0.uD_7zfZv5182aLXu9-YBzBDK0nr2mE4FWb_4saTog2JTqFTPZZa99Gm8AIDJx2ZUcZ_ElkATqNUZ4OpWmL2Se5NecMw3slJReewjD6xgpZ3-WvQuTGpoHdW5wN9-Rjy8ungilrnAsnDA3tzctsxm2w6i9KISxvZrzn5Rbk-GN6fxH01VC5eekkPUQJcJgwuJiEiu70SjGnm21xDN4VGkNRC6jrURoclv3j6AeOqDDIV95kA_MTfBswDFMCr2PQlj5U0RTndZqgSoxwFklpjGV09Azp_jnU7L32_Sq-8coZd0nj5mSdbkJLJ8ZDQDV_PP3HjCP7EHdy4P6TyZ7oGvjw"
```

Send a request to the route `/anything/test` with authorization header:

```shell
curl -i "http://127.0.0.1:9080/anything/test" -H "Authorization: Bearer $OIDC_ACCESS_TOKEN"
```

An `HTTP/1.1 200 OK` response verifies that the OIDC plugin works and accepts requests with valid access token.

### Test With Invalid Access Token

Send a request to `http://127.0.0.1:9080/anything/test` with invalid access token:

```shell
curl -i "http://127.0.0.1:9080/anything/test -H "Authorization: Bearer invalid-access-token"
```

An `HTTP/1.1 401 Unauthorized` response verifies that the OIDC plugin works and rejects requests with invalid access token.

### Test Without Access Token

Send a request to `http://127.0.0.1:9080/anything/test` without access token:

```shell
curl -i "http://127.0.0.1:9080/anything/test"
```

An `HTTP/1.1 401 Unauthorized` response verifies that the OIDC plugin works and rejects requests without access token.

## Next Steps

APISIX supports more OIDC identity providers, such as Okta, Auth0, and Azure AD (coming soon).

In addition, APISIX also supports other authentication approach such as basic authentication, JWT, and key authentication (coming soon).
