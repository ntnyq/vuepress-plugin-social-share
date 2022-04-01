import { resolve } from 'path'
import type { Plugin } from 'vuepress-types'
import { createNetworksData } from './utils'
import type { SocialSharePluginOptions } from './types'

const SocialSharePlugin: Plugin<SocialSharePluginOptions> = (options = {}) => {
  const networksData = createNetworksData(options)
  const socialShareOptions = { ...options, networksData }

  return {
    name: `social-share`,

    enhanceAppFiles: resolve(__dirname, `enhanceApp.js`),

    clientDynamicModules() {
      return {
        name: `social-share.js`,
        content: `export default ${JSON.stringify(socialShareOptions)}`,
      }
    },

    globalUIComponents: options.noGlobalSocialShare
      ? []
      : [`GlobalSocialShare`],
  }
}

module.exports = SocialSharePlugin
