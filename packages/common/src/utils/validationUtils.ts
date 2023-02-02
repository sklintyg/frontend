import {
  AutoFillValidation,
  Certificate,
  CertificateData,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValidation,
  CertificateDataValidationType,
  CertificateMetadata,
  CertificateStatus,
  ConfigUeCheckboxMultipleCodes,
  MaxDateValidation,
  ResourceLinkType,
  ValidationError,
  ValueCodeList,
} from '..'
import { maxDateToExpression, validateExpression } from './validateExpression'

export const parseExpression = (
  expression: string,
  element: CertificateDataElement,
  validationType: CertificateDataValidationType
): boolean => {
  if (!element.visible || element.value == null) {
    return false
  }
  return validateExpression(expression, element.value, validationType)
}

export interface ValidationResult {
  type: CertificateDataValidationType
  id: string
  result: boolean
  affectedIds?: string[]
  validation: CertificateDataValidation
}

const getResult = (validation: CertificateDataValidation, data: CertificateData, questionId: string): boolean => {
  let question = data[validation.questionId]

  // TODO: remove hack for missing questionId in MAX_DATE_VALIDATION validation
  if (validation.type === CertificateDataValidationType.MAX_DATE_VALIDATION) {
    question = data[questionId]
  }

  if (validation.questions != null) {
    return validation.expressionType === 'OR'
      ? validation.questions.some((v) => getResult(v, data, questionId))
      : validation.questions.every((v) => getResult(v, data, questionId))
  }

  if (question) {
    if (validation.type === CertificateDataValidationType.MAX_DATE_VALIDATION) {
      return parseExpression(maxDateToExpression(validation as MaxDateValidation), question, validation.type)
    }

    if (validation.expression != null) {
      return parseExpression(validation.expression, question, validation.type)
    }
  }

  return false
}

const filterValidations = (validationResults: ValidationResult[]): ValidationResult[] => {
  function resolvePriorityBetweenValidationTypes(validationResult: ValidationResult) {
    function hideValidationHasPriorityOverShowIfHideTrue(validationResult: ValidationResult) {
      return validationResults.some(
        (value) => value.type === CertificateDataValidationType.HIDE_VALIDATION && value.id === validationResult.id && value.result
      )
    }

    function showValidationHasPriorityOverHideIfHideFalse(validationResult: ValidationResult) {
      return validationResults.some(
        (value) =>
          value.type === CertificateDataValidationType.SHOW_VALIDATION && value.id === validationResult.id && !validationResult.result
      )
    }

    if (validationResult.type === CertificateDataValidationType.SHOW_VALIDATION) {
      return !hideValidationHasPriorityOverShowIfHideTrue(validationResult)
    }
    if (validationResult.type === CertificateDataValidationType.HIDE_VALIDATION) {
      return !showValidationHasPriorityOverHideIfHideFalse(validationResult)
    }
    return true
  }

  function shouldValidationRuleBeMerged(validationType: CertificateDataValidationType) {
    return [
      CertificateDataValidationType.SHOW_VALIDATION,
      CertificateDataValidationType.HIDE_VALIDATION,
      CertificateDataValidationType.DISABLE_VALIDATION,
      CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
    ].find((type) => type === validationType)
  }

  function getSameRuleTypeFound(currentValidationResults: ValidationResult[], validationResult: ValidationResult) {
    return currentValidationResults.find(
      (currentValidationResult) =>
        currentValidationResult.id === validationResult.id &&
        currentValidationResult.type === validationResult.type &&
        (validationResult.affectedIds === undefined || currentValidationResult.affectedIds === validationResult.affectedIds)
    )
  }

  return validationResults
    .filter((validationResult) => resolvePriorityBetweenValidationTypes(validationResult))
    .reduce((currentValidationResults: ValidationResult[], validationResult: ValidationResult) => {
      if (!shouldValidationRuleBeMerged(validationResult.type)) {
        currentValidationResults.push(validationResult)
        return currentValidationResults
      }

      const sameRuleTypeFound = getSameRuleTypeFound(currentValidationResults, validationResult)
      if (sameRuleTypeFound) {
        sameRuleTypeFound.result = validationResult.result ? validationResult.result : sameRuleTypeFound.result
      } else {
        currentValidationResults.push(validationResult)
      }

      return currentValidationResults
    }, [])
}

export const validateExpressions = (certificate: Certificate, updated: CertificateDataElement): ValidationResult[] => {
  const validationResults: ValidationResult[] = []
  const data = certificate.data

  for (const id in data) {
    const validations = data[id].validation ?? []

    const needsValidation = validations.find(
      (validation) =>
        validation.questionId === updated.id || validation.questions?.some((validation) => validation.questionId === updated.id)
    )

    if (needsValidation) {
      validations.forEach((validation) => {
        const affectedId = typeof validation.id === 'string' ? [validation.id] : (validation.id as string[])
        const validationResult: ValidationResult = {
          type: validation.type,
          id,
          affectedIds: affectedId,
          result: getResult(validation, data, id),
          validation,
        }
        validationResults.push(validationResult)
      })
    }
  }

  return filterValidations(validationResults)
}

export const decorateCertificateWithInitialValues = (certificate: Certificate): void => {
  const data = certificate.data

  function setAsVisibleTrueAsDefault() {
    for (const id in data) {
      if (data[id].visible === undefined) {
        data[id].visible = true
      }
    }
  }

  setAsVisibleTrueAsDefault()

  for (const id in data) {
    if (shouldBeReadOnly(certificate.metadata)) {
      data[id].readOnly = true
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

export function autoFillElement(validation: CertificateDataValidation, question: CertificateDataElement): void {
  const autoFillValidation = validation as AutoFillValidation
  question.value = autoFillValidation.fillValue
}

function validate(data: CertificateData, id: string) {
  const validationResults: ValidationResult[] = []
  const validations = data[id].validation || []

  validations.forEach((validation) => {
    validationResults.push({
      type: validation.type,
      id,
      affectedIds: validation.id as string[],
      result: getResult(validation, data, id),
      validation,
    })
  })

  filterValidations(validationResults).forEach((validationResult) => {
    switch (validationResult.type) {
      case CertificateDataValidationType.CATEGORY_MANDATORY_VALIDATION:
      case CertificateDataValidationType.MANDATORY_VALIDATION:
        data[id].mandatory = !validationResult.result
        break
      case CertificateDataValidationType.SHOW_VALIDATION:
        data[id].visible = validationResult.result
        break
      case CertificateDataValidationType.HIDE_VALIDATION: {
        data[id].visible = !validationResult.result
        break
      }
      case CertificateDataValidationType.ENABLE_VALIDATION:
        data[id].disabled = !validationResult.result
        break
      case CertificateDataValidationType.HIGHLIGHT_VALIDATION: {
        if (validationResult.result) {
          data[id].style = CertificateDataElementStyleEnum.HIGHLIGHTED
        } else {
          data[id].style = CertificateDataElementStyleEnum.NORMAL
        }
        break
      }
      case CertificateDataValidationType.DISABLE_VALIDATION:
        data[id].disabled = validationResult.result
        break
      case CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION:
        setDisableForChildElement(data, validationResult)
        break
      case CertificateDataValidationType.AUTO_FILL_VALIDATION:
        if (validationResult.result) {
          autoFillElement(validationResult.validation, data[id])
        }
        break
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
