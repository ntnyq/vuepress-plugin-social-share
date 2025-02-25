import { useDarkMode } from '@vuepress/helper/client'
import { computed, defineComponent, h, onMounted, onUnmounted, ref } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import { isString } from '../../shared/index.js'
import { useSocialShareOptions } from '../helpers/index.js'
import { inBrowser, isSVG, SVG_ICON_CLOSE, SVG_ICON_SHARE } from '../utils.js'
import { SocialShare } from './SocialShare.js'
import type { SocialShareFrontmatter } from '../../shared/index.js'

export const GlobalSocialShare = defineComponent({
  name: 'GlobalSocialShare',

  inheritAttrs: true,

  setup() {
    const options = useSocialShareOptions()

    const isActive = ref(false)
    const globalRef = ref<HTMLElement>()
    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()

    const isDarkMode = computed(() => {
      // workaround for document is undefined
      if (!inBrowser) return false
      return useDarkMode().value
    })

    const visible = computed(
      () =>
        !options.noGlobalSocialShare
        && !frontmatter.value.noGlobalSocialShare
        && !frontmatter.value.noSocialShare,
    )
    const resolvedShareIcon = computed(() => {
      if (options.shareIcon) {
        if (isString(options.shareIcon)) {
          return isSVG(options.shareIcon) ? options.shareIcon : SVG_ICON_SHARE
        } else {
          return isDarkMode.value
            ? isSVG(options.shareIcon.dark)
              ? options.shareIcon.dark
              : SVG_ICON_SHARE
            : isSVG(options.shareIcon.light)
              ? options.shareIcon.light
              : SVG_ICON_SHARE
        }
      }
      return SVG_ICON_SHARE
    })
    const resolvedShareCloseIcon = computed(() => {
      if (options.shareCloseIcon) {
        if (isString(options.shareCloseIcon)) {
          return isSVG(options.shareCloseIcon)
            ? options.shareCloseIcon
            : SVG_ICON_CLOSE
        } else {
          return isDarkMode.value
            ? isSVG(options.shareCloseIcon.dark)
              ? options.shareCloseIcon.dark
              : SVG_ICON_CLOSE
            : isSVG(options.shareCloseIcon.light)
              ? options.shareCloseIcon.light
              : SVG_ICON_CLOSE
        }
      }
      return SVG_ICON_CLOSE
    })

    const onClick = (evt: MouseEvent) => {
      isActive.value = !isActive.value
      evt.stopPropagation()
    }
    const onClickOutside = (evt: MouseEvent) => {
      const target = evt.target as HTMLElement
      if (!globalRef.value) return
      if (globalRef.value.contains(target)) return
      isActive.value = false
    }

    onMounted(() => {
      document.addEventListener('click', onClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', onClickOutside)
    })

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
          'aria-label': 'Toggle global social share',
          onClick: (evt: MouseEvent) => onClick(evt),
        },
        [renderButtonIcon()],
      )
    const renderSocialShare = () => (isActive.value ? h(SocialShare) : null)

    return () =>
      visible.value
        ? h(
            'div',
            {
              class: [
                'social-share-global',
                options.hideWhenPrint && 'social-share-hide-when-print',
              ],
              ref: globalRef,
            },
            [renderSocialShare(), renderGlobalButton()],
          )
        : null
  },
})

export default GlobalSocialShare
