const { resolve } = require('path')

module.exports = {
  title: 'vuepress-plugin-social-share',
  description: 'Social sharing plugin for VuePress',
  dest: 'site',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'vuepress-plugin-social-share',
      description: 'Social sharing plugin for VuePress',
    },
  },

  plugins: [
    [
      require(resolve(__dirname, '../../lib')),
      {
        networks: ['qq', 'twitter', 'reddit', 'telegram', 'weibo'],
        twitterUser: 'ntnyq',
        fallbackImage: '/hero.png',
      },
    ],
  ],

  themeConfig: {
    repo: 'ntnyq/vuepress-plugin-social-share',
    docsRepo: 'ntnyq/vuepress-plugin-social-share',
    docsDir: 'docs',
    docsBranch: 'master',
    search: false,
    editLinks: true,
    lastUpdated: true,
    displayAllHeaders: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          { text: 'Demo', link: '/demo/' },
          { text: 'Changelog', link: 'https://github.com/ntnyq/vuepress-plugin-social-share/blob/master/CHANGELOG.md' },
        ],
        sidebar: [
          '/guide/',
        ],
      },
    },
  },
}
