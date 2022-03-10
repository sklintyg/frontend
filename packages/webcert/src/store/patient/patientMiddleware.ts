import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  changePatient,
  clearPatient,
  getPatient,
  getPatientError,
  getPatientStarted,
  getPatientSuccess,
  setPatient,
} from './patientActions'

const handleGetPatient: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      method: 'GET',
      url: '/api/patient/' + action.payload.patientId,
      onStart: getPatientStarted.type,
      onSuccess: getPatientSuccess.type,
      onError: getPatientError.type,
      onArgs: { history: action.payload.history },
    })
  )
}

const handleGetPatientSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(setPatient(action.payload.patient))
  action.payload.history.push(`/create/${action.payload.patient.personId.id}`)
}

const handleChangePatient: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(clearPatient())
  action.payload.push('/create')
}

const middlewareMethods = {
  [getPatient.type]: handleGetPatient,
  [getPatientSuccess.type]: handleGetPatientSuccess,
  [changePatient.type]: handleChangePatient,
}

export const patientMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
