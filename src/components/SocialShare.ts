import Vue, { ComponentOptions, VNode } from 'vue'
import { SocialShareNetworkData } from '../types'
import { inBrowser, isExternalUrl, getMetaContentByName } from '../utils'

interface SocialShareComponent extends Vue {
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

const SocialShare: ComponentOptions<Vue> = {
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

  render(this: SocialShareComponent, h) {
    return h(`div`, { attrs: { class: 'social-share' } }, [])
  },
}

export default SocialShare
