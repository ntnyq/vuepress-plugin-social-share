import { defineClientConfig } from 'vuepress/client'
import { socialShareOptions } from '@vuepress/plugin-social-share/options'
import { injectSocialShareOptions } from './helpers/index.js'
import { GlobalSocialShare, SocialShare } from './components/index.js'
import type { ClientConfig } from 'vuepress/client'

declare const __SOCIAL_SHARE_COMPONENT_NAME__: string
declare const __SOCIAL_SHARE_USE_CUSTOM_STYLE__: boolean

const options = socialShareOptions

if (!__SOCIAL_SHARE_USE_CUSTOM_STYLE__) {
  import('./style.css')
}

export default defineClientConfig({
  enhance({ app }) {
    injectSocialShareOptions(app, options)

    app.component(__SOCIAL_SHARE_COMPONENT_NAME__, SocialShare)
  },

  rootComponents: options.noGlobalSocialShare ? [] : [GlobalSocialShare],
}) satisfies ClientConfig
