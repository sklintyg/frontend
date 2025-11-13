import type { AxiosResponse } from 'axios'
import { ErrorCode } from '../error/errorReducer'
import type { ApiError } from './apiActions'

export function getHeaders() {
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
