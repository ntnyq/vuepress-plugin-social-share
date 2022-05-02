import {
  h,
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineComponent,
  getCurrentInstance,
  type VNode,
} from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import { SocialShare } from './SocialShare'
import { SVG_ICON_CLOSE, SVG_ICON_SHARE } from '../utils'
// @ts-expect-error virtual module
import { socialShareOptions } from '@vuepress/plugin-social-share/temp'

export const GlobalSocialShare = defineComponent({
  name: `GlobalSocialShare`,

  setup() {
    const isActive = ref(false)
    const vm = getCurrentInstance() as any
    const frontmatter = usePageFrontmatter()
    const visible = computed(
      () =>
        !(
          frontmatter.value.noGlobalSocialShare ||
          frontmatter.value.noSocialShare
        ),
    )

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
      document.addEventListener(`click`, onClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener(`click`, onClickOutside)
    })

    const renderButtonIcon = () =>
      h(`span`, {
        class: `social-share-icon-svg`,
        innerHTML: isActive.value ? SVG_ICON_CLOSE : SVG_ICON_SHARE,
      })
    const renderGlobalButton = () =>
      h(
        `button`,
        {
          class: `social-share-btn social-share-trigger`,
          type: `button`,
          role: `button`,
          onClick: (evt: MouseEvent) => onClick(evt),
        },
        [renderButtonIcon()],
      )
    const renderSocialShare = () => {
      if (!isActive.value) return null as unknown as VNode
      return h(SocialShare, {
        networks: socialShareOptions.networks,
        isPlain: socialShareOptions.isPlain,
        twitterUser: socialShareOptions.twitterUser,
        fallbackImage: socialShareOptions.fallbackImage,
        autoQuote: socialShareOptions.autoQuote,
        qrcodeOptions: socialShareOptions.qrcodeOptions,
        networksData: socialShareOptions.networksData,
      })
    }

    return () => {
      if (!visible.value) return null as unknown as VNode
      return h(`div`, { class: `social-share-global` }, [
        renderSocialShare(),
        renderGlobalButton(),
      ])
    }
  },
})

export default GlobalSocialShare
