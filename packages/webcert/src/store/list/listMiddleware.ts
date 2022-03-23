import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import {
  getDraftListConfig,
  getDraftListConfigStarted,
  getDraftListConfigSuccess,
  getDrafts,
  getDraftsStarted,
  getDraftsSuccess,
  updateDraftList,
  updateDraftListConfig,
} from './listActions'

const handleGetDrafts: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/draft',
      method: 'POST',
      data: { filter: action.payload },
      onStart: getDraftsStarted.type,
      onSuccess: getDraftsSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetDraftsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateDraftList(action.payload))
}

const handleGetDraftListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/config/draft',
      method: 'GET',
      onStart: getDraftListConfigStarted.type,
      onSuccess: getDraftListConfigSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetDraftListConfigSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateDraftListConfig(action.payload))
}

const middlewareMethods = {
  [getDrafts.type]: handleGetDrafts,
  [getDraftsSuccess.type]: handleGetDraftsSuccess,
  [getDraftListConfig.type]: handleGetDraftListConfig,
  [getDraftListConfigSuccess.type]: handleGetDraftListConfigSuccess,
}

export const listMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
