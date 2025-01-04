import { SVG_ICON_CLOSE, SVG_ICON_SHARE } from '../constants'
import SocialShare from './SocialShare'
import type { ComponentOptions, VNode } from 'vue'
import type Vue from 'vue'

interface GlobalSocialShareComponent extends Vue {
  isActive: boolean
  visible: boolean
  handleClick: (evt: MouseEvent) => void
  toggle: () => void
}

const GlobalSocialShare: ComponentOptions<GlobalSocialShareComponent> = {
  name: 'GlobalSocialShare',

  inheritAttrs: false,

  computed: {
    visible(this: GlobalSocialShareComponent) {
      return !(this.$frontmatter.noGlobalSocialShare || this.$frontmatter.noSocialShare)
    },
  },

  data(this: GlobalSocialShareComponent) {
    return {
      isActive: false,
    }
  },

  methods: {
    handleClick(this: GlobalSocialShareComponent, evt: MouseEvent): void {
      const { target } = evt
      if (!this.$el.contains) return
      if (this.$el.contains(target as Node)) return
      this.isActive = false
    },

    toggle(this: GlobalSocialShareComponent, evt: MouseEvent): void {
      this.isActive = !this.isActive
      evt.stopPropagation()
    },
  },

  render(this: GlobalSocialShareComponent, h) {
    if (!this.visible) return null as unknown as VNode

    const renderButtonIcon = () =>
      h('span', {
        class: 'social-share-icon-svg',
        domProps: {
          innerHTML: this.isActive ? SVG_ICON_CLOSE : SVG_ICON_SHARE,
        },
      })
    const renderGlobalButton = () =>
      h(
        'button',
        {
          attrs: {
            class: 'social-share-btn social-share-trigger',
            type: 'button',
            role: 'button',
          },
          on: {
            click: this.toggle,
          },
        },
        [renderButtonIcon()],
      )
    const renderSocialShare = () =>
      h(SocialShare, {
        style: { display: this.isActive ? 'block' : 'none' },
        props: { ...this.$attrs },
      })

    return h('div', { attrs: { class: 'social-share-global' } }, [
      renderSocialShare(),
      renderGlobalButton(),
    ])
  },

  mounted(this: GlobalSocialShareComponent) {
    document.addEventListener('click', this.handleClick)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('click', this.handleClick)
    })
  },
}

export default GlobalSocialShare
