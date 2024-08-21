import { CertificateData, CertificateDataValidation } from '../../types'
import { validateExpression } from './validateExpression'

export const executeValidation = (validation: CertificateDataValidation, data: CertificateData): boolean => {
  const element = data[validation.questionId]

  if (validation.questions != null) {
    return validation.expressionType === 'OR'
      ? validation.questions.some((v) => executeValidation(v, data))
      : validation.questions.every((v) => executeValidation(v, data))
  }

  if (element && (element.visible ?? true) && validation.expression != null && element.value != null) {
    return validateExpression(validation.expression, element.value)
  }

  return false
}
