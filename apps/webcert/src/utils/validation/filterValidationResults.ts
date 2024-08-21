import { isEqual } from 'lodash-es'
import { CertificateDataValidation, CertificateDataValidationType } from '../../types'
import { ValidationResult } from './getValidationResults'

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
    CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
  ].includes(validationType)

const getAffectedIds = (validation: CertificateDataValidation) => (typeof validation.id === 'string' ? [validation.id] : validation.id)

const mergeSameValidation = (result: ValidationResult[], item: ValidationResult) => {
  const existing =
    shouldValidationRuleBeMerged(item.validation.type) &&
    result.find(
      (needle) =>
        item.element.id === needle.element.id &&
        item.validation.type === needle.validation.type &&
        (needle.validation.id === undefined || isEqual(getAffectedIds(item.validation), getAffectedIds(needle.validation)))
    )

  return [...result.filter((needle) => needle !== existing), { ...item, result: existing ? existing.result || item.result : item.result }]
}

export const filterValidationResults = (validationResults: ValidationResult[]): ValidationResult[] =>
  validationResults.filter(resolvePriorityBetweenValidationTypes).reduce(mergeSameValidation, [])
