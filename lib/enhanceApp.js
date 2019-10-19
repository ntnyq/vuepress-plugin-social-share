import SocialShare from './components/SocialShare.vue'
import GlobalSocialShare from './components/GlobalSocialShare.vue'

import './styles/index.styl'

export default ({ Vue }) => {
  /* eslint-disable-next-line no-undef */
  const socialShareOptions = JSON.parse(SOCIAL_SHARE_OPTIONS)
  const {
    networks,
    twitterUser,
    weiboAppKey,
    fallbackImage,
    autoQuote,
    isPlain,
    extendsNetworks,
  } = socialShareOptions

  Vue.component('SocialShare', {
    functional: true,

    props: {
      networks: {
        type: Array,
        default: undefined,
      },

      tags: {
        type: Array,
        default: undefined,
      },

      isPlain: {
        type: Boolean,
        default: undefined,
      },
    },

    /* eslint-disable-next-line vue/require-render-return */
    render (h, { data, props, parent }) {
      if (parent._isMounted) {
        return h(SocialShare, {
          ...data,
          props: {
            networks: props.networks || networks,
            tags: props.tags,
            twitterUser,
            weiboAppKey,
            fallbackImage,
            autoQuote,
            isPlain: props.isPlain || isPlain,
            extendsNetworks,
          },
        })
      } else {
        parent.$once('hook:mounted', () => {
          parent.$forceUpdate()
        })
      }
    },
  })

  Vue.component('GlobalSocialShare', {
    functional: true,

    /* eslint-disable-next-line vue/require-render-return */
    render (h, { parent }) {
      if (parent._isMounted) {
        return h(GlobalSocialShare, {
          attrs: {
            networks,
            isPlain,
            twitterUser,
            weiboAppKey,
            fallbackImage,
            autoQuote,
            extendsNetworks,
          },
        })
      } else {
        parent.$once('hook:mounted', () => {
          parent.$forceUpdate()
        })
      }
    },
  })
}
