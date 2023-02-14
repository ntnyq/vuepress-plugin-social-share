import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { isSVG } from '../utils.js'
import type { SocialShareNetworkItem } from '../../shared/index.js'

export enum Event {
  Share = 'share',
}

export const SocialShareNetwork = defineComponent({
  name: 'SocialShareNetwork',

  inheritAttrs: true,

  props: {
    network: {
      type: Object as PropType<SocialShareNetworkItem>,
      required: true,
      validator: (network: SocialShareNetworkItem) => {
        if (!network.icon) return false
        if (['popup'].includes(network.type)) return Boolean(network.sharer)
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
    const isSvgIcon = computed(() => isSVG(props.network.icon))
    const renderShareIcon = (network: SocialShareNetworkItem) =>
      isSvgIcon.value
        ? h('span', {
            class: 'social-share-icon-svg',
            focusable: false,
            style: { color: !props.isPlain && network.color },
            innerHTML: network.icon,
          })
        : h('span', {
            style: { backgroundImage: `url(${network.icon})` },
            class: 'social-share-icon-img',
          })
    const renderShareButton = (network: SocialShareNetworkItem) =>
      h(
        'button',
        {
          class: 'social-share-btn',
          title: network.name,
          type: 'button',
          role: 'button',
          onClick: () => ctx.emit(Event.Share, network.name),
          'data-link': network.type === 'popup' ? `#share-${network.name}` : props.shareURL,
        },
        [renderShareIcon(network)],
      )

    return () =>
      h(
        'li',
        {
          class: 'social-share-network',
          role: 'option',
        },
        [renderShareButton(props.network)],
      )
  },
})
