const inBrowser = typeof window !== 'undefined'

export const outboundRE = /^(https?:|mailto:|tel:|[a-zA-Z]{4,}:)/

/**
 * Return meta content in browser by name
 */
export function getMetaContentByName (name) {
  if (!inBrowser) {
    return
  }

  return (document.getElementsByName(name)[0] || 0).content
}

/**
 * Check if a given url is external
 */
export function isExternal (path) {
  return outboundRE.test(path)
}
