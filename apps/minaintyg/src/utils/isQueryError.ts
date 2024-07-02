import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { isPlainObject } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export type QueryError = (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })

export const isQueryError = (action: PayloadAction<unknown>): action is PayloadAction<QueryError> =>
  isPlainObject(action.payload) && 'id' in action.payload && typeof action?.payload.id === 'string'
