import * as React from "react";
import { IoGrid, IoHelpBuoy, IoListSharp, IoCloudOutline, IoPeople } from "react-icons/io5";
import {
  AiOutlineRead,
  AiFillGithub,
  AiOutlineProject,
} from "react-icons/ai";
import { MdWeb } from "react-icons/md";
import { CgReadme } from "react-icons/cg";
import { SiMeetup } from "react-icons/si";
import { MdCompare, MdBook } from "react-icons/md";
import { TiNews } from "react-icons/ti";
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
    label: "API7 Cloud",
    href: "https://www.api7.cloud/",
  },
  {
    label: "技术博客",
    children: [
      {
        label: "技术文章",
        href: "https://www.apiseven.com/blog",
        description: "阅读技术文章，了解前沿技术",
        icon: <AiOutlineRead />,
      },
      {
        label: "用户案例",
        href: "https://www.apiseven.com/usercases",
        description: "全球领先企业在 Apache APISIX 上的成功实践",
        icon: <IoGrid />,
      },
    ],
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
        label: "ApacheCon Asia",
        description: "观看 ApacheCon Asia 2021 大会录像",
        href: "https://www.apiseven.com/resources/acasia2021",
        icon: <SiMeetup />,
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
    ],
  },
  {
    label: "商业产品",
    children: [
      {
        label: "API7 Cloud",
        description: "联系我们，抢先体验 API7 Cloud",
        href: 'https://www.api7.cloud/',
        icon: <IoCloudOutline />,
      },
      {
        label: "Apache APISIX vs API7",
        href: "https://www.apiseven.com/apisix-vs-api7",
        description: "产品能力、商业支持对比",
        icon: <MdCompare />,
      },
      {
        label: "产品特性",
        href: "https://www.apiseven.com/products/api7/features",
        description: "查看 API7 产品功能特性",
        icon: <IoListSharp />,
      },
    ],
  },
  {
    label: "API7.ai",
    children: [
      {
        label: "关于我们",
        description: "关于 API7.ai",
        href: "https://www.apiseven.com/about",
        icon: <MdWeb />,
      },
      {
        label: "新闻报道",
        description: "获取 API7.ai 相关新闻",
        href: "https://www.apiseven.com/news",
        icon: <TiNews />,
      },
      {
        label: "工作机会",
        description: "与我们一起构建安全、可靠的 API 连接",
        href: "https://www.apiseven.com/careers",
        icon: <IoPeople />,
      },
      {
        label: "公司手册",
        description: "故事、文化、价值观等",
        href: "https://handbook.api7.ai/",
        icon: <MdBook />,
      },
    ],
  },
];
