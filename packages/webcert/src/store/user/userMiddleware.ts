import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  cancelLogout,
  cancelLogoutError,
  cancelLogoutStarted,
  cancelLogoutSuccess,
  getUser,
  getUserError,
  getUserStarted,
  getUserSuccess,
  setUserPreference,
  setUserPreferenceError,
  setUserPreferenceStarted,
  setUserPreferenceSuccess,
  triggerLogout,
  triggerLogoutError,
  triggerLogoutNow,
  triggerLogoutNowError,
  triggerLogoutNowStarted,
  triggerLogoutNowSuccess,
  triggerLogoutStarted,
  triggerLogoutSuccess,
  updateUser,
  updateUserPreference,
} from './userActions'

const handleGetUser: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getUser.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/user',
      method: 'GET',
      onStart: getUserStarted.type,
      onSuccess: getUserSuccess.type,
      onError: getUserError.type,
    })
  )
}

const handleGetUserSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getUserSuccess.match(action)) {
    return
  }

  dispatch(updateUser(action.payload))
}

const handleSetUserPreference: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!setUserPreference.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/anvandare/preferences',
      method: 'PUT',
      data: {
        key: action.payload.key,
        value: action.payload.value,
      },
      onStart: setUserPreferenceStarted.type,
      onSuccess: setUserPreferenceSuccess.type,
      onError: setUserPreferenceError.type,
      onArgs: {
        key: action.payload.key,
        value: action.payload.value,
      },
    })
  )
}

const handleSetUserPreferenceSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!setUserPreferenceSuccess.match(action)) {
    return
  }

  dispatch(
    updateUserPreference({
      key: action.payload.key,
      value: action.payload.value,
    })
  )
}

const handleCancelLogout: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!cancelLogout.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/anvandare/logout/cancel',
      method: 'GET',
      onStart: cancelLogoutStarted.type,
      onSuccess: cancelLogoutSuccess.type,
      onError: cancelLogoutError.type,
    })
  )
}

const handleTriggerLogout: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!triggerLogout.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/anvandare/logout',
      method: 'GET',
      onStart: triggerLogoutStarted.type,
      onSuccess: triggerLogoutSuccess.type,
      onError: triggerLogoutError.type,
    })
  )
}

const handleTriggerLogoutNow: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!triggerLogoutNow.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/visa/anvandare/logout/now',
      method: 'GET',
      onStart: triggerLogoutNowStarted.type,
      onSuccess: triggerLogoutNowSuccess.type,
      onError: triggerLogoutNowError.type,
    })
  )
}

export const userMiddleware = [
  handleGetUser,
  handleGetUserSuccess,
  handleSetUserPreference,
  handleSetUserPreferenceSuccess,
  handleCancelLogout,
  handleTriggerLogout,
  handleTriggerLogoutNow,
]
