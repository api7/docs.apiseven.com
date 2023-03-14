export type MenuData = {
  title?: string;
  icon_link?: string;
  href?: string;
  links: {
    title: string;
    icon_link?: string;
    description?: string;
    href: string;
  }[];
};

export type DesktopNavData = {
  title: string;
  data: MenuData[];
};

export type MobileNavData = {
  label: string;
  children: MenuData[];
};

export const products = [
  {
    title: 'API7 Cloud',
    href: 'https://api7.ai/cloud',
    links: [
      {
        title: 'Get Started for Free',
        description: 'No credit card required',
        href: 'https://api7.ai/cloud',
      },
      {
        title: 'Pricing',
        description: 'Pay-as-you-go',
        href: 'https://api7.ai/pricing',
      },
    ],
  },
  {
    title: 'API7 Enterprise',
    href: 'https://api7.ai/apisix-vs-api7',
    links: [
      {
        title: 'API7 Enterprise',
        description: 'API Management based on Apache APISIX',
        href: 'https://api7.ai/apisix-vs-api7',
      },
      {
        title: 'API7 Whitepaper',
        description: 'An overview of the API7 product',
        href: 'https://docs.api7.ai/enterprise-whitepaper/introduction',
      },
      {
        title: 'Commercial Support',
        description: 'Services included in commercial support',
        href: 'https://api7.ai/support',
      },
      {
        title: 'Talk to Experts',
        description: 'Communicate for better solutions',
        href: 'https://api7.ai/contact',
      },
    ],
  },
] as MenuData[];

export const oss = [
  {
    title: 'Open Source',
    links: [
      {
        title: 'Apache APISIX',
        href: 'https://api7.ai/apisix',
        description: 'Why Is APISIX the Best API Gateway?',
      },
      {
        title: 'wasm-nginx-module',
        href: 'https://github.com/api7/wasm-nginx-module',
        description: 'Run Wasm in NGINX',
      },
    ],
  },
  {
    links: [
      {
        title: 'APISIX Kubernetes Ingress Controller',
        href: 'http://github.com/apache/apisix-ingress-controller',
        description: 'Use APISIX for Kubernetes',
      },
      {
        title: 'Contributor Over Time',
        href: 'https://github.com/api7/contributor-graph',
        description: 'Observing the health of open source projects',
      },
    ],
  },
];

export const developers = [
  {
    title: 'Learn',
    links: [
      {
        title: 'Blog',
        href: 'https://api7.ai/blog',
        description: 'Latest news and updates',
      },
      {
        title: 'NGINX + Lua',
        href: 'https://api7.ai/learning-center/openresty',
        description: 'Learn NGINX and Lua from here',
      },
      {
        title: 'APISIX Training and Certification',
        href: 'https://api7.ai/apisix-training-and-certification',
        description: 'Apache APISIX Traning and Certification',
      },
      {
        title: 'Apache APISIX Quickstart',
        href: 'https://docs.api7.ai/apisix',
        description: 'Get started with Apache APISIX',
      },
    ],
  },
  {
    title: 'Comparsion',
    links: [
      {
        title: 'APISIX vs Kong',
        description: '93x Faster and 200% QPS',
        href: 'https://api7.ai/apisix-vs-kong',
      },
      {
        title: 'APISIX vs NGINX',
        description: 'Dynamic and Cluster Management',
        href: 'https://api7.ai/apisix-vs-nginx',
      },
    ],
  },
] as MenuData[];

export const company = [
  {
    links: [
      { title: 'About', href: 'https://api7.ai/about' },
      { title: 'Contact', href: 'https://api7.ai/contact' },
      { title: 'Careers', href: 'https://angel.co/company/api7-ai/jobs' },
      { title: 'Handbook', href: 'https://handbook.api7.ai/' },
      { title: 'Partners', href: 'https://api7.ai/partners' },
    ],
  },
];

export const docs = [
  {
    links: [
      { title: 'Apache APISIX', href: 'https://docs.api7.ai/apisix' },
      { title: 'API7 Cloud', href: 'https://docs.api7.ai/cloud' },
      { title: 'API7 Enterprise', href: 'https://docs.api7.ai/enterprise' },
    ],
  },
];

const ossMobileLink = [
  {
    links: [
      {
        title: 'Apache APISIX',
        href: 'https://api7.ai/apisix',
        description: 'Why Is APISIX the Best API Gateway?',
      },
      {
        title: 'wasm-nginx-module',
        href: 'https://github.com/api7/wasm-nginx-module',
        description: 'Run Wasm in NGINX',
      },
    ],
  },
  {
    links: [
      {
        title: 'APISIX Kubernetes Ingress Controller',
        href: 'http://github.com/apache/apisix-ingress-controller',
        description: 'Use APISIX for Kubernetes',
      },
      {
        title: 'Contributor Over Time',
        href: 'https://github.com/api7/contributor-graph',
        description: 'Observing the health of open source projects',
      },
    ],
  },
];
export const data: MobileNavData[] = [
  {
    label: 'Products',
    children: [...products],
  },
  {
    label: 'Open Source',
    children: [...ossMobileLink],
  },
  {
    label: 'Docs',
    children: [...docs],
  },
  {
    label: 'Resources',
    children: [...developers],
  },
  {
    label: 'Company',
    children: [...company],
  },
];
