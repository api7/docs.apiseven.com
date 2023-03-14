---
title: Authentication
slug: /features/authentication
tags:
  - API7 Enterprise
  - API7 Whitepaper
  - Authentication
---

API7 has built-in authentication authentication plugins such as key-auth, basic-auth, jwt-auth, etc. Taking HMAC plugin as an example, API7 can work with AK/SK to encrypt the request parameters to ensure that the request has not been tampered with.

Request parameters such as Request Path, Request Query String, timestamp, and signature algorithm, are included in Request Header to avoid request tampering and replay attacks.