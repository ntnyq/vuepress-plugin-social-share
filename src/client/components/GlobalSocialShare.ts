import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import { socialShareOptions } from '@vuepress/plugin-social-share/options'
import { SVG_ICON_CLOSE, SVG_ICON_SHARE } from '../utils.js'
import type { SocialShareFrontmatter } from '../../shared/index.js'
import { SocialShare } from './SocialShare.js'

export const GlobalSocialShare = defineComponent({
  name: 'GlobalSocialShare',

  inheritAttrs: true,

  setup() {
    const options = socialShareOptions
    const isActive = ref(false)
    const vm = getCurrentInstance() as any
    const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()
    const visible = computed(() => !(
      options.noGlobalSocialShare
          || frontmatter.value.noGlobalSocialShare
          || frontmatter.value.noSocialShare
    ))

    const onClick = (evt: MouseEvent) => {
      isActive.value = !isActive.value
      evt.stopPropagation()
    }
    const onClickOutside = (evt: MouseEvent) => {
      const { target } = evt
      const { proxy } = vm
      if (!proxy.$el.contains) return
      if (proxy.$el.contains(target as Node)) return
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
        innerHTML: isActive.value ? SVG_ICON_CLOSE : SVG_ICON_SHARE,
      })
    const renderGlobalButton = () => h('button', {
      class: 'social-share-btn social-share-trigger',
      type: 'button',
      role: 'button',
      onClick: (evt: MouseEvent) => onClick(evt),
    }, [renderButtonIcon()])
    const renderSocialShare = () =>
      isActive.value
        ? h(SocialShare, {
          networks: options.networks,
          isPlain: options.isPlain,
          twitterUser: options.twitterUser,
          fallbackImage: options.fallbackImage,
          autoQuote: options.autoQuote,
          qrcodeOptions: options.qrcodeOptions,
          networksData: options.networksData,
        })
        : null

    return () => {
      return visible.value
        ? h('div', { class: 'social-share-global' }, [
          renderSocialShare(),
          renderGlobalButton(),
        ])
        : null
    }
  },
})

export default GlobalSocialShare
