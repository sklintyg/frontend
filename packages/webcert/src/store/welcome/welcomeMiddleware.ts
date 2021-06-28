import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  createNewCertificate,
  createNewCertificateError,
  createNewCertificateStarted,
  createNewCertificateSuccess,
  getCertificateTypes,
  getCertificateTypesError,
  getCertificateTypesStarted,
  getCertificateTypesSuccess,
  getPatients,
  getPatientsError,
  getPatientsStarted,
  getPatientsSuccess,
  loginUser,
  loginUserError,
  loginUserStarted,
  loginUserSuccess,
  updateCertificateId,
  updateCertificateTypes,
  updateNavigateToCertificate,
  updatePatients,
} from './welcomeActions'
import { getUser } from '../user/userActions'

const handleGetCertificateTypes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificateTypes.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/testability/certificate/types',
      method: 'GET',
      onStart: getCertificateTypesStarted.type,
      onSuccess: getCertificateTypesSuccess.type,
      onError: getCertificateTypesError.type,
    })
  )
}

const handleGetCertificateTypesSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getCertificateTypesSuccess.match(action)) {
    return
  }

  dispatch(updateCertificateTypes(action.payload.certificateTypes))
}

const handleGetPatients: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getPatients.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/testability/certificate/patients',
      method: 'GET',
      onStart: getPatientsStarted.type,
      onSuccess: getPatientsSuccess.type,
      onError: getPatientsError.type,
    })
  )
}

const handleGetPatientsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getPatientsSuccess.match(action)) {
    return
  }

  dispatch(updatePatients(action.payload.patients))
}

const handleCreateNewCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!createNewCertificate.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/testability/certificate',
      method: 'POST',
      data: action.payload,
      onStart: createNewCertificateStarted.type,
      onSuccess: createNewCertificateSuccess.type,
      onError: createNewCertificateError.type,
    })
  )
}

const handleCreateNewCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!createNewCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCertificateId(action.payload.certificateId))
}

const handleLoginUser: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!loginUser.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/fake',
      method: 'POST',
      data: action.payload,
      onStart: loginUserStarted.type,
      onSuccess: loginUserSuccess.type,
      onError: loginUserError.type,
    })
  )
}

const handleLoginUserSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!loginUserSuccess.match(action)) {
    return
  }

  dispatch(getUser())

  dispatch(updateNavigateToCertificate(true))
}

export const welcomeMiddleware = [
  handleGetCertificateTypes,
  handleGetCertificateTypesSuccess,
  handleGetPatients,
  handleGetPatientsSuccess,
  handleCreateNewCertificate,
  handleCreateNewCertificateSuccess,
  handleLoginUser,
  handleLoginUserSuccess,
]
