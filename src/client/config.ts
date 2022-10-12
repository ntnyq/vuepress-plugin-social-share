import './style.css'
import { h } from 'vue'
import { defineClientConfig } from '@vuepress/client'
// @ts-expect-error virtual module
import { socialShareOptions } from '@vuepress/plugin-social-share/temp'
import { type SocialSharePluginOptionsWithDefaults } from '../shared/index.js'
import { GlobalSocialShare, SocialShare } from './components/index.js'

declare const __SOCIAL_SHARE_COMPONENT_NAME__: string

const options = socialShareOptions as SocialSharePluginOptionsWithDefaults

export default defineClientConfig({
  enhance ({ app }) {
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

      setup (props) {
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
