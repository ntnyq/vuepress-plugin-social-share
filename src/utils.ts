/**
 * @file utils
 */

import deepmerge from 'deepmerge'
import type { SocialSharePluginOptions } from './types'
import { BASE_NETWORKS } from './networks'
import { RE_EMAIL, RE_EXTERNAL_LINK, RE_SVG_SOURCE } from './constants'

/**
 * Check if given val is valid email address
 * @param val given val
 * @returns `true` if given an email address
 */
export const isEmail = (val: string) => RE_EMAIL.test(val)

/**
 * Check if the given url is external
 * @param url given url
 * @returns `true` is given an external url
 */
export const isExternalUrl = (url: string) => RE_EXTERNAL_LINK.test(url)

/**
 * Check if the given source string is SVG
 * @param source given source string
 * @returns `true` if given a svg source string
 */
export const isSVG = (source: string) => RE_SVG_SOURCE.test(source)

export const inBrowser = typeof window !== 'undefined'

/**
 * Return meta tag's content in browser by name
 * @param name meta tag's name
 *
 * @returns meta tag's content if exists, or `''`
 */
export function getMetaContentByName(name: string) {
  if (!inBrowser) return ''
  const tag = document.getElementsByName(name)[0]
  if (!tag) return ''
  return tag.getAttribute(`content`) || ``
}

export const createNetworksData = (options: SocialSharePluginOptions = {}) => {
  const { email = ``, extendsNetworks = {} } = options

  if (isEmail(email)) {
    BASE_NETWORKS.email.sharer = BASE_NETWORKS.email.sharer!.replace(
      `@email`,
      email
    )
  } else {
    delete BASE_NETWORKS.email
  }

  return deepmerge(BASE_NETWORKS, extendsNetworks)
}
