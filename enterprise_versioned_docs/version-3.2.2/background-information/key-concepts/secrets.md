---
title: Secrets
slug: /key-concepts/secrets
---

In this document, you will learn the basic concept of secrets in APISIX and why you may need them.

Explore additional resources at the end of the document for more information on related topics.

## Overview

In APISIX, a *secret* object is used to set up integration with an external secret manager, so that APISIX can establish connections and fetch secrets from the secret manager dynamically at runtime. 

The following diagram illustrates the concept of a secret object using an example, where [key authentication](../../getting-started/key-authentication.md) is enabled for a user, John Doe, and user credentials are stored in an [HashiCorp Vault](https://www.vaultproject.io) server: 

<div style={{textAlign: 'center'}}>
<img src="https://static.apiseven.com/uploads/2023/04/20/SOgLBbLy_secrets-3.svg" alt="secrets diagram example when using Vault as the external secret manager to store key for key authentication" width="100%"/>
</div>

As demonstrated, when APISIX is used in conjunction with an external secret manager, the field for secret is defined as a variable starting with a fixed prefix `$secret://`, appended with the name of the secret manager, APISIX secret object ID, username, and other details. 

Specifically, if Vault is used as the secret manager, the APISIX secret object should specify:

* `uri`: location where Vault server is hosted
* `prefix`: path prefix corresponding to a secret engine that Vault should route traffic to
* `token`: token for APISIX to authenticate to Vault and establish connection

These configurations ensure that John Doe can send requests to APISIX and access the back-end service with the correct key. Requests from unauthenticated users are rejected by APISIX. 

For more details on the secret object usage, please refer to the Admin API reference (coming soon).

[//]: <TODO: link to Admin API - secrets>

## Additional Resource(s)

* Getting Started - [Key Authentication](../../getting-started/key-authentication.md)
* Key Concepts
  * [Plugins](./plugins.md)
  * [Consumers](./consumers.md)

[//]: <TODO: Admin API - secrets>
