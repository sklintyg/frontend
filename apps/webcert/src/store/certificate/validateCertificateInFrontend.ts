import {
  AutoFillValidation,
  Certificate,
  CertificateDataElement,
  CertificateDataValidation,
  CertificateDataValidationType,
  ValueType,
  validateExpressions,
} from '@frontend/common'
import { PayloadAction } from '@reduxjs/toolkit'
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
  (action: PayloadAction<CertificateDataElement>): void => {
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

  const questionIdsToValidate: string[] = []

  validateExpressions(certificate.data, update).forEach((validationResult) => {
    const { result, element, validation } = validationResult
    switch (validation.type) {
      case CertificateDataValidationType.CATEGORY_MANDATORY_VALIDATION:
      case CertificateDataValidationType.MANDATORY_VALIDATION:
        if (result) {
          dispatch(hideCertificateDataElementMandatory(element.id))
        } else {
          dispatch(showCertificateDataElementMandatory(element.id))
        }
        break
      case CertificateDataValidationType.HIDE_VALIDATION:
        if (result) {
          dispatch(hideCertificateDataElement(element.id))
          if (certificate.data[element.id].visible) {
            questionIdsToValidate.push(element.id)
          }
        } else {
          dispatch(showCertificateDataElement(element.id))
          if (!certificate.data[element.id].visible) {
            questionIdsToValidate.push(element.id)
          }
        }
        break
      case CertificateDataValidationType.SHOW_VALIDATION:
        if (result) {
          dispatch(showCertificateDataElement(element.id))
          if (!certificate.data[element.id].visible) {
            questionIdsToValidate.push(element.id)
          }
        } else {
          dispatch(hideCertificateDataElement(element.id))
          if (certificate.data[element.id].visible) {
            questionIdsToValidate.push(element.id)
          }
        }
        break
      case CertificateDataValidationType.DISABLE_VALIDATION:
        if (result) {
          dispatch(disableCertificateDataElement(element.id))
        } else {
          dispatch(enableCertificateDataElement(element.id))
        }
        break
      case CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION:
        dispatch(setDisabledCertificateDataChild(validationResult))
        break
      case CertificateDataValidationType.ENABLE_VALIDATION:
        if (result) {
          dispatch(enableCertificateDataElement(element.id))
        } else {
          dispatch(disableCertificateDataElement(element.id))
        }
        break
      case CertificateDataValidationType.HIGHLIGHT_VALIDATION:
        if (result) {
          dispatch(highlightCertificateDataElement(element.id))
        } else {
          dispatch(unstyleCertificateDataElement(element.id))
        }
        break
      case CertificateDataValidationType.AUTO_FILL_VALIDATION:
        if (result && !_.isEqual(certificate.data[element.id].value, getAutoFillValidation(validation))) {
          dispatch(applyCertificateDataElementAutoFill(validationResult))
          dispatch(validateCertificate(certificate))
          dispatch(autoSaveCertificate(certificate))
          questionIdsToValidate.push(element.id)
        }
        break
    }
  })
  return questionIdsToValidate
}
