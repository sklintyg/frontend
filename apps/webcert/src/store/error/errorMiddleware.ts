import { randomUUID } from '@frontend/utils'
import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { apiCallBegan } from '../api/apiActions'
import { updateCertificate } from '../certificate/certificateSlice'
import { setActiveCertificateId, setError, throwError } from './errorActions'
import { ErrorData, ErrorLogRequest, ErrorType } from './errorReducer'

const handleThrowError: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (action: AnyAction): void => {
    if (!throwError.match(action)) {
      return
    }

    const errorData: ErrorData = !action.payload.errorId
      ? { ...action.payload, errorId: randomUUID() }
      : { ...action.payload, errorId: action.payload.errorId as string }

    if (!errorData.certificateId) {
      errorData.certificateId = getState().ui.uiError.activeCertificateId
    }

    if (errorData.type !== ErrorType.SILENT) {
      dispatch(setError(errorData))
    }

    const message = action.payload.message ? action.payload.message : 'No message'
    const errorLogRequest: ErrorLogRequest = { ...errorData, message }

    dispatch(
      apiCallBegan({
        data: errorLogRequest,
        method: 'POST',
        url: '/api/log/error',
      })
    )
  }

const handleUpdateCertificate: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    if (!updateCertificate.match(action)) {
      return
    }

    dispatch(setActiveCertificateId(action.payload.metadata.id))
  }

const middlewareMethods = {
  [throwError.type]: handleThrowError,
  [updateCertificate.type]: handleUpdateCertificate,
}

export const errorMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
