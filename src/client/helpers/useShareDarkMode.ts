import { useDarkMode } from '@vuepress/helper/client'
import { computed, onMounted, shallowRef } from 'vue'

/**
 * Keeps the first client render consistent with SSR before applying theme icons.
 * Vue does not repair mismatched inline colors during production hydration.
 *
 * @returns A reactive dark-mode flag that becomes theme-aware after mounting.
 */
export function useShareDarkMode() {
  const isDarkMode = useDarkMode()
  const isMounted = shallowRef(false)
  onMounted(() => {
    isMounted.value = true
  })
  return computed(() => isMounted.value && isDarkMode.value)
}
