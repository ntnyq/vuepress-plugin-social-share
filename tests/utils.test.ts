import { describe, expect, it } from 'vitest'
import { isExternalUrl, isSVG } from '../src/client/utils'

const FIXTURES = {
  validSVG: ['<svg></svg>', '<svg><g></g></svg>'],
  invalidSVG: ['<svg</svg>', '<svg><svg>'],

  validExternalUrl: ['https://foo.bar', 'http://foo.bar'],
  invalidExternalUrl: ['foo.bar', '/foo.bar'],
}

describe('isSVG', () => {
  it.each(FIXTURES.validSVG)('valid - %s', svg => {
    expect(isSVG(svg)).toBeTruthy()
  })

  it.each(FIXTURES.invalidSVG)('invalid - %s', svg => {
    expect(isSVG(svg)).toBeFalsy()
  })
})

describe('isExternalUrl', () => {
  it.each(FIXTURES.validExternalUrl)('valid - %s', url => {
    expect(isExternalUrl(url)).toBeTruthy()
  })

  it.each(FIXTURES.invalidExternalUrl)('invalid - %s', url => {
    expect(isExternalUrl(url)).toBeFalsy()
  })
})
