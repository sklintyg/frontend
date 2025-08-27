import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { type ErrorData, type ErrorState } from './errorReducer'

const initialState: ErrorState = {}

const errorSlice = createSlice({
  name: 'uiError',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    setError(state, { payload }: PayloadAction<ErrorData>) {
      state.error = payload
    },
    setActiveCertificateId(state, { payload }: PayloadAction<string>) {
      state.activeCertificateId = payload
    },
    clearError(state) {
      state.error = undefined
    },
  },
})

export const { reset, setError, setActiveCertificateId, clearError } = errorSlice.actions
export const { reducer: errorReducer, name: errorReducerPath } = errorSlice
