import { replaceDecimalSeparator } from './textUtils'

describe('Text utils tests', () => {
  it('should return comma instead of dot', () => {
    const numberWithComma = replaceDecimalSeparator('1.5')

    expect(numberWithComma).toBe('1,5')
  })
})
