import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { PatientStatus } from '../../types'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import { throwError } from '../error/errorActions'
import { createErrorRequestWithErrorId } from '../error/errorCreator'
import { ErrorCode, ErrorType } from '../error/errorReducer'
import { getSessionStatusError } from '../session/sessionActions'
import {
  clearPatientError,
  getCertificateTypes,
  getCertificateTypesStarted,
  getCertificateTypesSuccess,
  getPatient,
  getPatientError,
  getPatientStarted,
  getPatientSuccess,
  isLoadingCertificateTypes,
  setPatient,
  setPatientError,
  updateCertificateTypes,
} from './patientActions'

const handleGetPatient: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
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

const handleGetPatientSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (action.payload.status === PatientStatus.FOUND) {
      dispatch(clearPatientError())
      dispatch(setPatient(action.payload.patient))
    } else {
      dispatch(getPatientError(action.payload))
    }
  }

const handleGetPatientError: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
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

const handleGetCertificateTypes: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
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

const handleGetCertificateTypesStarted: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(isLoadingCertificateTypes(true))
  }

const handleGetCertificateTypesSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateCertificateTypes(action.payload))
    dispatch(isLoadingCertificateTypes(false))
  }

const handleGetSessionStatusError: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateCertificateTypes([]))
  }

const middlewareMethods = {
  [getPatient.type]: handleGetPatient,
  [getPatientSuccess.type]: handleGetPatientSuccess,
  [getPatientError.type]: handleGetPatientError,
  [getCertificateTypes.type]: handleGetCertificateTypes,
  [getCertificateTypesStarted.type]: handleGetCertificateTypesStarted,
  [getCertificateTypesSuccess.type]: handleGetCertificateTypesSuccess,
  [getSessionStatusError.type]: handleGetSessionStatusError,
}

export const patientMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
