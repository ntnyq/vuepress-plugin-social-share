const { resolve } = require('path')

module.exports = options => {
  return {
    name: 'social-share',

    plugins: [
      ['@goy/svg-icons', {
        svgsDir: resolve(__dirname, 'icons'),
        componentName: 'SocialShareIcon',
        iconIdPrefix: 'social_share_icon_',
        iconClassPrefix: 'social-share-icon-',
        iconCommonClass: 'social-share-icon',
      }],
    ],

    enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),

    define: {
      SOCIAL_SHARE_OPTIONS: JSON.stringify(options),
    },

    globalUIComponents: 'GlobalSocialShare',
  }
}
