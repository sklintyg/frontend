import { CertificateData, CertificateDataElement } from '../../types'
import { filterValidationResults } from './filterValidationResults'
import { getValidationResults } from './getValidationResults'
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
      .map((element) => getValidationResults(data, element))
      .flat()
  )
}
