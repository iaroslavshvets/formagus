// @ts-check
import {themes} from 'prism-react-renderer';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

// Create __dirname equivalent for ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Formagus',
  tagline: 'Formagus library',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://formagus.surge.sh',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'iaroslavshvets', // Usually your GitHub org/user name.
  projectName: 'formagus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: resolve(__dirname, './sidebars.mjs'),
          routeBasePath: '/',
          editUrl: 'https://github.com/iaroslavshvets/formagus/tree/master/packages/docs',
        },
        pages: {},
        blog: false,
        theme: {
          customCss: resolve(__dirname, './src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Formagus',
        logo: {
          alt: 'Formagus Logo',
          src: 'img/formagus.svg',
        },

        items: [
          {
            href: 'https://github.com/iaroslavshvets/formagus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${String(new Date().getFullYear())} Iaroslav Shvets. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

export default config;
