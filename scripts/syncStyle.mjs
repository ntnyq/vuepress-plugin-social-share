import { cp } from 'node:fs/promises'
import { resolve } from './utils.mjs'

try {
  await cp(resolve('src/client/styles'), resolve('dist/client/styles'), {
    force: true,
    recursive: true,
  })
  console.log('🟩 Sync files successfully')
} catch (err) {
  console.log('🟥 Ops! sync failed')
  console.error(err)
}
