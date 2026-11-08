/**
 * Escapes link text and destination so the result remains one Markdown link.
 *
 * @param title - Link label; whitespace is collapsed and Markdown delimiters are escaped.
 * @param url - Link destination; whitespace and delimiters are percent-encoded.
 * @returns A single Markdown link containing the escaped title and URL.
 */
export function formatMarkdownLink(title: string, url: string): string {
  const text = title
    .replaceAll(/\s+/gu, ' ')
    .replaceAll(/[\\`*_[\]<>]/gu, character => `\\${character}`)
  const destination = url.replaceAll(/[\s()<>\\]/gu, character =>
    encodeURIComponent(character).replaceAll('(', '%28').replaceAll(')', '%29'),
  )
  return `[${text}](${destination})`
}
