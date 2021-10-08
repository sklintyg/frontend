import { isValid } from 'date-fns'
import { compileExpression, Options } from 'filtrex'
import {
  Certificate,
  CertificateData,
  CertificateDataElement,
  CertificateDataValidation,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateMetadata,
  CertificateStatus,
  getValidDate,
  MaxDateValidation,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDateList,
  ValueDateRangeList,
  ValueDiagnosisList,
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
          ? valueBoolean.selected !== null && valueBoolean.selected !== undefined
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

      case CertificateDataValueType.DATE_LIST:
        const valueDateList = element.value as ValueDateList
        const date = valueDateList.list.find((date) => date.id === adjustedId)
        return date ? 1 : 0

      case CertificateDataValueType.CODE:
        const valueCode = element.value as ValueCode
        return valueCode.id === adjustedId ? 1 : 0

      case CertificateDataValueType.DIAGNOSIS_LIST:
        const valueDiagnosisList = element.value as ValueDiagnosisList
        const diagnosis = valueDiagnosisList.list.find(
          (d) => d.id === adjustedId && d.code !== undefined && d.code.length > 0 && d.description !== undefined && d.description.length > 0
        )
        return diagnosis ? 1 : 0
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

const getResult = (validation: CertificateDataValidation, data: CertificateData, id: string): boolean => {
  if (validation.expression === undefined || validation.expression === null) {
    if (CertificateDataValidationType.MAX_DATE_VALIDATION) {
      return validateMaxDate(id, validation as MaxDateValidation, data)
    }
    return false
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

const validateMaxDate = (id: string, validation: MaxDateValidation, data: CertificateData): boolean => {
  const value = data[id].value as ValueDateList
  if (value === null || value.list === undefined || value.list === null) {
    return true
  }
  const index = value.list.findIndex((item) => item.id === validation.id)
  if (index !== -1) {
    return differenceInDays(new Date(value.list[index].date), new Date()) > validation.numberOfDays ? false : true
  } else return true
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

export const decorateCertificateWithInitialValues = (certificate: Certificate): void => {
  const data = certificate.data

  for (const id in data) {
    if (shouldBeReadOnly(certificate.metadata)) {
      data[id].readOnly = true
      data[id].visible = true
    } else if (shouldBeDisabled(certificate.metadata)) {
      validate(data, id)
      data[id].disabled = true
    } else {
      validate(data, id)
    }
  }
}

function shouldBeReadOnly(metadata: CertificateMetadata) {
  return metadata.status === CertificateStatus.SIGNED || metadata.status === CertificateStatus.REVOKED
}

function shouldBeDisabled(metadata: CertificateMetadata) {
  return metadata.status === CertificateStatus.LOCKED || metadata.status === CertificateStatus.LOCKED_REVOKED
}

function validate(data: CertificateData, id: string) {
  const validations = data[id].validation || []

  validations.forEach((validation) => {
    const validationResult: ValidationResult = {
      type: validation.type,
      id,
      affectedIds: validation.id as string[],
      result: getResult(validation, data, id),
    }

    if (validationResult.type == CertificateDataValidationType.MANDATORY_VALIDATION) {
      data[id].mandatory = !validationResult.result
    } else if (validationResult.type == CertificateDataValidationType.SHOW_VALIDATION) {
      data[id].visible = validationResult.result
    } else if (validationResult.type == CertificateDataValidationType.HIDE_VALIDATION) {
      if (validationResult.result) {
        data[id].visible = false
      }
    } else if (validationResult.type == CertificateDataValidationType.ENABLE_VALIDATION) {
      data[id].disabled = !validationResult.result
    }
  })
}
