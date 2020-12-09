import { isValid } from 'date-fns'
import { compileExpression, Options } from 'filtrex'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidation,
  CertificateDataValidationType,
  CertificateDataValueType,
  MandatoryValidation,
  ShowValidation,
  ValueBoolean,
  ValueCodeList,
  ValueText,
  ValueDateRangeList,
  getValidDate,
} from '..'

export const parseExpression = (
  expression: string,
  element: CertificateDataElement,
  validationType: CertificateDataValidationType
): boolean => {
  if (!expression) return false

  const adjustedExpression = expression.replace(/\|\|/g, 'or')

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

      case CertificateDataValueType.DATE_RANGE_LIST:
        const dateRangeList = (element.value as ValueDateRangeList).list
        const dateRange = dateRangeList.find((dateR) => dateR.id === adjustedId)

        if (!dateRange || dateRange?.from === null || dateRange?.to === null) {
          return 0
        } else {
          const fromDate = getValidDate(dateRange.from)
          const toDate = getValidDate(dateRange.to)
          return isValid(fromDate) && isValid(toDate) ? 1 : 0
        }

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
          result: parseExpression(validation.expression, data[validation.questionId], validation.type),
        }

        newValidationResults.push(validationResult)
      })

      validationResults.push(
        ...newValidationResults.reduce((currentValidationResults: ValidationResult[], validationResult: ValidationResult) => {
          const sameRuleTypeFound = currentValidationResults.find(
            (currentValidationResult) => currentValidationResult.type === validationResult.type
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
