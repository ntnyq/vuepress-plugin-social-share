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
  {
    text: 'Release Notes',
    link: `https://github.com/ntnyq/${packageName}/releases`,
  },
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
      { text: 'Examples', link: '/examples/' },
      {
        text: `v${version}`,
        children: VERSIONS,
      },
    ],

    sidebar: [
      {
        link: '/guide/',
        text: 'Guide',
      },
    ],
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
        {
          name: 'pocket',
          color: '#ef3f56',
          icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.902 4.194A1.82 1.82 0 0 0 20.197 3H3.813A1.823 1.823 0 0 0 2 4.814v6.035l.069 1.2c.29 2.73 1.707 5.116 3.9 6.779c.038.03.078.059.118.089l.025.018a9.897 9.897 0 0 0 3.91 1.727a10.06 10.06 0 0 0 4.05-.014a.261.261 0 0 0 .064-.023a9.906 9.906 0 0 0 3.753-1.691l.025-.018c.04-.03.08-.058.119-.09c2.192-1.663 3.609-4.048 3.898-6.778l.069-1.2V4.814a1.792 1.792 0 0 0-.098-.62m-4.235 6.287l-4.704 4.513a1.372 1.372 0 0 1-1.899 0L6.36 10.48a1.371 1.371 0 1 1 1.898-1.979l3.756 3.601l3.756-3.6a1.372 1.372 0 0 1 1.898 1.978"/></svg>',
          sharer: 'https://getpocket.com/edit?url=@url',
          type: 'popup',
        },
      ],
      twitterUser: 'ntnyq',
      fallbackImage: '/hero.png',
      useCustomStyle: false,
      hideWhenPrint: true,
    }),
  ],
})
