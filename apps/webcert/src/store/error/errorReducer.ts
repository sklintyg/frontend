import { createReducer } from '@reduxjs/toolkit'
import { clearError, setActiveCertificateId, setError } from './errorActions'

export enum ErrorType {
  ROUTE = 'ROUTE',
  MODAL = 'MODAL',
  SILENT = 'SILENT',
}

export enum ErrorCode {
  AUTHORIZATION_PROBLEM = 'AUTHORIZATION_PROBLEM',
  AUTHORIZATION_PROBLEM_RESOURCE = 'AUTHORIZATION_PROBLEM_RESOURCE',
  AUTHORIZATION_PROBLEM_SEKRETESSMARKERING = 'AUTHORIZATION_PROBLEM_SEKRETESSMARKERING',
  AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET = 'AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET',
  AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE = 'AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE',
  CERTIFICATE_REVOKED = 'CERTIFICATE_REVOKED',
  COMPLEMENT_INTYG_EXISTS = 'COMPLEMENT_INTYG_EXISTS',
  CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  EXTERNAL_SYSTEM_PROBLEM = 'EXTERNAL_SYSTEM_PROBLEM',
  INDETERMINATE_IDENTITY = 'INDETERMINATE_IDENTITY',
  INTERNAL_PROBLEM = 'INTERNAL_PROBLEM',
  INVALID_STATE = 'INVALID_STATE',
  INVALID_STATE_REPLACED = 'INVALID_STATE_REPLACED',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  MODULE_PROBLEM = 'MODULE_PROBLEM',
  PU_PROBLEM = 'PU_PROBLEM',
  TIMEOUT = 'TIMEOUT',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  UNKNOWN_INTERNAL_PROBLEM = 'UNKNOWN_INTERNAL_PROBLEM',
  NOT_APPROVED_PROTECTED_PERSON_AGREEMENT = 'NOT_APPROVED_PROTECTED_PERSON_AGREEMENT',
  FETCH_QUESTIONS_PROBLEM = 'FETCH_QUESTIONS_PROBLEM',
  GETTING_PATIENT_ERROR = 'GETTING_PATIENT_ERROR',
  PATIENT_NOT_FOUND = 'PATIENT_NOT_FOUND',
  INVALID_PATIENT_ID = 'INVALID_PATIENT_ID',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_HSA_ERROR = 'LOGIN_HSA_ERROR',
  LOGIN_MEDARBETARUPPDRAG_SAKNAS = 'LOGIN_MEDARBETARUPPDRAG_SAKNAS',
  PATIENT_NO_NAME = 'PATIENT_NO_NAME',
  GET_CERTIFICATE_PROBLEM = 'GET_CERTIFICATE_PROBLEM',
  SIGN_CERTIFICATE_ERROR = 'SIGN_CERTIFICATE_ERROR',
  INVALID_LAUNCHID = 'INVALID_LAUNCHID',
  SRS_ERROR = 'SRS_ERROR',
  INTEGRATION_NOCONTENT = 'INTEGRATION_NOCONTENT',
}

export interface ErrorData {
  type: ErrorType
  errorCode: ErrorCode
  errorId: string
  certificateId?: string
  message?: string
}

export interface ErrorRequest {
  type: ErrorType
  errorCode: ErrorCode
  errorId?: string
  message?: string
  certificateId?: string
  stackTrace?: string
}

export interface ErrorLogRequest {
  message: string
  errorCode: ErrorCode
  errorId: string
  certificateId?: string
  stackTrace?: string
}

export interface ErrorState {
  error?: ErrorData
  activeCertificateId?: string
}

const getInitialState = (): ErrorState => {
  return {}
}

const errorReducer = createReducer(getInitialState(), (builder) =>
  builder
    .addCase(setError, (state, action) => {
      state.error = action.payload
    })
    .addCase(setActiveCertificateId, (state, action) => {
      state.activeCertificateId = action.payload
    })
    .addCase(clearError, (state) => {
      state.error = undefined
    })
)

export default errorReducer
