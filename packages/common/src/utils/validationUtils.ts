import { epochDaysAdjustedToTimezone, ValueDateRange } from '@frontend/common'
import { isValid } from 'date-fns'
import { compileExpression, Options } from 'filtrex'
import {
  Certificate,
  CertificateData,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValidation,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateMetadata,
  CertificateStatus,
  ConfigTypes,
  ConfigUeCheckboxMultipleCodes,
  getValidDate,
  MaxDateValidation,
  ResourceLinkType,
  sortByIndex,
  ValidationError,
  ValidationErrorSummary,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDateRangeList,
  ValueDiagnosisList,
  ValueIcf,
  ValueText,
} from '..'

export const CARE_UNIT_ADDRESS_FIELD = 'grunddata.skapadAv.vardenhet.postadress'
export const CARE_UNIT_ZIP_CODE_FIELD = 'grunddata.skapadAv.vardenhet.postnummer'
export const CARE_UNIT_CITY_FIELD = 'grunddata.skapadAv.vardenhet.postort'
export const CARE_UNIT_PHONE_NUMBER_FIELD = 'grunddata.skapadAv.vardenhet.telefonnummer'
export const CARE_UNIT_ADDRESS_CATEGORY_TITLE_ID = 'vardenhetensadress'
export const CARE_UNIT_ADDRESS_CATEGORY_TITLE = 'Vårdenhetens adress'

export const parseExpression = (
  expression: string,
  element: CertificateDataElement,
  validationType: CertificateDataValidationType
): boolean => {
  if (element && !element.visible && element.id === '2.2') {
    return false
  }

  const adjustedExpression = getExpression(expression)

  function convertToValue(id: string, type: CertificateDataValidationType): number | undefined {
    const adjustedId = id.replace(/\$/g, '')

    switch (element.value?.type) {
      case CertificateDataValueType.TEXT: {
        const valueText = element.value as ValueText
        return valueText.id === adjustedId && valueText.text ? 1 : 0
      }
      case CertificateDataValueType.BOOLEAN: {
        const valueBoolean = element.value as ValueBoolean
        return type === CertificateDataValidationType.MANDATORY_VALIDATION
          ? valueBoolean.selected !== null && valueBoolean.selected !== undefined
            ? 1
            : 0
          : valueBoolean.selected
          ? 1
          : 0
      }
      case CertificateDataValueType.CODE_LIST: {
        const valueCodeList = element.value as ValueCodeList
        const code = valueCodeList.list.find((code) => code.id === adjustedId)
        return code ? 1 : 0
      }
      case CertificateDataValueType.DATE_RANGE_LIST: {
        const dateRangeList = (element.value as ValueDateRangeList).list

        if (shouldValidateDayDifference(adjustedId)) {
          return validateDayDifference(adjustedId, dateRangeList)
        }

        const dateRange = dateRangeList.find((dateR) => dateR.id === adjustedId)

        if (!dateRange || dateRange?.from === null || dateRange?.to === null) {
          return 0
        } else {
          const fromDate = getValidDate(dateRange.from)
          const toDate = getValidDate(dateRange.to)
          return isValid(fromDate) && isValid(toDate) ? 1 : 0
        }
      }
      case CertificateDataValueType.DATE: {
        const date = element.value as ValueDate
        if (adjustedId.includes('toEpochDay')) {
          const dateObj = getValidDate(date.date)
          if (dateObj) {
            return epochDaysAdjustedToTimezone(dateObj)
          } else {
            return undefined
          }
        }
        return date.date ? 1 : 0
      }
      case CertificateDataValueType.DATE_LIST: {
        const valueDateList = element.value as ValueDateList
        const date = valueDateList.list.find((date) => date.id === adjustedId)
        return date ? 1 : 0
      }
      case CertificateDataValueType.CODE: {
        const valueCode = element.value as ValueCode
        return valueCode.id === adjustedId ? 1 : 0
      }
      case CertificateDataValueType.DIAGNOSIS_LIST: {
        const valueDiagnosisList = element.value as ValueDiagnosisList
        const diagnosis = valueDiagnosisList.list.find(
          (d) => d.id === adjustedId && d.code !== undefined && d.code.length > 0 && d.description !== undefined && d.description.length > 0
        )
        return diagnosis ? 1 : 0
      }
      case CertificateDataValueType.ICF: {
        const valueIcf = element.value as ValueIcf
        return valueIcf.id === adjustedId && valueIcf.text ? 1 : 0
      }
      default: {
        return 0
      }
    }
  }

  const options: Options = {
    customProp: (id: string, _: unknown, type: CertificateDataValidationType): number | undefined => convertToValue(id, type),
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
    return differenceInDays(new Date(value.list[index].date as string), new Date()) <= validation.numberOfDays
  } else return true
}

const shouldValidateDayDifference = (adjustedId: string): boolean => {
  return adjustedId.includes('.')
}

const validateDayDifference = (adjustedId: string, dateRangeList: ValueDateRange[]): number => {
  const updatedAdjustedId = adjustedId.replace(/\.from/g, '').replace(/\.to/g, '')

  const dateRange = dateRangeList.find((dateR) => dateR.id === updatedAdjustedId)

  if (!dateRange) return 0

  let date

  if (adjustedId.includes('from')) {
    date = getValidDate(dateRange.from)
  } else if (adjustedId.includes('to')) {
    date = getValidDate(dateRange.to)
  }

  if (!date) return 0
  return differenceInDays(date, new Date()) + 1
}

const differenceInDays = (a: Date, b: Date) => {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}

export const validateExpressions = (certificate: Certificate, updated: CertificateDataElement): ValidationResult[] => {
  const validationResults: ValidationResult[] = []
  const data = certificate.data

  for (const id in data) {
    const validations = data[id].validation ?? []

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
            sameRuleTypeFound.result = validationResult.result ? validationResult.result : sameRuleTypeFound.result
          } else {
            currentValidationResults.push(validationResult)
          }

          return currentValidationResults
        }, [])
      )
    }
  }
  /**
   * HIDE_VALIDATION has priority over SHOW_VALIDATION
   */
  function resolvePriorityBetweenValidationTypes(validationResult: ValidationResult) {
    function hideValidationHasPriorityOverShow(validationResult: ValidationResult) {
      return validationResults.some(
        (value) => value.type === CertificateDataValidationType.HIDE_VALIDATION && value.id === validationResult.id
      )
    }

    if (validationResult.type === CertificateDataValidationType.SHOW_VALIDATION) {
      return !hideValidationHasPriorityOverShow(validationResult)
    }
    return true
  }

  return validationResults.filter((validationResult) => resolvePriorityBetweenValidationTypes(validationResult))
}

export const decorateCertificateWithInitialValues = (certificate: Certificate): void => {
  const data = certificate.data

  for (const id in data) {
    if (shouldBeReadOnly(certificate.metadata)) {
      data[id].readOnly = true
      data[id].visible = true
    } else if (shouldBeDisabled(certificate)) {
      validate(data, id)
      data[id].disabled = true
    } else {
      validate(data, id)
    }
  }
}

export const getValidationErrors = (validationErrors: ValidationError[], field: string): ValidationError[] => {
  return validationErrors.filter((error) => error.field === field)
}

export const getSortedValidationErrorSummary = (
  certificate: Certificate,
  clientValidationErrors: ValidationError[]
): ValidationErrorSummary[] => {
  const validationFilter = (parent: string) => (validation: ValidationErrorSummary) => validation.id === certificateData[parent].id
  let result: ValidationErrorSummary[] = []

  //Perhaps this could be simplified
  const certificateData = certificate.data
  for (const questionId in certificateData) {
    if (
      (certificateData[questionId].validationErrors && certificateData[questionId].validationErrors.length > 0) ||
      clientValidationErrors.some((v) => v.id === questionId)
    ) {
      if (certificateData[questionId].parent && certificateData[certificateData[questionId].parent].config.type === ConfigTypes.CATEGORY) {
        if (result.findIndex((validation) => validation.id === certificateData[certificateData[questionId].parent].id) === -1) {
          result = result.concat({
            id: certificateData[certificateData[questionId].parent].id,
            text: certificateData[certificateData[questionId].parent].config.text,
            index: certificateData[certificateData[questionId].parent].index,
          } as ValidationErrorSummary)
        }
      } else {
        let parent = certificateData[questionId].parent
        while (parent != null) {
          if (certificateData[parent].config.type === ConfigTypes.CATEGORY) {
            if (!result.find(validationFilter(parent))) {
              result = result.concat({
                id: certificateData[parent].id,
                text: certificateData[parent].config.text,
                index: certificateData[parent].index,
              } as ValidationErrorSummary)
            }
            break
          } else {
            parent = certificateData[parent].parent
          }
        }
      }
    }
  }

  result.sort(sortByIndex)

  result = addCareUnitValidationErrors(result, certificate.metadata.careUnitValidationErrors)

  return result
}

function addCareUnitValidationErrors(validationErrorSummary: ValidationErrorSummary[], careUnitValidationErrors?: ValidationError[]) {
  if (careUnitValidationErrors && careUnitValidationErrors.length > 0) {
    validationErrorSummary = validationErrorSummary.concat({
      id: CARE_UNIT_ADDRESS_CATEGORY_TITLE_ID,
      text: CARE_UNIT_ADDRESS_CATEGORY_TITLE,
    } as ValidationErrorSummary)
  }

  return validationErrorSummary
}

function shouldBeReadOnly(metadata: CertificateMetadata) {
  return metadata.status === CertificateStatus.SIGNED || metadata.status === CertificateStatus.REVOKED
}

function shouldBeDisabled(certificate: Certificate) {
  const { metadata, links } = certificate
  return (
    metadata.status === CertificateStatus.LOCKED ||
    metadata.status === CertificateStatus.LOCKED_REVOKED ||
    links.every((link) => link.type !== ResourceLinkType.EDIT_CERTIFICATE)
  )
}

export function setDisableForChildElement(data: CertificateData, validationResult: ValidationResult): void {
  const question = data[validationResult.id] as CertificateDataElement
  const updatedList = (question.config as ConfigUeCheckboxMultipleCodes).list.map((item) => {
    const isAffected = validationResult.affectedIds?.some((id: string) => item.id === id)
    if (isAffected) {
      item.disabled = validationResult.result
      if (item.disabled) {
        const index = (question.value as ValueCodeList).list.findIndex((value) => item.id === value.id)
        if (index !== -1) {
          ;(question.value as ValueCodeList).list.splice(index, 1)
        }
      }
    }

    return item
  })
  data[validationResult.id].config.list = updatedList
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

    if (validationResult.type === CertificateDataValidationType.MANDATORY_VALIDATION) {
      data[id].mandatory = !validationResult.result
    } else if (validationResult.type === CertificateDataValidationType.SHOW_VALIDATION) {
      data[id].visible = validationResult.result
    } else if (validationResult.type === CertificateDataValidationType.HIDE_VALIDATION) {
      if (validationResult.result) {
        data[id].visible = false
      }
    } else if (validationResult.type === CertificateDataValidationType.ENABLE_VALIDATION) {
      data[id].disabled = !validationResult.result
    } else if (validationResult.type === CertificateDataValidationType.HIGHLIGHT_VALIDATION) {
      if (validationResult.result) {
        data[id].style = CertificateDataElementStyleEnum.HIGHLIGHTED
      } else {
        data[id].style = CertificateDataElementStyleEnum.NORMAL
      }
    } else if (validationResult.type === CertificateDataValidationType.DISABLE_VALIDATION) {
      data[id].disabled = validationResult.result
    } else if (validationResult.type === CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION) {
      setDisableForChildElement(data, validationResult)
    }
  })
}

export const isShowAlways = (validationError: ValidationError): boolean => {
  if (validationError.type === 'INVALID_FORMAT' || validationError.type === 'OTHER') {
    return true
  } else {
    return false
  }
}
