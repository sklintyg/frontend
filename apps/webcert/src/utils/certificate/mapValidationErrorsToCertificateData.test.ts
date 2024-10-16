import { fakeCertificateValidationError, fakeTextFieldElement } from '../../faker'
import type { CertificateData, ValidationError } from '../../types'
import { mapValidationErrorsToCertificateData } from './mapValidationErrorsToCertificateData'

it('should return the same data structure when no validation errors are present', () => {
  const certificateData: CertificateData = {
    ...fakeTextFieldElement({ id: '1' }),
    ...fakeTextFieldElement({ id: '2' }),
  }
  const validationErrors: ValidationError[] = []

  const result = mapValidationErrorsToCertificateData(certificateData, validationErrors)

  expect(result).toMatchObject({
    '1': { id: '1', validationErrors: [] },
    '2': { id: '2', validationErrors: [] },
  })
})

it('should map validation errors to their respective fields by ID', () => {
  const certificateData: CertificateData = {
    ...fakeTextFieldElement({ id: '1' }),
    ...fakeTextFieldElement({ id: '2' }),
  }
  const validationErrors: ValidationError[] = [
    fakeCertificateValidationError({ id: '1', text: 'Error in field 1' }),
    fakeCertificateValidationError({ id: '2', text: 'Error in field 2' }),
  ]

  const result = mapValidationErrorsToCertificateData(certificateData, validationErrors)

  expect(result).toMatchObject({
    '1': { id: '1', validationErrors: [{ id: '1', text: 'Error in field 1' }] },
    '2': { id: '2', validationErrors: [{ id: '2', text: 'Error in field 2' }] },
  })
})

it('should handle multiple validation errors for the same field', () => {
  const certificateData: CertificateData = {
    ...fakeTextFieldElement({ id: '1' }),
    ...fakeTextFieldElement({ id: '2' }),
  }
  const validationErrors: ValidationError[] = [
    fakeCertificateValidationError({ id: '1', text: 'First error in field 1' }),
    fakeCertificateValidationError({ id: '1', text: 'Second error in field 1' }),
    fakeCertificateValidationError({ id: '2', text: 'Error in field 2' }),
  ]

  const result = mapValidationErrorsToCertificateData(certificateData, validationErrors)

  expect(result).toMatchObject({
    '1': {
      id: '1',
      validationErrors: [
        { id: '1', text: 'First error in field 1' },
        { id: '1', text: 'Second error in field 1' },
      ],
    },
    '2': { id: '2', validationErrors: [{ id: '2', text: 'Error in field 2' }] },
  })
})

it('should return empty validationErrors array if no errors match a field', () => {
  const certificateData: CertificateData = {
    ...fakeTextFieldElement({ id: '1' }),
    ...fakeTextFieldElement({ id: '2' }),
  }
  const validationErrors: ValidationError[] = [fakeCertificateValidationError({ id: '3', text: 'Error in unrelated field' })]

  const result = mapValidationErrorsToCertificateData(certificateData, validationErrors)

  expect(result).toMatchObject({
    '1': { id: '1', validationErrors: [] },
    '2': { id: '2', validationErrors: [] },
  })
})

it('should work correctly with empty certificate data', () => {
  const certificateData: CertificateData = {}
  const validationErrors: ValidationError[] = [fakeCertificateValidationError({ id: '1', text: 'Error in field 1' })]

  const result = mapValidationErrorsToCertificateData(certificateData, validationErrors)

  expect(result).toEqual({})
})
