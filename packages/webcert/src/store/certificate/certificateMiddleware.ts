import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import {
  autoSaveCertificate,
  autoSaveCertificateCompleted,
  autoSaveCertificateError,
  autoSaveCertificateStarted,
  autoSaveCertificateSuccess,
  getCertificate,
  getCertificateCompleted,
  getCertificateError,
  getCertificateStarted,
  getCertificateSuccess,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  hideSpinner,
  hideValidationErrors,
  setCertificateDataElement,
  setCertificateUnitData,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  showSpinner,
  showValidationErrors,
  signCertificate,
  signCertificateCompleted,
  signCertificateError,
  signCertificateSuccess,
  updateCertificate,
  updateCertificateAsReadOnly,
  updateCertificateDataElement,
  updateCertificateStatus,
  updateCertificateUnit,
  updateValidationErrors,
  validateCertificate,
  validateCertificateCompleted,
  validateCertificateError,
  validateCertificateInFrontEnd,
  validateCertificateInFrontEndCompleted,
  validateCertificateStarted,
  validateCertificateSuccess,
} from './certificateActions'
import { apiCallBegan } from '../api/apiActions'
import {
  Certificate,
  CertificateBooleanValue,
  CertificateDataElement,
  CertificateDataValueType,
  CertificateStatus,
  CertificateTextValue,
} from '@frontend/common'
import { loginUser } from '../user/userActions'

const handleGetCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Laddar...'))

  // TODO: Replace this hack with implementation to handle user session.
  if (!getState().ui.uiUser.userLoggedIn) {
    dispatch(
      loginUser(function() {
        const certificateId = action.payload
        return getCertificate(certificateId)
      })
    )
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload,
      method: 'GET',
      data: {
        id: action.payload,
      },
      onStart: getCertificateStarted,
      onSuccess: getCertificateSuccess,
      onError: getCertificateError,
    })
  )
}

const handleGetCertificateSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCertificate(action.payload))
  dispatch(getCertificateCompleted())
  dispatch(hideSpinner())
  if (action.payload.metadata.certificateStatus === CertificateStatus.UNSIGNED) {
    dispatch(validateCertificate(action.payload))
  }
}

const handleSignCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!signCertificate.match(action)) {
    return
  }

  const certificate: Certificate = getState().ui.uiCertificate.certificate
  for (const questionId in certificate.data) {
    if (
      certificate.data[questionId].visible &&
      certificate.data[questionId].validationErrors &&
      certificate.data[questionId].validationErrors.length > 0
    ) {
      dispatch(showValidationErrors())
      return
    }
  }

  dispatch(showSpinner('Signerar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.certificateId + '/sign',
      method: 'POST',
      data: certificate,
      onSuccess: signCertificateSuccess,
      onError: signCertificateError,
    })
  )
}

const handleSignCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!signCertificateSuccess.match(action)) {
    return
  }

  dispatch(hideValidationErrors())
  dispatch(updateCertificate(action.payload))
  dispatch(hideSpinner())
  dispatch(signCertificateCompleted())
}

const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!updateCertificateDataElement.match(action)) {
    return
  }

  dispatch(setCertificateDataElement(action.payload))
  dispatch(validateCertificateInFrontEnd(action.payload))
  const certificate = getState().ui.uiCertificate.certificate
  dispatch(validateCertificate(certificate))
  dispatch(autoSaveCertificate(certificate))
}

const handleUpdateCertificateUnit: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!updateCertificateUnit.match(action)) {
    return
  }

  dispatch(setCertificateUnitData(action.payload))
  const certificate = getState().ui.uiCertificate.certificate
  dispatch(validateCertificate(certificate))
  dispatch(autoSaveCertificate(certificate))
}

const handleAutoSaveCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!autoSaveCertificate.match(action)) {
    return
  }

  const certificate = getState().ui.uiCertificate.certificate
  console.log(certificate)
  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.certificateId,
      method: 'PUT',
      data: certificate,
      onStart: autoSaveCertificateStarted,
      onSuccess: autoSaveCertificateSuccess,
      onError: autoSaveCertificateError,
    })
  )
}

const handleAutoSaveCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!autoSaveCertificateSuccess.match(action)) {
    return
  }

  dispatch(autoSaveCertificateCompleted())
}

const handleValidateCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!validateCertificate.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload.metadata.certificateId + '/validate',
      method: 'POST',
      data: action.payload,
      onStart: validateCertificateStarted,
      onSuccess: validateCertificateSuccess,
      onError: validateCertificateError,
    })
  )
}

const handleValidateCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!validateCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateValidationErrors(action.payload))
  dispatch(validateCertificateCompleted())
}

const handleValidateCertificateInFrontEnd: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!validateCertificateInFrontEnd.match(action)) {
    return
  }

  validate(getState().ui.uiCertificate.certificate, dispatch, action.payload)

  dispatch(validateCertificateInFrontEndCompleted())
}

function validate(certificate: Certificate, dispatch: Dispatch, update: CertificateDataElement): void {
  if (!certificate) {
    return
  }

  validateHideExpressions(certificate, dispatch, update)

  validateMandatory(certificate, dispatch, update)
}

function validateHideExpressions(certificate: Certificate, dispatch: Dispatch, update: CertificateDataElement): void {
  const dataProp = certificate.data[update.id].config.prop
  for (const questionId in certificate.data) {
    const question = certificate.data[questionId]
    if (question.validation && question.validation.hideExpression && question.validation.hideExpression.includes(dataProp)) {
      switch (update.value.type) {
        case CertificateDataValueType.BOOLEAN:
          const booleanValue = (update.value as CertificateBooleanValue).selected
          if (booleanValue && !question.visible) {
            dispatch(showCertificateDataElement(questionId))
          } else if (!booleanValue && question.visible) {
            dispatch(hideCertificateDataElement(questionId))
          }
          break
        case CertificateDataValueType.TEXT:
          const textValue = (update.value as CertificateTextValue).text
          if (textValue != null && textValue.length > 0) {
            dispatch(showCertificateDataElement(questionId))
          } else if (question.visible) {
            dispatch(hideCertificateDataElement(questionId))
          }
          break
        default:
          break
      }
    }
  }
}

function validateMandatory(certificate: Certificate, dispatch: Dispatch<AnyAction>, update: CertificateDataElement): void {
  const question = certificate.data[update.id]
  if (question.validation && question.validation.required) {
    switch (update.value.type) {
      case 'BOOLEAN':
        const booleanValue = (update.value as CertificateBooleanValue).selected
        if (booleanValue === null) {
          dispatch(showCertificateDataElementMandatory(question.id))
        } else if (question.mandatory) {
          dispatch(hideCertificateDataElementMandatory(question.id))
        }
        break
      case 'TEXT':
        const textValue = (update.value as CertificateTextValue).text
        if (textValue === null || textValue.length === 0) {
          dispatch(hideCertificateDataElementMandatory(question.id))
        } else if (question.mandatory) {
          dispatch(hideCertificateDataElementMandatory(question.id))
        }
        break
      default:
        break
    }
  }
}

export const certificateMiddleware = [
  handleGetCertificate,
  handleGetCertificateSuccess,
  handleSignCertificate,
  handleSignCertificateSuccess,
  handleUpdateCertificateDataElement,
  handleValidateCertificateInFrontEnd,
  handleValidateCertificate,
  handleValidateCertificateSuccess,
  handleAutoSaveCertificate,
  handleAutoSaveCertificateSuccess,
  handleUpdateCertificateUnit,
]
