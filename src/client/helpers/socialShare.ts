import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { SocialSharePluginOptionsWithDefaults } from '../../shared'

/**
 * Typed injection key for the build-time social sharing configuration.
 */
export const socialShareOptionsSymbol: InjectionKey<SocialSharePluginOptionsWithDefaults> =
  Symbol('social-share-options')

/**
 * Provides the serialized plugin configuration to one Vue application.
 *
 * @param app - Vue application receiving the configuration.
 * @param options - Client options and the complete network registry.
 * @returns Nothing; registers an application-scoped provider.
 */
export const injectSocialShareOptions = (
  app: App,
  options: SocialSharePluginOptionsWithDefaults,
) => {
  app.provide(socialShareOptionsSymbol, options)
}

/**
 * Reads plugin configuration from the current component injection context.
 * Requires injectSocialShareOptions to have configured the owning application.
 *
 * @template [T=SocialSharePluginOptionsWithDefaults] - Expected configuration type.
 * @returns The provided options cast to T; the provider must exist.
 */
export const useSocialShareOptions = <
  T = SocialSharePluginOptionsWithDefaults,
>() => inject(socialShareOptionsSymbol) as T
