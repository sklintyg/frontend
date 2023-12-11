import { isEqual } from 'lodash-es'
import { CertificateDataValidation, CertificateDataValidationType } from '../../types'
import { ValidationResult } from './getValidationResults'

function resolvePriorityBetweenValidationTypes(result: ValidationResult, _: number, list: ValidationResult[]) {
  // HIDE validation has priority over SHOW when HIDE true
  if (result.validation.type === CertificateDataValidationType.SHOW_VALIDATION) {
    return !list.some(
      (validation) =>
        validation.validation.type === CertificateDataValidationType.HIDE_VALIDATION &&
        validation.element.id === result.element.id &&
        validation.result
    )
  }

  // SHOW validation has priority over HIDE when HIDE === false
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

const filterSameRule =
  (needle: ValidationResult) =>
  (result: ValidationResult): boolean => {
    return !(
      result.element.id === needle.element.id &&
      result.validation.type === needle.validation.type &&
      (result.validation.id === undefined || isEqual(getAffectedIds(result.validation), getAffectedIds(needle.validation)))
    )
  }

export const filterValidationResults = (validationResults: ValidationResult[]): ValidationResult[] =>
  validationResults.filter(resolvePriorityBetweenValidationTypes).reduce((result: ValidationResult[], current: ValidationResult) => {
    return shouldValidationRuleBeMerged(current.validation.type)
      ? [...result.filter(filterSameRule(current)), current]
      : [...result, current]
  }, [])
