import { createListenerMiddleware, isAnyOf, isPlainObject } from '@reduxjs/toolkit'
import { randomUUID } from 'crypto'
import { api } from '../api'
import type { ApiGenericError } from '../api/apiActions'
import { certificateApi } from '../certificateApi'
import type { RootState } from '../reducer'
import { throwError } from './errorActions'
import { createErrorRequestFromApiError } from './errorCreator'
import type { ErrorData } from './errorReducer'
import { ErrorCode, ErrorType } from './errorReducer'
import { setError } from './errorSlice'

const errorListener = createListenerMiddleware<RootState>()

type CertificateError = {
  error: {
    errorCode: ErrorCode
    message: string
  }
  certificateId: string
}

function isCertificateError(data: unknown): data is CertificateError {
  return isPlainObject(data) && 'error' in data
}

function isApiGenericError(data: unknown): data is ApiGenericError {
  return isPlainObject(data) && 'error' in data
}

errorListener.startListening({
  actionCreator: throwError,
  effect: async (action, { getState, dispatch }) => {
    const errorData: ErrorData = {
      ...action.payload,
      errorId: action.payload.errorId ?? randomUUID(),
      certificateId: action.payload.certificateId ?? getState().ui.uiError.activeCertificateId,
    }

    if (errorData.type !== ErrorType.SILENT) {
      dispatch(setError(errorData))
    }

    dispatch(api.endpoints.logError.initiate({ ...errorData, message: errorData.message ?? 'No message' }))
  },
})

errorListener.startListening({
  matcher: certificateApi.endpoints.getCertificate.matchRejected,
  effect: async (action, { dispatch }) => {
    const data = action.payload?.data

    if (isCertificateError(data)) {
      const errorCode = [
        ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET,
        ErrorCode.AUTHORIZATION_PROBLEM,
        ErrorCode.DATA_NOT_FOUND,
        ErrorCode.INVALID_LAUNCHID,
      ].find((code) => code === data.error.errorCode)

      dispatch(
        throwError({
          type: ErrorType.ROUTE,
          errorCode: errorCode || ErrorCode.GET_CERTIFICATE_PROBLEM,
          message: data.error.message,
          certificateId: data.certificateId,
        })
      )
    }
  },
})

errorListener.startListening({
  matcher: isAnyOf(
    certificateApi.endpoints.answerCertificateComplement.matchRejected,
    certificateApi.endpoints.complementCertificate.matchRejected,
    certificateApi.endpoints.copyCertificate.matchRejected,
    certificateApi.endpoints.createCertificate.matchRejected,
    certificateApi.endpoints.createCertificateFromCandidate.matchRejected,
    certificateApi.endpoints.createCertificateFromTemplate.matchRejected,
    certificateApi.endpoints.deleteCertificate.matchRejected,
    certificateApi.endpoints.forwardCertificate.matchRejected,
    certificateApi.endpoints.getRelatedCertificate.matchRejected,
    certificateApi.endpoints.renewCertificate.matchRejected,
    certificateApi.endpoints.replaceCertificate.matchRejected,
    certificateApi.endpoints.revokeCertificate.matchRejected
  ),
  effect: async (action, { dispatch }) => {
    const data = isApiGenericError(action.payload?.data)

    if (isApiGenericError(data)) {
      dispatch(throwError(createErrorRequestFromApiError(data.error, data.certificateId)))
    }
  },
})

export const { middleware: errorListenerMiddleware } = errorListener
