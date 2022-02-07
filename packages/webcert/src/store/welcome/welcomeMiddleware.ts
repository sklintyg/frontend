import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiGenericError } from '../api/apiActions'
import {
  createNewCertificate,
  createNewCertificateStarted,
  createNewCertificateSuccess,
  getCertificateTypes,
  getCertificateTypesStarted,
  getCertificateTypesSuccess,
  getPatients,
  getPatientsStarted,
  getPatientsSuccess,
  loginUser,
  loginUserStarted,
  loginUserSuccess,
  updateCertificateId,
  updateCertificateTypes,
  updateNavigateToCertificate,
  updatePatients,
  populateFmb,
  populateFmbStarted,
  populateFmbSuccess,
} from './welcomeActions'
import { getUser } from '../user/userActions'

const handleGetCertificateTypes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(
    apiCallBegan({
      url: '/testability/certificate/types',
      method: 'GET',
      onStart: getCertificateTypesStarted.type,
      onSuccess: getCertificateTypesSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const handleGetCertificateTypesSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateCertificateTypes(action.payload.certificateTypes))
}

const handleGetPatients: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(
    apiCallBegan({
      url: '/testability/certificate/patients',
      method: 'GET',
      onStart: getPatientsStarted.type,
      onSuccess: getPatientsSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const handleGetPatientsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updatePatients(action.payload.patients))
}

const handleCreateNewCertificate: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/testability/certificate',
      method: 'POST',
      data: action.payload,
      onStart: createNewCertificateStarted.type,
      onSuccess: createNewCertificateSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const handleCreateNewCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateCertificateId(action.payload.certificateId))
}

const handleLoginUser: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/fake',
      method: 'POST',
      data: action.payload,
      onStart: loginUserStarted.type,
      onSuccess: loginUserSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const handleLoginUserSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(getUser())

  dispatch(updateNavigateToCertificate(true))
}

const handlePopulateFmb: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(
    apiCallBegan({
      url: '/testability/fmb/updatefmbdata',
      method: 'GET',
      onStart: populateFmbStarted.type,
      onSuccess: populateFmbSuccess.type,
      onError: apiGenericError.type,
    })
  )
}

const middlewareMethods = {
  [getCertificateTypes.type]: handleGetCertificateTypes,
  [getCertificateTypesSuccess.type]: handleGetCertificateTypesSuccess,
  [getPatients.type]: handleGetPatients,
  [getPatientsSuccess.type]: handleGetPatientsSuccess,
  [createNewCertificate.type]: handleCreateNewCertificate,
  [createNewCertificateSuccess.type]: handleCreateNewCertificateSuccess,
  [loginUser.type]: handleLoginUser,
  [loginUserSuccess.type]: handleLoginUserSuccess,
  [populateFmb.type]: handlePopulateFmb,
}

export const welcomeMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
