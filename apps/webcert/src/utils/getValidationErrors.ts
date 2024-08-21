import { ValidationError } from '../types'

export const getValidationErrors = (validationErrors: ValidationError[], field: string): ValidationError[] => {
  return validationErrors.filter((error) => error.field === field)
}
