import { createReducer } from '@reduxjs/toolkit'
import { clearError, setActiveCertificateId, setError } from './errorActions'

export const CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION'
export const TIMEOUT = 'TIMEOUT'
export const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
export const AUTHORIZATION_PROBLEM = 'AUTHORIZATION_PROBLEM'
export const CONCURRENT_MODIFICATION_ERROR_MESSAGE =
  'Utkastet har samtidigt ändrats av en annan användare och kunde därför inte sparas. Ladda om sidan och försök igen.'

export enum ErrorType {
  ROUTE = 'ROUTE',
  MODAL = 'MODAL',
}

export interface ErrorData {
  type: ErrorType
  // 'timeout',
  // 'concurrent-editing',
  // 'unexpected-error'
  errorCode: string
  errorId: string
  certificateId?: string
}

export interface ErrorRequest {
  type: ErrorType
  errorCode: string
  message?: string
  certificateId?: string
  stackTrace?: string
}

export interface ErrorLogRequest {
  message: string
  errorCode: string
  errorId: string
  certificateId?: string
  stackTrace?: string
}

interface ErrorState {
  error?: ErrorData
  activeCertificateId?: string
}

const getInitialState = (): ErrorState => {
  return {}
}

const errorReducer = createReducer(getInitialState(), (builder) =>
  builder
    .addCase(setError, (state, action) => {
      state.error = action.payload
    })
    .addCase(setActiveCertificateId, (state, action) => {
      state.activeCertificateId = action.payload
    })
    .addCase(clearError, (state) => {
      state.error = undefined
    })
)

export default errorReducer
