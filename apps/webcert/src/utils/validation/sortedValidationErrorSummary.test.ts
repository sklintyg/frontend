import {
  fakeCategoryElement,
  fakeCertificate,
  fakeCertificateValidationError,
  fakeCheckboxBooleanElement,
  fakeRadioBooleanElement,
  fakeTextAreaElement,
  fakeTextFieldElement,
} from '../../faker'
import { sortedValidationErrorSummary } from './sortedValidationErrorSummary'

const getCertificate = () =>
  fakeCertificate({
    data: {
      ...fakeRadioBooleanElement({ id: '1.1', parent: 'funktionsnedsattning' }),
      ...fakeTextFieldElement({ id: '1.2', parent: '1.1' }),
      ...fakeTextAreaElement({ id: '1.3', parent: 'client' }),
      ...fakeCheckboxBooleanElement({ id: '28', parent: 'sysselsattning' }),
      ...fakeCategoryElement({ id: 'funktionsnedsattning', index: 11, config: { text: 'Sjukdomens konsekvenser' } }),
      ...fakeCategoryElement({ id: 'sysselsattning', index: 6, config: { text: 'Sysselsättning' } }),
      ...fakeCategoryElement({ id: 'client', index: 7, config: { text: 'Client Error' } }),
      ...fakeCategoryElement({ id: 'foo', index: 8, config: { text: 'En till kategori' } }),
    },
  })

it('Should return empty validation error summary', () => {
  const certificate = getCertificate()
  const result = sortedValidationErrorSummary(certificate)

  expect(result.length).toBe(0)
})

describe('Sorted validation error', () => {
  const certificate = getCertificate()
  certificate.data['1.2'].validationErrors.push(fakeCertificateValidationError())
  certificate.data['28'].validationErrors.push(fakeCertificateValidationError())
  certificate.metadata.careUnitValidationErrors = [fakeCertificateValidationError()]
  certificate.metadata.patientValidationErrors = [fakeCertificateValidationError()]
  const result = sortedValidationErrorSummary(certificate)

  it('Should contain correct number of errors', () => {
    expect(result.length).toBe(4)
  })

  it('Should return validation errors on patients adress', () => {
    expect(result[0]).toEqual({ id: 'patientensadress', text: 'Patientens adressuppgifter', index: -1 })
  })

  it('Should return errors on question parent categories', () => {
    expect(result[1]).toEqual({ id: 'sysselsattning', text: 'Sysselsättning', index: 6 })
    expect(result[2]).toEqual({ id: 'funktionsnedsattning', text: 'Sjukdomens konsekvenser', index: 11 })
  })

  it('Should return errors on care unit', () => {
    expect(result[3]).toEqual({ id: 'vardenhetensadress', text: 'Vårdenhetens adress', index: -1 })
  })
})
