import { Badge } from "@chakra-ui/react";
import * as React from "react";
import { FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";

export interface LinkGroupData {
  title: string;
  links: Array<{
    label: string;
    href: string;
    badge?: React.ReactElement;
  }>;
}

export const EN_US_links: LinkGroupData[] = [
  {
    title: "Product",
    links: [
      {
        label: "API7 Cloud",
        href: "https://www.api7.cloud/",
        badge: (
          <Badge colorScheme="blue" variant="solid" fontSize="0.625rem">
            New
          </Badge>
        ),
      },
      {
        label: "API Gateway",
        href: "http://apisix.apache.org/",
        badge: (
          <Badge colorScheme="blue" variant="solid" fontSize="0.625rem">
            Hot
          </Badge>
        ),
      },
      {
        label: "k8s Ingress Controller",
        href: "https://github.com/apache/apisix-ingress-controller",
      },
      {
        label: "Service Mesh",
        href: "https://github.com/api7/amesh",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Success Stories",
        href: "https://www.apiseven.com/usercases",
      },
      {
        label: "Blog",
        href: "https://www.apiseven.com/blog",
      },
      {
        label: "DevCon",
        href: "https://www.apiseven.com/resources/apisix-devcon-2020",
      },
      ,
      {
        label: "API7 Whitepaper",
        href: "https://static.apiseven.com/202202/API7-WhitePaper-EN.pdf",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        label: "About",
        href: "https://www.apiseven.com/about",
      },
      {
        label: "Careers",
        href: "https://www.apiseven.com/careers",
      },
      {
        label: "News",
        href: "https://www.apiseven.com/news",
      },
      {
        label: "Handbook",
        href: "https://handbook.api7.ai/",
      },
    ],
  },
  {
    title: "Links",
    links: [
      {
        label: "Authing",
        href: "https://www.authing.cn/",
      },
      {
        label: "Apifox",
        href: "https://www.apifox.cn/",
      },
    ],
  },
  {
    title: "Contact",
    links: [
      {
        label: "support@api7.ai",
        href: "mailto:support@api7.ai",
      },
    ],
  },
];

export const ZH_CN_links: LinkGroupData[] = [
  {
    title: "产品",
    links: [
      {
        label: "API7 企业版",
        href: "https://www.apiseven.com/enterprise",
        badge: (
          <Badge colorScheme="blue" variant="solid" fontSize="0.625rem">
            Hot
          </Badge>
        ),
      },
      {
        label: "API7 Portal",
        href: "https://www.apiseven.com/portal",
        badge: (
          <Badge colorScheme="blue" variant="solid" fontSize="0.625rem">
            New
          </Badge>
        ),
      },
      {
        label: "API7 Cloud",
        href: "https://www.api7.cloud/",
      },
    ],
  },
  {
    title: "开源项目",
    links: [
      {
        label: "Apache APISIX",
        href: "http://apisix.apache.org/",
      },
      {
        label: "Apache APISIX Ingress Controller",
        href: "https://github.com/apache/apisix-ingress-controller",
      },
      {
        label: "Amesh",
        href: "https://github.com/api7/amesh",
      },
    ],
  },
  {
    title: "相关资源",
    links: [
      {
        label: "用户案例",
        href: "https://www.apiseven.com/usercases",
      },
      {
        label: "技术博客",
        href: "https://www.apiseven.com/blog",
      },
      {
        label: "API7 企业版文档",
        href: "/enterprise/introduction",
      },
      {
        label: "开发者大会",
        href: "https://www.apiseven.com/resources/apisix-devcon-2020",
      },
      {
        label: "白皮书",
        href: "https://static.apiseven.com/202202/API7-WhitePaper.pdf",
      },
      {
        label: "隐私政策",
        href: "https://www.apiseven.com/privacy_policy",
      },
    ],
  },
  {
    title: "支流科技",
    links: [
      {
        label: "关于我们",
        href: "https://www.apiseven.com/about",
      },
      {
        label: "工作机会",
        href: "https://www.apiseven.com/careers",
      },
      {
        label: "合作伙伴",
        href: "https://www.apiseven.com/partners",
      },
      {
        label: "新闻报道",
        href: "https://www.apiseven.com/news",
      },
      {
        label: "公司手册",
        href: "https://handbook.api7.ai/",
      },
    ],
  },
  {
    title: "友情链接",
    links: [
      {
        label: "Authing",
        href: "https://www.authing.cn/",
      },
      {
        label: "Apifox",
        href: "https://www.apifox.cn/",
      },
    ],
  },
];

interface SocialLink {
  label: string;
  icon: React.ReactElement;
  href: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "Twitter",
    icon: <FaTwitter />,
    href: "https://twitter.com/ApacheAPISIX",
  },
  {
    label: "YouTube",
    icon: <FaYoutube />,
    href: "https://www.youtube.com/channel/UCgPD18cMhOg5rmPVnQhAC8g",
  },
  {
    label: "Github",
    icon: <FaGithub />,
    href: "https://github.com/apache/apisix",
  },
];

interface FooterLink {
  label: string;
  href: string;
}

export const footerLinks: FooterLink[] = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Offer terms", href: "#" },
  { label: "Legal notice", href: "#" },
  { label: "Sitemap", href: "#" },
];
