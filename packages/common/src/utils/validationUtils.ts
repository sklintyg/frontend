import { compileExpression, Options } from 'filtrex'
import {
  Certificate,
  CertificateData,
  CertificateDataElement,
  CertificateDataValidation,
  CertificateDataValidationType,
  CertificateDataValueType,
  DateValidation,
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

const getResult = (validation: CertificateDataValidation, data: CertificateData, id: string) => {
  if (validation.expression === undefined || validation.expression === null) {
    if (CertificateDataValidationType.MAX_DATE_VALIDATION) {
      return validateMaxDate(id, validation as DateValidation, data)
    }
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

const validateMaxDate = (id: string, validation: DateValidation, data: CertificateData) => {
  const value = data[id].value as ValueDateList
  if (value.list === undefined || value.list === null) {
    return 1
  }
  const index = value.list.findIndex((item) => item.id === validation.id)
  if (index !== -1) {
    return differenceInDays(new Date(value.list[index].date), new Date()) > validation.numberOfDays ? 0 : 1
  } else return 1
}

const differenceInDays = (a: Date, b: Date) => {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
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
        const validationResult: ValidationResult = {
          type: validation.type,
          id,
          affectedIds: validation.id as string[],
          result: getResult(validation, data, id),
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
