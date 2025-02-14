import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { SocialSharePluginOptionsWithDefaults } from '../../shared/index.js'

export const socialShareOptionsSymbol: InjectionKey<SocialSharePluginOptionsWithDefaults> =
  Symbol('social-share-options')

export const injectSocialShareOptions = (
  app: App,
  options: SocialSharePluginOptionsWithDefaults,
) => {
  app.provide(socialShareOptionsSymbol, options)
}

export const useSocialShareOptions = () => {
  return inject(socialShareOptionsSymbol)!
}
