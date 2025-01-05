import { viteBundler } from '@vuepress/bundler-vite'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { socialSharePlugin } from 'vuepress-plugin-social-share'
import { version } from '../../package.json'
import type { NavbarLinkOptions } from '@vuepress/theme-default'

const packageName = 'vuepress-plugin-social-share'

const VERSIONS: NavbarLinkOptions[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: `https://github.com/ntnyq/${packageName}/releases` },
  { text: 'VuePress v1', link: 'https://social-share-v1.ntnyq.com' },
]

export default defineUserConfig({
  title: packageName,

  description: 'Social sharing plugin for VuePress',

  bundler: viteBundler(),

  theme: defaultTheme({
    repo: `ntnyq/${packageName}`,
    docsRepo: `ntnyq/${packageName}`,
    docsDir: 'docs',
    docsBranch: 'next',
    editLink: true,
    lastUpdated: true,

    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Demo', link: '/demo/' },
      {
        text: `v${version}`,
        children: VERSIONS,
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
      networks: [
        'qq',
        'twitter',
        'weibo',
        'email',
        'wechat',
        'linkedin',
        {
          name: 'pinterest',
          type: 'popup',
          icon: '/pinterest.png',
          default: true,
          sharer:
            'https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title',
        },
      ],
      twitterUser: 'ntnyq',
      fallbackImage: '/hero.png',
      useCustomStyle: false,
      hideWhenPrint: true,
    }),
  ],
})
