import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import {
  addClientValidationError,
  answerComplementCertificate,
  answerComplementCertificateStarted,
  answerComplementCertificateSuccess,
  autoSaveCertificate,
  autoSaveCertificateCompleted,
  autoSaveCertificateError,
  autoSaveCertificateStarted,
  autoSaveCertificateSuccess,
  certificateApiGenericError,
  complementCertificate,
  complementCertificateStarted,
  complementCertificateSuccess,
  copyCertificate,
  copyCertificateCompleted,
  copyCertificateStarted,
  copyCertificateSuccess,
  createCertificateFromCandidate,
  createCertificateFromCandidateStarted,
  createCertificateFromCandidateSuccess,
  createCertificateFromTemplate,
  createCertificateFromTemplateStarted,
  createCertificateFromTemplateSuccess,
  deleteCertificate,
  deleteCertificateCompleted,
  deleteCertificateStarted,
  deleteCertificateSuccess,
  disableCertificateDataElement,
  enableCertificateDataElement,
  fakeSignCertificate,
  fakeSignCertificateSuccess,
  forwardCertificate,
  forwardCertificateCompleted,
  forwardCertificateStarted,
  forwardCertificateSuccess,
  getCertificate,
  getCertificateCompleted,
  getCertificateEvents,
  getCertificateEventsCompleted,
  getCertificateEventsStarted,
  getCertificateEventsSuccess,
  getCertificateStarted,
  getCertificateSuccess,
  getVisibleValidationErrors,
  hideCertificateDataElement,
  hideCertificateDataElementMandatory,
  hideSpinner,
  hideValidationErrors,
  highlightCertificateDataElement,
  printCertificate,
  readyForSign,
  readyForSignCompleted,
  readyForSignStarted,
  readyForSignSuccess,
  removeClientValidationError,
  renewCertificate,
  renewCertificateCompleted,
  renewCertificateStarted,
  renewCertificateSuccess,
  replaceCertificate,
  replaceCertificateCompleted,
  replaceCertificateStarted,
  replaceCertificateSuccess,
  revokeCertificate,
  revokeCertificateCompleted,
  revokeCertificateStarted,
  revokeCertificateSuccess,
  sendCertificate,
  sendCertificateSuccess,
  setCertificateDataElement,
  setCertificateUnitData,
  setDisabledCertificateDataChild,
  setReadyForSign,
  setValidationErrorsForQuestion,
  showCertificateDataElement,
  showCertificateDataElementMandatory,
  showSpinner,
  showValidationErrors,
  signCertificateCompleted,
  startSignCertificate,
  startSignCertificateSuccess,
  toggleCertificateFunctionDisabler,
  unhideCertificateDataElement,
  unstyleCertificateDataElement,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateComplements,
  updateCertificateDataElement,
  updateCertificateEvents,
  updateCertificateSigningData,
  updateCertificateUnit,
  updateCertificateVersion,
  updateClientValidationError,
  updateGotoCertificateDataElement,
  updateRoutedFromDeletedCertificate,
  updateValidationErrors,
  validateCertificate,
  validateCertificateCompleted,
  validateCertificateError,
  validateCertificateInFrontEnd,
  validateCertificateInFrontEndCompleted,
  validateCertificateStarted,
  validateCertificateSuccess,
} from './certificateActions'
import { apiCallBegan, apiGenericError } from '../api/apiActions'
import { Certificate, CertificateDataElement, CertificateStatus, getCertificateToSave, SigningMethod } from '@frontend/common'
import { decorateCertificateWithInitialValues, validateExpressions } from '@frontend/common/src/utils/validationUtils'
import { CertificateDataValidationType, ValidationError } from '@frontend/common/src'
import { gotoComplement, updateComplements } from '../question/questionActions'
import { throwError } from '../error/errorActions'
import _ from 'lodash'
import { createConcurrencyErrorRequestFromApiError, createErrorRequestFromApiError } from '../error/errorCreator'

const handleGetCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(showSpinner('Laddar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload,
      method: 'GET',
      onStart: getCertificateStarted.type,
      onSuccess: getCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      onArgs: { certificateId: action.payload },
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleGetCertificateSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(getCertificateCompleted())
  dispatch(hideSpinner())
  if (action.payload.certificate.metadata.status === CertificateStatus.UNSIGNED) {
    dispatch(validateCertificate(action.payload.certificate))
  }
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleGetCertificateEvents: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload + '/events',
      method: 'GET',
      onStart: getCertificateEventsStarted.type,
      onSuccess: getCertificateEventsSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const handleGetCertificateEventsSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(updateCertificateEvents(action.payload.certificateEvents))
  dispatch(getCertificateEventsCompleted())
}

const handleDeleteCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(showSpinner('Raderar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: `/api/certificate/${action.payload.certificateId}/${certificate.metadata.version}`,
      method: 'DELETE',
      onStart: deleteCertificateStarted.type,
      onSuccess: deleteCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      onArgs: { history: action.payload.history, metadata: certificate.metadata },
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleDeleteCertificateSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  if (action.payload.metadata.relations?.parent?.certificateId) {
    dispatch(updateRoutedFromDeletedCertificate(true))
    action.payload.history.push(`/certificate/${action.payload.metadata.relations.parent.certificateId}`)
  } else {
    dispatch(updateCertificateAsDeleted())
    dispatch(hideSpinner())
  }
  dispatch(deleteCertificateCompleted())
}

const handleForwardCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
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
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleForwardCertificateSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(forwardCertificateCompleted())
  dispatch(validateCertificate(action.payload.certificate))
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleReadyForSign: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: `/api/certificate/${certificate.metadata.id}/readyforsign`,
      method: 'POST',
      onStart: readyForSignStarted.type,
      onSuccess: readyForSignSuccess.type,
      onError: apiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleReadyForSignSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  if (!readyForSignSuccess.match(action)) {
    return
  }
  if (action.payload.certificate.metadata.readyForSign) {
    dispatch(setReadyForSign(action.payload.certificate.metadata.readyForSign))
    dispatch(updateCertificateVersion(action.payload.certificate.metadata.version))
  }
  dispatch(readyForSignCompleted())
}

const handleSendCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  const certificate: Certificate = getState().ui.uiCertificate.certificate
  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/send',
      method: 'POST',
      onSuccess: sendCertificateSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const handleSendCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  if (action.payload.result === 'OK') {
    dispatch(getCertificate(action.payload.certificateId))
  }
}

const handleStartSignCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
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
        onError: apiGenericError.type,
        functionDisablerType: toggleCertificateFunctionDisabler.type,
      })
    )
  }
}

const handleStartSignCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateCertificateSigningData(action.payload))
}

const handleFakeSignCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(showSpinner('Signerar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/sign',
      method: 'POST',
      data: certificate,
      onSuccess: fakeSignCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleFakeSignCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(hideValidationErrors())
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(signCertificateCompleted())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleRevokeCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(showSpinner('Makulerar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/revoke',
      method: 'POST',
      data: action.payload,
      onStart: revokeCertificateStarted.type,
      onSuccess: revokeCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleRevokeCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(revokeCertificateCompleted())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleComplementCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(showSpinner('Kompletterar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/complement',
      method: 'POST',
      data: {
        message: action.payload.message,
      },
      onStart: complementCertificateStarted.type,
      onSuccess: complementCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      onArgs: { history: action.payload.history },
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleComplementCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(hideSpinner())
  action.payload.history.push(`/certificate/${action.payload.certificate.metadata.id}`)
}

const handleAnswerComplementCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
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
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleAnswerComplementCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleReplaceCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
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
      onError: certificateApiGenericError.type,
      onArgs: { history: action.payload },
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleReplaceCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(hideSpinner())
  dispatch(replaceCertificateCompleted())
  action.payload.history.push(`/certificate/${action.payload.certificateId}`)
}

const handleRenewCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(showSpinner('Förnyar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/renew',
      method: 'POST',
      onStart: renewCertificateStarted.type,
      onSuccess: renewCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      onArgs: { history: action.payload },
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleRenewCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(hideSpinner())
  dispatch(renewCertificateCompleted())
  action.payload.history.push(`/certificate/${action.payload.certificateId}`)
}

const handleCreateCertificateFromTemplate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Laddar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/template',
      method: 'POST',
      onStart: createCertificateFromTemplateStarted.type,
      onSuccess: createCertificateFromTemplateSuccess.type,
      onError: certificateApiGenericError.type,
      onArgs: { history: action.payload },
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleCreateCertificateFromTemplateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  action.payload.history.push(`/certificate/${action.payload.certificateId}`)
}

const handleCreateCertificateFromCandidate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  dispatch(showSpinner('Laddar...'))

  const certificate: Certificate = getState().ui.uiCertificate.certificate

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/candidate',
      method: 'POST',
      onStart: createCertificateFromCandidateStarted.type,
      onSuccess: createCertificateFromCandidateSuccess.type,
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleCreateCertificateFromCandidateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(getCertificate(action.payload.certificateId))
}

const handleCopyCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
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
      onError: certificateApiGenericError.type,
      onArgs: { history: action.payload },
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleCopyCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(hideSpinner())
  dispatch(copyCertificateCompleted())
  action.payload.history.push(`/certificate/${action.payload.certificateId}`)
}

const handleGenericCertificateApiError: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(hideSpinner())
  dispatch(throwError(createErrorRequestFromApiError(action.payload.error, action.payload.certificateId)))
}

const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  dispatch(setCertificateDataElement(action.payload))
  dispatch(validateCertificateInFrontEnd(action.payload))
  const certificate = getState().ui.uiCertificate.certificate
  dispatch(validateCertificate(certificate))
  dispatch(autoSaveCertificate(certificate))
}

const handleUpdateCertificateUnit: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(setCertificateUnitData(action.payload))
  const certificate = getState().ui.uiCertificate.certificate
  dispatch(validateCertificate(certificate))
  dispatch(autoSaveCertificate(certificate))
}

const autoSaving = _.debounce(({ dispatch, getState }: MiddlewareAPI) => {
  const certificate = getState().ui.uiCertificate.certificate
  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id,
      method: 'PUT',
      data: getCertificateToSave(certificate),
      onStart: autoSaveCertificateStarted.type,
      onSuccess: autoSaveCertificateSuccess.type,
      onError: autoSaveCertificateError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}, 1000)

const handleAutoSaveCertificate: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => () => (): void => {
  autoSaving(middlewareAPI)
}

const handleAutoSaveCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateCertificateVersion(action.payload.version))

  dispatch(autoSaveCertificateCompleted())
}

const handleAutoSaveCertificateError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  if (!autoSaveCertificateError.match(action)) {
    return
  }
  dispatch(autoSaveCertificateCompleted())

  if (action.payload.error.errorCode === 'UNKNOWN_INTERNAL_PROBLEM') {
    dispatch(throwError(createConcurrencyErrorRequestFromApiError(action.payload.error)))
  } else {
    dispatch(throwError(createErrorRequestFromApiError(action.payload.error)))
  }
}

const validating = _.debounce(({ dispatch, getState }: MiddlewareAPI) => {
  const certificate = getState().ui.uiCertificate.certificate
  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/validate',
      method: 'POST',
      data: getCertificateToSave(certificate),
      onStart: validateCertificateStarted.type,
      onSuccess: validateCertificateSuccess.type,
      onError: validateCertificateError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}, 1000)

const handleValidateCertificate: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => () => (): void => {
  middlewareAPI.dispatch(validateCertificateStarted())
  validating(middlewareAPI)
}

const handleValidateCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateValidationErrors(action.payload.validationErrors))
  dispatch(validateCertificateCompleted())
}

const handleUpdateComplements: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateCertificateComplements(action.payload))
}

const handleGotoComplement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateGotoCertificateDataElement(action.payload))
}

const handlePrintCertificate: Middleware<Dispatch> = () => () => (action: AnyAction): void => {
  const printUrl = `/moduleapi/intyg/${action.payload.type}/${action.payload.id}/pdf`
  window.open(printUrl, 'printTargetIFrame')
}

const handleValidateCertificateInFrontEnd: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  validate(getState().ui.uiCertificate.certificate, dispatch, action.payload)

  dispatch(validateCertificateInFrontEndCompleted())
}

const handleUpdateClientValidationError: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  const currentValidationErrors = [...getState().ui.uiCertificate.clientValidationErrors]
  if (!currentValidationErrors) {
    return
  }
  const duplicatedValidationIndex = currentValidationErrors.findIndex(
    (v: ValidationError) =>
      v.type === action.payload.validationError.type &&
      v.id === action.payload.validationError.id &&
      v.text === action.payload.validationError.text &&
      v.field === action.payload.validationError.field
  )
  if (duplicatedValidationIndex !== -1) {
    if (action.payload.shouldBeRemoved) {
      dispatch(
        removeClientValidationError(duplicatedValidationIndex)
        // setValidationErrorsForQuestion({
        //   questionId: action.payload.validationError.id,
        //   validationErrors: currentValidationErrors.splice(duplicatedValidationIndex, 1),
        // })
      )
    }
  } else if (!action.payload.shouldBeRemoved) {
    dispatch(
      addClientValidationError(action.payload.validationError)
      // setValidationErrorsForQuestion({
      //   questionId: action.payload.validationError.id,
      //   validationErrors: [...currentValidationErrors, action.payload.validationError],
      // })
    )
  }
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

const middlewareMethods = {
  [getCertificate.type]: handleGetCertificate,
  [getCertificateSuccess.type]: handleGetCertificateSuccess,
  [getCertificateEvents.type]: handleGetCertificateEvents,
  [getCertificateEventsSuccess.type]: handleGetCertificateEventsSuccess,
  [startSignCertificate.type]: handleStartSignCertificate,
  [startSignCertificateSuccess.type]: handleStartSignCertificateSuccess,
  [updateCertificateDataElement.type]: handleUpdateCertificateDataElement,
  [validateCertificateInFrontEnd.type]: handleValidateCertificateInFrontEnd,
  [validateCertificate.type]: handleValidateCertificate,
  [validateCertificateSuccess.type]: handleValidateCertificateSuccess,
  [autoSaveCertificate.type]: handleAutoSaveCertificate,
  [autoSaveCertificateSuccess.type]: handleAutoSaveCertificateSuccess,
  [autoSaveCertificateError.type]: handleAutoSaveCertificateError,
  [updateCertificateUnit.type]: handleUpdateCertificateUnit,
  [deleteCertificate.type]: handleDeleteCertificate,
  [deleteCertificateSuccess.type]: handleDeleteCertificateSuccess,
  [printCertificate.type]: handlePrintCertificate,
  [revokeCertificate.type]: handleRevokeCertificate,
  [revokeCertificateSuccess.type]: handleRevokeCertificateSuccess,
  [renewCertificate.type]: handleRenewCertificate,
  [renewCertificateSuccess.type]: handleRenewCertificateSuccess,
  [createCertificateFromTemplate.type]: handleCreateCertificateFromTemplate,
  [createCertificateFromTemplateSuccess.type]: handleCreateCertificateFromTemplateSuccess,
  [createCertificateFromCandidate.type]: handleCreateCertificateFromCandidate,
  [createCertificateFromCandidateSuccess.type]: handleCreateCertificateFromCandidateSuccess,
  [replaceCertificate.type]: handleReplaceCertificate,
  [replaceCertificateSuccess.type]: handleReplaceCertificateSuccess,
  [forwardCertificate.type]: handleForwardCertificate,
  [forwardCertificateSuccess.type]: handleForwardCertificateSuccess,
  [readyForSign.type]: handleReadyForSign,
  [readyForSignSuccess.type]: handleReadyForSignSuccess,
  [copyCertificate.type]: handleCopyCertificate,
  [copyCertificateSuccess.type]: handleCopyCertificateSuccess,
  [sendCertificate.type]: handleSendCertificate,
  [sendCertificateSuccess.type]: handleSendCertificateSuccess,
  [updateComplements.type]: handleUpdateComplements,
  [gotoComplement.type]: handleGotoComplement,
  [complementCertificate.type]: handleComplementCertificate,
  [complementCertificateSuccess.type]: handleComplementCertificateSuccess,
  [answerComplementCertificate.type]: handleAnswerComplementCertificate,
  [answerComplementCertificateSuccess.type]: handleAnswerComplementCertificateSuccess,
  [fakeSignCertificate.type]: handleFakeSignCertificate,
  [fakeSignCertificateSuccess.type]: handleFakeSignCertificateSuccess,
  [certificateApiGenericError.type]: handleGenericCertificateApiError,
  [updateClientValidationError.type]: handleUpdateClientValidationError,
}

export const certificateMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
