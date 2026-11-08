import { computed, onMounted, ref, watchEffect } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import type {
  SocialShareFrontmatter,
  SocialSharePageOptions,
} from '../../shared'
import { resolveSocialShareOptions } from './resolveOptions'
import { useSocialShareOptions } from './socialShare'

/**
 * Resolves reactive sharing settings and filters unsupported native sharing networks.
 * Native sharing stays hidden until mounted capability detection succeeds.
 * Development builds warn once per unknown network name for this component.
 *
 * @param props - Component overrides above page and plugin settings; defaults to {}.
 * @returns Computed networks and appearance settings for the current page.
 */
export function useResolvedSocialShareOptions(
  props: SocialSharePageOptions = {},
) {
  const options = useSocialShareOptions()
  const frontmatter = usePageFrontmatter<SocialShareFrontmatter>()
  const canNativeShare = ref(false)
  onMounted(() => {
    canNativeShare.value =
      window.isSecureContext && typeof navigator.share === 'function'
  })
  const resolved = computed(() =>
    resolveSocialShareOptions(options, frontmatter.value.socialShare, props),
  )
  // oxlint-disable-next-line node/no-process-env -- Replaced by both VuePress bundlers.
  if (process.env.NODE_ENV !== 'production') {
    const warned = new Set<string>()
    watchEffect(() => {
      for (const name of resolved.value.unknownNetworks) {
        if (!warned.has(name)) {
          warned.add(name)
          console.warn(`[social-share] Unknown network: ${name}`)
        }
      }
    })
  }
  return computed(() => ({
    ...resolved.value,
    networks: resolved.value.networks.filter(
      network => network.type !== 'native' || canNativeShare.value,
    ),
  }))
}
