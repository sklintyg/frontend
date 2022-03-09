import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import { searchPatient, searchPatientError, searchPatientStarted, searchPatientSuccess, setPatient } from './patientActions'

const handleSearchPatient: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      method: 'GET',
      url: '/api/person/' + action.payload,
      onStart: searchPatientStarted.type,
      onSuccess: searchPatientSuccess.type,
      onError: searchPatientError.type,
    })
  )
}

const handleSearchPatientSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(setPatient(action.payload))
}

const middlewareMethods = {
  [searchPatient.type]: handleSearchPatient,
  [searchPatientSuccess.type]: handleSearchPatientSuccess,
}

export const patientMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
