import { createAction } from '@reduxjs/toolkit'
import { History, LocationState } from 'history'
import {
  Certificate,
  CertificateDataElement,
  CertificateStatus,
  Unit,
  ValidationError,
  CertificateMetadata,
  CertificateEvent,
} from '@frontend/common'

const CERTIFICATE = '[CERTIFICATE]'

const GET_CERTIFICATE = `${CERTIFICATE} Get certificate`
const GET_CERTIFICATE_STARTED = `${CERTIFICATE} Get certificate started`
const GET_CERTIFICATE_SUCCESS = `${CERTIFICATE} Get certificate success`
const GET_CERTIFICATE_ERROR = `${CERTIFICATE} Get certificate error`
const GET_CERTIFICATE_COMPLETED = `${CERTIFICATE} Get certificate completed`

const GET_CERTIFICATE_EVENTS = `${CERTIFICATE} Get certificate events`
const GET_CERTIFICATE_EVENTS_STARTED = `${CERTIFICATE} Get certificate events started`
const GET_CERTIFICATE_EVENTS_SUCCESS = `${CERTIFICATE} Get certificate events success`
const GET_CERTIFICATE_EVENTS_ERROR = `${CERTIFICATE} Get certificate events error`
const GET_CERTIFICATE_EVENTS_COMPLETED = `${CERTIFICATE} Get certificate events completed`

const DELETE_CERTIFICATE = `${CERTIFICATE} Delete certificate`
const DELETE_CERTIFICATE_STARTED = `${CERTIFICATE} Delete certificate started`
const DELETE_CERTIFICATE_SUCCESS = `${CERTIFICATE} Delete certificate success`
const DELETE_CERTIFICATE_ERROR = `${CERTIFICATE} Delete certificate error`
const DELETE_CERTIFICATE_COMPLETED = `${CERTIFICATE} Delete certificate completed`

const FORWARD_CERTIFICATE = `${CERTIFICATE} Forward certificate`
const FORWARD_CERTIFICATE_STARTED = `${CERTIFICATE} Forward certificate started`
const FORWARD_CERTIFICATE_SUCCESS = `${CERTIFICATE} Forward certificate success`
const FORWARD_CERTIFICATE_ERROR = `${CERTIFICATE} Forward certificate error`
const FORWARD_CERTIFICATE_COMPLETED = `${CERTIFICATE} Forward certificate completed`

const SIGN_CERTIFICATE = `${CERTIFICATE} Sign certificate`
const SIGN_CERTIFICATE_STARTED = `${CERTIFICATE} Sign certificate started`
const SIGN_CERTIFICATE_SUCCESS = `${CERTIFICATE} Sign certificate success`
const SIGN_CERTIFICATE_ERROR = `${CERTIFICATE} Sign certificate error`
const SIGN_CERTIFICATE_COMPLETED = `${CERTIFICATE} Sign certificate completed`

const REVOKE_CERTIFICATE = `${CERTIFICATE} Revoke certificate`
const REVOKE_CERTIFICATE_STARTED = `${CERTIFICATE} Revoke certificate started`
const REVOKE_CERTIFICATE_SUCCESS = `${CERTIFICATE} Revoke certificate success`
const REVOKE_CERTIFICATE_ERROR = `${CERTIFICATE} Revoke certificate error`
const REVOKE_CERTIFICATE_COMPLETED = `${CERTIFICATE} Revoke certificate completed`

const REPLACE_CERTIFICATE = `${CERTIFICATE} Replace certificate`
const REPLACE_CERTIFICATE_STARTED = `${CERTIFICATE} Replace certificate started`
const REPLACE_CERTIFICATE_SUCCESS = `${CERTIFICATE} Replace certificate success`
const REPLACE_CERTIFICATE_ERROR = `${CERTIFICATE} Replace certificate error`
const REPLACE_CERTIFICATE_COMPLETED = `${CERTIFICATE} Replace certificate completed`

const VALIDATE_CERTIFICATE = `${CERTIFICATE} Validate certificate`
const VALIDATE_CERTIFICATE_STARTED = `${CERTIFICATE} Validate certificate started`
const VALIDATE_CERTIFICATE_COMPLETED = `${CERTIFICATE} Validate certificate completed`
const VALIDATE_CERTIFICATE_SUCCESS = `${CERTIFICATE} Validate certificate success`
const VALIDATE_CERTIFICATE_ERROR = `${CERTIFICATE} Validate certificate error`

const UPDATE_CERTIFICATE_STATUS = `${CERTIFICATE} Update certificate status`
const UPDATE_CERTIFICATE_UNIT = `${CERTIFICATE} Update certificate unit`

const AUTO_SAVE_CERTIFICATE = `${CERTIFICATE} Auto save certificate`
const AUTO_SAVE_STARTED = `${CERTIFICATE} Auto save certificate started`
const AUTO_SAVE_COMPLETED = `${CERTIFICATE} Auto save certificate completed`
const AUTO_SAVE_SUCCESS = `${CERTIFICATE} Auto save certificate success`
const AUTO_SAVE_ERROR = `${CERTIFICATE} Auto save certificate error`

const VALIDATE_CERTIFICATE_IN_FRONTEND = `${CERTIFICATE} Validate in frontend`
const VALIDATE_CERTIFICATE_IN_FRONTEND_COMPLETED = `${CERTIFICATE} Validate in frontend completed`

const UPDATE_CERTIFICATE_AS_READONLY = `${CERTIFICATE} Update certificate as readonly`
const UPDATE_CERTIFICATE_AS_DELETED = `${CERTIFICATE} Update certificate as deleted`
const UPDATE_CERTIFICATE = `${CERTIFICATE} Update certificate`
const UPDATE_CERTIFICATE_EVENTS = `${CERTIFICATE} Update certificate events`
const UPDATE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Update certificate data element`
const UPDATE_VALIDATION_ERRORS = `${CERTIFICATE} Update validation errors`
const UPDATE_CERTIFICATE_VERSION = `${CERTIFICATE} Update certificate version`

const SET_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Set certificate data element`
const SET_CERTIFICATE_UNIT_DATA = `${CERTIFICATE} Set certificate unit data`

const SHOW_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Show data element`
const HIDE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Hide data element`

const SHOW_CERTIFICATE_DATA_ELEMENT_MANDATORY = `${CERTIFICATE} Show mandatory on data element`
const HIDE_CERTIFICATE_DATA_ELEMENT_MANDATORY = `${CERTIFICATE} Hide mandatory on data element`

const SHOW_CERTIFICATE_LOADING_SPINNER = `${CERTIFICATE} Show spinner`
const HIDE_CERTIFICATE_LOADING_SPINNER = `${CERTIFICATE} Hide spinner`

const SHOW_CERTIFICATE_VALIDATION_ERRORS = `${CERTIFICATE} Show validation errors`
const HIDE_CERTIFICATE_VALIDATION_ERRORS = `${CERTIFICATE} Hide validation errors`

const PRINT_CERTIFICATE = `${CERTIFICATE} Print certificate`

export const getCertificate = createAction<string>(GET_CERTIFICATE)

export const getCertificateStarted = createAction(GET_CERTIFICATE_STARTED)

export const getCertificateSuccess = createAction<Certificate>(GET_CERTIFICATE_SUCCESS)

export const getCertificateError = createAction<string>(GET_CERTIFICATE_ERROR)

export const getCertificateCompleted = createAction(GET_CERTIFICATE_COMPLETED)

export const getCertificateEvents = createAction<string>(GET_CERTIFICATE_EVENTS)

export const getCertificateEventsStarted = createAction(GET_CERTIFICATE_EVENTS_STARTED)

export interface GetCertificateEventsSuccess {
  certificateEvents: CertificateEvent[]
}

export const getCertificateEventsSuccess = createAction<GetCertificateEventsSuccess>(GET_CERTIFICATE_EVENTS_SUCCESS)

export const getCertificateEventsError = createAction<string>(GET_CERTIFICATE_EVENTS_ERROR)

export const getCertificateEventsCompleted = createAction(GET_CERTIFICATE_EVENTS_COMPLETED)

export const deleteCertificate = createAction<string>(DELETE_CERTIFICATE)

export const deleteCertificateStarted = createAction(DELETE_CERTIFICATE_STARTED)

export const deleteCertificateSuccess = createAction(DELETE_CERTIFICATE_SUCCESS)

export const deleteCertificateError = createAction<string>(DELETE_CERTIFICATE_ERROR)

export const deleteCertificateCompleted = createAction(DELETE_CERTIFICATE_COMPLETED)

export const forwardCertificate = createAction<boolean>(FORWARD_CERTIFICATE)

export const forwardCertificateStarted = createAction(FORWARD_CERTIFICATE_STARTED)

export const forwardCertificateSuccess = createAction<Certificate>(FORWARD_CERTIFICATE_SUCCESS)

export const forwardCertificateError = createAction<string>(FORWARD_CERTIFICATE_ERROR)

export const forwardCertificateCompleted = createAction(FORWARD_CERTIFICATE_COMPLETED)

export const signCertificate = createAction(SIGN_CERTIFICATE)

export const signCertificateStarted = createAction(SIGN_CERTIFICATE_STARTED)

export const signCertificateSuccess = createAction<Certificate>(SIGN_CERTIFICATE_SUCCESS)

export const signCertificateError = createAction<string>(SIGN_CERTIFICATE_ERROR)

export const signCertificateCompleted = createAction(SIGN_CERTIFICATE_COMPLETED)

export interface RevokeCertificateReason {
  reason: string
  message: string
}

export const revokeCertificate = createAction<RevokeCertificateReason>(REVOKE_CERTIFICATE)

export const revokeCertificateStarted = createAction(REVOKE_CERTIFICATE_STARTED)

export const revokeCertificateSuccess = createAction<Certificate>(REVOKE_CERTIFICATE_SUCCESS)

export const revokeCertificateError = createAction<string>(REVOKE_CERTIFICATE_ERROR)

export const revokeCertificateCompleted = createAction(REVOKE_CERTIFICATE_COMPLETED)

export const replaceCertificate = createAction<History<LocationState>>(REPLACE_CERTIFICATE)

export const replaceCertificateStarted = createAction(REPLACE_CERTIFICATE_STARTED)

export interface ReplaceCertificateSuccess {
  certificateId: string
  history: History<LocationState>
}

export const replaceCertificateSuccess = createAction<ReplaceCertificateSuccess>(REPLACE_CERTIFICATE_SUCCESS)

export const replaceCertificateError = createAction<string>(REPLACE_CERTIFICATE_ERROR)

export const replaceCertificateCompleted = createAction(REPLACE_CERTIFICATE_COMPLETED)

export const validateCertificate = createAction<Certificate>(VALIDATE_CERTIFICATE)

export const validateCertificateStarted = createAction(VALIDATE_CERTIFICATE_STARTED)

interface ValidateCertificateSuccess {
  validationErrors: ValidationError[]
}

export const validateCertificateSuccess = createAction<ValidateCertificateSuccess>(VALIDATE_CERTIFICATE_SUCCESS)

export const validateCertificateError = createAction<string>(VALIDATE_CERTIFICATE_ERROR)

export const validateCertificateCompleted = createAction(VALIDATE_CERTIFICATE_COMPLETED)

export const autoSaveCertificate = createAction<Certificate>(AUTO_SAVE_CERTIFICATE)

export const autoSaveCertificateStarted = createAction(AUTO_SAVE_STARTED)

export const autoSaveCertificateCompleted = createAction(AUTO_SAVE_COMPLETED)

interface AutoSaveCertificateSuccess {
  version: number
}
export const autoSaveCertificateSuccess = createAction<AutoSaveCertificateSuccess>(AUTO_SAVE_SUCCESS)

export const autoSaveCertificateError = createAction<Certificate>(AUTO_SAVE_ERROR)

export const validateCertificateInFrontEnd = createAction<CertificateDataElement>(VALIDATE_CERTIFICATE_IN_FRONTEND)

export const validateCertificateInFrontEndCompleted = createAction(VALIDATE_CERTIFICATE_IN_FRONTEND_COMPLETED)

export const updateCertificate = createAction<Certificate>(UPDATE_CERTIFICATE)

export const updateCertificateEvents = createAction<CertificateEvent[]>(UPDATE_CERTIFICATE_EVENTS)

export const updateCertificateAsDeleted = createAction(UPDATE_CERTIFICATE_AS_DELETED)

export const updateCertificateAsReadOnly = createAction(UPDATE_CERTIFICATE_AS_READONLY)

export const updateCertificateStatus = createAction<CertificateStatus>(UPDATE_CERTIFICATE_STATUS)

export const updateCertificateDataElement = createAction<CertificateDataElement>(UPDATE_CERTIFICATE_DATA_ELEMENT)

export const updateCertificateVersion = createAction<number>(UPDATE_CERTIFICATE_VERSION)

export const showCertificateDataElement = createAction<string>(SHOW_CERTIFICATE_DATA_ELEMENT)

export const hideCertificateDataElement = createAction<string>(HIDE_CERTIFICATE_DATA_ELEMENT)

export const showCertificateDataElementMandatory = createAction<string>(SHOW_CERTIFICATE_DATA_ELEMENT_MANDATORY)

export const hideCertificateDataElementMandatory = createAction<string>(HIDE_CERTIFICATE_DATA_ELEMENT_MANDATORY)

export const setCertificateDataElement = createAction<CertificateDataElement>(SET_CERTIFICATE_DATA_ELEMENT)

export const showSpinner = createAction<string>(SHOW_CERTIFICATE_LOADING_SPINNER)

export const hideSpinner = createAction(HIDE_CERTIFICATE_LOADING_SPINNER)

export const updateValidationErrors = createAction<ValidationError[]>(UPDATE_VALIDATION_ERRORS)

export const showValidationErrors = createAction(SHOW_CERTIFICATE_VALIDATION_ERRORS)

export const hideValidationErrors = createAction(HIDE_CERTIFICATE_VALIDATION_ERRORS)

export const updateCertificateUnit = createAction<Unit>(UPDATE_CERTIFICATE_UNIT)

export const setCertificateUnitData = createAction<Unit>(SET_CERTIFICATE_UNIT_DATA)

export const printCertificate = createAction<CertificateMetadata>(PRINT_CERTIFICATE)
