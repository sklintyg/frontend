import { GetThunkAPI, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { generateFunctionDisabler } from '../../utils/functionDisablerUtils'
import { ErrorCode } from '../error/errorReducer'
import { apiCallFailed, apiCallSuccess } from './apiActions'

export interface ApiError {
  api: string
  errorCode: string
  message: string
}

export interface ApiCall<Response> {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: unknown
  headers?: Record<string, string>
  onStart?: (api: GetThunkAPI<AsyncThunkConfig>) => void
  onSuccess?: (data: Response, api: GetThunkAPI<AsyncThunkConfig>) => void
  onError?: (error: ApiError, api: GetThunkAPI<AsyncThunkConfig>) => void
  functionDisablerType?: string
}

function getHeaders() {
  if (sessionStorage.getItem('launchId')) {
    return { launchId: sessionStorage.getItem('launchId') }
  }
  return {}
}

export function createApiError(api: string, response: AxiosResponse | undefined, altMessage: string): ApiError {
  if (!response) {
    return { api, errorCode: ErrorCode.UNKNOWN_INTERNAL_PROBLEM, message: altMessage }
  }

  if (response.data && response.data.errorCode) {
    return { api, errorCode: response.data.errorCode, message: response.data.message }
  }

  const errorCode: string = response.status === 403 ? ErrorCode.TIMEOUT : ErrorCode.UNKNOWN_INTERNAL_PROBLEM
  return { api, errorCode, message: response.status + ' - ' + response.statusText }
}

export function createApiThunk<Response, ThunkArg = void>(name: string, init: (args: ThunkArg) => ApiCall<Response>) {
  const functionDisabler = generateFunctionDisabler()

  return createAsyncThunk(name, async (args: ThunkArg, api) => {
    const { url, method, data, headers, onStart, onSuccess, onError, functionDisablerType } = init(args)

    if (onStart) {
      onStart(api)
    }

    try {
      if (functionDisablerType) {
        api.dispatch({ type: functionDisablerType, payload: functionDisabler })
      }

      const response = await axios.request<Response>({
        url,
        method,
        data,
        withCredentials: true,
        headers: { ...getHeaders(), ...headers },
      })

      api.dispatch(apiCallSuccess(response.data))

      if (onSuccess) {
        onSuccess(response.data, api)
      }
    } catch (error) {
      const message = (error as Error)?.message ?? ''
      const response = (error as AxiosError)?.response ?? undefined

      api.dispatch(apiCallFailed(message))

      if (onError) {
        onError(createApiError(method + ' ' + url, response, message), api)
      }
    } finally {
      if (functionDisablerType) {
        api.dispatch({ type: functionDisablerType, payload: functionDisabler })
      }
    }
  })
}
