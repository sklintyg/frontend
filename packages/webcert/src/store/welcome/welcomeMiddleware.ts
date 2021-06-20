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
  updateCertificateTypes,
  updateCreatedCertificateId,
  updatePatients,
} from './welcomeActions'

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

const handleGetCertificateTypesSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
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

const handleGetPatientsSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
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

const handleCreateNewCertificateSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!createNewCertificateSuccess.match(action)) {
    return
  }

  dispatch(updateCreatedCertificateId(action.payload.certificateId))
}

export const welcomeMiddleware = [
  handleGetCertificateTypes,
  handleGetCertificateTypesSuccess,
  handleGetPatients,
  handleGetPatientsSuccess,
  handleCreateNewCertificate,
  handleCreateNewCertificateSuccess,
]
