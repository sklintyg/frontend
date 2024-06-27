import { AnyAction, ThunkMiddleware, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { throwError } from '../error/errorActions'
import { createErrorRequestFromApiError, createSilentErrorRequestFromApiError } from '../error/errorCreator'
import { ErrorCode } from '../error/errorReducer'
import { ApiError, apiCallBegan, apiGenericError, apiSilentGenericError } from './apiActions'
import { createApiThunk } from './createApiThunk'

export const handleApiCallBegan: ThunkMiddleware<unknown> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (apiCallBegan.match(action)) {
      const { url, method, data, headers, onStart, onSuccess, onError, onArgs, functionDisablerType } = action.payload

      const onStartThunk = createAsyncThunk(onStart ?? 'api start', (_: typeof onArgs) => {})
      const onSuccessThunk = createAsyncThunk(onSuccess ?? 'api success', (_: typeof onArgs) => {})
      const onErrorThunk = createAsyncThunk(onError ?? 'api error', (_: { error: ApiError } & typeof onArgs) => {})

      dispatch(
        createApiThunk<any>(`${method} ${url}`, () => ({
          url,
          method,
          data,
          headers,
          functionDisablerType,
          onStart: () => {
            dispatch(onStartThunk(onArgs))
          },
          onSuccess: (data) => {
            dispatch(onSuccessThunk({ ...data, ...onArgs }))
          },
          onError: (error) => {
            dispatch(
              onErrorThunk({
                error,
                ...onArgs,
              })
            )
          },
        }))
      )
    }
    return next(action)
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
