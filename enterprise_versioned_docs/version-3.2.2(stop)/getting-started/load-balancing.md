---
title: Load Balancing
slug: /getting-started/load-balancing
---

Load balancing is a technique used to distribute network request loads. It is a key consideration in designing systems that need to handle a large volume of traffic, allowing for improved system performance, scalability, and reliability

Apache APISIX supports a variety of [load balancing algorithms](../background-information/key-concepts/upstreams.md#load-balancing), one of which is the weighted round-robin algorithm. This algorithm distributes incoming requests over a set of servers in a cyclical pattern.

In this tutorial, you will create a route with two upstream services and uses the round-robin load balancing algorithm to load balance requests.

## Prerequisite(s)

1. Complete [Get APISIX](./) to install APISIX.
2. Understand APISIX [Route and Upstream](./configure-routes#whats-a-route).

## Enable Load Balancing

Create a route with two upstream services, [httpbin.org](https://httpbin.org/headers) and [mock.api7.ai](https://mock.api7.ai/headers), to distribute requests across. Both services respond with the request headers when receiving request at `/headers`:

```shell
curl -i "http://127.0.0.1:9180/apisix/admin/routes" -X PUT -d '
{
  "id": "getting-started-headers",
  "uri": "/headers",
  "upstream" : {
# highlight-start
    // Annotate 1
    "type": "roundrobin",
    // Annotate 2
    "nodes": {
# highlight-end
      "httpbin.org:443": 1,
      "mock.api7.ai:443": 1
    },
# highlight-start
    // Annotate 3
    "pass_host": "node",
    // Annotate 4
    "scheme": "https"
# highlight-end
  }
}'
```

❶ `type`: use `roundrobin` as the load balancing algorithm.

❷ `nodes`: upstream services.

❸ `pass_host`: use `node` to pass the host header to the upstream.

❹ `scheme`: use `https` to enable TLS with upstream.

You should receive an `HTTP/1.1 201 OK` response if the route was created successfully.

## Validate

Generate 50 consecutive requests to APISIX `/headers` route to see the load-balancing effect:

```shell
resp=$(seq 50 | xargs -I{} curl "http://127.0.0.1:9080/headers" -sL) && \
  count_httpbin=$(echo "$resp" | grep "httpbin.org" | wc -l) && \
  count_mockapi7=$(echo "$resp" | grep "mock.api7.ai" | wc -l) && \
  echo httpbin.org: $count_httpbin, mock.api7.ai: $count_mockapi7
```

The command keeps count of the number of requests that was handled by the two services respectively. The output shows that requests were distributed over to the two services:

```text
httpbin.org: 23, mock.api7.ai: 27
```

## What's Next

You have learned how to configure load balancing. In the next tutorial, you will learn how to configure key authentication.
