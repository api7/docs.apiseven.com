---  
title: 构建 API 端点  
slug: /reference/api-implementation/build-api-endpoints  
---

API 端点为您的 API 提供实际的业务逻辑和数据。在将其与 API7 企业版集成之前，您需要先开发和部署 API。  

## 开发 API 端点  

本节列出了开发 API 端点的工作流程。  

1. **排期规划**：排期是 API 开发过程中的关键环节。团队成员应根据排期时间表完成并汇报工作，以确保项目按时交付。  
2. **开发与自测**：开发通常涉及编码和调试，而自测则包括测试和验证开发的 API，以确保其功能正常。  
3. **集成测试**：集成测试是调试和测试不同模块间 API 的阶段，以确保交互和通信的正确性与稳定性。  
4. **QA 测试**：QA 测试（或质量保证测试）旨在在 API 发布前识别并消除缺陷或漏洞。这对 API 的可靠性和安全性至关重要。  
5. **产品验收**​​：产品验收阶段需进行全面测试、评估与确认，确保 API 符合预期目标、技术标准及业务需求。此环节是验证 API 生产环境就绪性（production readiness）的关键步骤，直接影响最终交付质量。
6. **部署**：一旦 API 通过所有必要的测试和评估，它将被部署到生产环境中。之后，您可以访问并使用该 API。  

## 部署 API 后端  

在部署 API 后端时，您应考虑 API 的可扩展性、可用性、可移植性等因素。  

- **虚拟机**：直接在虚拟机上部署服务二进制文件/包。  
- **容器**：将服务打包为 Docker 容器，并部署在 Kubernetes 等编排平台上。  
- **无服务器架构**：开发函数并部署在 AWS Lambda 等平台上。  
- **本地部署**：在现有的本地基础设施上托管服务。  

## 定义 API 端点  

部署完成后，必须为 API 后端配置网络端点，以便 API7 企业版能够路由请求。  

- **虚拟机**：分配公共 IP 地址并在虚拟机防火墙上开放服务端口的访问权限。  
- **容器**：使用 Kubernetes Ingress 或 LoadBalancer 服务暴露端点。  
- **无服务器架构**：大多数无服务器平台会自动为函数分配调用 URL。  
- **本地部署**：为本地服务定义 URL 或 IP 地址及端口，并配置 API7 企业版的 IP 地址白名单。  

### 检测 API 后端  

您可以使用以下任一方式检测 API 后端：  

- **实现健康检查（强烈推荐）**  

    为后端服务配置健康检查端点，以便 API7 企业版检测可用性并相应地路由流量。  

- **使用服务发现（可选）**  

    可以使用服务发现机制（如 Consul、Eureka、Nacos 或 Kubernetes 服务发现）动态检测后端节点。
