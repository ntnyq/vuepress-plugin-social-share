import SocialShare from './components/SocialShare.vue'

import './styles/index.styl'

export default ({ Vue }) => {
  /* eslint-disable-next-line no-undef */
  const socialShareOptions = JSON.parse(SOCIAL_SHARE_OPTIONS)
  const {
    networks,
    twitterUser = '',
    weiboAppKey = '',
    fallbackImage = '',
    autoQuote,
    isPlain,
  } = socialShareOptions

  Vue.component('SocialShare', {
    functional: true,

    props: {
      networks: {
        type: [String, Array],
        default: undefined,
      },

      twitterUser: {
        type: String,
        default: '',
      },

      weiboAppKey: {
        type: String,
        default: '',
      },

      fallbackImage: {
        type: String,
        default: '',
      },

      autoQuote: {
        type: Boolean,
        default: undefined,
      },

      isPlain: {
        type: Boolean,
        default: undefined,
      },

      isGlobal: {
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
            twitterUser,
            weiboAppKey,
            fallbackImage,
            autoQuote,
            isPlain: props.isPlain || isPlain,
            isGlobal: props.isGlobal,
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
