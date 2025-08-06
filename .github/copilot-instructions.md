# VuePress Social Share Plugin - AI Coding Instructions

## Architecture Overview

This is a VuePress v2 plugin that provides social sharing components. The codebase follows a **dual-bundle architecture**:

- **`src/node/`**: Server-side plugin logic that integrates with VuePress build system
- **`src/client/`**: Client-side Vue components and utilities shipped to the browser
- **`src/shared/`**: TypeScript types and constants shared between node and client

Key architectural patterns:

- **Plugin factory pattern**: `socialSharePlugin()` returns a VuePress plugin function
- **Compile-time configuration injection**: Node plugin injects client options via webpack `define`
- **Network abstraction**: Built-in social networks defined as declarative config objects with icons, colors, and sharer URLs

## Essential Build & Development Workflow

```bash
# Core development cycle
pnpm dev           # Watch mode build with tsdown
pnpm docs:dev      # Live docs site (uses workspace:* plugin)
pnpm test          # Vitest unit tests
pnpm build         # Production build
pnpm build:site    # Build plugin + docs for deployment
```

**Critical build details:**

- Uses `tsdown` (not tsc) for unbundled TypeScript compilation
- CSS files are **manually copied** in `tsdown.config.ts` hooks (not processed by TypeScript)
- Exports follow VuePress plugin conventions with dual entry points

## Plugin Configuration Patterns

**Node-side initialization** (`src/node/socialSharePlugin.ts`):

```typescript
// Plugin transforms user options into client-ready configuration
const networksData = resolveNetworksData(networks, extendsNetworks)
const clientOptions = { ...restClientOptions, networksData }

// Injects via webpack defines (not runtime config)
define: {
  __SOCIAL_SHARE_CLIENT_OPTIONS__: clientOptions,
}
```

**Client-side consumption** (`src/client/config.ts`):

```typescript
// Client config auto-runs when plugin loads
injectSocialShareOptions(app, __SOCIAL_SHARE_CLIENT_OPTIONS__)
```

## Component System

**Two main components:**

- `SocialShare`: Explicit component users add to pages
- `GlobalSocialShare`: Auto-injected floating share button (unless `noGlobalSocialShare: true`)

**Network resolution priority:**

1. Component `networks` prop
2. Networks marked `default: true` in plugin config
3. Falls back to `['twitter', 'facebook', 'reddit']`

**Custom network extension pattern:**

```typescript
// Built-in networks in src/shared/constants.ts
networks: [
  'twitter',
  { name: 'custom', icon: '<svg>...', sharer: 'https://...', type: 'popup' },
]
```

## Styling Architecture

**CSS organization:**

- `styles/vars.css`: CSS custom properties for theming
- `styles/social-share.css`: Component styles (auto-imported unless `useCustomStyle: true`)
- Supports light/dark mode via `ThemeableValue<T>` type for icons and colors

## VuePress Integration Patterns

**Key integration points:**

- `clientConfigFile`: Points to auto-executing client config
- `addViteSsrNoExternal()`: Ensures dependencies work in SSR
- Frontmatter integration: `SocialShareFrontmatter` type defines page-level share metadata
- Uses VuePress composables: `usePageFrontmatter()`, `withBase()`, `useDarkMode()`

## Testing & Quality Patterns

**Test structure:**

- Unit tests in `/tests/` using Vitest
- Focus on utility functions (`isExternalUrl`, `isSVG`)
- No component testing setup currently

**Workspace structure:**

- `/docs/` subdirectory is separate pnpm workspace for documentation site
- Uses `workspace:*` dependency to test local plugin build
- Documentation doubles as integration test environment

## Key Files to Understand

- `src/shared/plugin.ts`: Core TypeScript interfaces and plugin options
- `src/shared/constants.ts`: Built-in social network definitions
- `src/node/socialSharePlugin.ts`: VuePress plugin factory and server integration
- `src/client/components/SocialShare.ts`: Main Vue component implementation
- `tsdown.config.ts`: Build configuration with CSS copying logic
