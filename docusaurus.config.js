// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const getEditUrl = (props) => {
  const {
    projectName, docPath, version,
  } = props;
  const dir = version === 'current' ? `docs/${projectName}` : `${projectName}/version-${version}`;

  return `https://github.com/api7/docs.apiseven.com/edit/main/${dir}/${docPath}`
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '支流科技文档',
  tagline: '',
  url: 'https://docs.apiseven.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'API7.ai', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },
  

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: "daily",
          priority: 0.5,
        },
      }),
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            spec: "https://run.api7.ai/api7-ee/openapi-latest.json",
            route: "/enterprise/reference/admin-api",
          },
          {
            spec: "enterprise_versioned_docs/version-3.2.11.8/reference/admin-api.json",
            route: "/enterprise/3.2.11.8/reference/admin-api"
          }
        ],
        theme: {
          primaryColor: "#e8433e",
        },
      }
    ]
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'enterprise-whitepaper',
        path: 'docs/enterprise-whitepaper',
        routeBasePath: '/enterprise-whitepaper',
        sidebarPath: require.resolve('./docs/enterprise-whitepaper/sidebars.json'),
        editUrl: (props) =>
          getEditUrl({
            ...props,
            projectName: 'enterprise-whitepaper',
          }),
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'enterprise',
        path: 'docs/enterprise',
        routeBasePath: '/enterprise',
        sidebarPath: require.resolve('./docs/enterprise/sidebars.js'),
        editUrl: (props) =>
          getEditUrl({
            ...props,
            projectName: 'enterprise_versioned_docs',
          }),
        includeCurrentVersion: false,
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'portal',
        path: 'docs/portal',
        routeBasePath: '/portal',
        sidebarPath: require.resolve('./docs/portal/sidebars.js'),
        editUrl: (props) =>
          getEditUrl({
            ...props,
            projectName: 'portal_versioned_docs',
          }),
      }
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: "/enterprise",
            to: "/enterprise/introduction",
          },
          {
            from: "/portal",
            to: "/portal/introduction",
          }
        ]
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '首页',
        items: [
          {
            position: "left",
            label: "API7 企业版",
            to: '/enterprise/introduction',
          },
        ],
      },
      metadata: [{ name: 'keywords', content: 'api7, apache apisix, premium support, enterprise, documentation, docs' }],
      footer: {
        style: 'dark',
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['lua']
      },
      colorMode: {
        defaultMode: "light",
        disableSwitch: true,
      },
    }),

  scripts: [
    {
      src: '/_vercel/insights/script.js',
      async: true,
    }
  ]
};

module.exports = config;
