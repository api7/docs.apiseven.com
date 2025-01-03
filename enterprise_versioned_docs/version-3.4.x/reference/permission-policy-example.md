---
title: 权限策略示例
slug: /reference/permission-policy-examples
---

### 完全访问所有资源

```json
{
 "statement": [
    {
      "resources": [
        "<.*>"
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow" 
    }
  ]
}
```

### 只读所有资源

```json
{
 "statement": [
    {
      "resources": [
        "<.*>"
      ],
      "actions": [
        "<.*>Get<.*>"
      ],
      "effect": "allow"      
    }
  ]
}
```

### 只读指定网关组

```json
{
  "statement": [
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/{gateway group id}",
        "arn:api7:gateway:gatewaygroup/{gateway group id}" 
      ],
      "actions": [
        "<.*>Get<.*>"
      ],
      "effect": "allow"
    },
    {
      "resources": [
         "arn:api7:gateway:gatewaygroup/{gateway group id}/publishedservice/<.*>",
         "arn:api7:gateway:gatewaygroup/{gateway group id}/publishedservice/<.*>" 
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    }
  ]
}
```

### 完全访问指定网关组

```json
{
  "statement": [ 
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/{gateway group id}",
        "arn:api7:gateway:gatewaygroup/{gateway group id}" 
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/{gateway group id}/publishedservice/<.*>"  
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    }
  ]
} 
```

### 服务管理员

1. 直接在所有网关组上修改特定服务；
2. 修改服务中心中特定服务的模板，然后发布到所有网关组；
3. 将特定服务从一个网关组同步到另一个网关组。


```json
{
  "statement": [
    {
      "resources": [
        "arn:api7:gateway:servicetemplate/{service id}" 
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/<.*>/publishedservice/{service id}" 
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
     {
      "resources": [
        "arn:api7:gateway:gatewaygroup/<.*>"
      ],
      "actions": [
        "gateway:GetGatewayGroup"  
      ],
      "effect": "allow" 
    }
  ]
}
```

你也可以使用标签，如果你需要管理多个具有同样标签的服务：

```json
{
  "statement": [ 
    {
      "resources": [
        "arn:api7:gateway:servicetemplate/<.*>" 
      ],
      "actions": [
        "<.*>"
      ],
      "conditions": {
        "service_label": {
          "type": "MatchLabel",
          "options": {
            "key": "team",
            "operator": "exact_match",
            "value": "enterprise"
          }
        }
      },
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/<.*>/publishedservice/<.*>" 
      ],
      "actions": [
        "<.*>"
      ],
      "conditions": {
        "service_label": {
          "type": "MatchLabel",
          "options": {
            "key": "team",
            "operator": "exact_match",
            "value": "enterprise"
          }
        }
      },
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/<.*>"
      ],
      "actions": [
        "gateway:GetGatewayGroup"  
      ],
      "effect": "allow" 
    }
  ]
}
```

### 管理自定义插件

```json
{
  "statement": [
    {
      "resources": [
        "arn:api7:gateway:gatewaysetting/*"
      ],
      "actions": [
        "gateway:<.*>CustomPlugin<.*>"
      ],
      "effect": "allow"
    }
  ]
}
```

### 角色管理员

1. 邀请/删除用户；
2. 帮助用户重置密码；
3. 设计自定义角色；
4. 为用户分配角色。


```json
{
  "statement": [ 
    {
      "resources": [
        "arn:api7:iam:user/<.*>"
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:iam:role/<.*>"
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:iam:permissionpolicy/<.*>"
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    }
  ]
}
```

### 创建并管理生产网关组

```json
{
  "statement": [
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/<.*>"
      ],
      "actions": [
        "<.*>"
      ],
      "conditions": {
        "gateway_group_label": {
          "type": "MatchLabel",
          "options": {
            "key": "type",
            "operator": "exact_match",
            "value": "production"
          }
        }
      },
      "effect": "allow"
    },
    {
      "resources": [
        "arn:api7:gateway:gatewaygroup/*"
      ],
      "actions": [
        "gateway:CreateGatewayGroup"
      ],
      "effect": "allow"
    }
  ]
}
```

### 完全访问除许可证外所有资源

```json
{
  "statement": [ 
    {
      "resources": [
        "<.*>"
      ],
      "actions": [
        "<.*>"
      ],
      "effect": "allow"
    },
     {
      "resources": [
        "arn:api7:iam:organization/*"
      ],
      "actions": [
        "iam:UpdateLicense"
      ],
      "effect": "deny"   // "deny" 优先，最终禁止访问 updateLicense 操作。
    }   
  ]
}
```
