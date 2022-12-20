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
  ConfigTypes,
  ConfigUeCheckboxMultipleCodes,
  MaxDateValidation,
  ResourceLinkType,
  sortByIndex,
  ValidationError,
  ValidationErrorSummary,
  ValueCodeList,
} from '..'
import { maxDateToExpression, validateExpression } from './validateExpression'
import { ValueType } from '../types/certificate'

export const CARE_UNIT_ADDRESS_FIELD = 'grunddata.skapadAv.vardenhet.postadress'
export const CARE_UNIT_ZIP_CODE_FIELD = 'grunddata.skapadAv.vardenhet.postnummer'
export const CARE_UNIT_CITY_FIELD = 'grunddata.skapadAv.vardenhet.postort'
export const CARE_UNIT_PHONE_NUMBER_FIELD = 'grunddata.skapadAv.vardenhet.telefonnummer'
export const CARE_UNIT_ADDRESS_CATEGORY_TITLE_ID = 'vardenhetensadress'
export const CARE_UNIT_ADDRESS_CATEGORY_TITLE = 'Vårdenhetens adress'
export const PATIENT_STREET_FIELD = 'grunddata.patient.postadress'
export const PATIENT_ZIP_CODE_FIELD = 'grunddata.patient.postnummer'
export const PATIENT_CITY_FIELD = 'grunddata.patient.postort'
export const PATIENT_ADDRESS_CATEGORY_TITLE_ID = 'patientensadress'
export const PATIENT_ADDRESS_CATEGORY_TITLE = 'Patientens adressuppgifter'

export const parseExpression = (
  expression: string,
  element: CertificateDataElement,
  validationType: CertificateDataValidationType
): boolean => {
  if (!element.visible || element.value == null) {
    return false
  }
  return validateExpression(expression, element.value as ValueType, validationType)
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
    if (validation.expressionType === 'OR') {
      return validation.questions.some((v) => getResult(v, data, questionId))
    }
    return validation.questions.every((v) => getResult(v, data, questionId))
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
  result = addPatientValidationErrors(result, certificate.metadata.patientValidationErrors)

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

function addPatientValidationErrors(validationErrorSummary: ValidationErrorSummary[], patientValidationErrors?: ValidationError[]) {
  if (patientValidationErrors && patientValidationErrors.length > 0) {
    validationErrorSummary = [
      {
        id: PATIENT_ADDRESS_CATEGORY_TITLE_ID,
        text: PATIENT_ADDRESS_CATEGORY_TITLE,
      } as ValidationErrorSummary,
    ].concat(validationErrorSummary)
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
