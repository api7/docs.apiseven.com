

## 使用场景

希望使用keycloak能力来做oauth，但是使用存量的用户数据（可能存在老的数据库里或其他系统）

## 前置要求

要先安装部署好keycloak，最低版本21.0.1. 下载包解压缩到provider 目录，然后安装SPI包后重启。


## 使用限制

不可以和现有的 authz-keycloak，openid-connect 插件混用，

要说清楚差异


## 操作步骤

1. 实现 API
2. 安装keycloak
3. 加载keycloak spi包
4. 在左侧菜单 user federation中，Add external api provider.
5. 加载插件
6. 路由加载插件
7. 访问带上jwt token




