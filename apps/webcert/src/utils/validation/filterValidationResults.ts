import { isEqual } from 'lodash-es'
import type { CertificateDataValidation, DisableSubElementValidation } from '../../types'
import { CertificateDataValidationType } from '../../types'
import type { ValidationResult } from './getValidationResults'

function resolvePriorityBetweenValidationTypes(result: ValidationResult, _: number, list: ValidationResult[]) {
  if (result.validation.type === CertificateDataValidationType.SHOW_VALIDATION) {
    return !list.some(
      (validation) =>
        validation.validation.type === CertificateDataValidationType.HIDE_VALIDATION &&
        validation.element.id === result.element.id &&
        validation.result
    )
  }
  if (result.validation.type === CertificateDataValidationType.HIDE_VALIDATION) {
    return !list.some(
      (validation) =>
        validation.validation.type === CertificateDataValidationType.SHOW_VALIDATION &&
        validation.element.id === result.element.id &&
        !result.result
    )
  }
  return true
}

const shouldValidationRuleBeMerged = (validationType: CertificateDataValidationType) =>
  [
    CertificateDataValidationType.SHOW_VALIDATION,
    CertificateDataValidationType.HIDE_VALIDATION,
    CertificateDataValidationType.DISABLE_VALIDATION,
  ].includes(validationType)

const getAffectedIds = (validation: CertificateDataValidation) => (typeof validation.id === 'string' ? [validation.id] : validation.id)

const mergeDisableSubElementValidation = (result: ValidationResult[], item: ValidationResult): ValidationResult[] => {
  const existing = result.find(
    (needle) => needle.validation.type === CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION && needle.result === item.result
  )
  const existingReverseResult = result.find(
    (needle) => needle.validation.type === CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION && needle.result !== item.result
  )
  const uniqueIds = [...new Set((getAffectedIds(item.validation) || []).concat(existing?.validation.id ?? []))]
  const filteredResult = result.filter((needle) => {
    if (item.result && existingReverseResult) {
      return needle !== existingReverseResult
    }
    return needle !== existing
  })

  if (item.result || (!item.result && !existingReverseResult)) {
    const itemResult = { ...item, validation: { ...(item.validation as DisableSubElementValidation), id: uniqueIds } }
    return [...filteredResult, itemResult]
  }

  return filteredResult
}

const mergeGenericValidation = (result: ValidationResult[], item: ValidationResult) => {
  const existingMatch =
    shouldValidationRuleBeMerged(item.validation.type) &&
    result.find(
      (needle) =>
        item.element.id === needle.element.id &&
        item.validation.type === needle.validation.type &&
        (needle.validation.id === undefined || isEqual(getAffectedIds(item.validation), getAffectedIds(needle.validation)))
    )

  const filteredResults = result.filter((entry) => entry !== existingMatch)
  const updatedResult = existingMatch ? existingMatch.result || item.result : item.result

  return [...filteredResults, { ...item, result: updatedResult }]
}

const mergeSameValidation = (result: ValidationResult[], item: ValidationResult) => {
  if (item.validation.type === CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION) {
    return mergeDisableSubElementValidation(result, item)
  }

  return mergeGenericValidation(result, item)
}

export const filterValidationResults = (validationResults: ValidationResult[]): ValidationResult[] =>
  validationResults.filter(resolvePriorityBetweenValidationTypes).reduce(mergeSameValidation, [])
