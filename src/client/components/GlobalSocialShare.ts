import { useDarkMode } from '@vuepress/helper/client'
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
} from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import type { SocialShareFrontmatter } from '../../shared'
import { useSocialShareOptions } from '../helpers'
import { useSocialShareLocale } from '../helpers/useLocale'
import { useResolvedSocialShareOptions } from '../helpers/useResolvedOptions'
import { resolveThemeIcon, SVG_ICON_CLOSE, SVG_ICON_SHARE } from '../utils'
import { SocialShare } from './SocialShare'

/**
 * Floating, responsive sharing toolbar with a localized expand/collapse trigger.
 * Visibility follows resolved networks and plugin or page disable flags.
 */
export const GlobalSocialShare = defineComponent({
  /**
   * Vue component name used for debugging and component identification.
   */
  name: 'GlobalSocialShare',

  /**
   * Forwards undeclared attributes to the toolbar root.
   *
   * @default true
   */
  inheritAttrs: true,

  /**
   * Owns toolbar expansion, theme-aware icons and the outside-click listener.
   *
   * @returns A render function for the toolbar, or null while sharing is disabled.
   */
  setup() {
    const options = useSocialShareOptions()
    const locale = useSocialShareLocale()
    const panelId = `social-share-${useId()}`

    const isDarkMode = useDarkMode()
    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()

    const resolvedOptions = useResolvedSocialShareOptions()
    const isActive = ref(false)
    const globalRef = shallowRef<HTMLElement>()

    const visible = computed(
      () =>
        resolvedOptions.value.networks.length > 0 &&
        !options.noGlobalSocialShare &&
        !frontmatter.value.noGlobalSocialShare &&
        !frontmatter.value.noSocialShare,
    )
    const resolvedShareIcon = computed(() =>
      resolveThemeIcon(options.shareIcon, isDarkMode.value, SVG_ICON_SHARE),
    )
    const resolvedShareCloseIcon = computed(() =>
      resolveThemeIcon(
        options.shareCloseIcon,
        isDarkMode.value,
        SVG_ICON_CLOSE,
      ),
    )

    const onClick = (evt: MouseEvent) => {
      isActive.value = !isActive.value
      evt.stopPropagation()
    }
    const onClickOutside = (evt: MouseEvent) => {
      const target = evt.target as HTMLElement
      if (!globalRef.value) {
        return
      }
      if (globalRef.value.contains(target)) {
        return
      }
      isActive.value = false
    }

    const renderButtonIcon = () =>
      h('span', {
        class: 'social-share-icon-svg',
        innerHTML: isActive.value
          ? resolvedShareCloseIcon.value
          : resolvedShareIcon.value,
      })
    const renderGlobalButton = () =>
      h(
        'button',
        {
          class: 'social-share-btn social-share-trigger',
          type: 'button',
          role: 'button',
          'aria-label': isActive.value
            ? locale.value.collapse
            : locale.value.expand,
          'aria-expanded': isActive.value,
          'aria-controls': panelId,
          onClick: (evt: MouseEvent) => onClick(evt),
        },
        [renderButtonIcon()],
      )
    const renderSocialShare = () =>
      isActive.value
        ? h(SocialShare, { id: panelId })
        : h('div', { id: panelId, hidden: true })

    onBeforeUnmount(() => {
      document.removeEventListener('click', onClickOutside)
    })
    onMounted(() => {
      document.addEventListener('click', onClickOutside)
    })

    return () =>
      visible.value
        ? h(
            'div',
            {
              'data-position': options.globalLayout?.position ?? 'right',
              'data-direction': options.globalLayout?.direction ?? 'vertical',
              'data-mobile-position':
                options.globalLayout?.mobile?.position ??
                options.globalLayout?.position ??
                'right',
              'data-mobile-direction':
                options.globalLayout?.mobile?.direction ??
                options.globalLayout?.direction ??
                'vertical',
              class: [
                'social-share-global',
                resolvedOptions.value.hideWhenPrint &&
                  'social-share-hide-when-print',
              ],
              ref: globalRef,
            },
            [renderSocialShare(), renderGlobalButton()],
          )
        : null
  },
})

export default GlobalSocialShare
