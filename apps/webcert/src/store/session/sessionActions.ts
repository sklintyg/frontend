import { createAction } from '@reduxjs/toolkit'
import type { SessionStatus } from './sessionReducer'
import type { ApiError } from '../api/apiActions'

const SESSION = '[Session]'

export const startPoll = createAction(`${SESSION} Start poll`)
export const stopPoll = createAction(`${SESSION} Stop poll`)

export const setPollHandle = createAction<NodeJS.Timeout>(`${SESSION} Set poll handle`)
export const clearPollHandle = createAction(`${SESSION} Clear poll handle`)

export const getSessionStatus = createAction(`${SESSION} Get session status`)
export const getSessionStatusStarted = createAction(`${SESSION} Get session status started`)
export const getSessionStatusSuccess = createAction<SessionStatus>(`${SESSION} Get session status success`)

export interface SessionStatusError {
  error: ApiError
}

export const getSessionStatusError = createAction<SessionStatusError>(`${SESSION} Get session status error`)

export const setSessionStatusPending = createAction<boolean>(`${SESSION} Set session status pending`)
export const setSessionStatus = createAction<SessionStatus>(`${SESSION} Set session status`)

// THIS IS TEMPORARY UNTIL ERROR-HANDLING IS IMPLEMENTED
export const setLoggedOut = createAction<boolean>(`${SESSION} Set logged out`)
