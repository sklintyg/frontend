import { CertificateSignStatus, CertificateStatus, getCertificateToSave, getClientValidationErrors, SigningMethod } from '@frontend/common'
import { decorateCertificateWithInitialValues } from '@frontend/common/src/utils/validationUtils'
import { AnyAction } from '@reduxjs/toolkit'
import { push } from 'connected-react-router'
import _ from 'lodash'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { apiCallBegan, apiGenericError } from '../api/apiActions'
import { throwError } from '../error/errorActions'
import { createConcurrencyErrorRequestFromApiError, createErrorRequestFromApiError } from '../error/errorCreator'
import { ErrorCode, ErrorType } from '../error/errorReducer'
import { gotoComplement, updateComplements } from '../question/questionActions'
import { getSessionStatusError } from '../session/sessionActions'
import { AppDispatch, RootState } from '../store'
import {
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
  createCertificateFromCandidateWithMessage,
  createCertificateFromCandidateWithMessageStarted,
  createCertificateFromCandidateWithMessageSuccess,
  createCertificateFromTemplate,
  createCertificateFromTemplateStarted,
  createCertificateFromTemplateSuccess,
  createNewCertificate,
  createNewCertificateStarted,
  createNewCertificateSuccess,
  deleteCertificate,
  deleteCertificateCompleted,
  deleteCertificateStarted,
  deleteCertificateSuccess,
  fakeSignCertificate,
  fakeSignCertificateSuccess,
  forwardCertificate,
  forwardCertificateCompleted,
  forwardCertificateStarted,
  forwardCertificateSuccess,
  getCertificate,
  getCertificateCompleted,
  getCertificateError,
  getCertificateEvents,
  getCertificateEventsCompleted,
  getCertificateEventsStarted,
  getCertificateEventsSuccess,
  getCertificateStarted,
  getCertificateSuccess,
  hideSpinner,
  hideValidationErrors,
  printCertificate,
  readyForSign,
  readyForSignCompleted,
  readyForSignStarted,
  readyForSignSuccess,
  renewCertificate,
  renewCertificateCompleted,
  renewCertificateStarted,
  renewCertificateSuccess,
  replaceCertificate,
  replaceCertificateCompleted,
  replaceCertificateStarted,
  replaceCertificateSuccess,
  resetCertificateState,
  revokeCertificate,
  revokeCertificateCompleted,
  revokeCertificateStarted,
  revokeCertificateSuccess,
  sendCertificate,
  sendCertificateSuccess,
  setCertificateDataElement,
  setCertificatePatientData,
  setCertificateUnitData,
  setReadyForSign,
  setValidationErrorsForQuestion,
  showRelatedCertificate,
  showRelatedCertificateCompleted,
  showRelatedCertificateStarted,
  showRelatedCertificateSuccess,
  showSpinner,
  showValidationErrors,
  signCertificateCompleted,
  signCertificateStatusError,
  signCertificateStatusSuccess,
  startSignCertificate,
  startSignCertificateSuccess,
  toggleCertificateFunctionDisabler,
  updateCertificate,
  updateCertificateAsDeleted,
  updateCertificateComplements,
  updateCertificateDataElement,
  updateCertificateEvents,
  updateCertificatePatient,
  updateCertificateSigningData,
  updateCertificateSignStatus,
  updateCertificateUnit,
  updateCertificateVersion,
  updateCreatedCertificateId,
  updateGotoCertificateDataElement,
  updateModalData,
  updateRoutedFromDeletedCertificate,
  updateValidationErrors,
  validateCertificate,
  validateCertificateCompleted,
  validateCertificateError,
  validateCertificateInFrontEnd,
  validateCertificateStarted,
  validateCertificateSuccess,
} from './certificateActions'
import { handleValidateCertificateInFrontEnd } from './validateCertificateInFrontend'

const handleGetCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Laddar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload,
      method: 'GET',
      onStart: getCertificateStarted.type,
      onSuccess: getCertificateSuccess.type,
      onError: getCertificateError.type,
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
  dispatch(updateCertificateSignStatus(CertificateSignStatus.INITIAL))
}

const handleGetCertificateError: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  let errorCode
  if (
    action.payload.error.errorCode === ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET.toString() ||
    action.payload.error.errorCode === ErrorCode.DATA_NOT_FOUND.toString()
  ) {
    errorCode = action.payload.error.errorCode
  } else {
    errorCode = ErrorCode.GET_CERTIFICATE_PROBLEM
  }

  dispatch(
    throwError({
      type: ErrorType.ROUTE,
      errorCode: errorCode,
      message: action.payload.error.message,
      certificateId: action.payload.certificateId,
    })
  )
}

const handleGetCertificateEvents: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
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

const handleDeleteCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Raderar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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
    dispatch(push(`/certificate/${action.payload.metadata.relations.parent.certificateId}`))
  } else {
    dispatch(updateCertificateAsDeleted())
    dispatch(hideSpinner())
  }
  dispatch(deleteCertificateCompleted())
}

const handleForwardCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Vidarebefordrar...'))

  dispatch(
    apiCallBegan({
      url: `/api/certificate/${action.payload.certificateId}/forward`,
      method: 'POST',
      data: {
        forward: action.payload.forward,
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

const handleReadyForSign: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleSendCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/send',
      method: 'POST',
      onSuccess: sendCertificateSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const handleSendCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  if (action.payload.result === 'OK') {
    dispatch(getCertificate(action.payload.certificateId))
  }
}

const handleStartSignCertificate: Middleware<Dispatch> = ({
  dispatch,
  getState,
}: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

  for (const questionId in certificate?.data) {
    if (
      certificate.data[questionId].visible &&
      certificate.data[questionId].validationErrors &&
      certificate.data[questionId].validationErrors.length > 0
    ) {
      dispatch(showValidationErrors())
      return
    }
  }

  if (certificate?.metadata?.careUnitValidationErrors != null && certificate.metadata.careUnitValidationErrors.length > 0) {
    dispatch(showValidationErrors())
    return
  }

  if (certificate?.metadata?.patientValidationErrors != null && certificate.metadata.patientValidationErrors.length > 0) {
    dispatch(showValidationErrors())
    return
  }

  const signingMethod = getState().ui.uiUser.user?.signingMethod

  switch (signingMethod) {
    case SigningMethod.FAKE:
      dispatch(fakeSignCertificate)
      break
    case SigningMethod.DSS:
      dispatch(
        apiCallBegan({
          url: `/api/signature/${certificate.metadata.type}/${certificate.metadata.id}/${certificate.metadata.version}/signeringshash/SIGN_SERVICE`,
          method: 'POST',
          onSuccess: startSignCertificateSuccess.type,
          onError: signCertificateStatusError.type,
          functionDisablerType: toggleCertificateFunctionDisabler.type,
        })
      )
      break
    case SigningMethod.BANK_ID:
      dispatch(
        apiCallBegan({
          url: `/api/signature/${certificate.metadata.type}/${certificate.metadata.id}/${certificate.metadata.version}/signeringshash/GRP`,
          method: 'POST',
          onSuccess: startSignCertificateSuccess.type,
          onError: signCertificateStatusError.type,
          functionDisablerType: toggleCertificateFunctionDisabler.type,
        })
      )
      break
  }
}

const handleSignCertificateStatusSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  const certificate = getState().ui.uiCertificate.certificate
  const signStatus: CertificateSignStatus = getState().ui.uiCertificate.signingStatus

  if (action.payload?.status) {
    dispatch(updateCertificateSignStatus(action.payload.status))
  }

  if (!certificate) {
    return
  }

  switch (signStatus) {
    case CertificateSignStatus.UNKNOWN:
    case CertificateSignStatus.SIGNED:
      dispatch(signCertificateCompleted())
      dispatch(getCertificate(certificate.metadata.id))
      break
    default:
      setTimeout(
        () =>
          dispatch(
            apiCallBegan({
              url: `/api/signature/${certificate.metadata.type}/${action.payload.id}/signeringsstatus`,
              method: 'GET',
              onSuccess: signCertificateStatusSuccess.type,
              onError: signCertificateStatusError.type,
              functionDisablerType: toggleCertificateFunctionDisabler.type,
            })
          ),
        1000
      )
      break
  }
}

const handleSignCertificateStatusError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action
): void => {
  dispatch(hideSpinner())
  dispatch(
    throwError({
      type: ErrorType.MODAL,
      errorCode: ErrorCode.SIGN_CERTIFICATE_ERROR,
      message: action.payload.error.message,
      certificateId: action.payload.certificateId,
    })
  )
  dispatch(updateCertificateSignStatus(CertificateSignStatus.INITIAL))
}

const handleStartSignCertificateSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

  if (action.payload?.status === CertificateSignStatus.PROCESSING) {
    dispatch(updateCertificateSignStatus(action.payload.status))

    dispatch(
      apiCallBegan({
        url: `/api/signature/${certificate.metadata.type}/${action.payload.id}/signeringsstatus`,
        method: 'GET',
        onSuccess: signCertificateStatusSuccess.type,
        onError: signCertificateStatusError.type,
        functionDisablerType: toggleCertificateFunctionDisabler.type,
      })
    )
  } else {
    dispatch(updateCertificateSigningData(action.payload))
  }
}

const handleFakeSignCertificate: Middleware<Dispatch> = ({
  dispatch,
  getState,
}: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

  dispatch(showSpinner('Signerar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/sign',
      method: 'POST',
      data: certificate,
      onSuccess: fakeSignCertificateSuccess.type,
      onError: signCertificateStatusError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleFakeSignCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideValidationErrors())
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(signCertificateCompleted())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleRevokeCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Makulerar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/revoke',
      method: 'POST',
      data: { reason: action.payload.reason, message: action.payload.title + ' ' + action.payload.message },
      onStart: revokeCertificateStarted.type,
      onSuccess: revokeCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleRevokeCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(revokeCertificateCompleted())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleComplementCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Kompletterar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleComplementCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(push(`/certificate/${action.payload.certificate.metadata.id}`))
}

const handleAnswerComplementCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Besvarar kompletterar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleAnswerComplementCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  decorateCertificateWithInitialValues(action.payload.certificate)
  dispatch(updateCertificate(action.payload.certificate))
  dispatch(hideSpinner())
  dispatch(getCertificateEvents(action.payload.certificate.metadata.id))
}

const handleReplaceCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Ersätter...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleReplaceCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(replaceCertificateCompleted())
  dispatch(push(`/certificate/${action.payload.certificateId}`))
}

const handleRenewCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Förnyar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload.certificateId + '/renew',
      method: 'POST',
      onStart: renewCertificateStarted.type,
      onSuccess: renewCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleRenewCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(renewCertificateCompleted())
  dispatch(push(`/certificate/${action.payload.certificateId}`))
}

const handleShowRelatedCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Laddar...'))

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + action.payload.certificateId + '/related',
      method: 'GET',
      onStart: showRelatedCertificateStarted.type,
      onSuccess: showRelatedCertificateSuccess.type,
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleShowRelatedCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(showRelatedCertificateCompleted())
  dispatch(push(`/certificate/${action.payload.certificateId}`))
}

const handleCreateCertificateFromTemplate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Laddar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleCreateCertificateFromTemplateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(push(`/certificate/${action.payload.certificateId}`))
}

const handleCreateCertificateFromCandidate: Middleware<Dispatch> = ({
  dispatch,
  getState,
}: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  dispatch(showSpinner('Laddar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleCreateCertificateFromCandidateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(getCertificate(action.payload.certificateId))
}

const handleCreateCertificateFromCandidateWithMessage: Middleware<Dispatch> = ({
  dispatch,
  getState,
}: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  dispatch(showSpinner('Laddar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/certificate/' + certificate.metadata.id + '/candidatemessage',
      method: 'GET',
      onStart: createCertificateFromCandidateWithMessageStarted.type,
      onSuccess: createCertificateFromCandidateWithMessageSuccess.type,
      onError: certificateApiGenericError.type,
      functionDisablerType: toggleCertificateFunctionDisabler.type,
    })
  )
}

const handleCreateCertificateFromCandidateWithMessageSuccess: Middleware<Dispatch> = ({
  dispatch,
}: MiddlewareAPI<AppDispatch, RootState>) => () => (action: AnyAction): void => {
  dispatch(hideSpinner())
  dispatch(updateModalData(action.payload))
}

const handleCopyCertificate: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(showSpinner('Kopierar...'))

  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleCopyCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(hideSpinner())
  dispatch(copyCertificateCompleted())
  dispatch(push(`/certificate/${action.payload.certificateId}`))
}

const handleGenericCertificateApiError: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(hideSpinner())
  dispatch(throwError(createErrorRequestFromApiError(action.payload.error, action.payload.certificateId)))
}

const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: ReturnType<typeof updateCertificateDataElement>
): void => {
  const certificate = getState().ui.uiCertificate.certificate
  if (certificate) {
    const clientValidationErrors = getClientValidationErrors(action.payload)
    dispatch(setValidationErrorsForQuestion({ questionId: action.payload.id, validationErrors: clientValidationErrors }))

    if (clientValidationErrors.length === 0) {
      dispatch(setCertificateDataElement(action.payload))
      dispatch(validateCertificateInFrontEnd(action.payload))
      dispatch(validateCertificate(certificate))
      dispatch(autoSaveCertificate(certificate))
    }
  }
}

const handleUpdateCertificateUnit: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(setCertificateUnitData(action.payload))
  const certificate = getState().ui.uiCertificate.certificate
  if (!certificate) {
    return
  }
  dispatch(validateCertificate(certificate))
  dispatch(autoSaveCertificate(certificate))
}

const handleUpdateCertificatePatient: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(setCertificatePatientData(action.payload))
  const certificate = getState().ui.uiCertificate.certificate
  if (!certificate) {
    return
  }
  dispatch(validateCertificate(certificate))
  dispatch(autoSaveCertificate(certificate))
}

const autoSaving = _.debounce(({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => {
  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleAutoSaveCertificate: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  autoSaving(middlewareAPI)
}

const handleAutoSaveCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(updateCertificateVersion(action.payload.version))

  dispatch(autoSaveCertificateCompleted())
}

const handleAutoSaveCertificateError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
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

const validating = _.debounce(({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) => {
  const certificate = getState().ui.uiCertificate.certificate

  if (!certificate) {
    return
  }

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

const handleValidateCertificate: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  middlewareAPI.dispatch(validateCertificateStarted())
  validating(middlewareAPI)
}

const handleValidateCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(updateValidationErrors(action.payload.validationErrors))
  dispatch(validateCertificateCompleted())
}

const handleUpdateComplements: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(updateCertificateComplements(action.payload))
}

const handleGotoComplement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(updateGotoCertificateDataElement(action.payload))
}

const handlePrintCertificate: Middleware<Dispatch> = () => () => (action: AnyAction): void => {
  const printUrl = `/moduleapi/intyg/${action.payload.type}/${action.payload.id}/pdf`
  if (action.payload.iframe) {
    action.payload.iframe.onload = function() {
      setTimeout(function() {
        action.payload.iframe.focus()
        action.payload.iframe.contentWindow.print()
      }, 1)
    }
    action.payload.iframe.src = printUrl
  }
}

const handleCreateNewCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(
    apiCallBegan({
      url: `/api/certificate/${action.payload.certificateType}/${action.payload.patientId}`,
      method: 'POST',
      onStart: createNewCertificateStarted.type,
      onSuccess: createNewCertificateSuccess.type,
      onError: certificateApiGenericError.type,
    })
  )
}

const handleCreateNewCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (
  action: AnyAction
): void => {
  dispatch(updateCreatedCertificateId(action.payload.certificateId))
}

const handleGetSessionStatusError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) => () => (): void => {
  dispatch(resetCertificateState())
}

const middlewareMethods = {
  [createNewCertificate.type]: handleCreateNewCertificate,
  [createNewCertificateSuccess.type]: handleCreateNewCertificateSuccess,
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
  [updateCertificatePatient.type]: handleUpdateCertificatePatient,
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
  [createCertificateFromCandidateWithMessage.type]: handleCreateCertificateFromCandidateWithMessage,
  [createCertificateFromCandidateWithMessageSuccess.type]: handleCreateCertificateFromCandidateWithMessageSuccess,
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
  [getCertificateError.type]: handleGetCertificateError,
  [signCertificateStatusSuccess.type]: handleSignCertificateStatusSuccess,
  [signCertificateStatusError.type]: handleSignCertificateStatusError,
  [getSessionStatusError.type]: handleGetSessionStatusError,
  [showRelatedCertificate.type]: handleShowRelatedCertificate,
  [showRelatedCertificateSuccess.type]: handleShowRelatedCertificateSuccess,
}

export const certificateMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI<AppDispatch, RootState>) => (next) => (
  action: AnyAction
): void => {
  next(action)
  if (middlewareMethods !== null && Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
