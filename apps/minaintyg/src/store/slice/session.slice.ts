/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { z } from 'zod'
import { ErrorTypeEnum } from '../../schema/error.schema'
import { isQueryError } from '../../utils/isQueryError'
import { api, hasResponse, isRejectedEndpoint } from '../api'

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
  },
  extraReducers: (builder) => {
    // Start session after successful user fetch
    builder.addMatcher(api.endpoints.getUser.matchFulfilled, () => ({ ...initialState, hasSession: true }))

    builder.addMatcher(isRejectedEndpoint, (state, action) => {
      const error = isQueryError(action) ? action.payload : null

      if (hasResponse(action.meta.baseQueryMeta) && state.hasSession === true) {
        const { status } = action.meta.baseQueryMeta.response
        const isUnauthorized = status >= 401 && status <= 403

        if (status >= 500 || isUnauthorized) {
          state.hasSession = false
          state.hasSessionEnded = true
        }

        if (isUnauthorized) {
          state.reason = 'logged-out'
        } else if (status === 503) {
          state.reason = 'unavailable'
        }

        if (status >= 500) {
          state.errorId = error?.id
        }
      }
    })
  },
})

export const { endSession, reset } = sessionSlice.actions
export const { reducer: sessionReducer, name: sessionReducerPath } = sessionSlice
