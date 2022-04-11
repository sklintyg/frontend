import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import {
  cancelLogout,
  cancelLogoutStarted,
  cancelLogoutSuccess,
  getUser,
  getUserError,
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
  updateIsLoadingUser,
  updateUser,
  updateUserPreference,
  updateUserResourceLinks,
  getCertificateTypes,
  getCertificateTypesSuccess,
  getCertificateTypesStarted,
  updateCertificateTypes,
  createNewCertificate,
  createNewCertificateSuccess,
  createNewCertificateStarted,
} from './userActions'
import { startSignCertificate } from '../certificate/certificateActions'

const handleGetUser: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
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

const handleGetUserError: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(updateIsLoadingUser(false))
}

const handleGetUserStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateIsLoadingUser(true))
}

const handleGetUserSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateUser(action.payload.user))
  dispatch(updateUserResourceLinks(action.payload.links))
  dispatch(updateIsLoadingUser(false))
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

const handleGetCertificateTypes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/certificate/type/' + action.payload,
      method: 'GET',
      onStart: getCertificateTypesStarted.type,
      onSuccess: getCertificateTypesSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetCertificateTypesSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateCertificateTypes(action.payload))
}

// const handleCreateNewCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
//   dispatch(
//     apiCallBegan({
//       url: '/testability/certificate',
//       method: 'POST',
//       data: action.payload,
//       onStart: createNewCertificateStarted.type,
//       onSuccess: createNewCertificateSuccess.type,
//       onError: apiGenericError.type,
//     })
//   )
// }

// const handleCreateNewCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
//   dispatch(updateCertificateId(action.payload.certificateId))
// }

const middlewareMethods = {
  [getUser.type]: handleGetUser,
  [getUserSuccess.type]: handleGetUserSuccess,
  [getUserError.type]: handleGetUserError,
  [getUserStarted.type]: handleGetUserStarted,
  [setUserPreference.type]: handleSetUserPreference,
  [setUserPreferenceSuccess.type]: handleSetUserPreferenceSuccess,
  [cancelLogout.type]: handleCancelLogout,
  [triggerLogout.type]: handleTriggerLogout,
  [triggerLogoutNow.type]: handleTriggerLogoutNow,
  [startSignCertificate.type]: handleStartSignCertificate,
  [getCertificateTypes.type]: handleGetCertificateTypes,
  [getCertificateTypesSuccess.type]: handleGetCertificateTypesSuccess,
  // [createNewCertificate.type]: handleCreateNewCertificate,
  // [createNewCertificateSuccess.type]: handleCreateNewCertificateSuccess,
}

export const userMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
