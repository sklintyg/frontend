import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  clearRedirect,
  getUser,
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

  dispatch(updateRedirect(action.payload))

  dispatch(
    apiCallBegan({
      url: '/fake',
      method: 'POST',
      data: data,
      onStart: loginUserStarted.type,
      onSuccess: loginUserSuccess.type,
      onError: loginUserSuccess.type,
    })
  )
}

const handleLoginUserSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!loginUserSuccess.match(action)) {
    return
  }

  // TODO: Get logged in user
  dispatch(getUser('TSTNMT2321000156-1079'))

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

  // TODO: Fetch user from backend.
  dispatch(updateUser({ name: 'Arnold Johansson', title: 'Läkare', loggedInUnit: 'NMT vg3 ve1', loggedInCareProvider: 'NMT vg3' }))
}

const handleGetUserSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getUserSuccess.match(action)) {
    return
  }
}

export const userMiddleware = [handleLoginUser, handleLoginUserSuccess, handleGetUser, handleGetUserSuccess]
