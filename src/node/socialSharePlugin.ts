import { URL, fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import type { Plugin } from '@vuepress/core'
import { createNetworksData } from '../shared/index.js'
import type { SocialSharePluginOptions } from '../shared/index.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const socialSharePlugin = (options: SocialSharePluginOptions = {}): Plugin => ({
  name: 'social-share',

  clientConfigFile: resolve(__dirname, '../client/config.js'),

  alias: app => ({
    '@vuepress/plugin-social-share/options': app.dir.temp('social-share/social-share'),
  }),

  define: {
    __SOCIAL_SHARE_COMPONENT_NAME__: options.componentName ?? 'SocialShare',
  },

  onPrepared(app) {
    const networksData = createNetworksData(options)
    const socialShareOptions = { ...options, networksData }
    const content = `export const socialShareOptions = ${JSON.stringify(socialShareOptions)}`
    app.writeTemp('social-share/social-share.js', content)
  },
})
