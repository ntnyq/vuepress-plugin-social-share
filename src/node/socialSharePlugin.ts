import { addViteSsrNoExternal } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'
import { PLUGIN_NAME } from '../shared/index.js'
import { logger, resolveNetworksData } from './helpers.js'
import type { PluginFunction } from 'vuepress/core'
import type {
  SocialSharePluginOptions,
  SocialSharePluginOptionsWithDefaults,
} from '../shared/index.js'

const __dirname = getDirname(import.meta.url)

export const socialSharePlugin =
  (options: SocialSharePluginOptions = {}): PluginFunction =>
  app => {
    const {
      componentName = 'SocialShare',
      useCustomStyle = false,
      networks = ['twitter', 'facebook', 'reddit'],
      extendsNetworks = {},
      // Options for client
      ...restClientOptions
    } = options

    if (app.env.isDebug) {
      logger.info('Options:', options)
    }

    const networksData = resolveNetworksData(networks, extendsNetworks)
    const clientOptions: SocialSharePluginOptionsWithDefaults = {
      ...restClientOptions,
      networksData,
    }

    return {
      name: PLUGIN_NAME,

      clientConfigFile: path.resolve(__dirname, '../client/config.js'),

      define: {
        __SOCIAL_SHARE_COMPONENT_NAME__: componentName,
        __SOCIAL_SHARE_USE_CUSTOM_STYLE__: useCustomStyle,
        __SOCIAL_SHARE_CLIENT_OPTIONS__: clientOptions,
      },

      extendsBundlerOptions(bundlerOptions, app) {
        addViteSsrNoExternal(bundlerOptions, app, '@vuepress/helper')
      },
    }
  }
