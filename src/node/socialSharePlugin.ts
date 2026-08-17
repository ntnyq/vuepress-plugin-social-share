import { addViteSsrNoExternal } from '@vuepress/helper'
import type { PluginFunction } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import { PLUGIN_NAME } from '../shared'
import type {
  SocialSharePluginOptions,
  SocialSharePluginOptionsWithDefaults,
} from '../shared'
import { logger, resolveNetworksData } from './helpers'

const dirname = getDirname(import.meta.url)

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

    const networksData = resolveNetworksData(networks, extendsNetworks),
     clientOptions: SocialSharePluginOptionsWithDefaults = {
      ...restClientOptions,
      networksData,
    }

    return {
      name: PLUGIN_NAME,

      clientConfigFile: path.resolve(dirname, '../client/config.js'),

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
