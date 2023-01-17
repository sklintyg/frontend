import { Certificate, ValidationError, ConfigTypes, CertificateDataElement, CertificateData } from '../../types/certificate'
import { sortByIndex } from '../certificateUtils'

export interface ValidationErrorSummary {
  id: string
  text: string
  index: number
}

const getCategoryValidationErrors = (data: CertificateData, clientValidationErrors: ValidationError[]): ValidationErrorSummary[] => {
  const getParentCategory = (element: CertificateDataElement): CertificateDataElement | undefined => {
    let parent = element
    while (parent != null) {
      if (parent.config.type === ConfigTypes.CATEGORY) {
        return parent
      } else {
        parent = data[parent.parent]
      }
    }
  }

  return Object.values(data)
    .filter(
      ({ id, validationErrors }) => (validationErrors && validationErrors.length > 0) || clientValidationErrors.some((v) => v.id === id)
    )
    .reduce<ValidationErrorSummary[]>((result, element) => {
      const category = getParentCategory(element)
      if (category && !result.some(({ id }) => id === category.id)) {
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

export const sortedValidationErrorSummary = (
  certificate: Certificate,
  clientValidationErrors: ValidationError[]
): ValidationErrorSummary[] => {
  return [
    ...getPatientValidationErrors(certificate.metadata.patientValidationErrors),
    ...getCategoryValidationErrors(certificate.data, clientValidationErrors),
    ...getCareUnitValidationErrors(certificate.metadata.careUnitValidationErrors),
  ]
}
