import Vue, { ComponentOptions, VNode } from 'vue'
import type { SocialShareNetworkItem } from '../types'
import { isSVG } from '../utils'

interface SocialShareNetworkComponent extends Vue {
  // computed
  isSvgIcon: boolean
  shareUrl: string

  // props
  network: SocialShareNetworkItem
  isPlain: boolean

  // methods
  generateHashTags: (hashtags: string) => string
  share: () => void
}

const SocialShareNetwork: ComponentOptions<SocialShareNetworkComponent> = {
  name: `SocialShareNetwork`,

  inheritAttrs: false,

  props: {
    network: {
      type: Object,
      validator: network => {
        if (!network.icon) return false
        if ([`popup`].includes(network.type)) return Boolean(network.sharer)
        return true
      },
      required: true,
    },

    isPlain: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isSvgIcon(this: SocialShareNetworkComponent) {
      return isSVG(this.network.icon!)
    },

    shareUrl(this: SocialShareNetworkComponent) {
      let { name, sharer = `` } = this.network
      const { url, title, quote, media, hashtags, description, twitterUser } =
        this.$parent as any
      /**
       * On IOS, Twitter sharing should't have a empty hashtag parameter
       * See https://github.com/nicolasbeauvais/vue-social-sharing/issues/143
       */
      if ([`twitter`].includes(name) && !hashtags.length) {
        sharer = sharer.replace(`&hashtags=@hashtags`, ``)
      }
      return sharer
        .replace(/@url/g, encodeURIComponent(url))
        .replace(/@title/g, encodeURIComponent(title))
        .replace(/@media/g, media)
        .replace(/@description/g, encodeURIComponent(description))
        .replace(/@quote/g, encodeURIComponent(quote))
        .replace(/@hashtags/g, this.generateHashTags(hashtags))
        .replace(/@twitteruser/g, twitterUser ? `&via=${twitterUser}` : ``)
    },
  },

  methods: {
    /**
     * Encode hashtags for the specified social network
     * @param {string} hashtags All hashtags specified
     *
     * @returns {string} hashtags string
     */
    generateHashTags(
      this: SocialShareNetworkComponent,
      hashtags: string = ``
    ): string {
      const { name } = this.network
      if ([`facebook`].includes(name) && hashtags.length) {
        return `%23${hashtags.split(`,`)[0]}`
      }
      return hashtags
    },

    /**
     * Shares URL in specified network
     */
    share(this: SocialShareNetworkComponent) {
      const { name, type } = this.network
      const { url } = this.$parent as any
      switch (type) {
        case `popup`:
          ;(this.$parent as any).openSharer &&
            (this.$parent as any).openSharer(this.shareUrl, { name, url })
          break
        case `qrcode`:
          ;(this.$parent as any).showQRCode &&
            (this.$parent as any).showQRCode()
          break
        case `direct`:
          window.open(this.shareUrl, `_self`)
          break
        default:
          break
      }
      this.$root.$emit('social-share-open', { name, url })
    },
  },

  render(this: SocialShareNetworkComponent, h) {
    const renderShareIcon = (network: SocialShareNetworkItem) =>
      this.isSvgIcon
        ? h(`span`, {
            style: { color: !this.isPlain && network.color },
            attrs: {
              class: `social-share-icon-svg`,
              focusable: `false`,
            },
            domProps: {
              innerHTML: this.network.icon,
            },
          })
        : h(`span`, {
            style: { backgroundImage: `url(${network.icon})` },
            attrs: { class: `social-share-icon-img` },
          })
    const renderShareButton = (network: SocialShareNetworkItem) =>
      h(
        `button`,
        {
          attrs: {
            'data-link':
              network.type === 'popup'
                ? `#share-${network.name}`
                : this.shareUrl,
            class: `social-share-btn`,
            title: network.name,
            type: `button`,
            role: `button`,
          },
          on: { click: this.share },
        },
        [renderShareIcon(network)]
      )
    return h(
      `li`,
      { attrs: { class: `social-share-network`, role: `option` } },
      [renderShareButton(this.network)]
    )
  },
}

export default SocialShareNetwork
