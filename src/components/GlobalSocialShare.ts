import Vue, { ComponentOptions, VNode } from 'vue'

interface GlobalSocialShareComponent extends Vue {
  isActive: boolean
  visible: boolean
  // FIXME: any type
  handleClick: (this: any, evt: MouseEvent) => void
}

const GlobalSocialShare: ComponentOptions<Vue> = {
  name: `GlobalSocialShare`,

  inheritAttrs: false,

  computed: {
    visible(this: GlobalSocialShareComponent) {
      return !(
        this.$frontmatter.noGlobalSocialShare || this.$frontmatter.noSocialShare
      )
    },
  },

  data(this: GlobalSocialShareComponent) {
    return {
      isActive: false,
    }
  },

  methods: {
    handleClick(this: any, evt: MouseEvent): void {
      const { target } = evt
      if (!this.$el.contains) return
      if (this.$el.contains(target as Node)) return
      this.isActive = false
    },
  },

  render(this: GlobalSocialShareComponent, h) {
    return h(`div`, { attrs: { class: `social-share-global` } }, [])
  },

  mounted(this: GlobalSocialShareComponent) {
    document.addEventListener(`click`, this.handleClick)
    this.$once(`hook:beforeDestroy`, () => {
      document.removeEventListener(`click`, this.handleClick)
    })
  },
}

export default GlobalSocialShare
