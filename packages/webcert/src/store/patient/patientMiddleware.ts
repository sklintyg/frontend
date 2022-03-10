import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import { getPatient, getPatientError, getPatientStarted, getPatientSuccess, setPatient } from './patientActions'

const handleGetPatient: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      method: 'GET',
      url: '/api/patient/' + action.payload,
      onStart: getPatientStarted.type,
      onSuccess: getPatientSuccess.type,
      onError: getPatientError.type,
    })
  )
}

const handleGetPatientSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(setPatient(action.payload.patient))
  //handle status?
  console.log(action.payload)
}

const middlewareMethods = {
  [getPatient.type]: handleGetPatient,
  [getPatientSuccess.type]: handleGetPatientSuccess,
}

export const patientMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
