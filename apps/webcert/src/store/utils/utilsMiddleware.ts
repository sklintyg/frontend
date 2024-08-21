import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import {
  getAllDynamicLinks,
  getAllDynamicLinksError,
  getAllDynamicLinksStarted,
  getAllDynamicLinksSuccess,
  getConfig,
  getConfigError,
  getConfigStarted,
  getConfigSuccess,
  getDiagnosisTypeahead,
  getDiagnosisTypeaheadStarted,
  getDiagnosisTypeaheadSuccess,
  updateConfig,
  updateDiagnosisTypeahead,
  updateDynamicLinks,
  updateIsLoadingConfig,
  updateIsLoadingDynamicLinks,
} from './utilsActions'

const handleGetAllDynamicLinks: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(
      apiCallBegan({
        url: '/api/configuration/links',
        method: 'GET',
        onStart: getAllDynamicLinksStarted.type,
        onSuccess: getAllDynamicLinksSuccess.type,
        onError: getAllDynamicLinksError.type,
      })
    )
  }

const handleGetAllDynamicLinksSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateDynamicLinks(action.payload))
    dispatch(updateIsLoadingDynamicLinks(false))
  }

const handleGetAllDynamicLinksError: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingDynamicLinks(false))
  }

const handleGetAllDynamicLinksStarted: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingDynamicLinks(true))
  }

const handleGetDiagnosisTypeahead: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    let url: string
    let queryProperty: string
    if (action.payload.code) {
      url = '/moduleapi/diagnos/kod/sok'
      queryProperty = 'codeFragment'
    } else {
      url = '/moduleapi/diagnos/beskrivning/sok'
      queryProperty = 'descriptionSearchString'
    }

    dispatch(
      apiCallBegan({
        url: url,
        method: 'POST',
        data: {
          codeSystem: action.payload.codeSystem,
          [queryProperty]: action.payload.fragment,
          nbrOfResults: action.payload.maxNumberOfResults,
        },
        onStart: getDiagnosisTypeaheadStarted.type,
        onSuccess: getDiagnosisTypeaheadSuccess.type,
        onError: apiSilentGenericError.type,
      })
    )
  }

const handleGetDiagnosisTypeaheadSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateDiagnosisTypeahead(action.payload))
  }

const handleGetConfig: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(
      apiCallBegan({
        url: '/api/configuration',
        method: 'GET',
        onStart: getConfigStarted.type,
        onSuccess: getConfigSuccess.type,
        onError: getConfigError.type,
      })
    )
  }

const handleGetConfigSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateConfig(action.payload))
    dispatch(updateIsLoadingConfig(false))
  }

const handleGetConfigError: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingConfig(false))
  }

const handleGetConfigStarted: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingConfig(true))
  }

const middlewareMethods = {
  [getAllDynamicLinks.type]: handleGetAllDynamicLinks,
  [getAllDynamicLinksSuccess.type]: handleGetAllDynamicLinksSuccess,
  [getAllDynamicLinksError.type]: handleGetAllDynamicLinksError,
  [getAllDynamicLinksStarted.type]: handleGetAllDynamicLinksStarted,
  [getDiagnosisTypeahead.type]: handleGetDiagnosisTypeahead,
  [getDiagnosisTypeaheadSuccess.type]: handleGetDiagnosisTypeaheadSuccess,
  [getConfig.type]: handleGetConfig,
  [getConfigSuccess.type]: handleGetConfigSuccess,
  [getConfigError.type]: handleGetConfigError,
  [getConfigStarted.type]: handleGetConfigStarted,
}

export const utilsMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
