import { URL, fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { createNetworksData } from '../shared/index.js'
import type { Plugin } from '@vuepress/core'
import type { SocialSharePluginOptions } from '../shared/index.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const socialSharePlugin = ({
  componentName = 'SocialShare',
  useCustomStyle = false,
  ...options
}: SocialSharePluginOptions = {}): Plugin => ({
  name: 'social-share',

  clientConfigFile: resolve(__dirname, '../client/config.js'),

  alias: app => ({
    '@vuepress/plugin-social-share/options': app.dir.temp('social-share/options'),
  }),

  define: {
    __SOCIAL_SHARE_COMPONENT_NAME__: componentName,
    __SOCIAL_SHARE_USE_CUSTOM_STYLE__: useCustomStyle,
  },

  onPrepared(app) {
    const networksData = createNetworksData(options)
    const socialShareOptions = { ...options, networksData }
    const content = `export const socialShareOptions = ${JSON.stringify(socialShareOptions)}`
    app.writeTemp('social-share/options.js', content)
  },
})
