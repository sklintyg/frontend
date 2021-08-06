import { createAction } from '@reduxjs/toolkit'

export interface ApiCall {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  onStart?: string
  onSuccess?: string
  onError?: string
  onArgs?: any
}

const API = '[API]'

export const apiCallBegan = createAction<ApiCall>(`${API} Call began`)
export const apiCallSuccess = createAction<any>(`${API} Call success`)
export const apiCallFailed = createAction<string>(`${API} Call failed`)
