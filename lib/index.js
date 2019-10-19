const { resolve } = require('path')

module.exports = options => {
  return {
    name: 'social-share',

    enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),

    define: {
      SOCIAL_SHARE_OPTIONS: JSON.stringify(options),
    },

    globalUIComponents: 'GlobalSocialShare',
  }
}
