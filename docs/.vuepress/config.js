const extendsNetworks = {
  pinterest: {
    sharer: 'https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title',
    type: 'popup',
    icon: '/pinterest.png',
  },
  linkedin: {
    sharer: 'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description',
    type: 'popup',
    color: '#1786b1',
    icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
  },
}

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
    [require('../../lib'), {
      networks: ['qq', 'twitter', 'weibo', 'email', 'linkedin', 'pinterest'],
      email: 'ntnyq13@gmail.com',
      twitterUser: 'ntnyq',
      fallbackImage: '/hero.png',
      extendsNetworks,
    }],
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
