import { createAction } from '@reduxjs/toolkit'
import { ErrorData, ErrorRequest } from './errorReducer'

const ERROR = '[Error]'

export const createError = createAction<ErrorRequest>(`${ERROR} Create error`)

export const setError = createAction<ErrorData>(`${ERROR} Set error`)
