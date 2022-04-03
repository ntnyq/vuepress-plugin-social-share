import Vue, { ComponentOptions, VNode } from 'vue'
import { SocialShareNetworkItem, SocialShareNetworkData } from '../types'
import { inBrowser, isExternalUrl, getMetaContentByName } from '../utils'
import SocialShareNetwork from './SocialShareNetwork'

interface SocialShareComponent extends Vue {
  // data
  userNetworks: SocialShareNetworkItem[]
  popup: {
    status: boolean
    resizable: boolean
    toolbar: boolean
    menubar: boolean
    scrollbars: boolean
    location: boolean
    directories: boolean
    width: number
    height: number
    top: number
    left: number
    interval: number | undefined
  }

  // props
  networks: string[]
  tags: string[]
  twitterUser: string
  fallbackImage: string
  autoQuote: boolean
  isPlain: boolean
  networksData: SocialShareNetworkData

  // computed
  visible: boolean
  url: string
  title: string
  description: string
  media: string
  quote: string
  hashtags: string
}

const SocialShare: ComponentOptions<SocialShareComponent> = {
  name: `SocialShare`,

  props: {
    networks: {
      type: Array,
      default: () => [`twitter`, `facebook`, `reddit`],
    },

    tags: {
      type: Array,
      default: () => [],
    },

    twitterUser: {
      type: String,
    },

    fallbackImage: {
      type: String,
    },

    autoQuote: {
      type: Boolean,
      default: true,
    },

    isPlain: {
      type: Boolean,
      default: false,
    },

    networksData: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    visible(this: SocialShareComponent) {
      return !!this.networks.length && !this.$frontmatter.noSocialShare
    },

    url(this: SocialShareComponent) {
      return (
        this.$frontmatter.$shareUrl ||
        this.$frontmatter.shareUrl ||
        (inBrowser ? location.href : '')
      )
    },

    title(this: SocialShareComponent) {
      return (
        this.$frontmatter.$shareTitle ||
        this.$frontmatter.shareTitle ||
        this.$frontmatter.title ||
        (inBrowser ? document.title : this.$title)
      )
    },

    description(this: SocialShareComponent) {
      return (
        this.$frontmatter.$shareDescription ||
        this.$frontmatter.shareDescription ||
        this.$frontmatter.description ||
        getMetaContentByName('description') ||
        this.$description
      )
    },

    media(this: SocialShareComponent) {
      const mediaUrl =
        this.$frontmatter.$shareImage ||
        this.$frontmatter.shareImage ||
        this.$frontmatter.image ||
        this.fallbackImage
      if (!mediaUrl) return ''
      if (isExternalUrl(mediaUrl)) return mediaUrl
      const realUrl = inBrowser
        ? `${location.origin}${this.$withBase(mediaUrl)}`
        : ''
      return realUrl
    },

    quote(this: SocialShareComponent) {
      return (
        this.$frontmatter.$shareQuote ||
        this.$frontmatter.shareQuote ||
        (this.autoQuote ? this.description : '')
      )
    },

    hashtags(this: SocialShareComponent) {
      const shareTags =
        this.$frontmatter.$shareTags ||
        this.$frontmatter.shareTags ||
        this.$frontmatter.tags ||
        this.$frontmatter.tag ||
        this.tags ||
        getMetaContentByName('keywords')
      if (Array.isArray(shareTags)) {
        return shareTags.join(',')
      }
      if (typeof shareTags === 'string') {
        return shareTags.replace(/\s/g, '')
      }
      return ''
    },
  },

  data(this: SocialShareComponent) {
    // Remove duplicated networks
    const networks = [...new Set(this.networks)]
    const userNetworks = Object.keys(this.networksData)
      .map(name => ({ name, ...this.networksData[name] }))
      .filter(network => networks.includes(network.name))
      .sort(
        (prev, next) =>
          networks.indexOf(prev.name) - networks.indexOf(next.name)
      )
    return {
      userNetworks,
      popup: {
        status: false,
        resizable: false,
        toolbar: false,
        menubar: false,
        scrollbars: false,
        location: false,
        directories: false,
        width: 626,
        height: 436,
        top: 0,
        left: 0,
        interval: null,
      },
    }
  },

  methods: {
    /**
     * Opens sharer popup
     *
     * @param {string} shareUrl target sharer url
     * @param {string} name sharer name
     * @param {string} url current page url
     */
    openSharer(shareUrl, { name, url }) {
      // If a popup window already exist it will be replaced, trigger a close event
      let popupWindow: Window | null = null
      const shareParams = [
        `status=${this.popup.status ? 'yes' : 'no'}`,
        `height=${this.popup.height}`,
        `width=${this.popup.width}`,
        `resizable=${this.popup.resizable ? 'yes' : 'no'}`,
        `left=${this.popup.left}`,
        `top=${this.popup.top}`,
        `screenX=${this.popup.left}`,
        `screenY=${this.popup.top}`,
        `toolbar=${this.popup.toolbar ? 'yes' : 'no'}`,
        `menubar=${this.popup.menubar ? 'yes' : 'no'}`,
        `scrollbars=${this.popup.scrollbars ? 'yes' : 'no'}`,
        `location=${this.popup.location ? 'yes' : 'no'}`,
        `directories=${this.popup.directories ? 'yes' : 'no'}`,
      ]
      popupWindow = window.open(shareUrl, 'sharer', shareParams.join(','))
      popupWindow?.focus?.()
      // Create an interval to detect popup closing event
      this.popup.interval = window.setInterval(() => {
        if (popupWindow && popupWindow.closed) {
          clearInterval(this.popup.interval)
          popupWindow = null
          this.$root.$emit('social-share-close', { name, url })
        }
      }, 500)
    },
    /**
     * Show QRCode modal
     */
    showQRCode() {
      const body = document.body
      const socialShareEl = document.querySelector(`#__VUEPRESS_SOCIAL_SHARE__`)
      const socialShareOverlay = document.createElement(`div`)
      socialShareOverlay.id = `__VUEPRESS_SOCIAL_SHARE__`
      socialShareOverlay.classList.add(`social-share-overlay`)
      if (socialShareEl && socialShareEl.parentNode) {
        socialShareEl.parentNode.removeChild(socialShareEl)
      }
      // import('qrcode').then(QRCode => {
      //   QRCode.toDataURL(this.url, {
      //     errorCorrectionLevel: `H`,
      //     width: 250,
      //     scale: 1,
      //     margin: 1.5,
      //   }).then(url => {
      //     socialShareOverlay.innerHTML = `<img class="social-share-qrcode" src="${url}" />`
      //     body.appendChild(socialShareOverlay)
      //     socialShareOverlay.classList.add('show')
      //     socialShareOverlay.addEventListener('click', evt => {
      //       socialShareOverlay.classList.remove('show')
      //       body.removeChild(socialShareOverlay)
      //       evt.stopPropagation()
      //     })
      //   })
      // })
    },
  },

  render(this: SocialShareComponent, h) {
    if (!this.visible) return null as unknown as VNode

    const renderSocialNetworkList = (
      networks: SocialShareNetworkItem[]
    ): VNode =>
      h(
        `ul`,
        { attrs: { class: `social-share-list`, role: `listbox` } },
        networks.map(network =>
          h(SocialShareNetwork, { props: { network, isPlain: this.isPlain } })
        )
      )

    return h(`div`, { attrs: { class: `social-share` } }, [
      renderSocialNetworkList(this.userNetworks),
      this.$slots.default,
    ])
  },

  mounted(this: SocialShareComponent) {
    if (!inBrowser) return false
    /**
     * Center the popup on dual screens
     * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
     */
    const docElem = document.documentElement
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY
    const width = window.innerWidth
      ? window.innerWidth
      : docElem.clientWidth
      ? docElem.clientWidth
      : screen.width
    const height = window.innerHeight
      ? window.innerHeight
      : docElem.clientHeight
      ? docElem.clientHeight
      : screen.height
    this.popup.left = width / 2 - this.popup.width / 2 + dualScreenLeft
    this.popup.top = height / 2 - this.popup.height / 2 + dualScreenTop
  },
}

export default SocialShare
