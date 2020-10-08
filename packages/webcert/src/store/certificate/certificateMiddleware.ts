import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import {
  autoSaveCertificate,
  autoSaveCertificateCompleted,
  autoSaveCertificateError,
  autoSaveCertificateStarted,
  autoSaveCertificateSuccess,
  deleteCertificate,
  deleteCertificateCompleted,
  deleteCertificateError,
  deleteCertificateStarted,
  deleteCertificateSuccess,
  getCertificate,
  getCertificateCompleted,
  getCertificateError,
  getCertificateEvents,
  getCertificateEventsCompleted,
  getCertificateEventsError,
  getCertificateEventsStarted,
  getCertificateEventsSuccess,
  getCertificateStarted,
  getCertificateSuccess,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  hideSpinner,
  hideValidationErrors,
  printCertificate,
  replaceCertificate,
  replaceCertificateCompleted,
  replaceCertificateError,
  replaceCertificateStarted,
  replaceCertificateSuccess,
  revokeCertificate,
  revokeCertificateCompleted,
  revokeCertificateError,
  revokeCertificateStarted,
  revokeCertificateSuccess,
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
  updateCertificateAsDeleted,
  updateCertificateAsReadOnly,
  updateCertificateDataElement,
  updateCertificateEvents,
  updateCertificateStatus,
  updateCertificateUnit,
  updateCertificateVersion,
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
    dispatch(loginUser({ type: getCertificate.type, payload: action.payload }))
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload,
      method: 'GET',
      onStart: getCertificateStarted.type,
      onSuccess: getCertificateSuccess.type,
      onError: getCertificateError.type,
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
  dispatch(getCertificateEvents(action.payload.metadata.certificateId))
}

const handleGetCertificateEvents: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificateEvents.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload + '/events',
      method: 'GET',
      onStart: getCertificateEventsStarted.type,
      onSuccess: getCertificateEventsSuccess.type,
      onError: getCertificateEventsError.type,
    })
  )
}

const handleGetCertificateEventsSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificateEventsSuccess.match(action)) {
    return
  }

  dispatch(updateCertificateEvents(action.payload.certificateEvents))
  dispatch(getCertificateEventsCompleted())
}

const handleDeleteCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!deleteCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Laddar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: `/api/certificate/${action.payload}/${certificate.metadata.version}`,
      method: 'DELETE',
      onStart: deleteCertificateStarted.type,
      onSuccess: deleteCertificateSuccess.type,
      onError: deleteCertificateError.type,
    })
  )
}

const handleDeleteCertificateSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!deleteCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCertificateAsDeleted())
  dispatch(hideSpinner())
  dispatch(deleteCertificateCompleted())
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
      onSuccess: signCertificateSuccess.type,
      onError: signCertificateError.type,
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
  dispatch(getCertificateEvents(action.payload.metadata.certificateId))
}

const handleRevokeCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!revokeCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Makulerar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.certificateId + '/revoke',
      method: 'POST',
      data: action.payload,
      onStart: revokeCertificateStarted.type,
      onSuccess: revokeCertificateSuccess.type,
      onError: revokeCertificateError.type,
    })
  )
}

const handleRevokeCertificateSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!revokeCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCertificateStatus(CertificateStatus.INVALIDATED))
  dispatch(hideSpinner())
  dispatch(revokeCertificateCompleted())
  const certificate: Certificate = getState().ui.uiCertificate.certificate
  dispatch(getCertificateEvents(certificate.metadata.certificateId))
}

const handleReplaceCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!replaceCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Ersätter...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.certificateId + '/replace',
      method: 'POST',
      data: {
        certificateType: certificate.metadata.certificateType,
        patientId: certificate.metadata.patient.personId,
      },
      onStart: replaceCertificateStarted.type,
      onSuccess: replaceCertificateSuccess.type,
      onError: replaceCertificateError.type,
      onArgs: { history: action.payload },
    })
  )
}

const handleReplaceCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!replaceCertificateSuccess.match(action)) {
    return
  }

  dispatch(hideSpinner())
  dispatch(replaceCertificateCompleted())
  action.payload.history.push(`/certificate/${action.payload.certificateId}`)
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

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.certificateId,
      method: 'PUT',
      data: certificate,
      onStart: autoSaveCertificateStarted.type,
      onSuccess: autoSaveCertificateSuccess.type,
      onError: autoSaveCertificateError.type,
    })
  )
}

const handleAutoSaveCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!autoSaveCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCertificateVersion(action.payload.version))

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
      onStart: validateCertificateStarted.type,
      onSuccess: validateCertificateSuccess.type,
      onError: validateCertificateError.type,
    })
  )
}

const handleValidateCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!validateCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateValidationErrors(action.payload.validationErrors))
  dispatch(validateCertificateCompleted())
}

const handlePrintCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!printCertificate.match(action)) {
    return
  }

  const printUrl = `http://localhost:9088/moduleapi/intyg/${action.payload.certificateType}/${action.payload.certificateId}/pdf`
  window.open(printUrl, '_self')
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
  handleGetCertificateEvents,
  handleGetCertificateEventsSuccess,
  handleSignCertificate,
  handleSignCertificateSuccess,
  handleUpdateCertificateDataElement,
  handleValidateCertificateInFrontEnd,
  handleValidateCertificate,
  handleValidateCertificateSuccess,
  handleAutoSaveCertificate,
  handleAutoSaveCertificateSuccess,
  handleUpdateCertificateUnit,
  handleDeleteCertificate,
  handleDeleteCertificateSuccess,
  handlePrintCertificate,
  handleRevokeCertificate,
  handleRevokeCertificateSuccess,
  handleReplaceCertificate,
  handleReplaceCertificateSuccess,
]
