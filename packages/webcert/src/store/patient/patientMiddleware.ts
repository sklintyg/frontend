import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  changePatient,
  clearPatient,
  clearPatientError,
  getPatient,
  getPatientError,
  getPatientStarted,
  getPatientSuccess,
  setPatient,
  setPatientError,
} from './patientActions'
import { PatientStatus } from '@frontend/common'
import { throwError } from '../error/errorActions'
import { ErrorCode, ErrorType } from '../error/errorReducer'
import { createErrorRequestWithErrorId } from '../error/errorCreator'

const handleGetPatient: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  if (action.payload.patientId) {
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
}

const handleGetPatientSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  if (action.payload.status === PatientStatus.FOUND) {
    dispatch(clearPatientError())
    dispatch(setPatient(action.payload.patient))
    action.payload.history.push(`/create/${action.payload.patient.personId.id}`)
  } else {
    dispatch(getPatientError(action.payload))
  }
}

const handleGetPatientError: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  let errorCode = ErrorCode.GETTING_PATIENT_ERROR
  if (action.payload.status === PatientStatus.NOT_FOUND) {
    errorCode = ErrorCode.PATIENT_NOT_FOUND
  } else if (action.payload.status === PatientStatus.INVALID_PATIENT_ID) {
    errorCode = ErrorCode.INVALID_PATIENT_ID
  } else if (action.payload.status === PatientStatus.ERROR) {
    errorCode = ErrorCode.PU_PROBLEM
  }
  let error  = createErrorRequestWithErrorId(ErrorType.SILENT, errorCode, getState().ui.uiQuestion.certificateId)
  dispatch(setPatientError(error))
  dispatch(throwError(error))
}

const handleChangePatient: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(clearPatient())
  action.payload.push('/create')
}

const middlewareMethods = {
  [getPatient.type]: handleGetPatient,
  [getPatientSuccess.type]: handleGetPatientSuccess,
  [changePatient.type]: handleChangePatient,
  [getPatientError.type]: handleGetPatientError,
}

export const patientMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
