import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
  watch,
} from 'vue'
import { usePageFrontmatter, useRoute } from 'vuepress/client'
import type { SocialShareFrontmatter } from '../../shared'
import { useSocialShareOptions } from '../helpers'
import { useSocialShareLocale } from '../helpers/useLocale'
import { useResolvedSocialShareOptions } from '../helpers/useResolvedOptions'
import { useShareDarkMode } from '../helpers/useShareDarkMode'
import {
  resolveThemeIcon,
  SVG_ICON_CLOSE,
  SVG_ICON_CLOSE_PANEL,
  SVG_ICON_SHARE,
  SVG_ICON_SHARE_PANEL,
} from '../utils'
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

    const isDarkMode = useShareDarkMode()
    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()
    const route = useRoute()

    const resolvedOptions = useResolvedSocialShareOptions()
    const isActive = ref(false)
    const globalRef = shallowRef<HTMLElement>()
    const triggerRef = shallowRef<HTMLButtonElement>()
    const closeRef = shallowRef<HTMLButtonElement>()
    const globalLayout = computed(() => ({
      ...options.globalLayout,
      ...frontmatter.value.socialShare?.globalLayout,
      mobile: {
        ...options.globalLayout?.mobile,
        ...frontmatter.value.socialShare?.globalLayout?.mobile,
      },
    }))
    const isPanel = computed(() => globalLayout.value.variant === 'panel')

    const visible = computed(
      () =>
        resolvedOptions.value.networks.length > 0 &&
        !options.noGlobalSocialShare &&
        !frontmatter.value.noGlobalSocialShare &&
        !frontmatter.value.noSocialShare,
    )
    const resolvedShareIcon = computed(() =>
      resolveThemeIcon(
        options.shareIcon,
        isDarkMode.value,
        isPanel.value ? SVG_ICON_SHARE_PANEL : SVG_ICON_SHARE,
      ),
    )
    const resolvedShareCloseIcon = computed(() =>
      resolveThemeIcon(
        options.shareCloseIcon,
        isDarkMode.value,
        isPanel.value ? SVG_ICON_CLOSE_PANEL : SVG_ICON_CLOSE,
      ),
    )

    const closePanel = (restoreFocus = false) => {
      isActive.value = false
      if (restoreFocus) {
        triggerRef.value?.focus()
      }
    }
    const onClick = async (evt: MouseEvent) => {
      isActive.value = !isActive.value
      evt.stopPropagation()
      if (isPanel.value && isActive.value) {
        await nextTick()
        closeRef.value?.focus()
      }
    }
    const onClickOutside = (evt: MouseEvent) => {
      const target = evt.target
      if (!globalRef.value) {
        return
      }
      if (target instanceof Node && globalRef.value.contains(target)) {
        return
      }
      closePanel()
    }
    const onKeydown = (evt: KeyboardEvent) => {
      // The modal QR dialog owns Escape until it has been dismissed.
      if (
        evt.key === 'Escape' &&
        isActive.value &&
        !document.querySelector('.social-share-overlay[open]')
      ) {
        evt.preventDefault()
        closePanel(true)
      }
    }

    watch([frontmatter, () => route.fullPath, visible], () => closePanel())

    const renderButtonIcon = () =>
      h('span', {
        class: 'social-share-icon-svg',
        'aria-hidden': 'true',
        innerHTML:
          isActive.value && !isPanel.value
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
          'aria-haspopup': isPanel.value ? 'dialog' : undefined,
          ref: triggerRef,
          onClick: (evt: MouseEvent) => onClick(evt),
        },
        [renderButtonIcon()],
      )
    const renderPanelClose = () =>
      h(
        'button',
        {
          type: 'button',
          class: 'social-share-panel-close',
          'aria-label': locale.value.panelClose,
          ref: closeRef,
          onClick: () => closePanel(true),
        },
        h('span', {
          class: 'social-share-icon-svg',
          'aria-hidden': 'true',
          innerHTML: resolvedShareCloseIcon.value,
        }),
      )
    const renderSocialShare = () => {
      if (!isActive.value) {
        return h('div', { id: panelId, hidden: true })
      }
      if (!isPanel.value) {
        return h(SocialShare, { id: panelId })
      }
      return h(
        'section',
        {
          id: panelId,
          class: 'social-share-panel',
          role: 'dialog',
          'aria-labelledby': `${panelId}-title`,
        },
        [
          h('div', { class: 'social-share-panel-header' }, [
            h(
              'span',
              {
                id: `${panelId}-title`,
                class: 'social-share-panel-title',
              },
              locale.value.panelTitle,
            ),
            renderPanelClose(),
          ]),
          h(SocialShare, { variant: 'panel' }),
        ],
      )
    }

    onBeforeUnmount(() => {
      document.removeEventListener('click', onClickOutside)
      document.removeEventListener('keydown', onKeydown)
    })
    onMounted(() => {
      document.addEventListener('click', onClickOutside)
      document.addEventListener('keydown', onKeydown)
    })

    return () =>
      visible.value
        ? h(
            'div',
            {
              'data-position': globalLayout.value.position ?? 'right',
              'data-variant': isPanel.value ? 'panel' : 'toolbar',
              'data-expanded': isActive.value,
              'data-direction': globalLayout.value.direction ?? 'vertical',
              'data-mobile-position':
                globalLayout.value.mobile.position ??
                globalLayout.value.position ??
                'right',
              'data-mobile-direction':
                globalLayout.value.mobile.direction ??
                globalLayout.value.direction ??
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
