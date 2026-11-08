import './styles/vars.css'
import { defineClientConfig } from 'vuepress/client'
import type { SocialSharePluginOptionsWithDefaults } from '../shared/plugin'
import { GlobalSocialShare, SocialShare } from './components'
import { injectSocialShareOptions } from './helpers'

/**
 * Global component registration name injected by the plugin at build time.
 *
 * @default 'SocialShare'
 */
// oxlint-disable-next-line no-underscore-dangle
declare const __SOCIAL_SHARE_COMPONENT_NAME__: string
/**
 * Build-time flag that skips loading the built-in component stylesheet.
 *
 * @default false
 */
// oxlint-disable-next-line no-underscore-dangle
declare const __SOCIAL_SHARE_USE_CUSTOM_STYLE__: boolean
/**
 * Serialized plugin settings and resolved network registry injected at build time.
 */
// oxlint-disable-next-line no-underscore-dangle
declare const __SOCIAL_SHARE_CLIENT_OPTIONS__: SocialSharePluginOptionsWithDefaults

if (!__SOCIAL_SHARE_USE_CUSTOM_STYLE__) {
  import('./styles/social-share.css')
}

/**
 * VuePress client integration that registers sharing options, components and global UI.
 */
export default defineClientConfig({
  /**
   * Provides plugin settings and registers the configured inline sharing component.
   *
   * @param context - VuePress client enhancement context containing the Vue app.
   * @param context.app - Vue application receiving the provider and global component.
   * @returns Nothing; configures the application before mounting.
   */
  enhance({ app }) {
    injectSocialShareOptions(app, __SOCIAL_SHARE_CLIENT_OPTIONS__)

    app.component(__SOCIAL_SHARE_COMPONENT_NAME__, SocialShare)
  },

  /**
   * Global toolbar component, omitted when noGlobalSocialShare is enabled.
   */
  rootComponents: __SOCIAL_SHARE_CLIENT_OPTIONS__.noGlobalSocialShare
    ? []
    : [GlobalSocialShare],
})
