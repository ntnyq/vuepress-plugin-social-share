import './styles/vars.css'
import { socialShareOptions } from '@vuepress/plugin-social-share/options'
import { defineClientConfig } from 'vuepress/client'
import { GlobalSocialShare, SocialShare } from './components/index.js'
import { injectSocialShareOptions } from './helpers/index.js'

declare const __SOCIAL_SHARE_COMPONENT_NAME__: string
declare const __SOCIAL_SHARE_USE_CUSTOM_STYLE__: boolean

const options = socialShareOptions

if (!__SOCIAL_SHARE_USE_CUSTOM_STYLE__) {
  import('./styles/social-share.css')
}

export default defineClientConfig({
  enhance({ app }) {
    injectSocialShareOptions(app, options)

    app.component(__SOCIAL_SHARE_COMPONENT_NAME__, SocialShare)
  },

  rootComponents: options.noGlobalSocialShare ? [] : [GlobalSocialShare],
})
