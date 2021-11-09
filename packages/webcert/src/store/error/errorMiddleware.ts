import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { createError, setError } from './errorActions'
import { ErrorData } from './errorReducer'

const handleCreateError: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  if (!createError.match(action)) {
    return
  }

  const errorData: ErrorData = { ...action.payload, errorId: uuidv4() }
  dispatch(setError(errorData))
}

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const middlewareMethods = {
  [createError.type]: handleCreateError,
}

export const errorMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
