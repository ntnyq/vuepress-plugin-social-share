import {
  computed,
  defineComponent,
  h,
  onMounted,
  reactive,
  ref,
} from 'vue'
import type { PropType, VNode } from 'vue'
import { usePageFrontmatter, withBase } from '@vuepress/client'
import type {
  MayBe,
  SocialShareNetwork as Network,
  QRCodeOptions,
  SocialShareNetworkData,
  SocialShareNetworkItem,
} from '../../shared/index.js'
import { getMetaContentByName, inBrowser, isExternalUrl } from '../utils.js'
import { SocialShareNetwork } from './SocialShareNetwork.js'

export const SocialShare = defineComponent({
  name: `SocialShare`,

  inheritAttrs: true,

  props: {
    networks: {
      type: Array,
      default: () => [`twitter`, `facebook`, `reddit`],
    },

    isPlain: {
      type: Boolean,
      default: false,
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

    qrcodeOptions: {
      type: Object as PropType<QRCodeOptions>,
      default: () => ({}),
    },

    networksData: {
      type: Object as PropType<SocialShareNetworkData>,
      default: () => ({}),
    },
  },

  // eslint-disable-next-line max-lines-per-function
  setup (props) {
    const networks = [...new Set(props.networks)]
    const networkList = Object.keys(props.networksData)
      .map(name => ({ name, ...props.networksData[name] }))
      .filter(network => networks.includes(network.name))
      .sort((prev, next) => networks.indexOf(prev.name) - networks.indexOf(next.name))
    const frontmatter = usePageFrontmatter()
    const timer = ref<MayBe<number>>(null)
    const popup = reactive({
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
    })

    onMounted(() => {
      if (!inBrowser) return false
      /**
       * Center the popup on dual screens
       * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
       */
      const rootEl = document.documentElement
      const dualScreenLeft
        = window.screenLeft !== undefined ? window.screenLeft : window.screenX
      const dualScreenTop
        = window.screenTop !== undefined ? window.screenTop : window.screenY
      const width = window.innerWidth
        ? window.innerWidth
        : rootEl.clientWidth
          ? rootEl.clientWidth
          : screen.width
      const height = window.innerHeight
        ? window.innerHeight
        : rootEl.clientHeight
          ? rootEl.clientHeight
          : screen.height
      popup.left = width / 2 - popup.width / 2 + dualScreenLeft
      popup.top = height / 2 - popup.height / 2 + dualScreenTop
    })

    // Computed
    const visible = computed(
      () => networks.length && !frontmatter.value.noSocialShare,
    )
    const url = computed(
      () =>
        (frontmatter.value.$shareUrl
          ?? frontmatter.value.shareUrl
          ?? frontmatter.value.permalink
          ?? (inBrowser ? location.href : ``)) as string,
    )
    const title = computed(
      () =>
        (frontmatter.value.$shareTitle
          ?? frontmatter.value.shareTitle
          ?? frontmatter.value.title
          ?? (inBrowser ? document.title : ``)) as string,
    )
    const description = computed(
      () =>
        (frontmatter.value.$shareDescription
          ?? frontmatter.value.shareDescription
          ?? frontmatter.value.description
          ?? getMetaContentByName(`description`)) as string,
    )
    const media = computed(() => {
      const mediaURL = (frontmatter.value.$shareImage
        ?? frontmatter.value.shareImage
        ?? frontmatter.value.image
        ?? props.fallbackImage) as string

      if (!mediaURL) return ``
      if (isExternalUrl(mediaURL)) return mediaURL
      const realURL = inBrowser ? `${location.origin}${withBase(mediaURL)}` : ``
      return realURL
    })
    const quote = computed(
      () =>
        (frontmatter.value.$shareQuote
          ?? frontmatter.value.shareQuote
          ?? (props.autoQuote ? description.value : ``)) as string,
    )
    const hashtags = computed(() => {
      const tags
        = frontmatter.value.$shareTags
        ?? frontmatter.value.shareTags
        ?? frontmatter.value.tags
        ?? frontmatter.value.tag
        ?? props.tags
        ?? getMetaContentByName(`keywords`)
      if (Array.isArray(tags)) {
        return tags.join(`,`)
      }
      if (typeof tags === `string`) {
        return tags.replace(/\s/g, ``)
      }
      return ``
    })
    const qrcodeRenderOptions = computed<QRCodeOptions>(() => {
      const defaultOptions: QRCodeOptions = {
        errorCorrectionLevel: `H`,
        width: 250,
        scale: 1,
        margin: 1.5,
      }
      return {
        ...defaultOptions,
        ...props.qrcodeOptions,
      }
    })

    // Methods
    const openSharer = (shareURL: string) => {
      let popWindow: MayBe<Window> = null
      const shareParams: string[] = [
        `status=${popup.status ? `yes` : `no`}`,
        `height=${popup.height}`,
        `width=${popup.width}`,
        `resizable=${popup.resizable ? `yes` : `no`}`,
        `left=${popup.left}`,
        `top=${popup.top}`,
        `screenX=${popup.left}`,
        `screenY=${popup.top}`,
        `toolbar=${popup.toolbar ? `yes` : `no`}`,
        `menubar=${popup.menubar ? `yes` : `no`}`,
        `scrollbars=${popup.scrollbars ? `yes` : `no`}`,
        `location=${popup.location ? `yes` : `no`}`,
        `directories=${popup.directories ? `yes` : `no`}`,
      ]
      popWindow = window.open(shareURL, `sharer`, shareParams.join(`,`))
      popWindow?.focus?.()
      timer.value = window.setInterval(() => {
        if (popWindow?.closed) {
          window.clearInterval(timer.value!)
          popWindow = null
        }
      }, 500)
    }
    const showQRCode = async () => {
      const body = document.body
      const socialShareEl = document.querySelector(`#__VUEPRESS_SOCIAL_SHARE__`)
      const socialShareOverlay = document.createElement(`div`)
      socialShareOverlay.id = `__VUEPRESS_SOCIAL_SHARE__`
      socialShareOverlay.classList.add(`social-share-overlay`)
      if (socialShareEl && socialShareEl.parentNode) {
        socialShareEl.parentNode.removeChild(socialShareEl)
      }
      try {
        const QRCode = await import('qrcode')
        const dataURL = await QRCode.toDataURL(url.value, qrcodeRenderOptions.value)
        socialShareOverlay.innerHTML = `<img class="social-share-qrcode" src="${dataURL}" />`
        body.appendChild(socialShareOverlay)
        socialShareOverlay.classList.add(`show`)
        socialShareOverlay.addEventListener(`click`, evt => {
          socialShareOverlay.classList.remove(`show`)
          body.removeChild(socialShareOverlay)
          evt.stopPropagation()
        })
      } catch (err) {
        console.log(err)
      }
    }
    const openWindow = (shareURL: string) => {
      window.open(shareURL, `_blank`)
    }
    const generateHashTags = (hashtags: string, name: string) => {
      if ([`facebook`].includes(name) && hashtags.length) {
        return `%23${hashtags.split(`,`)[0]}`
      }
      return hashtags
    }
    const createShareURL = (name: string, network: Network) => {
      let { sharer = `` } = network
      if ([`twitter`].includes(name) && !hashtags.value.length) {
        sharer = sharer.replace(`&hashtags=@hashtags`, ``)
      }
      return sharer
        .replace(/@url/g, encodeURIComponent(url.value))
        .replace(/@title/g, encodeURIComponent(title.value))
        .replace(/@media/g, media.value)
        .replace(/@description/g, encodeURIComponent(description.value))
        .replace(/@quote/g, encodeURIComponent(quote.value))
        .replace(/@hashtags/g, generateHashTags(hashtags.value, name))
        .replace(/@twitteruser/g, props.twitterUser ? `&via=${props.twitterUser}` : ``)
    }
    const onShare = (name: string) => {
      const network = props.networksData[name]
      const shareURL = createShareURL(name, network)
      switch (network.type) {
        case `popup`:
          openSharer(shareURL)
          break
        case `qrcode`:
          showQRCode()
          break
        case `direct`:
          openWindow(shareURL)
          break
        default:
          break
      }
    }
    const renderNetworkList = (networks: SocialShareNetworkItem[]) => h(`ul`, {
      class: `social-share-list`,
      role: `listbox`,
    }, networks.map(network =>
      h(SocialShareNetwork, {
        network,
        isPlain: props.isPlain,
        shareURL: createShareURL(network.name, network),
        onShare: (name: string) => onShare(name),
      }),
    ))

    return () => {
      if (!visible.value) return null as unknown as VNode
      return h(`div`, { class: `social-share` }, [
        renderNetworkList(networkList),
      ])
    }
  },
})
