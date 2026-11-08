# Repository Guidelines

## Project Structure & Module Organization

This repository contains the VuePress 2 social sharing plugin; active development targets the `next` branch.

- `src/node/`: plugin registration, option resolution, and VuePress build integration.
- `src/client/`: Vue components, injected configuration, helpers, and CSS in `styles/`.
- `src/shared/`: network definitions, public option types, and shared utilities.
- `tests/`: utility, server rendering, and DOM interaction tests.
- `docs/`: VuePress documentation and examples; configuration lives in `.vuepress/config.ts`, with static assets in `.vuepress/public/`.
- `dist/`: generated JavaScript, declarations, and copied styles. Edit source files instead of build output.

## Build, Test, and Development Commands

Use Node.js LTS and the pnpm version declared in `package.json`.

- `pnpm install`: install workspace dependencies.
- `pnpm build`: build the plugin and declarations with tsdown.
- `pnpm dev`: rebuild the plugin when source files change.
- `pnpm docs:dev`: start the documentation site; build the plugin first and keep `pnpm dev` running when editing source.
- `pnpm build:site`: build the plugin, then the documentation site.
- `pnpm test`: run Vitest once; watch mode is disabled in configuration.
- `pnpm typecheck`: check TypeScript without emitting files.
- `pnpm lint`: run oxlint.
- `pnpm format` / `pnpm format:check`: apply or verify oxfmt formatting.

## Coding Style & Naming Conventions

Use strict TypeScript and ESM imports. Follow existing Vue `defineComponent` and `h()` render-function patterns. Keep browser-dependent code safe during server rendering.

Use two-space indentation, LF endings, single quotes in TypeScript, no semicolons, and trailing commas. Let oxfmt manage wrapping and import ordering. Use PascalCase for component filenames and types, camelCase for functions and variables, and UPPER_SNAKE_CASE for constants. Use `import type` for type-only imports.

## Testing Guidelines

Name tests `tests/<subject>.test.ts`. Use Vitest assertions and mocks; DOM tests opt into `happy-dom` with a file directive. Cover changed behavior, including SSR safety and sharing interactions where relevant. No coverage threshold is configured. Run a focused file with `pnpm test tests/utils.test.ts`.

## Commit & Pull Request Guidelines

Follow the existing Conventional Commit style: `feat: ...`, `refactor: ...`, `build: ...`, or `chore(deps): ...`. Keep commits focused.

Target `next`. Describe the change, link relevant issues, and report validation results. Include screenshots for visible changes and update documentation when public options or behavior change. Before submitting, run formatting checks, lint, type checking, tests, and `pnpm build:site` to match CI.
