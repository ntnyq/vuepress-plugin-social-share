import { useDarkMode } from '@vuepress/helper/client'
import { computed, defineComponent, h, watch } from 'vue'
import type { PropType } from 'vue'
import { usePageFrontmatter, useRoute, withBase } from 'vuepress/client'
import { isString, upperFirst } from '../../shared'
import type {
  SocialShareEvent,
  SocialShareMeta,
  SocialShareDirection,
  SocialShareFrontmatter,
  SocialShareNetworkWithName,
  SocialShareQRCodeOptions,
} from '../../shared'
import {
  useSocialShareOptions,
  useShareEvent,
  useResolvedSocialShareOptions,
} from '../helpers'
import { createShareURL } from '../helpers/shareURL'
import { useSocialShareActions } from '../helpers/useActions'
import { useSocialShareLocale } from '../helpers/useLocale'
import { getMetaContentByName, inBrowser, isExternalUrl } from '../utils'
import { SocialShareNetwork } from './SocialShareNetwork'

/**
 * Inline social sharing list with reactive page metadata, action feedback and manual copy fallback.
 */
export const SocialShare = defineComponent({
  /**
   * Vue component name used for debugging and component identification.
   */
  name: 'SocialShare',

  /**
   * Forwards undeclared attributes to the sharing list root.
   *
   * @default true
   */
  inheritAttrs: true,

  /**
   * Component overrides and metadata inputs for the sharing list.
   */
  props: {
    /**
     * Button list orientation, independent of the floating toolbar layout.
     *
     * @default 'horizontal'
     */
    direction: {
      type: String as PropType<SocialShareDirection>,
      default: 'horizontal',
    },

    /**
     * Ordered network names; inherits page or plugin networks when omitted.
     *
     * @default undefined
     */
    networks: {
      type: Array as PropType<string[]>,
      default: undefined,
    },

    /**
     * Disables brand colors; inherits page or plugin settings when omitted.
     *
     * @default undefined
     */
    isPlain: {
      type: Boolean,
      default: undefined,
    },

    /**
     * Hides this component in print; inherits page or plugin settings when omitted.
     *
     * @default undefined
     */
    hideWhenPrint: {
      type: Boolean,
      default: undefined,
    },

    /**
     * Share tags used after page tags and before document meta keywords.
     *
     * @default undefined
     */
    tags: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
  },

  /**
   * Component events reporting browser share outcomes.
   */
  emits: {
    /**
     * Accepts a share outcome for component listeners.
     *
     * @param _event - Outcome and readonly snapshots associated with one share action.
     * @returns true because all SocialShareEvent payloads are accepted.
     */
    'share-event': (_event: SocialShareEvent) => true,
  },

  /**
   * Resolves page metadata, coordinates sharing actions and renders available networks.
   *
   * @param props - Network, appearance and metadata overrides for this instance.
   * @param context - Vue setup context.
   * @param context.emit - Dispatcher for the share-event component event.
   * @returns A render function for the list and feedback, or null when hidden.
   */
  setup(props, { emit }) {
    const emitShareEvent = useShareEvent(event => emit('share-event', event))
    const options = useSocialShareOptions()
    const locale = useSocialShareLocale()

    const isDarkMode = useDarkMode()
    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()
    const route = useRoute()

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

    const resolvedOptions = useResolvedSocialShareOptions(props)
    const networkList = computed(() => resolvedOptions.value.networks)

    // Computed
    const visible = computed(
      () => networkList.value.length > 0 && !frontmatter.value.noSocialShare,
    )
    const url = () =>
      getFrontmatterValue(['$shareUrl', 'shareUrl']) ??
      (inBrowser ? location.href : '')
    const title = () =>
      getFrontmatterValue(['$shareTitle', 'shareTitle', 'title']) ??
      (inBrowser ? document.title : '')
    const description = () =>
      getFrontmatterValue([
        '$shareDescription',
        'shareDescription',
        'description',
      ]) ?? getMetaContentByName('description')
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
    const hashtags = () => {
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
    }
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

    // Read browser fallbacks at dispatch time, including same-page navigation.
    const meta = (): SocialShareMeta => {
      const shareDescription = description()
      return {
        url: url(),
        title: title(),
        description: shareDescription,
        media: media.value,
        quote:
          getFrontmatterValue(['$shareQuote', 'shareQuote']) ??
          ((options.autoQuote ?? true) ? shareDescription : ''),
        hashtags: hashtags(),
      }
    }
    const actions = useSocialShareActions(
      meta,
      { qrcode: qrcodeRenderOptions, locale },
      emitShareEvent,
    )
    watch([frontmatter, () => route.fullPath], () => actions.reset())
    const shareURL = (network: SocialShareNetworkWithName) =>
      createShareURL(network, meta(), options.twitterUser)
    const renderNetworkList = (networks: SocialShareNetworkWithName[]) =>
      h(
        'ul',
        {
          class: 'social-share-list',
        },
        networks.map(network =>
          h(SocialShareNetwork, {
            network,
            disabled: actions.pending.value,
            label:
              locale.value.networkLabels[network.name] ??
              upperFirst(network.name),
            shareLabel: locale.value.shareWith.replaceAll(
              '{network}',
              locale.value.networkLabels[network.name] ??
                upperFirst(network.name),
            ),
            isDark: isDarkMode.value,
            isPlain: resolvedOptions.value.isPlain,
            shareURL: shareURL(network),
            onShare: () => actions.share(network),
          }),
        ),
      )

    return () =>
      visible.value
        ? h(
            'div',
            {
              'data-direction': props.direction,
              class: [
                'social-share',
                resolvedOptions.value.hideWhenPrint &&
                  'social-share-hide-when-print',
              ],
            },
            [
              renderNetworkList(networkList.value),
              h(
                'div',
                {
                  role: 'status',
                  class: 'social-share-status',
                  'aria-live': 'polite',
                },
                actions.feedback.value,
              ),
              actions.manualCopyText.value
                ? h('textarea', {
                    class: 'social-share-manual-copy',
                    readonly: true,
                    'aria-label': locale.value.copyFailed,
                    value: actions.manualCopyText.value,
                    onFocus: (event: FocusEvent) =>
                      (event.target as HTMLTextAreaElement).select(),
                  })
                : null,
            ],
          )
        : null
  },
})
