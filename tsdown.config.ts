import { cp, mkdir } from 'node:fs/promises'
import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/node/**/*.ts', 'src/client/**/*.ts', 'src/shared/**/*.ts'],
  hash: false,
  unbundle: true,
  hooks: {
    'build:done': async () => {
      await mkdir('dist/client/styles', { recursive: true })

      for await (const file of ['vars.css', 'social-share.css']) {
        await cp(`src/client/styles/${file}`, `dist/client/styles/${file}`, {
          recursive: true,
        })
      }
    },
  },
  external(id) {
    return id.endsWith('.css')
  },
})
