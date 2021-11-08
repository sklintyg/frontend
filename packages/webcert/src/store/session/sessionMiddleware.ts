import { Dispatch, Middleware } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import {
  clearPollHandle,
  getSessionStatus,
  getSessionStatusError,
  getSessionStatusStarted,
  getSessionStatusSuccess,
  setLoggedOut,
  setPollHandle,
  setSessionStatus,
  setSessionStatusPending,
  startPoll,
  stopPoll,
} from './sessionActions'
import { apiCallBegan } from '../api/apiActions'

export const handleStartPoll: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!startPoll.match(action)) {
    return
  }

  if (getState().ui.uiSession.pollHandle) {
    return
  }

  const handlePoll = setInterval(() => {
    dispatch(getSessionStatus())
  }, 30000)

  dispatch(setPollHandle(handlePoll))
}

export const handleStopPoll: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!stopPoll.match(action)) {
    return
  }

  if (getState().ui.uiSession.pollHandle) {
    clearInterval(getState().ui.uiSession.pollHandle)
    dispatch(clearPollHandle())
  }
}

export const handleGetSessionStatus: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getSessionStatus.match(action)) {
    return
  }

  if (getState().ui.uiSession.pending) {
    return
  }

  dispatch(setSessionStatusPending(true))

  dispatch(
    apiCallBegan({
      url: '/api/session-auth-check/ping',
      method: 'GET',
      onStart: getSessionStatusStarted.type,
      onSuccess: getSessionStatusSuccess.type,
      onError: getSessionStatusError.type,
    })
  )
}

export const handleGetSessionStatusSuccess: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getSessionStatusSuccess.match(action)) {
    return
  }

  dispatch(setSessionStatusPending(false))
  dispatch(setSessionStatus(action.payload))

  if (!action.payload.authenticated) {
    dispatch(setLoggedOut(true))
  }
}

export const handleGetSessionStatusError: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getSessionStatusError.match(action)) {
    return
  }

  dispatch(setSessionStatusPending(false))
  dispatch(setSessionStatus({ authenticated: false, hasSession: false, secondsUntilExpire: 0 }))
  dispatch(setLoggedOut(true))
}

export const sessionMiddleware = [
  handleStartPoll,
  handleStopPoll,
  handleGetSessionStatus,
  handleGetSessionStatusSuccess,
  handleGetSessionStatusError,
]
