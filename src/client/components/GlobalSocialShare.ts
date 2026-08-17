import { useDarkMode } from '@vuepress/helper/client'
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
} from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import type { SocialShareFrontmatter } from '../../shared'
import { useSocialShareOptions } from '../helpers'
import { resolveThemeIcon, SVG_ICON_CLOSE, SVG_ICON_SHARE } from '../utils'
import { SocialShare } from './SocialShare'

export const GlobalSocialShare = defineComponent({
  name: 'GlobalSocialShare',

  inheritAttrs: true,

  setup() {
    const options = useSocialShareOptions(),

     isActive = ref(false),
     globalRef = shallowRef<HTMLElement>(),
     frontmatter = usePageFrontmatter<SocialShareFrontmatter>(),

     isDarkMode = useDarkMode(),

     visible = computed(
      () =>
        !options.noGlobalSocialShare &&
        !frontmatter.value.noGlobalSocialShare &&
        !frontmatter.value.noSocialShare,
    ),
     resolvedShareIcon = computed(() =>
      resolveThemeIcon(options.shareIcon, isDarkMode.value, SVG_ICON_SHARE),
    ),
     resolvedShareCloseIcon = computed(() =>
      resolveThemeIcon(
        options.shareCloseIcon,
        isDarkMode.value,
        SVG_ICON_CLOSE,
      ),
    ),

     onClick = (evt: MouseEvent) => {
      isActive.value = !isActive.value
      evt.stopPropagation()
    },
     onClickOutside = (evt: MouseEvent) => {
      const target = evt.target as HTMLElement
      if (!globalRef.value) {
        return
      }
      if (globalRef.value.contains(target)) {
        return
      }
      isActive.value = false
    }

    onBeforeUnmount(() => {
      document.removeEventListener('click', onClickOutside)
    })
    onMounted(() => {
      document.addEventListener('click', onClickOutside)
    })

    const renderButtonIcon = () =>
      h('span', {
        class: 'social-share-icon-svg',
        innerHTML: isActive.value
          ? resolvedShareCloseIcon.value
          : resolvedShareIcon.value,
      }),
     renderGlobalButton = () =>
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
      ),
     renderSocialShare = () => (isActive.value ? h(SocialShare) : null)

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
