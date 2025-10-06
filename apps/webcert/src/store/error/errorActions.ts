import { createAction } from '@reduxjs/toolkit'
import type { ErrorData, ErrorRequest } from './errorReducer'

const ERROR = '[Error]'

export const throwError = createAction<ErrorRequest>(`${ERROR} Throw error`)

interface ClearErrorRequest {
  errorId: string
}

export const clearError = createAction<ClearErrorRequest>(`${ERROR} Clear error`)

export const setError = createAction<ErrorData>(`${ERROR} Set error`)
export const setActiveCertificateId = createAction<string>(`${ERROR} Set active certificate id`)
