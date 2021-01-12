import { compileExpression, Options } from 'filtrex'
import {
  Certificate,
  CertificateData,
  CertificateDataElement,
  CertificateDataValidation,
  CertificateDataValidationType,
  CertificateDataValueType,
  MandatoryValidation,
  ShowValidation,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDateList,
  ValueText,
} from '..'

export const parseExpression = (
  expression: string,
  element: CertificateDataElement,
  validationType: CertificateDataValidationType
): boolean => {
  const adjustedExpression = getExpression(expression)

  function convertToValue(id: string, type: CertificateDataValidationType): number {
    const adjustedId = id.replace(/\$/g, '')

    switch (element.value!.type) {
      case CertificateDataValueType.TEXT:
        const valueText = element.value as ValueText
        return valueText.id === adjustedId && valueText.text ? 1 : 0

      case CertificateDataValueType.BOOLEAN:
        const valueBoolean = element.value as ValueBoolean
        return type === CertificateDataValidationType.MANDATORY_VALIDATION
          ? valueBoolean.selected !== null
            ? 1
            : 0
          : valueBoolean.selected
          ? 1
          : 0

      case CertificateDataValueType.CODE_LIST:
        const valueCodeList = element.value as ValueCodeList
        const code = valueCodeList.list.find((code) => code.id === adjustedId)
        return code ? 1 : 0

      case CertificateDataValueType.DATE_LIST:
        const valueDateList = element.value as ValueDateList
        const date = valueDateList.list.find((date) => date.id === adjustedId)
        return date ? 1 : 0

      case CertificateDataValueType.CODE:
        const valueCode = element.value as ValueCode
        return valueCode.id === adjustedId ? 1 : 0

      default:
        return 0
    }
  }

  const options: Options = {
    customProp: (id: string, _: any, type: CertificateDataValidationType): number => convertToValue(id, type),
  }

  const executeExpression = compileExpression(adjustedExpression, options)

  return executeExpression(validationType) ? true : false
}

export interface ValidationResult {
  type: CertificateDataValidationType
  id: string
  result: boolean
  affectedIds?: string[]
}

const getResult = (validation: CertificateDataValidation, data: CertificateData) => {
  if (validation.expression === undefined || validation.expression === null) {
    return true // TODO: Create validationType specific logic here
  } else {
    return parseExpression(validation.expression, data[validation.questionId], validation.type)
  }
}

const getExpression = (expression: string): string => {
  expression = expression.replace(/\|\|/g, 'or')
  expression = expression.replace(/&&/g, 'and')
  expression = expression.replace(/!/g, 'not ')
  return expression
}

export const validateExpressions = (certificate: Certificate, updated: CertificateDataElement): ValidationResult[] => {
  const validationResults: ValidationResult[] = []
  const data = certificate.data

  for (const id in data) {
    const validations = data[id].validation ? data[id].validation : []

    const needsValidation = validations.find((validation) => validation.questionId === updated.id)

    if (needsValidation) {
      const newValidationResults: ValidationResult[] = []

      validations.forEach((validation) => {
        const validationResult = {
          type: validation.type,
          id,
          affectedIds: validation.id,
          result: getResult(validation, data),
        }
        newValidationResults.push(validationResult)
      })

      validationResults.push(
        ...newValidationResults.reduce((currentValidationResults: ValidationResult[], validationResult: ValidationResult) => {
          const sameRuleTypeFound = currentValidationResults.find(
            (currentValidationResult) =>
              currentValidationResult.type === validationResult.type &&
              (validationResult.affectedIds === undefined || currentValidationResult.affectedIds === validationResult.affectedIds)
          )

          if (sameRuleTypeFound) {
            sameRuleTypeFound.result = sameRuleTypeFound.result && validationResult.result
          } else {
            currentValidationResults.push(validationResult)
          }

          return currentValidationResults
        }, [])
      )
    }
  }

  return validationResults
}
