import { getDirname, path } from 'vuepress/utils'
import { addViteSsrNoExternal } from '@vuepress/helper'
import { PLUGIN_NAME, logger } from './logger.js'
import { mergeNetworksData } from './networks.js'
import type { PluginFunction } from 'vuepress/core'
import type { SocialSharePluginOptions } from '../shared/index.js'

const __dirname = getDirname(import.meta.url)

export const socialSharePlugin =
  (options: SocialSharePluginOptions = {}): PluginFunction =>
  app => {
    const {
      componentName = 'SocialShare',
      useCustomStyle = false,
      // Options to client
      ...restOptions
    } = options

    if (app.env.isDebug) {
      logger.info('Options:', options)
    }

    return {
      name: PLUGIN_NAME,

      clientConfigFile: path.resolve(__dirname, '../client/config.js'),

      alias: app => ({
        '@vuepress/plugin-social-share/options': app.dir.temp('social-share/options'),
      }),

      define: {
        __SOCIAL_SHARE_COMPONENT_NAME__: componentName,
        __SOCIAL_SHARE_USE_CUSTOM_STYLE__: useCustomStyle,
      },

      onPrepared(app) {
        const networksData = mergeNetworksData(restOptions)
        const socialShareOptions = { ...restOptions, networksData }
        const content = `export const socialShareOptions = ${JSON.stringify(socialShareOptions)}`
        app.writeTemp('social-share/options.js', content)
      },

      extendsBundlerOptions: (bundlerOptions: unknown, app): void => {
        addViteSsrNoExternal(bundlerOptions, app, '@vuepress/helper')
      },
    }
  }
