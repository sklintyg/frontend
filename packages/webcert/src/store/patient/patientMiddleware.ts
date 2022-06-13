import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import {
  clearPatientError,
  getCertificateTypes,
  getCertificateTypesStarted,
  getCertificateTypesSuccess,
  getPatient,
  getPatientError,
  getPatientStarted,
  getPatientSuccess,
  setPatient,
  setPatientError,
  updateCertificateTypes,
} from './patientActions'
import { PatientStatus } from '@frontend/common'
import { throwError } from '../error/errorActions'
import { ErrorCode, ErrorType } from '../error/errorReducer'
import { createErrorRequestWithErrorId } from '../error/errorCreator'

const handleGetPatient: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
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

const handleGetPatientSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  if (action.payload.status === PatientStatus.FOUND) {
    dispatch(clearPatientError())
    dispatch(setPatient(action.payload.patient))
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
  } else if (action.payload.status === PatientStatus.NO_NAME) {
    errorCode = ErrorCode.PATIENT_NO_NAME
  }
  const error = createErrorRequestWithErrorId(ErrorType.SILENT, errorCode, getState().ui.uiQuestion.certificateId)
  dispatch(setPatientError(error))
  dispatch(throwError(error))
}

const handleGetCertificateTypes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/certificate/type/' + action.payload,
      method: 'GET',
      onStart: getCertificateTypesStarted.type,
      onSuccess: getCertificateTypesSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetCertificateTypesSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateCertificateTypes(action.payload))
}

const middlewareMethods = {
  [getPatient.type]: handleGetPatient,
  [getPatientSuccess.type]: handleGetPatientSuccess,
  [getPatientError.type]: handleGetPatientError,
  [getCertificateTypes.type]: handleGetCertificateTypes,
  [getCertificateTypesSuccess.type]: handleGetCertificateTypesSuccess,
}

export const patientMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
