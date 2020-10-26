import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  clearRedirect,
  getUser,
  getUserCompleted,
  getUserError,
  getUserStarted,
  getUserSuccess,
  loginUser,
  loginUserError,
  loginUserStarted,
  loginUserSuccess,
  updateRedirect,
  updateUser,
} from './userActions'

const handleLoginUser: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!loginUser.match(action)) {
    return
  }

  const data =
    'userJsonDisplay= {\n' +
    ' "hsaId": "TSTNMT2321000156-1079",\n' +
    ' "forNamn": "Arnold",\n' +
    ' "efterNamn": "Johansson",\n' +
    ' "enhetId": "TSTNMT2321000156-1077",\n' +
    ' "legitimeradeYrkesgrupper": [\n' +
    '  "Läkare"\n' +
    ' ],\n' +
    ' "origin": "NORMAL",\n' +
    ' "authenticationMethod": "FAKE"\n' +
    '}'

  if (action.payload.redirectAction) {
    dispatch(updateRedirect(action.payload.redirectAction))
  }

  action.payload.user = action.payload.user ?? data

  dispatch(
    apiCallBegan({
      url: '/fake',
      method: 'POST',
      data: action.payload.user,
      onStart: loginUserStarted.type,
      onSuccess: loginUserSuccess.type,
      onError: loginUserSuccess.type,
      onArgs: { history: action.payload.loginUserSuccess?.history, certificateId: action.payload.loginUserSuccess?.certificateId },
    })
  )
}

const handleLoginUserSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!loginUserSuccess.match(action)) {
    return
  }

  dispatch(getUser())

  if (action.payload.history) {
    action.payload.history.push(`/certificate/${action.payload.certificateId}`)
  }

  const redirect = getState().ui.uiUser.redirect
  if (redirect) {
    dispatch(redirect)
    dispatch(clearRedirect())
  }
}

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

const handleGetUserSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getUserSuccess.match(action)) {
    return
  }

  dispatch(updateUser(action.payload))
  dispatch(getUserCompleted())
}

export const userMiddleware = [handleLoginUser, handleLoginUserSuccess, handleGetUser, handleGetUserSuccess]
