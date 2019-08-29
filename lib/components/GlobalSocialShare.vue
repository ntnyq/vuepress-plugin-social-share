<template>
  <div
    v-if="visible"
    class="social-share-wrap"
  >
    <social-share
      v-show="isActive"
      v-bind="$attrs"
    />
    <button
      @click="isActive = !isActive"
      class="social-share-trigger social-share-btn"
      type="button"
      role="button"
    >
      <vp-icon :name="isActive ? 'close' : 'share'" />
    </button>
  </div>
</template>

<script>
import SocialShare from './SocialShare'

export default {
  components: {
    SocialShare,
  },

  computed: {
    visible () {
      return !this.$frontmatter.noGlobalSocialShare && !this.$frontmatter.noSocialShare
    },
  },

  data () {
    return {
      isActive: false,
    }
  },
}
</script>
