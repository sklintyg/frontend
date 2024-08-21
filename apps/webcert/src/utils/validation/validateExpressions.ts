import { CertificateData, CertificateDataElement, CertificateDataValidation } from '../../types'
import { filterValidationResults } from './filterValidationResults'
import { ValidationResult, getValidationResults } from './getValidationResults'

const isAffected = (element: CertificateDataElement) => (validation: CertificateDataValidation) =>
  validation.questionId === element.id || validation.questions?.some(isAffected(element))

export function validateExpressions(data: CertificateData, updated: CertificateDataElement): ValidationResult[] {
  return filterValidationResults(
    Object.values(data)
      .filter((element) => (element.validation ?? []).some(isAffected(updated)))
      .map((element) => getValidationResults(data, element))
      .flat()
  )
}
