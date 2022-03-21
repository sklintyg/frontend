import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import {
  cancelLogout,
  cancelLogoutStarted,
  cancelLogoutSuccess,
  getUser,
  getUserStarted,
  getUserSuccess,
  setUserPreference,
  setUserPreferenceStarted,
  setUserPreferenceSuccess,
  triggerLogout,
  triggerLogoutNow,
  triggerLogoutNowStarted,
  triggerLogoutNowSuccess,
  triggerLogoutStarted,
  triggerLogoutSuccess,
  updateInactivateAutomaticLogout,
  updateUser,
  updateUserPreference,
  updateUserResourceLinks,
} from './userActions'
import { startSignCertificate } from '../certificate/certificateActions'

const handleGetUser: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(
    apiCallBegan({
      url: '/api/user',
      method: 'GET',
      onStart: getUserStarted.type,
      onSuccess: getUserSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetUserSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateUser(action.payload.user))
  dispatch(updateUserResourceLinks(action.payload.links))
}

const handleSetUserPreference: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
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
      onError: apiSilentGenericError.type,
      onArgs: {
        key: action.payload.key,
        value: action.payload.value,
      },
    })
  )
}

const handleSetUserPreferenceSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    updateUserPreference({
      key: action.payload.key,
      value: action.payload.value,
    })
  )
}

const handleCancelLogout: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(
    apiCallBegan({
      url: '/api/anvandare/logout/cancel',
      method: 'GET',
      onStart: cancelLogoutStarted.type,
      onSuccess: cancelLogoutSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleTriggerLogout: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  if (getState().ui.uiUser.inactiveAutomaticLogout) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/anvandare/logout',
      method: 'GET',
      onStart: triggerLogoutStarted.type,
      onSuccess: triggerLogoutSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleTriggerLogoutNow: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(
    apiCallBegan({
      url: '/visa/anvandare/logout/now',
      method: 'GET',
      onStart: triggerLogoutNowStarted.type,
      onSuccess: triggerLogoutNowSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleStartSignCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateInactivateAutomaticLogout(true))
}

const middlewareMethods = {
  [getUser.type]: handleGetUser,
  [getUserSuccess.type]: handleGetUserSuccess,
  [setUserPreference.type]: handleSetUserPreference,
  [setUserPreferenceSuccess.type]: handleSetUserPreferenceSuccess,
  [cancelLogout.type]: handleCancelLogout,
  [triggerLogout.type]: handleTriggerLogout,
  [triggerLogoutNow.type]: handleTriggerLogoutNow,
  [startSignCertificate.type]: handleStartSignCertificate,
}

export const userMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
