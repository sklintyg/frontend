import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { setActiveCertificateId, setError, throwError } from './errorActions'
import { ErrorData, ErrorLogRequest, ErrorType } from './errorReducer'
import { apiCallBegan } from '../api/apiActions'
import { updateCertificate } from '../certificate/certificateActions'

const handleThrowError: Middleware<Dispatch> = ({ dispatch, getState }) => () => (action: AnyAction): void => {
  if (!throwError.match(action)) {
    return
  }

  const errorData: ErrorData = { ...action.payload, errorId: uuidv4() }

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

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  if (!updateCertificate.match(action)) {
    return
  }

  dispatch(setActiveCertificateId(action.payload.metadata.id))
}

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const middlewareMethods = {
  [throwError.type]: handleThrowError,
  [updateCertificate.type]: handleUpdateCertificate,
}

export const errorMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
