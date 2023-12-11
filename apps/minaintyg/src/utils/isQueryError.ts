import { PayloadAction, SerializedError, isPlainObject } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

export type QueryError = (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })

export const isQueryError = (action: PayloadAction<unknown>): action is PayloadAction<QueryError> =>
  isPlainObject(action.payload) && 'id' in action.payload && typeof action?.payload.id === 'string'
