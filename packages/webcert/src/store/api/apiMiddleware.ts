import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import axios from 'axios'
import { apiCallBegan, apiCallFailed, apiCallSuccess, ApiError, apiGenericError, apiSilentGenericError } from './apiActions'
import { AnyAction } from '@reduxjs/toolkit'
import { throwError } from '../error/errorActions'
import { createErrorRequestFromApiError, createSilentErrorRequestFromApiError } from '../error/errorCreator'
import { FunctionDisabler, generateFunctionDisabler } from '../../utils/functionDisablerUtils'

const handleApiCallBegan: Middleware = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => async (action: AnyAction) => {
  if (!apiCallBegan.match(action)) {
    return
  }

  const { url, method, data, onStart, onSuccess, onError, onArgs, functionDisablerType } = action.payload
  let functionDisabler: FunctionDisabler

  if (onStart) {
    dispatch({ type: onStart, payload: { ...onArgs } })
  }

  if (functionDisablerType) {
    functionDisabler = generateFunctionDisabler()
  }

  try {
    if (functionDisablerType) {
      // @ts-expect-error functionDisabler wont be undefined if type has a value
      dispatch({ type: functionDisablerType, payload: functionDisabler })
    }

    const response = await axios.request({
      url,
      method,
      data,
      withCredentials: true,
    })

    dispatch(apiCallSuccess(response.data))

    if (onSuccess) {
      dispatch({ type: onSuccess, payload: { ...response.data, ...onArgs } })
    }
  } catch (error) {
    dispatch(apiCallFailed(error.message))

    if (onError) {
      dispatch({
        type: onError,
        payload: {
          error: createApiError(method + ' ' + url, error.response, error.message),
          ...onArgs,
        },
      })
    }
  } finally {
    if (functionDisablerType) {
      // @ts-expect-error functionDisabler wont be undefined if type has a value
      dispatch({ type: functionDisablerType, payload: functionDisabler })
    }
  }
}

const handleApiGenericError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(throwError(createErrorRequestFromApiError(action.payload.error)))
}

const handleApiSilentGenericError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(throwError(createSilentErrorRequestFromApiError(action.payload.error)))
}

function createApiError(api: string, response: any, altMessage: string): ApiError {
  if (!response) {
    return { api, errorCode: 'UNKNOWN_INTERNAL_PROBLEM', message: altMessage }
  }

  if (response.data && response.data.errorCode) {
    return { api, errorCode: response.data.errorCode, message: response.data.message }
  }

  const errorCode: string = response.status === 403 ? 'TIMEOUT' : 'UNKNOWN_INTERNAL_PROBLEM'
  return { api, errorCode, message: response.status + ' - ' + response.statusText }
}

const middlewareMethods = {
  [apiCallBegan.type]: handleApiCallBegan,
  [apiGenericError.type]: handleApiGenericError,
  [apiSilentGenericError.type]: handleApiSilentGenericError,
}

export const apiMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}

export default apiMiddleware
