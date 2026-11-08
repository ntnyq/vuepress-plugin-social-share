import { EN_LOCALE, ZH_CN_LOCALE } from '../../shared'
import type { SocialShareLocaleData } from '../../shared'

/**
 * Removes undefined top-level messages so they do not erase fallback translations.
 *
 * @param locale - Partial locale messages to filter; defaults to {}.
 * @returns A new object containing only explicitly defined fields.
 */
function definedLocaleFields(
  locale: Partial<SocialShareLocaleData> = {},
): Partial<SocialShareLocaleData> {
  return Object.fromEntries(
    Object.entries(locale).filter(([, value]) => value !== undefined),
  )
}

/**
 * Resolves messages from built-ins, root overrides and current-route overrides.
 * Each field and each network label falls back independently.
 *
 * @param locales - Locale-path overrides; defaults to {}.
 * @param routeLocale - Current VuePress locale path; defaults to /.
 * @param lang - Page language selecting English or Simplified Chinese; defaults to en.
 * @returns Complete messages with merged per-network labels.
 */
export function resolveSocialShareLocale(
  locales: Record<string, Partial<SocialShareLocaleData>> = {},
  routeLocale = '/',
  lang = 'en',
): SocialShareLocaleData {
  const builtin = /^zh(?:$|-(?:cn|sg|hans)(?:-|$))/iu.test(lang)
    ? ZH_CN_LOCALE
    : EN_LOCALE
  return {
    ...builtin,
    ...definedLocaleFields(locales['/']),
    ...definedLocaleFields(locales[routeLocale]),
    networkLabels: {
      ...builtin.networkLabels,
      ...locales['/']?.networkLabels,
      ...locales[routeLocale]?.networkLabels,
    },
  }
}
