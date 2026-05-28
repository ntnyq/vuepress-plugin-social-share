import './styles/vars.css'
import { defineClientConfig } from 'vuepress/client'
import type { SocialSharePluginOptionsWithDefaults } from '../shared/plugin'
import { GlobalSocialShare, SocialShare } from './components'
import { injectSocialShareOptions } from './helpers'

// oxlint-disable-next-line no-underscore-dangle
declare const __SOCIAL_SHARE_COMPONENT_NAME__: string
// oxlint-disable-next-line no-underscore-dangle
declare const __SOCIAL_SHARE_USE_CUSTOM_STYLE__: boolean
// oxlint-disable-next-line no-underscore-dangle
declare const __SOCIAL_SHARE_CLIENT_OPTIONS__: SocialSharePluginOptionsWithDefaults

if (!__SOCIAL_SHARE_USE_CUSTOM_STYLE__) {
  import('./styles/social-share.css')
}

export default defineClientConfig({
  enhance({ app }) {
    injectSocialShareOptions(app, __SOCIAL_SHARE_CLIENT_OPTIONS__)

    app.component(__SOCIAL_SHARE_COMPONENT_NAME__, SocialShare)
  },

  rootComponents: __SOCIAL_SHARE_CLIENT_OPTIONS__.noGlobalSocialShare
    ? []
    : [GlobalSocialShare],
})
