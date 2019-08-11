const { resolve } = require('path')

module.exports = {
  title: 'vuepress-plugin-social-share',
  description: 'Social sharing plugin for VuePress',
  dest: 'site',

  plugins: [
    [
      require(resolve(__dirname, '../../lib')),
      {
        twitterUser: 'ntnyq'
      }
    ]
  ],

  themeConfig: {
    repo: 'ntnyq/vuepress-plugin-social-share',
    docsRepo: 'ntnyq/vuepress-plugin-social-share',
    docsDir: 'docs',
    docsBranch: 'master',
    search: false,
    editLinks: true,
    lastUpdated: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Changelog', link: 'https://github.com/ntnyq/vuepress-plugin-social-share/blob/master/CHANGELOG.md' }
        ]
      }
    }
  }
}
