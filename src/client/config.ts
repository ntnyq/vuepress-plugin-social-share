import { h } from 'vue'
import { defineClientConfig } from '@vuepress/client'
import { socialShareOptions } from '@vuepress/plugin-social-share/options'
import { GlobalSocialShare, SocialShare } from './components/index.js'

declare const __SOCIAL_SHARE_COMPONENT_NAME__: string
declare const __SOCIAL_SHARE_USE_CUSTOM_STYLE__: boolean

const options = socialShareOptions

if (!__SOCIAL_SHARE_USE_CUSTOM_STYLE__) {
  import('./style.css')
}

export default defineClientConfig({
  enhance({ app }) {
    app.component(__SOCIAL_SHARE_COMPONENT_NAME__, {
      props: {
        tags: {
          type: Array,
        },

        networks: {
          type: Array,
        },

        isPlain: {
          type: Boolean,
        },
      },

      setup(props) {
        return () =>
          h(SocialShare, {
            ...options,
            tags: props.tags,
            networks: props.networks ?? options.networks,
            isPlain: props.isPlain ?? options.isPlain,
          })
      },
    })
  },

  rootComponents: options.noGlobalSocialShare ? [] : [GlobalSocialShare],
})
