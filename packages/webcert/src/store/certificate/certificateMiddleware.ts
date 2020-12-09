import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import {
  autoSaveCertificate,
  autoSaveCertificateCompleted,
  autoSaveCertificateError,
  autoSaveCertificateStarted,
  autoSaveCertificateSuccess,
  copyCertificate,
  copyCertificateCompleted,
  copyCertificateError,
  copyCertificateStarted,
  copyCertificateSuccess,
  deleteCertificate,
  deleteCertificateCompleted,
  deleteCertificateError,
  deleteCertificateStarted,
  deleteCertificateSuccess,
  forwardCertificate,
  forwardCertificateCompleted,
  forwardCertificateError,
  forwardCertificateStarted,
  forwardCertificateSuccess,
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
  updateCertificateDataElement,
  updateCertificateEvents,
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
import { Certificate, CertificateDataElement, CertificateStatus } from '@frontend/common'
import { loginUser } from '../user/userActions'
import { validateExpressions, ValidationResult } from '@frontend/common/src/utils/validationUtils'
import { CertificateDataValidationType } from '@frontend/common/src'

const handleGetCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Laddar...'))

  // TODO: Replace this hack with implementation to handle user session.
  if (!getState().ui.uiUser.userLoggedIn) {
    dispatch(loginUser({ redirectAction: { type: getCertificate.type, payload: action.payload } }))
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
  if (action.payload.metadata.status === CertificateStatus.UNSIGNED) {
    dispatch(validateCertificate(action.payload))
  }
  dispatch(getCertificateEvents(action.payload.metadata.id))
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

  dispatch(showSpinner('Raderar...'))

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

const handleForwardCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!forwardCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Vidarebefodrar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: `/api/certificate/${certificate.metadata.id}/${certificate.metadata.version}/forward`,
      method: 'POST',
      data: {
        forward: action.payload,
      },
      onStart: forwardCertificateStarted.type,
      onSuccess: forwardCertificateSuccess.type,
      onError: forwardCertificateError.type,
    })
  )
}

const handleForwardCertificateSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!forwardCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCertificate(action.payload))
  dispatch(hideSpinner())
  dispatch(forwardCertificateCompleted())
  dispatch(validateCertificate(action.payload))
  dispatch(getCertificateEvents(action.payload.metadata.id))
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
      url: '/api/certificate/' + certificate.metadata.id + '/sign',
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
  dispatch(getCertificateEvents(action.payload.metadata.id))
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
      url: '/api/certificate/' + certificate.metadata.id + '/revoke',
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

  dispatch(updateCertificate(action.payload))
  dispatch(hideSpinner())
  dispatch(revokeCertificateCompleted())
  dispatch(getCertificateEvents(action.payload.metadata.id))
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
      url: '/api/certificate/' + certificate.metadata.id + '/replace',
      method: 'POST',
      data: {
        certificateType: certificate.metadata.type,
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

const handleCopyCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!copyCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Kopierar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/copy',
      method: 'POST',
      data: {
        certificateType: certificate.metadata.type,
        patientId: certificate.metadata.patient.personId,
      },
      onStart: copyCertificateStarted.type,
      onSuccess: copyCertificateSuccess.type,
      onError: copyCertificateError.type,
      onArgs: { history: action.payload },
    })
  )
}

const handleCopyCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!copyCertificateSuccess.match(action)) {
    return
  }

  dispatch(hideSpinner())
  dispatch(copyCertificateCompleted())
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
      url: '/api/certificate/' + action.payload.metadata.id + '/validate',
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

  const printUrl = `http://localhost:9088/moduleapi/intyg/${action.payload.type}/${action.payload.id}/pdf`
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

  const validationResults = validateExpressions(certificate, update)
  validationResults.forEach((result) => {
    switch (result.type) {
      case CertificateDataValidationType.MANDATORY_VALIDATION:
        if (result.result) {
          dispatch(hideCertificateDataElementMandatory(result.id))
        } else {
          dispatch(showCertificateDataElementMandatory(result.id))
        }
        break

      case CertificateDataValidationType.SHOW_VALIDATION:
        if (result.result) {
          dispatch(showCertificateDataElement(result.id))
        } else {
          dispatch(hideCertificateDataElement(result.id))
        }
        break
    }
  })
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
  handleForwardCertificate,
  handleForwardCertificateSuccess,
  handleCopyCertificate,
  handleCopyCertificateSuccess,
]
