import { createReducer } from '@reduxjs/toolkit'
import { clearError, setActiveCertificateId, setError } from './errorActions'

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
