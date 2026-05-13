import { filterUnsupportedCharacters, replaceDecimalSeparator } from './textUtils'

describe('Text utils tests', () => {
  it('should return comma instead of dot', () => {
    const numberWithComma = replaceDecimalSeparator('1.5')

    expect(numberWithComma).toBe('1,5')
  })
})

describe('filterUnsupportedCharacters', () => {
  it('should pass through plain ASCII text unchanged', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('Hello, World!')
    expect(sanitized).toBe('Hello, World!')
    expect(hasRemovedCharacters).toBe(false)
  })

  it('should pass through Latin-1 supplement characters (e.g. Swedish letters)', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('åäöÅÄÖéàü')
    expect(sanitized).toBe('åäöÅÄÖéàü')
    expect(hasRemovedCharacters).toBe(false)
  })

  it('should remove emojis and set hasRemovedCharacters to true', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('Hello 😀 World')
    expect(sanitized).toBe('Hello  World')
    expect(hasRemovedCharacters).toBe(true)
  })

  it('should remove tab characters', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('before\tafter')
    expect(sanitized).toBe('beforeafter')
    expect(hasRemovedCharacters).toBe(true)
  })

  it('should preserve newline characters', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('line1\nline2')
    expect(sanitized).toBe('line1\nline2')
    expect(hasRemovedCharacters).toBe(false)
  })

  it('should preserve carriage return characters', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('line1\r\nline2')
    expect(sanitized).toBe('line1\r\nline2')
    expect(hasRemovedCharacters).toBe(false)
  })

  it('should remove hidden Unicode formatting characters', () => {
    const zeroWidthSpace = '\u200B'
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters(`text${zeroWidthSpace}text`)
    expect(sanitized).toBe('texttext')
    expect(hasRemovedCharacters).toBe(true)
  })

  it('should return empty string and false for empty input', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('')
    expect(sanitized).toBe('')
    expect(hasRemovedCharacters).toBe(false)
  })

  it('should handle text with only invalid characters', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('😀🎉')
    expect(sanitized).toBe('')
    expect(hasRemovedCharacters).toBe(true)
  })

  it('should remove C1 control characters (0x80–0x9F)', () => {
    const { sanitized, hasRemovedCharacters } = filterUnsupportedCharacters('text\x80text')
    expect(sanitized).toBe('texttext')
    expect(hasRemovedCharacters).toBe(true)
  })
})
