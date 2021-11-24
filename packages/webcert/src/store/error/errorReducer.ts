import { createReducer } from '@reduxjs/toolkit'
import { clearError, setActiveCertificateId, setError } from './errorActions'

export enum ErrorType {
  ROUTE = 'ROUTE',
  MODAL = 'MODAL',
  SILENT = 'SILENT',
}

export enum ErrorCode {
  CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION',
  UNKNOWN_INTERNAL_PROBLEM = 'UNKNOWN_INTERNAL_PROBLEM',
  TIMEOUT = 'TIMEOUT',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  AUTHORIZATION_PROBLEM = 'AUTHORIZATION_PROBLEM',
}

export interface ErrorData {
  type: ErrorType
  errorCode: ErrorCode
  errorId: string
  certificateId?: string
}

export interface ErrorRequest {
  type: ErrorType
  errorCode: ErrorCode
  message?: string
  certificateId?: string
  stackTrace?: string
}

export interface ErrorLogRequest {
  message: string
  errorCode: ErrorCode
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
