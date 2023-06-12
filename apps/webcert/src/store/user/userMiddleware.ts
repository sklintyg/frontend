import { ResourceLinkType } from '@frontend/common'
import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { apiCallBegan, apiGenericError, apiSilentGenericError } from '../api/apiActions'
import { deleteCertificateSuccess, startSignCertificate } from '../certificate/certificateActions'
import { stopPoll } from '../session/sessionActions'
import {
  acknowledgeSubscription,
  acknowledgeSubscriptionSuccess,
  cancelLogout,
  cancelLogoutStarted,
  cancelLogoutSuccess,
  getUser,
  getUserError,
  getUserStarted,
  getUserStatistics,
  getUserStatisticsError,
  getUserStatisticsStarted,
  getUserStatisticsSuccess,
  getUserSuccess,
  removeResourceLink,
  setUnit,
  setUnitStarted,
  setUnitSuccess,
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
  updateIsCareProviderModalOpen,
  updateIsLoadingUser,
  updateIsLoadingUserStatistics,
  updateUser,
  updateUserPreference,
  updateUserResourceLinks,
  updateUserStatistics,
} from './userActions'
import { handleQuestionSuccess } from '../question/questionActions'

const handleGetUser: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
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

const handleGetUserError: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingUser(false))
  }

const handleGetUserStarted: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingUser(true))
  }

const handleGetUserSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateUser(action.payload.user))
    dispatch(updateUserResourceLinks(action.payload.links))
    dispatch(updateIsLoadingUser(false))
    if (action.payload.user.launchId) {
      sessionStorage.setItem('launchId', action.payload.user.launchId)
    }
  }

const handleSetUserPreference: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
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

const handleSetUserPreferenceSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      updateUserPreference({
        key: action.payload.key,
        value: action.payload.value,
      })
    )
  }

const handleCancelLogout: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
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

const handleTriggerLogout: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (): void => {
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

const handleTriggerLogoutNow: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
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

const handleStartSignCertificate: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateInactivateAutomaticLogout(true))
  }

const handleGetUserStatistics: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(
      apiCallBegan({
        url: '/api/user/statistics',
        method: 'GET',
        onStart: getUserStatisticsStarted.type,
        onSuccess: getUserStatisticsSuccess.type,
        onError: getUserStatisticsError.type,
      })
    )
  }

const handleGetUserStatisticsStarted: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingUserStatistics(true))
  }

const handleGetUserStatisticsSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateUserStatistics(action.payload))
    dispatch(updateIsLoadingUserStatistics(false))
  }

const handleSetUnit: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: `/api/user/unit/${action.payload}`,
        method: 'POST',
        onStart: setUnitStarted.type,
        onSuccess: setUnitSuccess.type,
        onError: apiGenericError.type,
      })
    )
  }

const handleSetUnitSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateUser(action.payload.user))
    dispatch(updateUserResourceLinks(action.payload.links))
    dispatch(getUserStatistics())
    dispatch(updateIsCareProviderModalOpen(false))
  }

const handleStopPoll: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
    dispatch(updateIsCareProviderModalOpen(false))
  }

const handleAcknowledgeSubscription: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(
      apiCallBegan({
        url: '/api/subscription/acknowledgeSubscriptionModal',
        method: 'GET',
        onSuccess: acknowledgeSubscriptionSuccess.type,
        onError: apiGenericError.type,
      })
    )
  }

const handleAcknowledgeSubscriptionSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(removeResourceLink(ResourceLinkType.SUBSCRIPTION_WARNING))
  }

const handleHandleQuestionSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(getUserStatistics())
  }

const handleDeleteCertificateSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(getUserStatistics())
  }

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
  [getUserStatistics.type]: handleGetUserStatistics,
  [getUserStatisticsStarted.type]: handleGetUserStatisticsStarted,
  [getUserStatisticsSuccess.type]: handleGetUserStatisticsSuccess,
  [setUnit.type]: handleSetUnit,
  [setUnitSuccess.type]: handleSetUnitSuccess,
  [stopPoll.type]: handleStopPoll,
  [acknowledgeSubscription.type]: handleAcknowledgeSubscription,
  [acknowledgeSubscriptionSuccess.type]: handleAcknowledgeSubscriptionSuccess,
  [deleteCertificateSuccess.type]: handleDeleteCertificateSuccess,
  [handleQuestionSuccess.type]: handleHandleQuestionSuccess,
}

export const userMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
