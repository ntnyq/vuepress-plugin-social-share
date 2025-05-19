// @ts-check

import path from 'node:path'

/**
 * Resolve path from root
 * @param args - path segments
 * @returns resolved path
 */
export const resolve = (...args) =>
  path.resolve(import.meta.dirname, '..', ...args)
