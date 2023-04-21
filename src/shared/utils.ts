import deepmerge from 'deepmerge'
import { BASE_NETWORKS } from './networks.js'
import type { SocialSharePluginOptions } from './types.js'

export const createNetworksData = (options: SocialSharePluginOptions = {}) =>
  deepmerge(BASE_NETWORKS, options.extendsNetworks || {})
