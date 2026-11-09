import type {
  SocialSharePageOptions,
  SocialSharePluginOptionsWithDefaults,
} from '../../shared'

/**
 * Resolves component props, page overrides and plugin defaults without mutation.
 * Network names are deduplicated in order and unknown names are excluded.
 *
 * @param options - Plugin options containing the complete resolved network registry.
 * @param page - Page frontmatter overrides; defaults to {}.
 * @param props - Highest-priority component overrides; defaults to {}.
 * @returns Known networks, unknown names, plain mode and print visibility.
 */
export function resolveSocialShareOptions(
  options: SocialSharePluginOptionsWithDefaults,
  page: SocialSharePageOptions = {},
  props: SocialSharePageOptions = {},
) {
  const names = [
    ...new Set(
      props.networks ??
        page?.networks ??
        options.networksData
          .filter(network => network.default)
          .map(network => network.name),
    ),
  ]
  const registry = new Map(
    options.networksData.map(network => [network.name, network]),
  )
  return {
    /**
     * Presentation after component, page and plugin overrides.
     */
    variant: props.variant ?? page?.variant ?? options.variant ?? 'default',
    /**
     * Known networks in the requested order, with duplicate names removed.
     */
    networks: names.flatMap(name => {
      const network = registry.get(name)
      return network ? [network] : []
    }),
    /**
     * Requested names absent from the registry, used for development warnings.
     */
    unknownNetworks: names.filter(name => !registry.has(name)),
    /**
     * Resolved plain mode after component, page and plugin overrides.
     *
     * @default false
     */
    isPlain: props.isPlain ?? page?.isPlain ?? options.isPlain ?? false,
    /**
     * Resolved print visibility after component, page and plugin overrides.
     *
     * @default false
     */
    hideWhenPrint:
      props.hideWhenPrint ??
      page?.hideWhenPrint ??
      options.hideWhenPrint ??
      false,
  }
}
