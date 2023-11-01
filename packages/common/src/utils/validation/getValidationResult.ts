import { CertificateData, CertificateDataValidation } from '../../types'
import { validateExpression } from './validateExpression'

export const getValidationResult = (validation: CertificateDataValidation, data: CertificateData): boolean => {
  const element = data[validation.questionId]

  if (validation.questions != null) {
    return validation.expressionType === 'OR'
      ? validation.questions.some((v) => getValidationResult(v, data))
      : validation.questions.every((v) => getValidationResult(v, data))
  }

  if (element && element.visible && validation.expression != null && element.value != null) {
    return validateExpression(validation.expression, element.value)
  }

  return false
}
