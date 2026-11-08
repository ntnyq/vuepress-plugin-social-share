import { computed } from 'vue'
import { usePageLang, useRouteLocale } from 'vuepress/client'
import { resolveSocialShareLocale } from './resolveLocale'
import { useSocialShareOptions } from './socialShare'

/**
 * Tracks the current VuePress language and route locale to resolve sharing messages.
 *
 * @returns Computed complete messages that update when the page locale changes.
 */
export function useSocialShareLocale() {
  const options = useSocialShareOptions()
  const routeLocale = useRouteLocale()
  const lang = usePageLang()
  return computed(() =>
    resolveSocialShareLocale(options.locales, routeLocale.value, lang.value),
  )
}
