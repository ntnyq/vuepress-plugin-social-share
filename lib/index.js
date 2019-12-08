const { resolve } = require('path')
const deepMerge = require('deepmerge')
const BASE_NETWORKS = require('./networks.json')

module.exports = ({ extendsNetworks, ...options }) => {
  const socialShareOptions = {
    ...options,
    networksData: deepMerge(BASE_NETWORKS, extendsNetworks),
  }

  return {
    name: 'social-share',

    enhanceAppFiles: resolve(__dirname, 'enhanceApp.js'),

    clientDynamicModules () {
      return {
        name: 'social-share.js',
        content: `export default ${JSON.stringify(socialShareOptions)}`,
      }
    },

    globalUIComponents: 'GlobalSocialShare',
  }
}
