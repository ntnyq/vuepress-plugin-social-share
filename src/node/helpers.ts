import { Logger } from '@vuepress/helper'
import deepmerge from 'deepmerge'
import { BUILT_IN_NETWORKS, PLUGIN_NAME } from './constants.js'
import type { SocialSharePluginOptions } from '../shared/index.js'

export const logger = new Logger(PLUGIN_NAME)

/**
 * Merge extendsNetworks with built-in networks
 *
 * @param options - plugin options
 * @returns merged networks data
 */
export const mergeNetworksData = (options: SocialSharePluginOptions) =>
  deepmerge(BUILT_IN_NETWORKS, options.extendsNetworks || {})

/**
 * Resolve all networks data
 */
export function resolveNetworksData(options: SocialSharePluginOptions = {}) {
  console.log({ options })
}
