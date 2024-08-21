import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { apiCallBegan } from '../api/apiActions'
import { throwError } from '../error/errorActions'
import { createErrorRequestFromApiError, createErrorRequestTimeout } from '../error/errorCreator'
import { getUserSuccess, setUnitSuccess, triggerLogoutNowStarted, triggerLogoutStarted } from '../user/userActions'
import {
  clearPollHandle,
  getSessionStatus,
  getSessionStatusError,
  getSessionStatusStarted,
  getSessionStatusSuccess,
  setPollHandle,
  setSessionStatus,
  setSessionStatusPending,
  startPoll,
  stopPoll,
} from './sessionActions'

const handleStartPoll: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (): void => {
    if (getState().ui.uiSession.pollHandle) {
      return
    }

    dispatch(getSessionStatus())

    const handlePoll = setInterval(() => {
      dispatch(getSessionStatus())
    }, 30000)

    dispatch(setPollHandle(handlePoll))
  }

const handleStopPoll: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (): void => {
    if (getState().ui.uiSession.pollHandle) {
      clearInterval(getState().ui.uiSession.pollHandle)
      dispatch(clearPollHandle())
    }
  }

const handleGetSessionStatus: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (): void => {
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

const handleGetSessionStatusSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(setSessionStatusPending(false))
    dispatch(setSessionStatus(action.payload))

    if (!action.payload.authenticated) {
      dispatch(stopPoll())
      dispatch(throwError(createErrorRequestTimeout('Not authenticated')))
    }
  }

const handleGetSessionStatusError: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(setSessionStatusPending(false))
    dispatch(setSessionStatus({ authenticated: false, hasSession: false, secondsUntilExpire: 0 }))
    dispatch(stopPoll())
    dispatch(throwError(createErrorRequestFromApiError(action.payload.error)))
  }

const handleGetUserSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    if (!getUserSuccess.match(action)) {
      return
    }

    if (action.payload.user.loggedInUnit !== null && action.payload.user.loggedInUnit.unitId) {
      dispatch(startPoll())
    }
  }

const handleSetUnitSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(startPoll())
  }

const handleTriggerLogoutStarted: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
    dispatch(stopPoll())
  }

const handleTriggerLogoutNowStarted: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
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
  [setUnitSuccess.type]: handleSetUnitSuccess,
}

export const sessionMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
