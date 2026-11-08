import { describe, expect, it } from 'vitest'
import { formatMarkdownLink } from '../src/client/helpers/clipboard'

describe('markdown links', () => {
  it('escapes brackets, backslashes and formatting in titles and folds whitespace', () => {
    expect(
      formatMarkdownLink('A [title]\\\n**bold** <tag>', 'https://example.com/'),
    ).toBe(
      String.raw`[A \[title\]\\ \*\*bold\*\* \<tag\>](https://example.com/)`,
    )
  })

  it('encodes destination delimiters without double-encoding URL parameters', () => {
    expect(
      formatMarkdownLink(
        'Title',
        'https://example.com/a(b)?x=a%2Bb&y=<c>#some text\\',
      ),
    ).toBe(
      '[Title](https://example.com/a%28b%29?x=a%2Bb&y=%3Cc%3E#some%20text%5C)',
    )
  })
})
