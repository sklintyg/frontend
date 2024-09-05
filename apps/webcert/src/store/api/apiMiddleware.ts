import type { AnyAction } from '@reduxjs/toolkit'
import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import type { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import type { FunctionDisabler } from '../../utils/functionDisablerUtils'
import { generateFunctionDisabler } from '../../utils/functionDisablerUtils'
import { throwError } from '../error/errorActions'
import { createErrorRequestFromApiError, createSilentErrorRequestFromApiError } from '../error/errorCreator'
import { ErrorCode } from '../error/errorReducer'
import type { ApiError } from './apiActions'
import { apiCallBegan, apiCallFailed, apiCallSuccess, apiGenericError, apiSilentGenericError } from './apiActions'

const handleApiCallBegan: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  async (action: AnyAction) => {
    if (!apiCallBegan.match(action)) {
      return
    }

    const { url, method, data, headers, onStart, onSuccess, onError, onArgs, functionDisablerType } = action.payload
    const functionDisabler: FunctionDisabler = generateFunctionDisabler()

    if (onStart) {
      dispatch({ type: onStart, payload: { ...onArgs } })
    }

    try {
      if (functionDisablerType) {
        dispatch({ type: functionDisablerType, payload: functionDisabler })
      }

      const response = await axios.request({
        url,
        method,
        data,
        withCredentials: true,
        headers: { ...getHeaders(), ...headers },
      })

      dispatch(apiCallSuccess(response.data))

      if (onSuccess) {
        dispatch({ type: onSuccess, payload: { ...response.data, ...onArgs } })
      }
    } catch (error) {
      const message = (error as Error)?.message ?? ''
      const response = (error as AxiosError)?.response ?? undefined

      dispatch(apiCallFailed(message))

      if (onError) {
        dispatch({
          type: onError,
          payload: {
            error: createApiError(method + ' ' + url, response, message),
            ...onArgs,
          },
        })
      }
    } finally {
      if (functionDisablerType) {
        dispatch({ type: functionDisablerType, payload: functionDisabler })
      }
    }
  }

function getHeaders() {
  if (sessionStorage.getItem('launchId')) {
    return { launchId: sessionStorage.getItem('launchId') }
  }
  return {}
}

const handleApiGenericError: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(throwError(createErrorRequestFromApiError(action.payload.error)))
  }

const handleApiSilentGenericError: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(throwError(createSilentErrorRequestFromApiError(action.payload.error)))
  }

function createApiError(api: string, response: AxiosResponse | undefined, altMessage: string): ApiError {
  if (!response) {
    return { api, errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, message: altMessage }
  }

  if (response.data && response.data.errorCode) {
    return { api, errorCode: response.data.errorCode, message: response.data.message }
  }

  const errorCode: string = response.status === 403 ? ErrorCode.TIMEOUT : ErrorCode.UNKNOWN_INTERNAL_PROBLEM
  return { api, errorCode, message: response.status + ' - ' + response.statusText }
}

const middlewareMethods = {
  [apiCallBegan.type]: handleApiCallBegan,
  [apiGenericError.type]: handleApiGenericError,
  [apiSilentGenericError.type]: handleApiSilentGenericError,
}

export const apiMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
