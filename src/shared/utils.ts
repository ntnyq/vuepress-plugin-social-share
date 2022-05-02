import deepmerge from 'deepmerge'
import { type SocialSharePluginOptions } from './types'
import { BASE_NETWORKS } from './networks'

export const RE_EMAIL = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/

/**
 * Check if given val is valid email address
 * @param val given val
 * @returns `true` if given an email address
 */
export const isEmail = (val: string) => RE_EMAIL.test(val)

export const createNetworksData = (options: SocialSharePluginOptions = {}) => {
  const { email = ``, extendsNetworks = {} } = options

  if (isEmail(email)) {
    BASE_NETWORKS.email.sharer = BASE_NETWORKS.email.sharer!.replace(
      `@email`,
      email,
    )
  } else {
    delete BASE_NETWORKS.email
  }

  return deepmerge(BASE_NETWORKS, extendsNetworks)
}
