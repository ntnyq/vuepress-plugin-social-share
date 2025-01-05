import './styles/vars.css'
import { defineClientConfig } from 'vuepress/client'
import { GlobalSocialShare, SocialShare } from './components/index.js'
import { injectSocialShareOptions } from './helpers/index.js'
import type { SocialSharePluginOptionsWithDefaults } from '../shared/plugin.js'

declare const __SOCIAL_SHARE_COMPONENT_NAME__: string
declare const __SOCIAL_SHARE_USE_CUSTOM_STYLE__: boolean
declare const __SOCIAL_SHARE_CLIENT_OPTIONS__: SocialSharePluginOptionsWithDefaults

if (!__SOCIAL_SHARE_USE_CUSTOM_STYLE__) {
  import('./styles/social-share.css')
}

export default defineClientConfig({
  enhance({ app }) {
    injectSocialShareOptions(app, __SOCIAL_SHARE_CLIENT_OPTIONS__)

    app.component(__SOCIAL_SHARE_COMPONENT_NAME__, SocialShare)
  },

  rootComponents: __SOCIAL_SHARE_CLIENT_OPTIONS__.noGlobalSocialShare ? [] : [GlobalSocialShare],
})
