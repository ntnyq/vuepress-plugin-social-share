import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { isString, upperFirst } from '../../shared'
import type { SocialShareNetworkWithName } from '../../shared'
import { isSVG } from '../utils'

export enum Event {
  Share = 'share',
}

export const SocialShareNetwork = defineComponent({
  emits: [Event.Share],

  inheritAttrs: true,

  name: 'SocialShareNetwork',

  props: {
    isDark: {
      default: false,
      type: Boolean,
    },

    isPlain: {
      default: false,
      type: Boolean,
    },

    network: {
      required: true,
      type: Object as PropType<SocialShareNetworkWithName>,
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

    shareURL: {
      default: '',
      type: String,
    },
  },

  setup(props, ctx) {
    const resolvedIcon = computed(() => {
      if (isString(props.network.icon)) {
        return props.network.icon
      }
      return props.isDark ? props.network.icon.dark : props.network.icon.light
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
            innerHTML: resolvedIcon.value,
            style: { color: resolvedColor.value },
          })
        : h('span', {
            class: 'social-share-icon-img',
            style: { backgroundImage: `url(${resolvedIcon.value})` },
          })
    const renderShareButton = () =>
      h(
        'button',
        {
          'aria-label': `Share with ${upperFirst(props.network.name)}`,
          class: 'social-share-btn',
          'data-link':
            props.network.type === 'popup'
              ? `#share-${props.network.name}`
              : props.shareURL,
          onClick: () => ctx.emit(Event.Share, props.network.name),
          role: 'button',
          title: upperFirst(props.network.name),
          type: 'button',
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
