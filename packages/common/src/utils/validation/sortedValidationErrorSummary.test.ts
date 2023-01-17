import { fakeCertificate } from '../faker/fakeCertificate'
import {
  fakeTextFieldElement,
  fakeTextAreaElement,
  fakeCheckboxBooleanElement,
  fakeCategoryElement,
  fakeRadioBooleanElement,
} from '../faker/fakeCertificateData'
import { sortedValidationErrorSummary } from './sortedValidationErrorSummary'
import { fakeCertificateValidationError } from '../faker/fakeCertificateDataValidation'

const getCertificate = () =>
  fakeCertificate({
    data: {
      ...fakeRadioBooleanElement({ id: '1.1', parent: 'funktionsnedsattning' }),
      ...fakeTextFieldElement({ id: '1.2', parent: '1.1' }),
      ...fakeTextAreaElement({ id: '1.3', parent: 'client' }),
      ...fakeCheckboxBooleanElement({ id: '28', parent: 'sysselsattning' }),
      ...fakeCategoryElement({ id: 'funktionsnedsattning', index: 11, config: { text: 'Sjukdomens konsekvenser' } }),
      ...fakeCategoryElement({ id: 'sysselsattning', index: 6, config: { text: 'Sysselsättning' } }),
      ...fakeCategoryElement({ id: 'client', index: 6, config: { text: 'Client Error' } }),
      ...fakeCategoryElement({ id: 'cat', index: 6, config: { text: 'Category' } }),
    },
  })

it('Should return empty validation error summary', () => {
  const certificate = getCertificate()
  const result = sortedValidationErrorSummary(certificate, [])

  expect(result.length).toBe(0)
})

describe('Sorted validation error', () => {
  const certificate = getCertificate()
  const validationError = fakeCertificateValidationError()
  certificate.data['1.2'].validationErrors.push(validationError)
  certificate.data['28'].validationErrors.push(validationError)
  certificate.metadata.careUnitValidationErrors = []
  certificate.metadata.careUnitValidationErrors.push(validationError)
  certificate.metadata.patientValidationErrors = []
  certificate.metadata.patientValidationErrors.push(validationError)
  const result = sortedValidationErrorSummary(certificate, [fakeCertificateValidationError({ id: '1.3' })])

  it('Should contain correct number of errors', () => {
    expect(result.length).toBe(5)
  })

  it('Should return validation errors on patients adress', () => {
    expect(result[0]).toEqual({ id: 'patientensadress', text: 'Patientens adressuppgifter', index: -1 })
  })

  it('Should return errors on question parent categories', () => {
    expect(result[1]).toEqual({ id: 'sysselsattning', text: 'Sysselsättning', index: 6 })
    expect(result[2]).toEqual({ id: 'client', text: 'Client Error', index: 6 })
    expect(result[3]).toEqual({ id: 'funktionsnedsattning', text: 'Sjukdomens konsekvenser', index: 11 })
  })

  it('Should return errors on care unit', () => {
    expect(result[4]).toEqual({ id: 'vardenhetensadress', text: 'Vårdenhetens adress', index: -1 })
  })
})

it('Should include client validation errors in result', () => {
  expect(sortedValidationErrorSummary(getCertificate(), [fakeCertificateValidationError({ id: '1.2' })]).length).toBe(1)
})
