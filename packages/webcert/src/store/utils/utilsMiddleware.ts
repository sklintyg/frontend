import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import {
  getAllDynamicLinks,
  getAllDynamicLinksStarted,
  getAllDynamicLinksSuccess,
  getConfig,
  getConfigStarted,
  getConfigSuccess,
  getDiagnosisTypeahead,
  getDiagnosisTypeaheadStarted,
  getDiagnosisTypeaheadSuccess,
  getStatistics,
  getStatisticsStarted,
  getStatisticsSuccess,
  updateConfig,
  updateDiagnosisTypeahead,
  updateDynamicLinks,
  updateStatistics,
  updateIsLoadingConfig,
  getConfigError,
} from './utilsActions'

const handleGetAllDynamicLinks: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/configuration/links',
      method: 'GET',
      onStart: getAllDynamicLinksStarted.type,
      onSuccess: getAllDynamicLinksSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetAllDynamicLinksSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getAllDynamicLinksSuccess.match(action)) {
    return
  }

  dispatch(updateDynamicLinks(action.payload))
}

const handleGetDiagnosisTypeahead: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
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

const handleGetDiagnosisTypeaheadSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateDiagnosisTypeahead(action.payload))
}

const handleGetConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
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

const handleGetConfigSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  dispatch(updateConfig(action.payload))
  dispatch(updateIsLoadingConfig(false))
}

const handleGetConfigError: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(updateIsLoadingConfig(false))
}

const handleGetConfigStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateIsLoadingConfig(true))
}

const handleGetStatistics: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/moduleapi/stat',
      method: 'GET',
      onStart: getStatisticsStarted.type,
      onSuccess: getStatisticsSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetStatisticsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  dispatch(updateStatistics(action.payload))
}

const middlewareMethods = {
  [getAllDynamicLinks.type]: handleGetAllDynamicLinks,
  [getAllDynamicLinksSuccess.type]: handleGetAllDynamicLinksSuccess,
  [getDiagnosisTypeahead.type]: handleGetDiagnosisTypeahead,
  [getDiagnosisTypeaheadSuccess.type]: handleGetDiagnosisTypeaheadSuccess,
  [getConfig.type]: handleGetConfig,
  [getConfigSuccess.type]: handleGetConfigSuccess,
  [getConfigError.type]: handleGetConfigError,
  [getConfigStarted.type]: handleGetConfigStarted,
  [getStatistics.type]: handleGetStatistics,
  [getStatisticsSuccess.type]: handleGetStatisticsSuccess,
}

export const utilsMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
