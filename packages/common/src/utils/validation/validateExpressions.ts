import { CertificateData, CertificateDataElement } from '../../types'
import { filterValidationResults } from './filterValidationResults'
import { getValidationResult } from './getValidationResult'
import { ValidationResult } from './types'

export function validateExpressions(data: CertificateData, updated: CertificateDataElement): ValidationResult[] {
  return filterValidationResults(
    Object.values(data)
      .filter((element) =>
        (element.validation ?? []).some(
          (validation) =>
            validation.questionId === updated.id || validation.questions?.some((validation) => validation.questionId === updated.id)
        )
      )
      .map((element): ValidationResult[] =>
        (element.validation ?? []).map((validation) => ({ element, result: getValidationResult(validation, data), validation }))
      )
      .flat()
  )
}
