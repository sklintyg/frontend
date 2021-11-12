import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
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
import { getUserSuccess, triggerLogoutNowStarted, triggerLogoutStarted } from '../user/userActions'
import { throwError } from '../error/errorActions'
import { ErrorType, TIMEOUT } from '../error/errorReducer'

const handleStartPoll: Middleware<Dispatch> = ({ dispatch, getState }) => () => (): void => {
  if (getState().ui.uiSession.pollHandle) {
    return
  }

  const handlePoll = setInterval(() => {
    dispatch(getSessionStatus())
  }, 30000)

  dispatch(setPollHandle(handlePoll))
}

const handleStopPoll: Middleware<Dispatch> = ({ dispatch, getState }) => () => (): void => {
  if (getState().ui.uiSession.pollHandle) {
    clearInterval(getState().ui.uiSession.pollHandle)
    dispatch(clearPollHandle())
  }
}

const handleGetSessionStatus: Middleware<Dispatch> = ({ dispatch, getState }) => () => (): void => {
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

const handleGetSessionStatusSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(setSessionStatusPending(false))
  dispatch(setSessionStatus(action.payload))

  if (!action.payload.authenticated) {
    dispatch(stopPoll())
    dispatch(throwError({ errorCode: TIMEOUT, type: ErrorType.ROUTE }))
  }
}

const handleGetSessionStatusError: Middleware<Dispatch> = ({ dispatch }) => () => (): void => {
  dispatch(setSessionStatusPending(false))
  dispatch(setSessionStatus({ authenticated: false, hasSession: false, secondsUntilExpire: 0 }))
  dispatch(stopPoll())
  dispatch(throwError({ errorCode: TIMEOUT, type: ErrorType.ROUTE }))
}

const handleGetUserSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (): void => {
  dispatch(startPoll())
}

const handleTriggerLogoutStarted: Middleware<Dispatch> = ({ dispatch }) => () => (): void => {
  dispatch(stopPoll())
}

const handleTriggerLogoutNowStarted: Middleware<Dispatch> = ({ dispatch }) => () => (): void => {
  dispatch(stopPoll())
}

const middlewareMethods = {
  [startPoll.type]: handleStartPoll,
  [stopPoll.type]: handleStopPoll,
  [getSessionStatus.type]: handleGetSessionStatus,
  [getSessionStatusSuccess.type]: handleGetSessionStatusSuccess,
  [getSessionStatusError.type]: handleGetSessionStatusError,
  [getUserSuccess.type]: handleGetUserSuccess,
  [triggerLogoutStarted.type]: handleTriggerLogoutStarted,
  [triggerLogoutNowStarted.type]: handleTriggerLogoutNowStarted,
}

export const sessionMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
