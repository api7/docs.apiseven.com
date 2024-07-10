---
title: Security Hardening Reference
slug: /reference/hardening
---

Infrastructure security is an important topic that organizations scrutinize to stay compliant with the latest regulatory and legal requirements. Understanding where and how sensitive information is stored is of paramount importance to implement robust security measures and safeguard against unauthorized access, data breaches, or malicious attacks in your organization.

![ee-component-diagram](https://static.apiseven.com/uploads/2024/04/11/5ZUDl6rt_ee-sec-0411.png)

This document provides a reference detailing where sensitive information in API7 Enterprise is, how they are stored, and how they are protected.

## Between Data Plane (DP) and Control Plane (CP)

The communication between DP and CP can be secured with tokens or mTLS.

* When using tokens, tokens are PBKDF2 encrypted and saved to the database.
* When using mTLS, CP only stores the server and CA certificates. It does not store the client certificate.

## Control Plane (CP)

### Database Connection Credentials

Database connection credentials are stored in the control plane's configuration files. They can also be stored in environment variables and injected into the configuration files.

### Plugin Resources

Sensitive [plugin](../key-concepts/plugins.md) fields in plugin configurations are specified in `encrypted_fields` in the plugin schema. Information in these fields is encrypted with AES256 and saved to the database.

The keyring used to encrypt sensitive information differs by gateway group and they are also encrypted before being saved to the database.

### SSL Resources

For [SSL resources](../key-concepts/ssl-certificates.md), metadata are saved in plaintext while certificates are AES encrypted and saved to the database.

When viewing SSL resources using API or a dashboard, you can only see the metadata.

### Dashboard and DP Manager Connections

The communication between the dashboard and the DP manager uses HTTPS by default. If no certificates are configured, API7 will use self-signed certificates.

### Audit

Sensitive information, such as passwords, is masked in audit logs before the logs are saved to the database. Any additional alteration to audit logs is forbidden.

### User Credentials

User credentials, including username and password, as well as an access token, are salted and PBKDF2 encrypted before being saved to the database.

### Encryption Algorithms

In cases where the field should not be reversible, the encryption algorithm would be PBKDF2 with salt.

In cases where the field should be reversible, the encryption algorithm would be AES.

## Data Plane (DP)

Between clients and API7 Enterprise, as well as API7 Enterprise and upstream services, you can optionally configure TLS or mTLS to secure the communication.
