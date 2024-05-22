import * as React from "react";
import { IoGrid, IoHelpBuoy, IoListSharp, IoCloudOutline, IoPeople } from "react-icons/io5";
import {
  AiOutlineRead,
  AiFillGithub,
  AiOutlineProject,
  AiOutlineAppstore,
} from "react-icons/ai";
import { CgReadme } from "react-icons/cg";
import { SiMeetup, SiKubernetes, SiGoogledocs } from "react-icons/si";
import { MdCompare, MdBook, MdWeb, MdOutlineMiscellaneousServices } from "react-icons/md";
import { TiNews } from "react-icons/ti";
import { TbApiApp, TbHeartRateMonitor } from "react-icons/tb";
import { BsClouds } from "react-icons/bs";
import { RiShieldUserLine } from "react-icons/ri";
import { getRequestDemoLink } from "./helper";

export interface Link {
  label: string;
  href?: string;
  children?: Array<{
    label: string;
    description?: string;
    href: string;
    icon?: React.ReactElement;
  }>;
}

export const EN_US_Links: Link[] = [
  {
    label: "API7 Cloud",
    href: "https://www.api7.cloud/",
  },
  {
    label: "Blog",
    children: [
      {
        label: "Technical Article",
        href: "/blog",
        description: "Read technical articles and cutting-edge technologies",
        icon: <AiOutlineRead />,
      },
      {
        label: "Success Stories",
        href: "/usercases",
        description: "Success Stories of the world's leading companies",
        icon: <IoGrid />,
      },
    ],
  },
  {
    label: "Open Source",
    children: [
      {
        label: "Apache APISIX",
        href: "http://apisix.apache.org/",
        description: "A dynamic, real-time, high-performance API gateway",
        icon: <AiFillGithub />,
      },
      {
        label: "Apache APISIX Ingress Controller",
        href: "https://github.com/apache/apisix-ingress-controller",
        description:
          "Integrated with Kubernetes cluster management capabilities, it supports assertive dynamic configuration of distribution rules for ingress traffic",
        icon: <AiFillGithub />,
      },
      {
        label: "Amesh",
        href: "https://github.com/api7/amesh",
        description:
          "Agent of Apache APISIX to extend it as a Service Mesh Sidecar",
        icon: <AiFillGithub />,
      },
    ],
  },
  {
    label: "Resources",
    children: [
      {
        label: "ApacheCon Asia",
        description: "Watch ApacheCon Asia 2021 Records",
        href: "/resources/acasia2021",
        icon: <SiMeetup />,
      },
      {
        label: "Contributor Graph",
        description: "Generate Contributor Graph from GitHub",
        href: "/contributor-graph",
        icon: <AiOutlineProject />,
      },
      {
        label: "API7 Whitepaper",
        description:
          "Learn more about the API7's Whitepaper for more features and performance reports",
        href: "https://static.apiseven.com/202202/API7-WhitePaper-EN.pdf",
        icon: <IoHelpBuoy />,
      },
    ],
  },
  {
    label: "Company",
    children: [
      {
        label: "About",
        description: "About API7.ai",
        href: "/about",
        icon: <MdWeb />,
      },
      {
        label: "News",
        description: "Get latest news about API7.ai",
        href: "/news",
        icon: <TiNews />,
      },
      {
        label: "Careers",
        description:
          "Work with us to make the connections of the digital world more efficient, reliable and safe. ",
        href: "/careers",
        icon: <IoPeople />,
      },
      {
        label: "Handbook",
        description: "Values, Mission, etc.",
        href: "https://handbook.api7.ai/",
        icon: <MdBook />,
      },
    ],
  },
  {
    label: "Support",
    children: [
      {
        label: "Request Demo",
        description: "Contact us and request demo",
        href: getRequestDemoLink("en-US"),
        icon: <MdWeb />,
      },
      {
        label: "Commercial Support",
        description: "Features included in commercial products",
        href: "/business-support",
        icon: <IoHelpBuoy />,
      },
      {
        label: "Apache APISIX vs API7",
        href: "/apisix-vs-api7",
        description: "Difference between Apache APISIX and API7",
        icon: <MdCompare />,
      },
      {
        label: "API7 Features",
        href: "/products/api7/features",
        description: "Features list",
        icon: <IoListSharp />,
      },
    ],
  },
];

export const ZH_CN_Links: Link[] = [
  {
    label: "产品",
    children: [
      {
        label: "API7 EE",
        href: "https://www.apiseven.com/enterprise",
        description: "可部署于任何系统和云平台的 API 管理平台",
        icon: <TbApiApp />,
      },
      {
        label: "Apache APISIX vs API7",
        href: "https://www.apiseven.com/apisix-vs-enterprise",
        description: "产品能力、商业支持对比",
        icon: <MdCompare />,
      },
      {
        label: "API7 Cloud",
        description: "联系我们，抢先体验 API7 Cloud",
        href: 'https://www.api7.cloud/',
        icon: <IoCloudOutline />,
      },
      {
        label: "API7 Portal",
        href: "https://www.apiseven.com/portal",
        description: "以安全便捷的方式对内外部开放 API ，管控并可视化分析 API 的调用关系和调用量",
        icon: <AiOutlineAppstore />,
      },
    ],
  },
  {
    label: "解决方案",
    children: [
      {
        label: "本地部署升级混合云部署",
        href: "https://www.apiseven.com/solutions/on-prem-to-hybrid-cloud",
        description: "高效管理和保护多云、混合云环境中的 API",
        icon: <BsClouds />,
      },
      {
        label: "单体架构升级微服务架构",
        href: "https://www.apiseven.com/solutions/monolith-to-microservices",
        description: "提高业务服务可扩展性、弹性，降低风险和故障范围，实现团队效率提升",
        icon: <MdOutlineMiscellaneousServices />,
      },
      {
        label: "可观测性",
        href: "https://www.apiseven.com/solutions/observability",
        description: "通过可视化监控和异常检测提高系统可用性和性能",
        icon: <TbHeartRateMonitor />,
      },
      {
        label: "零信任安全",
        href: "https://www.apiseven.com/solutions/zero-trust-security",
        description: "在所有服务中实施零信任安全以简化安全防护",
        icon: <RiShieldUserLine />,
      },
      {
        label: "虚拟机升级 Kubernetes",
        href: "https://www.apiseven.com/solutions/vm-to-kubernetes",
        description: "降低运营成本并轻松管理数千服务",
        icon: <SiKubernetes />,
      },
    ],
  },
  {
    label: "客户案例",
    href: "https://www.apiseven.com/customers",
  },
  {
    label: "开源项目",
    children: [
      {
        label: "Apache APISIX",
        href: "http://apisix.apache.org/",
        description: "高性能、可扩展的微服务 API 网关",
        icon: <AiFillGithub />,
      },
      {
        label: "Apache APISIX Ingress Controller",
        href: "https://github.com/apache/apisix-ingress-controller",
        description:
          "基于 Apache APISIX 并集成 Kubernetes 集群管理能力，支持申明式动态配置入口流量的分发规则",
        icon: <AiFillGithub />,
      },
      {
        label: "Amesh",
        href: "https://github.com/api7/amesh",
        description:
          "Apache APISIX 的服务网格库。可从诸如 Istio 的控制平面中接收数据，并生成 APISIX 所需的数据结构，发挥 APISIX 作为数据面的作用。",
        icon: <AiFillGithub />,
      },
    ],
  },
  {
    label: "相关资源",
    children: [
      {
        label: "API7 企业版文档",
        description: "查看 API7 企业版详细指南，助力企业高效集成与管理 API",
        href: "/enterprise/introduction",
        icon: <SiGoogledocs />,
      },
      {
        label: "Apache APISIX Summit 2022",
        description: "观看 Apache APISIX Summit 2022 大会录像",
        href: "https://apisix-summit.org/",
        icon: <SiMeetup />,
      },
      {
        label: "白皮书",
        description: "阅读 API7 网关技术白皮书，了解更多功能与性能报告",
        href: "https://static.apiseven.com/202202/API7-WhitePaper.pdf",
        icon: <CgReadme />,
      },
      {
        label: "贡献者趋势",
        description: "获取开源项目贡献者趋势图",
        href: "https://www.apiseven.com/contributor-graph",
        icon: <AiOutlineProject />,
      },
      {
        label: "Apache APISIX vs Kong",
        description: "极致性能、高可用、稳定、开发者友好",
        href: "https://www.apiseven.com/apisix-vs-kong",
        icon: <MdCompare />,
      },
      {
        label: "Apache APISIX vs NGINX",
        description: "动态配置、多环境管理、全生命周期 API 管理",
        href: "https://www.apiseven.com/apisix-vs-nginx",
        icon: <MdCompare />,
      },
    ],
  },
  {
    label: "技术博客",
    href: "https://www.apiseven.com/blog",
  },
];
