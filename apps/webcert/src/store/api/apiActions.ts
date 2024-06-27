/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction } from '@reduxjs/toolkit'

export interface ApiCall {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  headers?: Record<string, string>
  onStart?: string
  onSuccess?: string
  onError?: string
  onArgs?: any
  functionDisablerType?: string
}

const API = '[API]'

export const apiCallBegan = createAction<ApiCall>(`${API} Call began`)
export const apiCallSuccess = createAction<any>(`${API} Call success`)
export const apiCallFailed = createAction<string>(`${API} Call failed`)

export interface ApiError {
  api: string
  errorCode: string
  message: string
}

export interface ApiGenericError {
  error: ApiError
}

/**
 * Action to dispatch when an API error should behandled with notifications to the user.
 */
export const apiGenericError = createAction<ApiGenericError>(`${API} Api generic error`)

/**
 * Action to dispatch when an API error should be handled without interruptions to the user.
 */
export const apiSilentGenericError = createAction<ApiGenericError>(`${API} Api silent generic error`)
