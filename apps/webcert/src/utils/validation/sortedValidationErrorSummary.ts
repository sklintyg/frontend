import type { Certificate, CertificateData, CertificateDataElement, ValidationError } from '../../types/certificate'
import { ConfigTypes } from '../../types/certificate'
import { sortByIndex } from '../certificateUtils'

export interface ValidationErrorSummary {
  id: string
  text: string
  index: number
}

const getCategoryValidationErrors = (data: CertificateData): ValidationErrorSummary[] => {
  const getCategory = (el: CertificateDataElement): CertificateDataElement | undefined => {
    return el ? (el.config.type === ConfigTypes.CATEGORY ? el : getCategory(data[el.parent])) : undefined
  }

  return Object.values(data)
    .filter(({ validationErrors }) => validationErrors && validationErrors.length > 0)
    .reduce<ValidationErrorSummary[]>((result, element) => {
      const category = getCategory(element)
      if (category && !result.find(({ id }) => id === category.id)) {
        return [...result, { id: category.id, text: category.config.text, index: category.index }]
      }
      return result
    }, [])
    .sort(sortByIndex)
}

const getCareUnitValidationErrors = (careUnitValidationErrors?: ValidationError[]): ValidationErrorSummary[] => {
  if (careUnitValidationErrors && careUnitValidationErrors.length > 0) {
    return [
      {
        id: 'vardenhetensadress',
        text: 'Vårdenhetens adress',
        index: -1,
      },
    ]
  }
  return []
}

function getPatientValidationErrors(patientValidationErrors?: ValidationError[]): ValidationErrorSummary[] {
  if (patientValidationErrors && patientValidationErrors.length > 0) {
    return [
      {
        id: 'patientensadress',
        text: 'Patientens adressuppgifter',
        index: -1,
      },
    ]
  }
  return []
}

export const sortedValidationErrorSummary = (certificate: Certificate): ValidationErrorSummary[] => {
  return [
    ...getPatientValidationErrors(certificate.metadata.patientValidationErrors),
    ...getCategoryValidationErrors(certificate.data),
    ...getCareUnitValidationErrors(certificate.metadata.careUnitValidationErrors),
  ]
}
