import { Logger } from '@vuepress/helper'
import deepmerge from 'deepmerge'
import { BUILT_IN_NETWORKS, isString, PLUGIN_NAME } from '../shared/index.js'
import type {
  SocialShareNetworkWithName,
  SocialSharePluginOptions,
} from '../shared/index.js'

export const logger = new Logger(PLUGIN_NAME)

/**
 * Resolve all networks data
 */
export function resolveNetworksData(
  networks: SocialSharePluginOptions['networks'] = [],
  extendsNetworks: SocialSharePluginOptions['extendsNetworks'] = {},
) {
  const mergedNetworks = deepmerge(BUILT_IN_NETWORKS, extendsNetworks)

  const mergedNetworkNames = new Set<string>(Object.keys(mergedNetworks))
  const enabledNetworkNames = new Set<string>()

  const networksData: SocialShareNetworkWithName[] = []

  for (const network of networks) {
    if (isString(network)) {
      enabledNetworkNames.add(network)
    } else {
      if (network.default) {
        enabledNetworkNames.add(network.name)
      }
      // Should override socialShareNetwork
      if (mergedNetworkNames.has(network.name)) {
        mergedNetworks[network.name] = deepmerge(
          mergedNetworks[network.name],
          network,
        )
      } else {
        mergedNetworks[network.name] = network as SocialShareNetworkWithName
      }
    }
  }

  Object.entries(mergedNetworks).forEach(([name, network]) => {
    networksData.push({
      ...network,
      name,
      default: enabledNetworkNames.has(name),
    })
  })

  return networksData
}
