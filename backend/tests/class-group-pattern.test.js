/* eslint-disable no-undef */
const esref = require('../src/utils/esref')

describe('esref utility', () => {
  it('matches an exact class group key', () => {
    expect(esref.matches('3-A-X', '3-A-X')).toBe(true)
    expect(esref.matches('3-A-X', '3-A-Y')).toBe(false)
  })

  it('matches wildcard segments', () => {
    expect(esref.matches('3-*-*', '3-A-X')).toBe(true)
    expect(esref.matches('*-*-X', '5-B-X')).toBe(true)
    expect(esref.matches('*-*-*', '7-C-Z')).toBe(true)
  })

  it('matches the full string only', () => {
    expect(esref.matches('3-*-*', '13-A-X')).toBe(false)
    expect(esref.matches('3-A-X', '3-A-X-extra')).toBe(false)
  })

  it('escapes regex characters in non-wildcard segments', () => {
    const regex = esref.patternToRegex('3-A.+-X(1)')

    expect(regex.test('3-A.+-X(1)')).toBe(true)
    expect(regex.test('3-AZZ-X1')).toBe(false)
  })
})
