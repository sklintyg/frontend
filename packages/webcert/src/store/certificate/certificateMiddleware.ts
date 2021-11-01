import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import {
  answerComplementCertificate,
  answerComplementCertificateError,
  answerComplementCertificateStarted,
  answerComplementCertificateSuccess,
  autoSaveCertificate,
  autoSaveCertificateCompleted,
  autoSaveCertificateError,
  autoSaveCertificateStarted,
  autoSaveCertificateSuccess,
  complementCertificate,
  complementCertificateError,
  complementCertificateStarted,
  complementCertificateSuccess,
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
  disableCertificateDataElement,
  enableCertificateDataElement,
  fakeSignCertificate,
  fakeSignCertificateSuccess,
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
  renewCertificate,
  renewCertificateCompleted,
  renewCertificateError,
  renewCertificateStarted,
  renewCertificateSuccess,
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
  sendCertificate,
  sendCertificateError,
  sendCertificateSuccess,
  setCertificateDataElement,
  setCertificateUnitData,
  setDisabledCertificateDataChild,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  showSpinner,
  showValidationErrors,
  signCertificateCompleted,
  signCertificateError,
  startSignCertificate,
  startSignCertificateSuccess,
  unhideCertificateDataElement,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateComplements,
  updateCertificateDataElement,
  updateCertificateEvents,
  updateCertificateSigningData,
  updateCertificateUnit,
  updateCertificateVersion,
  updateGotoCertificateDataElement,
  updateValidationErrors,
  validateCertificate,
  validateCertificateCompleted,
  validateCertificateError,
  validateCertificateInFrontEnd,
  validateCertificateInFrontEndCompleted,
  validateCertificateStarted,
  validateCertificateSuccess,
  highlightCertificateDataElement,
  unstyleCertificateDataElement,
} from './certificateActions'
import { apiCallBegan } from '../api/apiActions'
import { Certificate, CertificateDataElement, CertificateStatus, getCertificateToSave, SigningMethod } from '@frontend/common'
import { decorateCertificateWithInitialValues, validateExpressions } from '@frontend/common/src/utils/validationUtils'
import { CertificateDataValidationType } from '@frontend/common/src'
import { gotoComplement, updateComplements } from '../question/questionActions'

const handleGetCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Laddar...'))

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

  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(getCertificateCompleted())
  dispatch(hideSpinner())
  if (action.payload.certificate.metadata.status === CertificateStatus.UNSIGNED) {
    dispatch(validateCertificate(action.payload.certificate))
  }
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
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

  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(forwardCertificateCompleted())
  dispatch(validateCertificate(action.payload.certificate))
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleSendCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!sendCertificate.match(action)) {
    return
  }

  const certificate: Certificate = getState().ui.uiCertificate.certificate
  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/send',
      method: 'POST',
      onSuccess: sendCertificateSuccess.type,
      onError: sendCertificateError.type,
    })
  )
}

const handleSendCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!sendCertificateSuccess.match(action)) {
    return
  }

  if (action.payload.result === 'OK') {
    dispatch(getCertificate(action.payload.certificateId))
  }
}

const handleStartSignCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!startSignCertificate.match(action)) {
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

  const signingMethod = getState().ui.uiUser.user.signingMethod

  if (signingMethod === SigningMethod.FAKE) {
    dispatch(fakeSignCertificate)
  } else if (signingMethod === SigningMethod.DSS) {
    dispatch(
      apiCallBegan({
        url: `/api/signature/${certificate.metadata.type}/${certificate.metadata.id}/${certificate.metadata.version}/signeringshash/SIGN_SERVICE`,
        method: 'POST',
        onSuccess: startSignCertificateSuccess.type,
        onError: signCertificateError.type,
      })
    )
  }
}

const handleStartSignCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!startSignCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCertificateSigningData(action.payload))
}

const handleFakeSignCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!fakeSignCertificate.match(action)) {
    return
  }

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(showSpinner('Signerar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/sign',
      method: 'POST',
      data: certificate,
      onSuccess: fakeSignCertificateSuccess.type,
      onError: signCertificateError.type,
    })
  )
}

const handleFakeSignCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!fakeSignCertificateSuccess.match(action)) {
    return
  }

  dispatch(hideValidationErrors())
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(signCertificateCompleted())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
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

  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(revokeCertificateCompleted())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleComplementCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!complementCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Kompletterar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/complement',
      method: 'POST',
      data: {
        message: action.payload,
      },
      onStart: complementCertificateStarted.type,
      onSuccess: complementCertificateSuccess.type,
      onError: complementCertificateError.type,
    })
  )
}

const handleComplementCertificateSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!complementCertificateSuccess.match(action)) {
    return
  }

  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(validateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleAnswerComplementCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!answerComplementCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Besvarar kompletterar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/answercomplement',
      method: 'POST',
      data: {
        message: action.payload,
      },
      onStart: answerComplementCertificateStarted.type,
      onSuccess: answerComplementCertificateSuccess.type,
      onError: answerComplementCertificateError.type,
    })
  )
}

const handleAnswerComplementCertificateSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!answerComplementCertificateSuccess.match(action)) {
    return
  }

  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
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

const handleRenewCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!renewCertificate.match(action)) {
    return
  }

  dispatch(showSpinner('Förnyar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/renew',
      method: 'POST',
      onStart: renewCertificateStarted.type,
      onSuccess: renewCertificateSuccess.type,
      onError: renewCertificateError.type,
      onArgs: { history: action.payload },
    })
  )
}

const handleRenewCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!renewCertificateSuccess.match(action)) {
    return
  }

  dispatch(hideSpinner())
  dispatch(renewCertificateCompleted())
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
      url: '/api/certificate/' + certificate.metadata.id,
      method: 'PUT',
      data: getCertificateToSave(certificate),
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

const handleUpdateComplements: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateComplements.match(action)) {
    return
  }

  dispatch(updateCertificateComplements(action.payload))
}

const handleGotoComplement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!gotoComplement.match(action)) {
    return
  }

  dispatch(updateGotoCertificateDataElement(action.payload))
}

const handlePrintCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!printCertificate.match(action)) {
    return
  }

  const printUrl = `/moduleapi/intyg/${action.payload.type}/${action.payload.id}/pdf`
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

      case CertificateDataValidationType.HIDE_VALIDATION:
        if (result.result) {
          dispatch(hideCertificateDataElement(result.id))
        } else {
          dispatch(unhideCertificateDataElement(result.id))
        }
        break

      case CertificateDataValidationType.SHOW_VALIDATION:
        if (result.result) {
          dispatch(showCertificateDataElement(result.id))
        } else {
          dispatch(hideCertificateDataElement(result.id))
        }
        break

      case CertificateDataValidationType.DISABLE_VALIDATION:
        dispatch(setDisabledCertificateDataChild(result))
        break

      case CertificateDataValidationType.ENABLE_VALIDATION:
        if (result.result) {
          dispatch(enableCertificateDataElement(result.id))
        } else {
          dispatch(disableCertificateDataElement(result.id))
        }
        break

      case CertificateDataValidationType.HIGHLIGHT_VALIDATION:
        if (result.result) {
          dispatch(highlightCertificateDataElement(result.id))
        } else {
          dispatch(unstyleCertificateDataElement(result.id))
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
  handleStartSignCertificate,
  handleStartSignCertificateSuccess,
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
  handleRenewCertificate,
  handleRenewCertificateSuccess,
  handleReplaceCertificate,
  handleReplaceCertificateSuccess,
  handleForwardCertificate,
  handleForwardCertificateSuccess,
  handleCopyCertificate,
  handleCopyCertificateSuccess,
  handleSendCertificate,
  handleSendCertificateSuccess,
  handleUpdateComplements,
  handleGotoComplement,
  handleComplementCertificate,
  handleComplementCertificateSuccess,
  handleAnswerComplementCertificate,
  handleAnswerComplementCertificateSuccess,
  handleFakeSignCertificate,
  handleFakeSignCertificateSuccess,
]
