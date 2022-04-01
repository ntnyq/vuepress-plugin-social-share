import './style.styl'
import { EnhanceApp } from 'vuepress-types'
import type { SocialShareNetworkData, SocialSharePluginOptions } from './types'
// @ts-expect-error virtual modules
import socialShareOptions from '@dynamic/social-share'
import SocialShare from './components/SocialShare'
import GlobalSocialShare from './components/GlobalSocialShare'

type SocialSharePluginOptionsWithDefaults = SocialSharePluginOptions & {
  networksData: SocialShareNetworkData
}

const enhanceApp: EnhanceApp = ({ Vue }) => {
  const {
    networks,
    twitterUser,
    fallbackImage,
    autoQuote,
    isPlain,
    networksData,
  } = socialShareOptions as SocialSharePluginOptionsWithDefaults

  Vue.component(`SocialShare`, {
    functional: true,

    props: {
      networks: {
        type: Array,
      },

      tags: {
        type: Array,
      },

      isPlain: {
        type: Boolean,
      },
    },

    render(h, { props, data, parent }) {
      // @ts-expect-error private property
      if (parent._isMounted) {
        return h(SocialShare, {
          ...data,
          props: {
            networks: props.networks || networks,
            tags: props.tags,
            twitterUser,
            fallbackImage,
            autoQuote,
            isPlain: props.isPlain || isPlain,
            networksData,
          },
        })
      } else {
        parent.$once(`hook:mounted`, () => {
          parent.$forceUpdate()
        })
        return h()
      }
    },
  })

  Vue.component(`GlobalSocialShare`, {
    functional: true,

    render(h, { parent }) {
      // @ts-expect-error private property
      if (parent._isMounted) {
        return h(GlobalSocialShare, {
          attrs: {
            networks,
            isPlain,
            twitterUser,
            fallbackImage,
            autoQuote,
            networksData,
          },
        })
      } else {
        parent.$once(`hook:mounted`, () => {
          parent.$forceUpdate()
        })
        return h()
      }
    },
  })
}

module.exports = enhanceApp
