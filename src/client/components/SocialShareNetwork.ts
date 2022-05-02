import { h, computed, defineComponent, type PropType } from 'vue'
import { isSVG } from '../utils'
import { type SocialShareNetworkItem } from '../../shared'

export const SocialShareNetwork = defineComponent({
  name: `SocialShareNetwork`,

  props: {
    network: {
      type: Object as PropType<SocialShareNetworkItem>,
      required: true,
      validator: (network: SocialShareNetworkItem) => {
        if (!network.icon) return false
        if ([`popup`].includes(network.type)) return Boolean(network.sharer)
        return true
      },
    },

    isPlain: {
      type: Boolean,
      default: false,
    },

    shareURL: {
      type: String,
      default: ``,
    },
  },

  emits: [`share`],

  setup(props, ctx) {
    const isSvgIcon = computed(() => isSVG(props.network.icon))
    const renderShareIcon = (network: SocialShareNetworkItem) =>
      isSvgIcon.value
        ? h(`span`, {
            class: `social-share-icon-svg`,
            focusable: false,
            style: { color: !props.isPlain && network.color },
            innerHTML: network.icon,
          })
        : h(`span`, {
            style: { backgroundImage: `url(${network.icon})` },
            class: `social-share-icon-img`,
          })
    const renderShareButton = (network: SocialShareNetworkItem) =>
      h(
        `button`,
        {
          class: `social-share-btn`,
          title: network.name,
          type: `button`,
          role: `button`,
          onClick: () => ctx.emit(`share`, network.name),
          'data-link':
            network.type === `popup`
              ? `#share-${network.name}`
              : props.shareURL,
        },
        [renderShareIcon(network)],
      )

    return () =>
      h(
        `li`,
        {
          class: `social-share-network`,
          role: `option`,
        },
        [renderShareButton(props.network)],
      )
  },
})
