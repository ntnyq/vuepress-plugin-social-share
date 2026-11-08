import { Logger } from '@vuepress/helper'
import deepmerge from 'deepmerge'
import { BUILT_IN_NETWORKS, isString, PLUGIN_NAME } from '../shared'
import type {
  SocialShareNetworkWithName,
  SocialSharePluginOptions,
} from '../shared'

/**
 * VuePress logger scoped to the social sharing plugin.
 */
export const logger = new Logger(PLUGIN_NAME)

/**
 * Merges built-in, legacy and inline network definitions and resolves enabled flags.
 * Unknown string names are not added to the registry.
 *
 * @param networks - Ordered names or definitions to enable or override; defaults to [].
 * @param extendsNetworks - Legacy registry overrides merged first; defaults to {}.
 * @returns Every registered network with its name and resolved default flag.
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
