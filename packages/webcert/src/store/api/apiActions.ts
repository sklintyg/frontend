import { createAction } from '@reduxjs/toolkit'

export interface ApiCall {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data: any
  onStart?: Function
  onSuccess?: Function
  onError?: Function
}

export const apiCallBegan = createAction<ApiCall>('[API] Call began')
export const apiCallSuccess = createAction<any>('[API] Call success')
export const apiCallFailed = createAction<string>('[API] Call failed')
