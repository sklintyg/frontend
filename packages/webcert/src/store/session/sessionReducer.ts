import { createReducer } from '@reduxjs/toolkit'
import { clearPollHandle, setLoggedOut, setPollHandle, setSessionStatus, setSessionStatusPending } from './sessionActions'

export interface SessionStatus {
  hasSession: boolean
  authenticated: boolean
  secondsUntilExpire: number
}

export interface SessionState {
  pollHandle: NodeJS.Timeout | null
  pending: boolean
  sessionStatus: SessionStatus
  loggedOut: boolean // THIS IS TEMPORARY UNTIL ERROR-HANDLING IS IMPLEMENTED
}

const getInitialState = (): SessionState => {
  return {
    pollHandle: null,
    pending: false,
    sessionStatus: { hasSession: false, authenticated: false, secondsUntilExpire: 0 },
    loggedOut: false,
  }
}

const sessionReducer = createReducer(getInitialState(), (builder) =>
  builder
    .addCase(setPollHandle, (state, action) => {
      state.pollHandle = action.payload
    })
    .addCase(clearPollHandle, (state) => {
      state.pollHandle = null
    })
    .addCase(setSessionStatusPending, (state, action) => {
      state.pending = action.payload
    })
    .addCase(setSessionStatus, (state, action) => {
      state.sessionStatus = action.payload
    })
    .addCase(setLoggedOut, (state, action) => {
      state.loggedOut = action.payload
    })
)

export default sessionReducer
