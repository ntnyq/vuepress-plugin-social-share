<template>
  <div
    v-if="visible"
    class="social-share"
  >
    <ul
      class="social-share-list"
      role="list-box"
    >
      <li
        v-for="network in networkList"
        :key="network.name"
        class="social-share-item"
        role="option"
      >
        <button
          @click="share(network)"
          :data-link="network.type === 'popup'
            ? `#share-${network.name}`
            : createShareUrl(network)"
          :data-action="network.type === 'popup'
            ? null
            : network.action"
          :title="network.name"
          class="social-share-btn"
          type="button"
          role="button"
        >
          <vp-icon
            :name="network.name"
            :color="isPlain ? null: network.color"
            class="social-share-icon"
            focusable="false"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import NTEWORKS_DATA from '../networks.json'
import {
  getMetaContentByName,
  isExternal,
} from '../utils'

const inBrowser = typeof window !== 'undefined'
const $window = inBrowser ? window : null

export default {
  props: {
    networks: {
      type: Array,
      default: () => ['twitter', 'facebook', 'reddit'],
    },

    tags: {
      type: Array,
      default: () => [],
    },

    twitterUser: {
      type: String,
      default: undefined,
    },

    weiboAppKey: {
      type: String,
      default: undefined,
    },

    fallbackImage: {
      type: String,
      default: undefined,
    },

    autoQuote: {
      type: Boolean,
      default: true,
    },

    isPlain: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    visible () {
      return this.networks.length && !this.$frontmatter.noSocialShare
    },

    url () {
      return (
        this.$frontmatter.$shareUrl ||
        this.$frontmatter.shareUrl ||
        ($window ? $window.location.href : '')
      )
    },

    title () {
      return (
        this.$frontmatter.$shareTitle ||
        this.$frontmatter.shareTitle ||
        this.$frontmatter.title ||
        ($window ? $window.document.title : this.$title)
      )
    },

    description () {
      return (
        this.$frontmatter.$shareDescription ||
        this.$frontmatter.shareDescription ||
        this.$frontmatter.description ||
        getMetaContentByName('description') ||
        this.$description
      )
    },

    media () {
      const mediaUrl = (
        this.$frontmatter.$shareImage ||
        this.$frontmatter.shareImage ||
        this.$frontmatter.image ||
        this.fallbackImage
      )

      if (!mediaUrl) return ''

      if (isExternal(mediaUrl)) return mediaUrl

      const realUrl = $window
        ? `${$window.location.origin}${this.$withBase(mediaUrl)}`
        : ''

      return realUrl
    },

    quote () {
      return (
        this.$frontmatter.$shareQuote ||
        this.$frontmatter.shareQuote ||
        (this.autoQuote ? this.description : '')
      )
    },

    hashtags () {
      const shareTags = (
        this.$frontmatter.$shareTags ||
        this.$frontmatter.shareTags ||
        this.$frontmatter.tags ||
        this.$frontmatter.tag ||
        this.tags ||
        getMetaContentByName('keywords')
      )

      if (Array.isArray(shareTags)) {
        return shareTags.join(',')
      }

      if (typeof shareTags === 'string') {
        return shareTags.replace(/\s/g, '')
      }

      return ''
    },
  },

  data () {
    // Remove duplicated networks
    const networks = [...new Set(this.networks)]
    const baseNetworks = networks.map(name => ({
      name,
      ...NTEWORKS_DATA[name],
    }))
    const networkList = [...baseNetworks]

    return {
      networkList,
      popup: {
        status: false,
        resizable: false,
        toobar: false,
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
     * Returns generated sharer url.
     *
     * @param name Social network name
     * @param sharer Social network sharer
     */
    createShareUrl ({ name, sharer }) {
      let url = sharer

      /**
       * On IOS, Twitter sharing should't have a empty hashtag parameter
       * See https://github.com/nicolasbeauvais/vue-social-sharing/issues/143
       */
      if (['twitter'].includes(name) && this.hashtags.length === 0) {
        url = url.replace('&hashtags=@hashtags', '')
      }

      return url
        .replace(/@url/g, encodeURIComponent(this.url))
        .replace(/@title/g, encodeURIComponent(this.title))
        .replace(/@description/g, encodeURIComponent(this.description))
        .replace(/@quote/g, encodeURIComponent(this.quote))
        .replace(/@hashtags/g, this.generateHashTags(name, this.hashtags))
        .replace(/@appkey/g, this.weiboAppKey ? `&appkey=${this.weiboAppKey}` : '')
        .replace(/@media/g, this.media)
        .replace(/@twitteruser/g, this.twitterUser ? `&via=${this.twitterUser}` : '')
    },

    /**
     * Encode hashtags for the specified social network.
     *
     * @param name Social network name
     * @param hashtags All hashtags specified
     */
    generateHashTags (name, hashtags = '') {
      if (['facebook'].includes(name) && hashtags.length) {
        return `%23${hashtags.split(',')[0]}`
      }

      return hashtags
    },

    /**
     * Shares URL in specified network.
     *
     * @param name Social network name
     * @param sharer Social network sharer
     */
    share ({ name, sharer }) {
      this.openSharer(name, this.createShareUrl({ name, sharer }))

      this.$root.$emit('social_share_open', name, this.url)
    },

    /**
     * Opens sharer popup.
     *
     * @param name Social network name
     * @param url Url to share
     */
    openSharer (name, url) {
      // If a popup window already exist it will be replaced, trigger a close event.
      let popupWindow = null

      popupWindow = window.open(
        url,
        'sharer',
        'status=' + (this.popup.status ? 'yes' : 'no') +
        ',height=' + this.popup.height +
        ',width=' + this.popup.width +
        ',resizable=' + (this.popup.resizable ? 'yes' : 'no') +
        ',left=' + this.popup.left +
        ',top=' + this.popup.top +
        ',screenX=' + this.popup.left +
        ',screenY=' + this.popup.top +
        ',toolbar=' + (this.popup.toolbar ? 'yes' : 'no') +
        ',menubar=' + (this.popup.menubar ? 'yes' : 'no') +
        ',scrollbars=' + (this.popup.scrollbars ? 'yes' : 'no') +
        ',location=' + (this.popup.location ? 'yes' : 'no') +
        ',directories=' + (this.popup.directories ? 'yes' : 'no')
      )

      popupWindow.focus()

      // Create an interval to detect popup closing event
      this.popup.interval = setInterval(() => {
        if (popupWindow && popupWindow.closed) {
          clearInterval(this.popup.interval)

          popupWindow = undefined

          this.$root.$emit('social_share_close', name, this.url)
        }
      }, 500)
    },
  },

  /**
   * Sets popup default dimensions.
   */
  mounted () {
    if (!inBrowser) return false

    /**
     * Center the popup on dual screens
     * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
     */
    const docElem = $window.document.documentElement
    const screen = $window.screen
    const dualScreenLeft = $window.screenLeft !== undefined
      ? $window.screenLeft
      : screen.left
    const dualScreenTop = $window.screenTop !== undefined
      ? $window.screenTop
      : screen.top
    const width = $window.innerWidth
      ? $window.innerWidth
      : (docElem.clientWidth ? docElem.clientWidth : screen.width)
    const height = $window.innerHeight
      ? $window.innerHeight
      : (docElem.clientHeight ? docElem.clientHeight : screen.height)

    this.popup.left = ((width / 2) - (this.popup.width / 2)) + dualScreenLeft
    this.popup.top = ((height / 2) - (this.popup.height / 2)) + dualScreenTop
  },
}
</script>
