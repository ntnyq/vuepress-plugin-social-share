import deepmerge from 'deepmerge'
import type { SocialSharePluginOptions } from './types.js'
import { BASE_NETWORKS } from './networks.js'

export const createNetworksData = (options: SocialSharePluginOptions = {}) =>
  deepmerge(BASE_NETWORKS, options.extendsNetworks || {})
