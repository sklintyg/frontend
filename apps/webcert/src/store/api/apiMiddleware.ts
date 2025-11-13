import { randomUUID } from '@frontend/utils'
import type { AnyAction } from '@reduxjs/toolkit'
import type { AxiosError } from 'axios'
import axios from 'axios'
import type { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { throwError } from '../error/errorActions'
import { createErrorRequestFromApiError, createSilentErrorRequestFromApiError } from '../error/errorCreator'
import { apiCallBegan, apiCallFailed, apiCallSuccess, apiGenericError, apiSilentGenericError } from './apiActions'
import { createApiError, getHeaders } from './apiUtils'
import { addRequest, isRequestLoading, removeRequest } from './requestSlice'

const handleApiCallBegan: Middleware =
  ({ getState, dispatch }: MiddlewareAPI) =>
  () =>
  async (action: AnyAction) => {
    if (!apiCallBegan.match(action) || isRequestLoading(action.payload)(getState())) {
      return
    }

    const id = randomUUID()
    const { url, method, data, headers, onStart, onSuccess, onError, onArgs } = action.payload

    if (onStart) {
      dispatch({ type: onStart, payload: { ...onArgs } })
    }

    try {
      dispatch(addRequest({ id, ...action.payload }))

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
      dispatch(removeRequest(id))
    }
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
