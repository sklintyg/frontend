/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { QueryError } from '../middleware/error.middleware'

const initialState: {
  hasSessionEnded: boolean
  serviceUnavailableError: QueryError | null
} = {
  hasSessionEnded: false,
  serviceUnavailableError: null,
}

const sessionSlice = createSlice({
  name: 'sessionSlice',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    updateHasSessionEnded(state, { payload }: PayloadAction<boolean>) {
      state.hasSessionEnded = payload
    },
    updateServiceAvailability(state, { payload }: PayloadAction<QueryError | null>) {
      state.serviceUnavailableError = payload
    },
  },
})

export const { updateHasSessionEnded, updateServiceAvailability, reset } = sessionSlice.actions
export const { reducer: sessionReducer, name: sessionReducerPath } = sessionSlice
