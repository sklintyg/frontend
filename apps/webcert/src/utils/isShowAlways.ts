import { ValidationError } from '../types'

export const isShowAlways = (validationError: ValidationError): boolean => {
  if (validationError.type === 'INVALID_FORMAT' || validationError.type === 'OTHER') {
    return true
  } else {
    return false
  }
}
