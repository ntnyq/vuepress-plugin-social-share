import './style.css'
import { h } from 'vue'
import { defineClientAppEnhance } from '@vuepress/client'
import { SocialShare } from './components/SocialShare'
import { type SocialSharePluginOptionsWithDefaults } from '../shared'
// @ts-expect-error virtual module
import { socialShareOptions } from '@vuepress/plugin-social-share/temp'

declare const __SOCIAL_SHARE_COMPONENT_NAME__: string

export default defineClientAppEnhance(({ app }) => {
  const options = socialShareOptions as SocialSharePluginOptionsWithDefaults

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
})
