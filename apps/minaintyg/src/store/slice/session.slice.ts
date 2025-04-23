/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { z } from 'zod'
import type { ErrorTypeEnum } from '../../schema/error.schema'
import { api } from '../api'

export const SessionEndedReason = z.enum(['logged-out', 'service-offline', 'error'])
export type SessionEndedReasonEnum = z.infer<typeof SessionEndedReason>

const initialState: {
  hasSession: boolean
  hasSessionEnded: boolean
  reason: ErrorTypeEnum
  errorId?: string
} = {
  hasSession: false,
  hasSessionEnded: false,
  reason: 'unknown',
  errorId: undefined,
}

const sessionSlice = createSlice({
  name: 'sessionSlice',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    endSession(state, { payload }: PayloadAction<{ reason: ErrorTypeEnum; errorId?: string }>) {
      state.hasSession = false
      state.hasSessionEnded = true
      state.reason = payload.reason
      state.errorId = payload.errorId
    },
    startSession(state) {
      state.hasSession = true
      state.hasSessionEnded = false
    },
  },
  selectors: {
    selectHasSession: (state) => state.hasSession,
    selectHasSessionEnded: (state) => state.hasSessionEnded,
    selectSessionEndReason: (state) => state.reason,
  },
  extraReducers: (builder) => {
    // Start session after successful user fetch
    builder.addMatcher(api.endpoints.getUser.matchFulfilled, () => ({ ...initialState, hasSession: true }))
  },
})

export const { endSession, startSession, reset } = sessionSlice.actions
export const { reducer: sessionReducer, name: sessionReducerPath } = sessionSlice
export const { selectHasSession, selectHasSessionEnded, selectSessionEndReason } = sessionSlice.selectors
