import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { withBase } from 'vuepress/client'
import { isString, upperFirst } from '../../shared'
import type { SocialShareNetworkWithName } from '../../shared'
import { isSVG } from '../utils'

export enum Event {
  Share = 'share',
}

export const SocialShareNetwork = defineComponent({
  name: 'SocialShareNetwork',

  inheritAttrs: true,

  props: {
    network: {
      type: Object as PropType<SocialShareNetworkWithName>,
      required: true,
      validator: (network: SocialShareNetworkWithName) => {
        if (!network.icon) {
          return false
        }
        if (network.type !== 'qrcode') {
          return Boolean(network.sharer)
        }
        return true
      },
    },

    isPlain: {
      type: Boolean,
      default: false,
    },

    isDark: {
      type: Boolean,
      default: false,
    },

    shareURL: {
      type: String,
      default: '',
    },
  },

  emits: [Event.Share],

  setup(props, ctx) {
    const resolvedIcon = computed(() => {
      const theme = props.isDark ? 'dark' : 'light'
      const icon = isString(props.network.icon)
        ? props.network.icon
        : props.network.icon[theme]
      return icon.startsWith('/') && !icon.startsWith('//')
        ? withBase(icon)
        : icon
    })
    const resolvedColor = computed(() => {
      if (props.isPlain || !props.network.color) {
        return ''
      }
      if (isString(props.network.color)) {
        return props.network.color
      }
      return props.isDark ? props.network.color.dark : props.network.color.light
    })
    const isSvgIcon = computed(() => isSVG(resolvedIcon.value))

    const renderShareIcon = () =>
      isSvgIcon.value
        ? h('span', {
            class: 'social-share-icon-svg',
            focusable: false,
            style: { color: resolvedColor.value },
            innerHTML: resolvedIcon.value,
          })
        : h('span', {
            style: { backgroundImage: `url(${resolvedIcon.value})` },
            class: 'social-share-icon-img',
          })
    const renderShareButton = () =>
      h(
        'button',
        {
          class: 'social-share-btn',
          title: upperFirst(props.network.name),
          type: 'button',
          role: 'button',
          'aria-label': `Share with ${upperFirst(props.network.name)}`,
          onClick: () => ctx.emit(Event.Share, props.network.name),
          'data-link':
            props.network.type === 'popup'
              ? `#share-${props.network.name}`
              : props.shareURL,
        },
        [renderShareIcon()],
      )

    return () =>
      h(
        'li',
        {
          class: 'social-share-network',
          role: 'option',
        },
        [renderShareButton()],
      )
  },
})
