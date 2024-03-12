import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { usePageFrontmatter, withBase } from 'vuepress/client'
import { getMetaContentByName, inBrowser, isExternalUrl } from '../utils.js'
import { useSocialShareOptions } from '../helpers/index.js'
import { SocialShareNetwork } from './SocialShareNetwork.js'
import type {
  SocialShareNetwork as Network,
  SocialShareFrontmatter,
  SocialShareNetworkItem,
  SocialShareQRCodeOptions,
} from '../../shared/index.js'
import type { PropType } from 'vue'

export const SocialShare = defineComponent({
  name: 'SocialShare',

  inheritAttrs: true,

  props: {
    networks: {
      type: Array as PropType<string[]>,
    },

    isPlain: {
      type: Boolean,
    },

    tags: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  // eslint-disable-next-line max-lines-per-function
  setup(props) {
    const options = useSocialShareOptions()

    const networks = computed(() => [
      ...new Set(props.networks ?? options.networks ?? ['twitter', 'facebook', 'reddit']),
    ])
    const networkList = computed(() =>
      Object.keys(options.networksData)
        .map(name => ({ name, ...options.networksData[name] }))
        .filter(network => networks.value.includes(network.name))
        .sort(
          (prev, next) => networks.value.indexOf(prev.name) - networks.value.indexOf(next.name),
        ),
    )

    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()
    const timer = ref<number | undefined>()
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
      /**
       * Center the popup on dual screens
       * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
       */
      const rootEl = document.documentElement
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY
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
    const visible = computed(() => networks.value.length > 0 && !frontmatter.value.noSocialShare)
    const url = computed(
      () =>
        frontmatter.value.$shareUrl ??
        frontmatter.value.shareUrl ??
        frontmatter.value.permalink ??
        (inBrowser ? location.href : ''),
    )
    const title = computed(
      () =>
        frontmatter.value.$shareTitle ??
        frontmatter.value.shareTitle ??
        frontmatter.value.title ??
        (inBrowser ? document.title : ''),
    )
    const description = computed(
      () =>
        frontmatter.value.$shareDescription ??
        frontmatter.value.shareDescription ??
        frontmatter.value.description ??
        getMetaContentByName('description'),
    )
    const media = computed(() => {
      const mediaURL =
        frontmatter.value.$shareImage ??
        frontmatter.value.shareImage ??
        frontmatter.value.image ??
        options.fallbackImage

      if (!mediaURL) return ''
      if (isExternalUrl(mediaURL)) return mediaURL
      const realURL = inBrowser ? `${location.origin}${withBase(mediaURL)}` : ''
      return realURL
    })
    const quote = computed(
      () =>
        frontmatter.value.$shareQuote ??
        frontmatter.value.shareQuote ??
        (options.autoQuote ?? true ? description.value : ''),
    )
    const hashtags = computed(() => {
      const tags =
        frontmatter.value.$shareTags ??
        frontmatter.value.shareTags ??
        frontmatter.value.tags ??
        frontmatter.value.tag ??
        props.tags ??
        getMetaContentByName('keywords')
      if (Array.isArray(tags)) {
        return tags.join(',')
      }
      if (typeof tags === 'string') {
        return tags.replace(/\s/g, '')
      }
      return ''
    })
    const qrcodeRenderOptions = computed<SocialShareQRCodeOptions>(() => {
      const defaultOptions: SocialShareQRCodeOptions = {
        errorCorrectionLevel: 'H',
        width: 250,
        scale: 1,
        margin: 1.5,
      }
      return {
        ...defaultOptions,
        ...options.qrcodeOptions,
      }
    })

    // Methods
    const openSharer = (shareURL: string) => {
      let popWindow: Window | null = null
      const shareParams: string[] = [
        `status=${popup.status ? 'yes' : 'no'}`,
        `height=${popup.height}`,
        `width=${popup.width}`,
        `resizable=${popup.resizable ? 'yes' : 'no'}`,
        `left=${popup.left}`,
        `top=${popup.top}`,
        `screenX=${popup.left}`,
        `screenY=${popup.top}`,
        `toolbar=${popup.toolbar ? 'yes' : 'no'}`,
        `menubar=${popup.menubar ? 'yes' : 'no'}`,
        `scrollbars=${popup.scrollbars ? 'yes' : 'no'}`,
        `location=${popup.location ? 'yes' : 'no'}`,
        `directories=${popup.directories ? 'yes' : 'no'}`,
      ]
      popWindow = window.open(shareURL, 'sharer', shareParams.join(','))
      popWindow?.focus?.()
      timer.value = window.setInterval(() => {
        if (popWindow?.closed) {
          window.clearInterval(timer.value)
          popWindow = null
        }
      }, 500)
    }
    const showQRCode = async () => {
      const body = document.body
      const socialShareEl = document.querySelector('#__VUEPRESS_SOCIAL_SHARE__')
      const socialShareOverlay = document.createElement('div')
      socialShareOverlay.id = '__VUEPRESS_SOCIAL_SHARE__'
      socialShareOverlay.classList.add('social-share-overlay')
      if (socialShareEl && socialShareEl.parentNode) {
        socialShareEl.remove()
      }
      try {
        const QRCode = await import('qrcode')
        const dataURL = await QRCode.toDataURL(url.value, qrcodeRenderOptions.value)
        socialShareOverlay.innerHTML = `<img class="social-share-qrcode" src="${dataURL}" />`
        body.append(socialShareOverlay)
        socialShareOverlay.classList.add('show')
        socialShareOverlay.addEventListener('click', evt => {
          socialShareOverlay.classList.remove('show')
          socialShareOverlay.remove()
          evt.stopPropagation()
        })
      } catch (err) {
        console.log(err)
      }
    }
    const openWindow = (shareURL: string) => {
      window.open(shareURL, '_blank')
    }
    const generateHashTags = (hashtags: string, name: string) => {
      if (['facebook'].includes(name) && hashtags.length > 0) {
        return `%23${hashtags.split(',')[0]}`
      }
      return hashtags
    }
    const createShareURL = (name: string, network: Network) => {
      let { sharer = '' } = network
      if (['twitter'].includes(name) && hashtags.value.length === 0) {
        sharer = sharer.replace('&hashtags=@hashtags', '')
      }
      return sharer
        .replace(/@url/g, encodeURIComponent(url.value))
        .replace(/@title/g, encodeURIComponent(title.value))
        .replace(/@media/g, media.value)
        .replace(/@description/g, encodeURIComponent(description.value))
        .replace(/@quote/g, encodeURIComponent(quote.value))
        .replace(/@hashtags/g, generateHashTags(hashtags.value, name))
        .replace(/@twitteruser/g, options.twitterUser ? `&via=${options.twitterUser}` : '')
    }
    const onShare = (name: string) => {
      const network = options.networksData[name]
      const shareURL = createShareURL(name, network)
      switch (network.type) {
        case 'popup':
          openSharer(shareURL)
          break
        case 'qrcode':
          showQRCode()
          break
        case 'direct':
          openWindow(shareURL)
          break
        default:
          break
      }
    }
    const renderNetworkList = (networks: SocialShareNetworkItem[]) =>
      h(
        'ul',
        {
          class: 'social-share-list',
          role: 'listbox',
        },
        networks.map(network =>
          h(SocialShareNetwork, {
            network,
            isPlain: props.isPlain || options.isPlain,
            shareURL: createShareURL(network.name, network),
            onShare: (name: string) => onShare(name),
          }),
        ),
      )

    return () =>
      visible.value
        ? h(
            'div',
            { class: ['social-share', options.hideWhenPrint && 'social-share-hide-when-print'] },
            [renderNetworkList(networkList.value)],
          )
        : null
  },
})
