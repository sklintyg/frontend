import { fakeCertificateValidationError } from '../faker'
import { getValidationErrors } from './getValidationErrors'

it('Should return validation errors from field', () => {
  const result = getValidationErrors([fakeCertificateValidationError({ field: 'FIELD_IDENTIFIER' })], 'FIELD_IDENTIFIER')

  expect(result.length).toBe(1)
  expect(result[0].field).toBe('FIELD_IDENTIFIER')
})

it('Should return empty array on non existing field', () => {
  const result = getValidationErrors([fakeCertificateValidationError({ field: 'FIELD_IDENTIFIER' })], 'NON_EXISTING_FIELD')

  expect(result.length).toBe(0)
})
