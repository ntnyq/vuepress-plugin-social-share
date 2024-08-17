import { describe, expect, it } from 'vitest'
import { isExternalUrl, isSVG } from '../src/client/utils'

const FIXTURES = {
  validSVG: ['<svg></svg>', '<svg><g></g></svg>'],
  invalidSVG: ['<svg</svg>', '<svg><svg>'],

  validExternalUrl: ['https://foo.bar', 'http://foo.bar'],
  invalidExternalUrl: ['foo.bar', '/foo.bar'],
}

describe('isSVG', () => {
  it('valid', () => {
    FIXTURES.validSVG.forEach(svg => {
      expect(isSVG(svg)).toBeTruthy()
    })
  })

  it('invald', () => {
    FIXTURES.invalidSVG.forEach(svg => {
      expect(isSVG(svg)).toBeFalsy()
    })
  })
})

describe('isExternalUrl', () => {
  it('valid', () => {
    FIXTURES.validExternalUrl.forEach(url => {
      expect(isExternalUrl(url)).toBeTruthy()
    })
  })

  it('invald', () => {
    FIXTURES.invalidExternalUrl.forEach(url => {
      expect(isExternalUrl(url)).toBeFalsy()
    })
  })
})
