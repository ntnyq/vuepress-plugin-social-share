import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { viteBundler } from '@vuepress/bundler-vite'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { socialSharePlugin } from 'vuepress-plugin-social-share'
import type { SocialShareNetworkData } from 'vuepress-plugin-social-share'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const resolve = (...args: string[]) => path.resolve(__dirname, '..', ...args)

const extendsNetworks: SocialShareNetworkData = {
  pinterest: {
    sharer: 'https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title',
    type: 'popup',
    icon: '/pinterest.png',
  },
  linkedin: {
    sharer:
      'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description',
    type: 'popup',
    color: '#1786b1',
    icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
  },
}

export default defineUserConfig({
  title: 'vuepress-plugin-social-share',

  description: 'Social sharing plugin for VuePress',

  bundler: viteBundler(),

  alias: {
    '@vuepress/plugin-palette/style': resolve('.vuepress/styles/index.scss'),
  },

  theme: defaultTheme({
    repo: 'ntnyq/vuepress-plugin-social-share',
    docsRepo: 'ntnyq/vuepress-plugin-social-share',
    docsDir: 'docs',
    docsBranch: 'next',
    editLink: true,
    lastUpdated: true,

    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Demo', link: '/demo/' },
      { text: 'VuePress v1', link: 'https://social-share-v1.ntnyq.com' },
      {
        text: 'Changelog',
        link: 'https://github.com/ntnyq/vuepress-plugin-social-share/releases',
      },
    ],

    sidebar: ['/guide/'],
  }),

  plugins: [
    shikiPlugin({
      langs: [
        'js',
        'ts',
        'md',
        'jsx',
        'tsx',
        'html',
        'vue',
        'css',
        'scss',
        'json',
        'jsonc',
        'yml',
        'yaml',
        'bash',
        'shell',
      ],
      theme: 'one-dark-pro',
    }),
    socialSharePlugin({
      networks: ['qq', 'twitter', 'weibo', 'email', 'linkedin', 'pinterest', 'wechat'],
      twitterUser: 'ntnyq',
      fallbackImage: '/hero.png',
      useCustomStyle: false,
      hideWhenPrint: true,
      extendsNetworks,
    }),
  ],
})
