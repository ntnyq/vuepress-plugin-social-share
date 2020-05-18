const { resolve } = require('path')
const deepMerge = require('deepmerge')
const BASE_NETWORKS = require('./networks.json')

module.exports = ({
  extendsNetworks = {},
  noGlobalSocialShare,
  ...options
} = {}) => {
  const networksData = deepMerge(BASE_NETWORKS, extendsNetworks)
  const socialShareOptions = { ...options, networksData }

  return {
    name: 'social-share',

    enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),

    clientDynamicModules () {
      return {
        name: 'social-share.js',
        content: `export default ${JSON.stringify(socialShareOptions)}`,
      }
    },

    globalUIComponents: noGlobalSocialShare ? [] : ['GlobalSocialShare'],
  }
}
