import type { SocialShareMeta, SocialShareNetworkWithName } from '../../shared'

/**
 * Expands a network URL template with encoded metadata and attribution.
 * Facebook uses the first hashtag; Twitter drops an empty hashtag parameter.
 *
 * @param network - Network whose sharer template is expanded.
 * @param meta - Readonly metadata snapshot to encode in the URL.
 * @param twitterUser - Optional Twitter or X username used for via attribution.
 * @returns The expanded URL, or an empty string when the template is absent.
 */
export function createShareURL(
  network: SocialShareNetworkWithName,
  meta: Readonly<SocialShareMeta>,
  twitterUser?: string,
): string {
  let { sharer = '' } = network
  if (network.name === 'twitter' && meta.hashtags.length === 0) {
    sharer = sharer.replace('&hashtags=@hashtags', '')
  }
  const hashtags =
    network.name === 'facebook' && meta.hashtags
      ? `#${meta.hashtags.split(',')[0]}`
      : meta.hashtags
  const replacements: Record<string, string> = {
    '@url': encodeURIComponent(meta.url),
    '@title': encodeURIComponent(meta.title),
    '@media': encodeURIComponent(meta.media),
    '@description': encodeURIComponent(meta.description),
    '@quote': encodeURIComponent(meta.quote),
    '@hashtags': encodeURIComponent(hashtags),
    '@twitteruser': twitterUser
      ? `&via=${encodeURIComponent(twitterUser)}`
      : '',
  }
  return sharer.replaceAll(/@\w+/gu, match => replacements[match] ?? match)
}
