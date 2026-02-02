# VuePress Social Share Plugin - AI Coding Instructions

## Architecture (dual bundle)

- Node plugin in src/node (socialSharePlugin in src/node/socialSharePlugin.ts) resolves `networksData` via `resolveNetworksData` (src/node/helpers.ts) and injects client config at build time with `define` (`__SOCIAL_SHARE_*` globals).
- Client bundle in src/client reads injected options in src/client/config.ts, registers the component name from `__SOCIAL_SHARE_COMPONENT_NAME__`, and conditionally mounts GlobalSocialShare.
- Shared types/constants live in src/shared; built-in networks are declared in src/shared/constants.ts and merged/overridden by plugin options.

## Component behavior and data flow

- SocialShare (src/client/components/SocialShare.ts) derives share meta from frontmatter → page meta → plugin defaults, builds sharer URLs, and handles popup/direct/qrcode logic.
- GlobalSocialShare (src/client/components/GlobalSocialShare.ts) toggles a floating button and respects frontmatter `noGlobalSocialShare` / `noSocialShare`.
- QR code rendering uses the `qrcode` dependency and mounts a temporary overlay element with id `__VUEPRESS_SOCIAL_SHARE__`.

## Build, docs, and test workflows

- Build uses tsdown (not tsc): pnpm dev (watch), pnpm build (prod), pnpm build:site (plugin + docs).
- Docs live in a separate workspace: pnpm docs:dev / pnpm docs:build run under docs/.
- Tests: pnpm test (Vitest). Type checks: pnpm typecheck.

## Project-specific conventions

- CSS is not bundled by TS; tsdown.config.ts copies src/client/styles/\*.css to dist/client/styles and treats .css as external.
- `useCustomStyle: true` disables auto-import of src/client/styles/social-share.css (see src/client/config.ts).
- Default networks flow: component prop `networks` → plugin networks marked `default: true` → fallback ['twitter','facebook','reddit'].
- SSR compatibility is handled by addViteSsrNoExternal in src/node/socialSharePlugin.ts.

## Reference files

- src/node/socialSharePlugin.ts, src/node/helpers.ts
- src/client/config.ts, src/client/components/SocialShare.ts, src/client/components/GlobalSocialShare.ts
- src/shared/constants.ts, src/shared/plugin.ts
- tsdown.config.ts
