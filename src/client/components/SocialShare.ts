import { useDarkMode } from '@vuepress/helper/client'
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
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

export const SocialShare = defineComponent({
  inheritAttrs: true,

  name: 'SocialShare',

  props: {
    isPlain: {
      type: Boolean,
    },

    networks: {
      type: Array as PropType<string[]>,
    },

    tags: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  setup(props) {
    const options = useSocialShareOptions()
    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()
    const isDarkMode = useDarkMode()

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

    const intervalTimer = ref<ReturnType<typeof setInterval>>()
    const popup = reactive({
      directories: false,
      height: 436,
      left: 0,
      location: false,
      menubar: false,
      resizable: false,
      scrollbars: false,
      status: false,
      toolbar: false,
      top: 0,
      width: 626,
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
        return tags.replaceAll(/\s/g, '')
      }
      return ''
    })
    const qrcodeRenderOptions = computed<SocialShareQRCodeOptions>(() => {
      const defaultOptions: SocialShareQRCodeOptions = {
        errorCorrectionLevel: 'H',
        margin: 1.5,
        scale: 1,
        width: 250,
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

      intervalTimer.value = setInterval(() => {
        if (popWindow?.closed) {
          clearInterval(intervalTimer.value)
          intervalTimer.value = undefined
          popWindow = null
        }
      }, 500)
    }
    const showQRCode = async () => {
      const {body} = document
      const socialShareEl = document.querySelector('#__VUEPRESS_SOCIAL_SHARE__')
      const socialShareOverlay = document.createElement('div')

      socialShareOverlay.id = '__VUEPRESS_SOCIAL_SHARE__'
      socialShareOverlay.classList.add('social-share-overlay')

      if (socialShareEl && socialShareEl.parentNode) {
        socialShareEl.remove()
      }

      try {
        const QRCode = await import('qrcode')
        const dataURL = await QRCode.toDataURL(
          url.value,
          qrcodeRenderOptions.value,
        )

        socialShareOverlay.innerHTML = `<img class="social-share-qrcode" src="${dataURL}" />`
        body.append(socialShareOverlay)
        socialShareOverlay.classList.add('show')

        const handleClick = (evt: MouseEvent) => {
          socialShareOverlay.classList.remove('show')
          socialShareOverlay.removeEventListener('click', handleClick)
          socialShareOverlay.remove()
          evt.stopPropagation()
        }
        socialShareOverlay.addEventListener('click', handleClick)
      } catch (error) {
        console.error('Failed to generate QR code:', error)
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

      // Use a single replace with a mapping object for better performance
      const replacements: Record<string, string> = {
        '@description': encodeURIComponent(description.value),
        '@hashtags': generateHashTags(hashtags.value, name),
        '@media': media.value,
        '@quote': encodeURIComponent(quote.value),
        '@title': encodeURIComponent(title.value),
        '@twitteruser': options.twitterUser
          ? `&via=${options.twitterUser}`
          : '',
        '@url': encodeURIComponent(url.value),
      }

      return sharer.replaceAll(/@\w+/g, match => replacements[match] ?? match)
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
            isDark: isDarkMode.value,
            isPlain: props.isPlain || options.isPlain,
            network,
            onShare: (name: string) => onShare(name),
            shareURL: createShareURL(network.name, network),
          }),
        ),
      )

    onBeforeUnmount(() => {
      if (intervalTimer.value) {
        clearInterval(intervalTimer.value)
      }
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
