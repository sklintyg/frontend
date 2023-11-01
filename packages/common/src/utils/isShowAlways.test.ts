import { ValidationError } from '../types'
import { isShowAlways } from './isShowAlways'

const getValidationError = (type: string): ValidationError => ({
  id: 'id',
  type,
  field: 'field',
  category: 'category',
  text: 'text',
})

describe('isShowAlways', () => {
  it('should return true if validation error is of type OTHER', () => {
    const result = isShowAlways(getValidationError('OTHER'))
    expect(result).toBeTruthy()
  })

  it('should return true if validation error is of type INVALID_FORMAT', () => {
    const result = isShowAlways(getValidationError('INVALID_FORMAT'))
    expect(result).toBeTruthy()
  })

  it('should return false if validation error is of other type than other or invalid format', () => {
    const result = isShowAlways(getValidationError('TEST'))
    expect(result).toBeFalsy()
  })
})
