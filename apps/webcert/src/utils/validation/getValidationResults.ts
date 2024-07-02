import type { CertificateData, CertificateDataElement, CertificateDataValidation } from '../../types'
import { executeValidation } from './executeValidation'

export interface ValidationResult {
  element: CertificateDataElement
  result: boolean
  validation: CertificateDataValidation
}

export const getValidationResults = (data: CertificateData, element?: CertificateDataElement) =>
  element == null
    ? []
    : (element.validation ?? []).map(
        (validation): ValidationResult => ({
          element,
          result: executeValidation(validation, data),
          validation,
        })
      )
