import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getAllDynamicLinks,
  getAllDynamicLinksError,
  getAllDynamicLinksStarted,
  getAllDynamicLinksSuccess,
  getDiagnosisTypeahead,
  getDiagnosisTypeaheadError,
  getDiagnosisTypeaheadStarted,
  getDiagnosisTypeaheadSuccess,
  updateDiagnosisTypeahead,
  updateDynamicLinks,
} from './utilsActions'

const handleGetAllDynamicLinks: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getAllDynamicLinks.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/config/links',
      method: 'GET',
      onStart: getAllDynamicLinksStarted.type,
      onSuccess: getAllDynamicLinksSuccess.type,
      onError: getAllDynamicLinksError.type,
    })
  )
}

const handleGetAllDynamicLinksSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!getAllDynamicLinksSuccess.match(action)) {
    return
  }

  dispatch(updateDynamicLinks(action.payload))
}

const handleGetDiagnosisTypeahead: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getDiagnosisTypeahead.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/moduleapi/diagnos/kod/sok',
      method: 'POST',
      data: {
        codeSystem: action.payload.codeSystem,
        codeFragment: action.payload.codeFragment,
        nbrOfResults: action.payload.maxNumberOfResults,
      },
      onStart: getDiagnosisTypeaheadStarted.type,
      onSuccess: getDiagnosisTypeaheadSuccess.type,
      onError: getDiagnosisTypeaheadError.type,
    })
  )
}

const handleGetDiagnosisTypeaheadSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!getDiagnosisTypeaheadSuccess.match(action)) {
    return
  }

  dispatch(updateDiagnosisTypeahead(action.payload))
}

export const utilsMiddleware = [
  handleGetAllDynamicLinks,
  handleGetAllDynamicLinksSuccess,
  handleGetDiagnosisTypeahead,
  handleGetDiagnosisTypeaheadSuccess,
]
