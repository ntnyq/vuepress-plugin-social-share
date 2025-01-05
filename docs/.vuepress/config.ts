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
      // @keep-sorted
      langs: [
        'bash',
        'css',
        'html',
        'js',
        'json',
        'jsonc',
        'jsx',
        'md',
        'scss',
        'shell',
        'ts',
        'tsx',
        'vue',
        'yaml',
        'yml',
      ],
      theme: 'one-dark-pro',
    }),
    socialSharePlugin({
      // @keep-sorted
      networks: [
        'email',
        'facebook',
        'linkedin',
        'pinterest',
        'qq',
        'reddit',
        'twitter',
        'wechat',
        'weibo',
        'x',
      ],
      twitterUser: 'ntnyq',
      fallbackImage: '/hero.png',
      useCustomStyle: false,
      hideWhenPrint: true,
    }),
  ],
})
