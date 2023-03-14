---
title: Refined Routing
slug: /features/refined-routing
tags:
  - API7 Enterprise
  - API7 Whitepaper
  - Refined Routing
---

API7 will triage the matched requests according to the preset weights and parameters.

## Triage by weight

The administrator creates each upstream object through the control panel, and during the configuration process, allows to set the weight value for each upstream service instance, if the value is 0, it means that no traffic is assigned to the example. In addition, upstream supports algorithms such as round robin polling with weight, chash, and exponentially weighted moving average (EWMA).

## Streaming by parameters

The API gateway supports triage based on each parameter of the request and its value, for example:

### Request Header

```json
{
    "vars": [["http_user_agent", "~*", "android"]], // Whether request header User-Agent matches android
    "uri": "/hello",
    "upstream_id": "1"
}
```

### Request Host

```json
{
    "hosts": ["www.my.com"], // Whether host matches "www.my.com"
    "uri": "/hello",
    "upstream_id": "1"
}
```

### Request Path

```json
{
    "uri": "/hello", // Whether path matches "/hello"
    "upstream_id": "1"
}
```

### Request Query String

```json
{
    "vars": [["arg_theme", "==", "light"]], // Whether theme in query string matches light
    "uri": "/hello",
    "upstream_id": "1"
}
```

### Request Cookie

```json
{
    "vars": [["cookie_token", "==", "1234"]], // Whether token field in cookie matches "1234" 
    "uri": "/hello",
    "upstream_id": "1"
}
```

When the request is matched with each parameter, the traffic will be assigned to the corresponding upstream service.
