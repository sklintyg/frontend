import { Certificate, CertificateDataElement, CertificateStatus, ValidationError } from '@frontend/common'
import { createAction } from '@reduxjs/toolkit'

const CERTIFICATE = '[CERTIFICATE]'

const GET_CERTIFICATE = `${CERTIFICATE} Get certificate`
const GET_CERTIFICATE_STARTED = `${CERTIFICATE} Get certificate started`
const GET_CERTIFICATE_SUCCESS = `${CERTIFICATE} Get certificate success`
const GET_CERTIFICATE_ERROR = `${CERTIFICATE} Get certificate error`
const GET_CERTIFICATE_COMPLETED = `${CERTIFICATE} Get certificate completed`

const SIGN_CERTIFICATE = `${CERTIFICATE} Sign certificate`
const SIGN_CERTIFICATE_STARTED = `${CERTIFICATE} Sign certificate started`
const SIGN_CERTIFICATE_SUCCESS = `${CERTIFICATE} Sign certificate success`
const SIGN_CERTIFICATE_ERROR = `${CERTIFICATE} Sign certificate error`
const SIGN_CERTIFICATE_COMPLETED = `${CERTIFICATE} Sign certificate completed`

const UPDATE_CERTIFICATE_STATUS = `${CERTIFICATE} Update certificate status`
const UPDATE_CERTIFICATE_AS_READONLY = `${CERTIFICATE} Update certificate as readonly`

const UPDATE_CERTIFICATE = `${CERTIFICATE} Update certificate`
const UPDATE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Update certificate data element`
const SET_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Set certificate data element`

const VALIDATE_CERTIFICATE = `${CERTIFICATE} Validate certificate`
const VALIDATE_CERTIFICATE_STARTED = `${CERTIFICATE} Validate certificate started`
const VALIDATE_CERTIFICATE_COMPLETED = `${CERTIFICATE} Validate certificate completed`
const VALIDATE_CERTIFICATE_SUCCESS = `${CERTIFICATE} Validate certificate success`
const VALIDATE_CERTIFICATE_ERROR = `${CERTIFICATE} Validate certificate error`

const UPDATE_VALIDATION_ERRORS = `${CERTIFICATE} Update validation errors`

const VALIDATE_CERTIFICATE_IN_FRONTEND = `${CERTIFICATE} Validate in frontend`
const VALIDATE_CERTIFICATE_IN_FRONTEND_COMPLETED = `${CERTIFICATE} Validate in frontend completed`

const AUTO_SAVE_CERTIFICATE = `${CERTIFICATE} Auto save`
const AUTO_SAVE_STARTED = `${CERTIFICATE} Auto save started`
const AUTO_SAVE_COMPLETED = `${CERTIFICATE} Auto save completed`
const AUTO_SAVE_SUCCESS = `${CERTIFICATE} Auto save success`
const AUTO_SAVE_ERROR = `${CERTIFICATE} Auto save error`

const SHOW_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Show data element`
const HIDE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Hide data element`

const SHOW_CERTIFICATE_DATA_ELEMENT_MANDATORY = `${CERTIFICATE} Show mandatory on data element`
const HIDE_CERTIFICATE_DATA_ELEMENT_MANDATORY = `${CERTIFICATE} Hide mandatory on data element`

const SHOW_CERTIFICATE_LOADING_SPINNER = `${CERTIFICATE} Show spinner`
const HIDE_CERTIFICATE_LOADING_SPINNER = `${CERTIFICATE} Hide spinner`

const SHOW_CERTIFICATE_VALIDATION_ERRORS = `${CERTIFICATE} Show validation errors`
const HIDE_CERTIFICATE_VALIDATION_ERRORS = `${CERTIFICATE} Hide validation errors`

export const getCertificate = createAction<string>(GET_CERTIFICATE)

export const getCertificateStarted = createAction(GET_CERTIFICATE_STARTED)

export const getCertificateSuccess = createAction<any>(GET_CERTIFICATE_SUCCESS)

export const getCertificateError = createAction<string>(GET_CERTIFICATE_ERROR)

export const getCertificateCompleted = createAction(GET_CERTIFICATE_COMPLETED)

export const signCertificate = createAction(SIGN_CERTIFICATE)

export const signCertificateStarted = createAction(SIGN_CERTIFICATE_STARTED)

export const signCertificateSuccess = createAction<any>(SIGN_CERTIFICATE_SUCCESS)

export const signCertificateError = createAction<string>(SIGN_CERTIFICATE_ERROR)

export const signCertificateCompleted = createAction(SIGN_CERTIFICATE_COMPLETED)

export const updateCertificate = createAction<Certificate>(UPDATE_CERTIFICATE)

export const updateCertificateAsReadOnly = createAction(UPDATE_CERTIFICATE_AS_READONLY)

export const updateCertificateStatus = createAction<CertificateStatus>(UPDATE_CERTIFICATE_STATUS)

export const updateCertificateDataElement = createAction<CertificateDataElement>(UPDATE_CERTIFICATE_DATA_ELEMENT)

export const showCertificateDataElement = createAction<string>(SHOW_CERTIFICATE_DATA_ELEMENT)

export const hideCertificateDataElement = createAction<string>(HIDE_CERTIFICATE_DATA_ELEMENT)

export const showCertificateDataElementMandatory = createAction<string>(SHOW_CERTIFICATE_DATA_ELEMENT_MANDATORY)

export const hideCertificateDataElementMandatory = createAction<string>(HIDE_CERTIFICATE_DATA_ELEMENT_MANDATORY)

export const setCertificateDataElement = createAction<CertificateDataElement>(SET_CERTIFICATE_DATA_ELEMENT)

export const validateCertificate = createAction<Certificate>(VALIDATE_CERTIFICATE)

export const validateCertificateStarted = createAction(VALIDATE_CERTIFICATE_STARTED)

export const validateCertificateSuccess = createAction<ValidationError[]>(VALIDATE_CERTIFICATE_SUCCESS)

export const validateCertificateError = createAction<string>(VALIDATE_CERTIFICATE_ERROR)

export const validateCertificateCompleted = createAction(VALIDATE_CERTIFICATE_COMPLETED)

export const validateCertificateInFrontEnd = createAction<CertificateDataElement>(VALIDATE_CERTIFICATE_IN_FRONTEND)

export const validateCertificateInFrontEndCompleted = createAction(VALIDATE_CERTIFICATE_IN_FRONTEND_COMPLETED)

export const autoSaveCertificate = createAction<Certificate>(AUTO_SAVE_CERTIFICATE)

export const autoSaveCertificateStarted = createAction(AUTO_SAVE_STARTED)

export const autoSaveCertificateCompleted = createAction<Certificate>(AUTO_SAVE_COMPLETED)

export const autoSaveCertificateSuccess = createAction<Certificate>(AUTO_SAVE_SUCCESS)

export const autoSaveCertificateError = createAction<Certificate>(AUTO_SAVE_ERROR)

export const showSpinner = createAction<string>(SHOW_CERTIFICATE_LOADING_SPINNER)

export const hideSpinner = createAction(HIDE_CERTIFICATE_LOADING_SPINNER)

export const updateValidationErrors = createAction<ValidationError[]>(UPDATE_VALIDATION_ERRORS)

export const showValidationErrors = createAction(SHOW_CERTIFICATE_VALIDATION_ERRORS)

export const hideValidationErrors = createAction(HIDE_CERTIFICATE_VALIDATION_ERRORS)
