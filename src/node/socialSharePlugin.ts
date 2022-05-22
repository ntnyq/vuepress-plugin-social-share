import path from 'path'
import type { Plugin } from '@vuepress/core'
import { createNetworksData } from '../shared'
import type { SocialSharePluginOptions } from '../shared'

export const socialSharePlugin = (options: SocialSharePluginOptions = {}): Plugin => ({
  name: `social-share`,

  clientConfigFile: path.resolve(__dirname, `../client/config.js`),

  alias: app => ({
    '@vuepress/plugin-social-share/temp': app.dir.temp(
      `social-share/social-share`,
    ),
  }),

  define: {
    __SOCIAL_SHARE_COMPONENT_NAME__: options.componentName ?? `SocialShare`,
  },

  onPrepared (app) {
    const networksData = createNetworksData(options)
    const socialShareOptions = { ...options, networksData }
    app.writeTemp(
      `social-share/social-share.js`,
      `export const socialShareOptions = ${JSON.stringify(socialShareOptions)}`,
    )
  },
})
