import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getAllDynamicLinks,
  getAllDynamicLinksError,
  getAllDynamicLinksStarted,
  getAllDynamicLinksSuccess,
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

export const utilsMiddleware = [handleGetAllDynamicLinks, handleGetAllDynamicLinksSuccess]
