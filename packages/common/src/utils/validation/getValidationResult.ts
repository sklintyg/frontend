import { CertificateData, CertificateDataValidation } from '../../types'
import { validateExpression } from './validateExpression'

export const getValidationResult = (validation: CertificateDataValidation, data: CertificateData, questionId: string): boolean => {
  const question = data[validation.questionId]

  if (validation.questions != null) {
    return validation.expressionType === 'OR'
      ? validation.questions.some((v) => getValidationResult(v, data, questionId))
      : validation.questions.every((v) => getValidationResult(v, data, questionId))
  }

  if (question && question.visible && validation.expression != null && question.value != null) {
    return validateExpression(validation.expression, question.value)
  }

  return false
}
