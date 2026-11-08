import { useDarkMode } from '@vuepress/helper/client'
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  reactive,
} from 'vue'
import type { PropType } from 'vue'
import { usePageFrontmatter, withBase } from 'vuepress/client'
import { isString } from '../../shared'
import type {
  SocialShareNetwork as Network,
  SocialShareFrontmatter,
  SocialShareNetworkWithName,
  SocialShareQRCodeOptions,
} from '../../shared'
import { useSocialShareOptions } from '../helpers'
import { getMetaContentByName, inBrowser, isExternalUrl } from '../utils'
import { SocialShareNetwork } from './SocialShareNetwork'

function openWindow(shareURL: string) {
  window.open(shareURL, '_blank')
}
function generateHashTags(hashtags: string, name: string) {
  if (['facebook'].includes(name) && hashtags.length > 0) {
    return `#${hashtags.split(',')[0]}`
  }
  return hashtags
}

export const SocialShare = defineComponent({
  name: 'SocialShare',

  inheritAttrs: true,

  props: {
    networks: {
      type: Array as PropType<string[]>,
      default: undefined,
    },

    isPlain: {
      type: Boolean,
      default: undefined,
    },

    tags: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
  },

  setup(props) {
    const options = useSocialShareOptions()

    const isDarkMode = useDarkMode()
    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()

    // Helper function to get frontmatter value with fallback chain
    const getFrontmatterValue = <T = string>(
      keys: (keyof SocialShareFrontmatter)[],
      fallback?: T,
    ): T | undefined => {
      for (const key of keys) {
        const value = frontmatter.value[key]
        if (value !== undefined && value !== null) {
          return value as T
        }
      }
      return fallback
    }

    const networks = computed(() => [
      ...new Set(
        props.networks ??
          options.networksData
            .filter(item => item.default)
            .map(item => item.name),
      ),
    ])
    // Use Map for better performance when filtering and sorting networks
    const networkMap = computed(() => {
      const map = new Map<string, SocialShareNetworkWithName>()
      options.networksData.forEach(network => {
        map.set(network.name, network)
      })
      return map
    })
    const networkList = computed(() => {
      const result: SocialShareNetworkWithName[] = []
      for (const name of networks.value) {
        const network = networkMap.value.get(name)
        if (network) {
          result.push(network)
        }
      }
      return result
    })

    let qrcodeRequestId = 0
    let qrcodeOverlay: HTMLDivElement | null = null
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

    // Computed
    const visible = computed(
      () => networks.value.length > 0 && !frontmatter.value.noSocialShare,
    )
    const url = computed(
      () =>
        getFrontmatterValue(['$shareUrl', 'shareUrl', 'permalink']) ??
        (inBrowser ? location.href : ''),
    )
    const title = computed(
      () =>
        getFrontmatterValue(['$shareTitle', 'shareTitle', 'title']) ??
        (inBrowser ? document.title : ''),
    )
    const description = computed(
      () =>
        getFrontmatterValue([
          '$shareDescription',
          'shareDescription',
          'description',
        ]) ?? getMetaContentByName('description'),
    )
    const media = computed(() => {
      const mediaURL =
        getFrontmatterValue(['$shareImage', 'shareImage', 'image']) ??
        options.fallbackImage

      if (!mediaURL) {
        return ''
      }
      if (isExternalUrl(mediaURL)) {
        return mediaURL
      }
      const realURL = inBrowser ? `${location.origin}${withBase(mediaURL)}` : ''
      return realURL
    })
    const quote = computed(
      () =>
        getFrontmatterValue(['$shareQuote', 'shareQuote']) ??
        ((options.autoQuote ?? true) ? description.value : ''),
    )
    const hashtags = computed(() => {
      const tags =
        getFrontmatterValue(['$shareTags', 'shareTags', 'tags', 'tag']) ??
        props.tags ??
        getMetaContentByName('keywords')
      if (Array.isArray(tags)) {
        return tags.join(',')
      }
      if (isString(tags)) {
        return tags.replaceAll(/\s/gu, '')
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
      const popWindow = window.open(shareURL, 'sharer', shareParams.join(','))
      popWindow?.focus?.()
    }
    const removeQRCode = () => {
      qrcodeOverlay?.remove()
      qrcodeOverlay = null
    }
    const showQRCode = async () => {
      const requestId = ++qrcodeRequestId
      const shareURL = url.value
      const renderOptions = qrcodeRenderOptions.value
      try {
        const QRCode = await import('qrcode')
        if (requestId !== qrcodeRequestId) {
          return
        }
        const dataURL = await QRCode.toDataURL(shareURL, renderOptions)
        if (requestId !== qrcodeRequestId) {
          return
        }

        removeQRCode()
        document.querySelector('#__VUEPRESS_SOCIAL_SHARE__')?.remove()

        const overlay = document.createElement('div')
        const image = document.createElement('img')

        overlay.id = '__VUEPRESS_SOCIAL_SHARE__'
        overlay.classList.add('social-share-overlay', 'show')
        image.classList.add('social-share-qrcode')
        image.src = dataURL
        overlay.append(image)

        overlay.addEventListener(
          'click',
          (evt: MouseEvent) => {
            removeQRCode()
            evt.stopPropagation()
          },
          { once: true },
        )
        qrcodeOverlay = overlay
        document.body.append(overlay)
      } catch (error) {
        if (requestId === qrcodeRequestId) {
          console.error('Failed to generate QR code:', error)
        }
      }
    }
    const createShareURL = (name: string, network: Network) => {
      let { sharer = '' } = network
      if (['twitter'].includes(name) && hashtags.value.length === 0) {
        sharer = sharer.replace('&hashtags=@hashtags', '')
      }

      // Use a single replace with a mapping object for better performance
      const replacements: Record<string, string> = {
        '@url': encodeURIComponent(url.value),
        '@title': encodeURIComponent(title.value),
        '@media': encodeURIComponent(media.value),
        '@description': encodeURIComponent(description.value),
        '@quote': encodeURIComponent(quote.value),
        '@hashtags': encodeURIComponent(generateHashTags(hashtags.value, name)),
        '@twitteruser': options.twitterUser
          ? `&via=${encodeURIComponent(options.twitterUser)}`
          : '',
      }

      return sharer.replaceAll(/@\w+/gu, match => replacements[match] ?? match)
    }
    const onShare = (name: string) => {
      const network = options.networksData.find(item => item.name === name)!
      const shareURL = createShareURL(name, network)

      switch (network.type) {
        case 'popup': {
          return openSharer(shareURL)
        }
        case 'qrcode': {
          return showQRCode()
        }
        case 'direct': {
          return openWindow(shareURL)
        }
        default: {
          return openSharer(shareURL)
        }
      }
    }
    const renderNetworkList = (networks: SocialShareNetworkWithName[]) =>
      h(
        'ul',
        {
          class: 'social-share-list',
          role: 'listbox',
        },
        networks.map(network =>
          h(SocialShareNetwork, {
            network,
            isDark: isDarkMode.value,
            isPlain: props.isPlain ?? options.isPlain,
            shareURL: createShareURL(network.name, network),
            onShare: (name: string) => onShare(name),
          }),
        ),
      )

    onBeforeUnmount(() => {
      qrcodeRequestId++
      removeQRCode()
    })

    onMounted(() => {
      /**
       * Center the popup on dual screens
       * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
       */
      const rootEl = document.documentElement
      const dualScreenLeft = window.screenLeft ?? window.screenX
      const dualScreenTop = window.screenTop ?? window.screenY
      const width = window.innerWidth ?? rootEl.clientWidth ?? screen.width
      const height = window.innerHeight ?? rootEl.clientHeight ?? screen.height
      popup.left = width / 2 - popup.width / 2 + dualScreenLeft
      popup.top = height / 2 - popup.height / 2 + dualScreenTop
    })

    return () =>
      visible.value
        ? h(
            'div',
            {
              class: [
                'social-share',
                options.hideWhenPrint && 'social-share-hide-when-print',
              ],
            },
            [renderNetworkList(networkList.value)],
          )
        : null
  },
})
