import { CertificateData, CertificateDataElement } from '../../types'
import { executeValidation } from './executeValidation'
import { ValidationResult } from './types'

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
