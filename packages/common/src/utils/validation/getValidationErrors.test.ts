import { ValidationError } from '../../types'
import { getValidationErrors } from '../getValidationErrors'

it('Should return validation errors from field', () => {
  const validationError: ValidationError = { id: '', category: '', field: 'grunddata.skapadAv.vardenhet.postadress', type: '', text: '' }
  const validationErrors: ValidationError[] = []
  validationErrors.push(validationError)

  const result = getValidationErrors(validationErrors, 'grunddata.skapadAv.vardenhet.postadress')

  expect(result.length).toBe(1)
  expect(result[0].field).toBe('grunddata.skapadAv.vardenhet.postadress')
})

it('Should return empty array on non existing field', () => {
  const validationError: ValidationError = { id: '', category: '', field: 'grunddata.skapadAv.vardenhet.postadress', type: '', text: '' }
  const validationErrors: ValidationError[] = []
  validationErrors.push(validationError)

  const result = getValidationErrors(validationErrors, 'NON_EXISTING_FIELD')

  expect(result.length).toBe(0)
})
