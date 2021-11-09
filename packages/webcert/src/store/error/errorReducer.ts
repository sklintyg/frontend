import { createReducer } from '@reduxjs/toolkit'
import { setError } from './errorActions'

export enum ErrorType {
  ROUTE,
  MODAL,
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
  stacktrace?: string
}

export interface ErrorLogRequest {
  message: string
  errorCode: string
  errorId: string
  certificateId?: string
  stacktrace?: string
}

interface ErrorState {
  error: ErrorData | null
}

const getInitialState = (): ErrorState => {
  return {
    error: null,
  }
}

const errorReducer = createReducer(getInitialState(), (builder) =>
  builder.addCase(setError, (state, action) => {
    state.error = action.payload
  })
)

export default errorReducer
