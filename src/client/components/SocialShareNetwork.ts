import { useDarkMode } from '@vuepress/helper/client'
import { computed, defineComponent, h } from 'vue'
import { isString, upperFirst } from '../../shared/index.js'
import { inBrowser, isSVG } from '../utils.js'
import type { PropType } from 'vue'
import type { SocialShareNetworkWithName } from '../../shared/index.js'

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
        if (!network.icon) return false
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

    shareURL: {
      type: String,
      default: '',
    },
  },

  emits: [Event.Share],

  setup(props, ctx) {
    const isDarkMode = computed(() => {
      // workaround for document is undefined
      if (!inBrowser) return false
      return useDarkMode().value
    })
    const resolvedIcon = computed(() => {
      const { icon } = props.network
      if (isString(icon)) return icon
      return isDarkMode.value ? icon.dark : icon.light
    })
    const resolvedColor = computed(() => {
      const { color = '' } = props.network
      if (props.isPlain) return ''
      if (!color) return ''
      if (isString(color)) return color
      return isDarkMode.value ? color.dark : color.light
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
