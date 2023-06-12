import {
  AutoFillValidation,
  Certificate,
  CertificateDataElement,
  CertificateDataValidation,
  CertificateDataValidationType,
  validateExpressions,
  ValueType,
} from '@frontend/common'
import { AnyAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import {
  applyCertificateDataElementAutoFill,
  autoSaveCertificate,
  disableCertificateDataElement,
  enableCertificateDataElement,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  highlightCertificateDataElement,
  setDisabledCertificateDataChild,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  unstyleCertificateDataElement,
  validateCertificate,
  validateCertificateInFrontEnd,
  validateCertificateInFrontEndCompleted,
} from './certificateActions'

export const handleValidateCertificateInFrontEnd: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    const questionIdsToValidate = validate(getState().ui.uiCertificate.certificate, dispatch, action.payload)
    dispatch(validateCertificateInFrontEndCompleted())

    questionIdsToValidate.forEach((questionId) =>
      dispatch(validateCertificateInFrontEnd(getState().ui.uiCertificate.certificate.data[questionId]))
    )
  }

function getAutoFillValidation(validation: CertificateDataValidation): ValueType {
  const autoFillValidation = validation as AutoFillValidation
  return autoFillValidation.fillValue
}

function validate(certificate: Certificate, dispatch: Dispatch, update: CertificateDataElement): string[] {
  if (!certificate) {
    return []
  }

  const questionIdsToValidate = [] as string[]
  const validationResults = validateExpressions(certificate, update)
  validationResults.forEach((validationResult) => {
    const { result, type, id } = validationResult
    switch (type) {
      case CertificateDataValidationType.CATEGORY_MANDATORY_VALIDATION:
      case CertificateDataValidationType.MANDATORY_VALIDATION:
        if (result) {
          dispatch(hideCertificateDataElementMandatory(id))
        } else {
          dispatch(showCertificateDataElementMandatory(id))
        }
        break
      case CertificateDataValidationType.HIDE_VALIDATION:
        if (result) {
          dispatch(hideCertificateDataElement(id))
          if (certificate.data[id].visible) {
            questionIdsToValidate.push(id)
          }
        } else {
          dispatch(showCertificateDataElement(id))
          if (!certificate.data[id].visible) {
            questionIdsToValidate.push(id)
          }
        }
        break
      case CertificateDataValidationType.SHOW_VALIDATION:
        if (result) {
          dispatch(showCertificateDataElement(id))
          if (!certificate.data[id].visible) {
            questionIdsToValidate.push(id)
          }
        } else {
          dispatch(hideCertificateDataElement(id))
          if (certificate.data[id].visible) {
            questionIdsToValidate.push(id)
          }
        }
        break
      case CertificateDataValidationType.DISABLE_VALIDATION:
        if (result) {
          dispatch(disableCertificateDataElement(id))
        } else {
          dispatch(enableCertificateDataElement(id))
        }
        break
      case CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION:
        dispatch(setDisabledCertificateDataChild(validationResult))
        break
      case CertificateDataValidationType.ENABLE_VALIDATION:
        if (result) {
          dispatch(enableCertificateDataElement(id))
        } else {
          dispatch(disableCertificateDataElement(id))
        }
        break
      case CertificateDataValidationType.HIGHLIGHT_VALIDATION:
        if (result) {
          dispatch(highlightCertificateDataElement(id))
        } else {
          dispatch(unstyleCertificateDataElement(id))
        }
        break
      case CertificateDataValidationType.AUTO_FILL_VALIDATION:
        if (result && !_.isEqual(certificate.data[id].value, getAutoFillValidation(validationResult.validation))) {
          dispatch(applyCertificateDataElementAutoFill(validationResult))
          dispatch(validateCertificate(certificate))
          dispatch(autoSaveCertificate(certificate))
          questionIdsToValidate.push(id)
        }
        break
    }
  })
  return questionIdsToValidate
}
