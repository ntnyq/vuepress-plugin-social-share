const { resolve } = require('path')

module.exports = options => {
  return {
    name: 'vuepress-plugin-social-share',

    plugins: [
      ['@goy/svg-icons', {
        svgsDir: resolve(__dirname, 'icons'),
      }],
    ],

    enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),

    define: {
      SOCIAL_SHARE_OPTIONS: JSON.stringify(options),
    },

    globalUIComponents: 'GlobalSocialShare',
  }
}
