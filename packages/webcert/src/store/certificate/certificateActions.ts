import {
  Certificate,
  CertificateDataElement,
  CertificateEvent,
  CertificateMetadata,
  CertificateSignStatus,
  CertificateStatus,
  Complement,
  ModalData,
  Patient,
  Unit,
  ValidationError,
  ValidationResult,
} from '@frontend/common'
import { createAction } from '@reduxjs/toolkit'
import { FunctionDisabler, TOGGLE_FUNCTION_DISABLER } from '../../utils/functionDisablerUtils'
import { ApiError } from '../api/apiActions'

const CERTIFICATE = '[CERTIFICATE]'

const CREATE_NEW_CERTIFICATE = `${CERTIFICATE} Create certificate`
const CREATE_NEW_CERTIFICATE_STARTED = `${CERTIFICATE} Create certificate started`
const CREATE_NEW_CERTIFICATE_SUCCESS = `${CERTIFICATE} Create certificate success`
const CREATE_NEW_CERTIFICATE_ERROR = `${CERTIFICATE} Create certificate started`
const UPDATE_CERTIFICATE_ID = `${CERTIFICATE} Update certificate id`

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

const UPDATE_ROUTED_FROM_DELETED_CERTIFICATE = `${CERTIFICATE} update routed from deleted certificate`

const FORWARD_CERTIFICATE = `${CERTIFICATE} Forward certificate`
const FORWARD_CERTIFICATE_STARTED = `${CERTIFICATE} Forward certificate started`
const FORWARD_CERTIFICATE_SUCCESS = `${CERTIFICATE} Forward certificate success`
const FORWARD_CERTIFICATE_ERROR = `${CERTIFICATE} Forward certificate error`
const FORWARD_CERTIFICATE_COMPLETED = `${CERTIFICATE} Forward certificate completed`

const READY_FOR_SIGN = `${CERTIFICATE} Ready for sign`
const READY_FOR_SIGN_STARTED = `${CERTIFICATE} Ready for sign started`
const READY_FOR_SIGN_SUCCESS = `${CERTIFICATE} Ready for sign success`
const READY_FOR_SIGN_ERROR = `${CERTIFICATE} Ready for sign error`
const READY_FOR_SIGN_COMPLETED = `${CERTIFICATE} Ready for sign completed`
const SET_READY_FOR_SIGN = `${CERTIFICATE} Set ready for sign`

const SEND_CERTIFICATE = `${CERTIFICATE} Send certificate`
const SEND_CERTIFICATE_SUCCESS = `${CERTIFICATE} Send certificate success`
const SEND_CERTIFICATE_ERROR = `${CERTIFICATE} Send certificate error`

const SIGN_CERTIFICATE = `${CERTIFICATE} Sign certificate`
const SIGN_CERTIFICATE_STARTED = `${CERTIFICATE} Sign certificate started`
const SIGN_CERTIFICATE_SUCCESS = `${CERTIFICATE} Sign certificate success`
const SIGN_CERTIFICATE_ERROR = `${CERTIFICATE} Sign certificate error`
const SIGN_CERTIFICATE_COMPLETED = `${CERTIFICATE} Sign certificate completed`
const FAKE_SIGN_CERTIFICATE = `${CERTIFICATE} Fake sign certificate`
const FAKE_SIGN_CERTIFICATE_SUCCESS = `${CERTIFICATE} Fake sign certificate success`
const UPDATE_SIGN_CERTIFICATE_STATUS = `${CERTIFICATE} update sign status`
const SIGN_CERTIFICATE_STATUS_SUCCESS = `${CERTIFICATE} Get certificate sign status success`
const SIGN_CERTIFICATE_STATUS_ERROR = `${CERTIFICATE} Get certificate sign status error`

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

const COMPLEMENT_CERTIFICATE = `${CERTIFICATE} Complement certificate`
const COMPLEMENT_CERTIFICATE_STARTED = `${CERTIFICATE} Complement certificate started`
const COMPLEMENT_CERTIFICATE_SUCCESS = `${CERTIFICATE} Complement certificate success`
const COMPLEMENT_CERTIFICATE_ERROR = `${CERTIFICATE} Complement certificate error`
const COMPLEMENT_CERTIFICATE_COMPLETED = `${CERTIFICATE} Complement certificate completed`

const ANSWER_COMPLEMENT_CERTIFICATE = `${CERTIFICATE} Answer complement certificate`
const ANSWER_COMPLEMENT_CERTIFICATE_STARTED = `${CERTIFICATE} Answer complement certificate started`
const ANSWER_COMPLEMENT_CERTIFICATE_SUCCESS = `${CERTIFICATE} Answer complement certificate success`
const ANSWER_COMPLEMENT_CERTIFICATE_ERROR = `${CERTIFICATE} Answer complement certificate error`

const RENEW_CERTIFICATE = `${CERTIFICATE} Renew certificate`
const RENEW_CERTIFICATE_STARTED = `${CERTIFICATE} Renew certificate started`
const RENEW_CERTIFICATE_SUCCESS = `${CERTIFICATE} Renew certificate success`
const RENEW_CERTIFICATE_ERROR = `${CERTIFICATE} Renew certificate error`
const RENEW_CERTIFICATE_COMPLETED = `${CERTIFICATE} Renew certificate completed`

const CREATE_CERTIFICATE_FROM_CANDIDATE = `${CERTIFICATE} Create certificate from candidate`
const CREATE_CERTIFICATE_FROM_CANDIDATE_STARTED = `${CERTIFICATE} Create certificate started from candidate`
const CREATE_CERTIFICATE_FROM_CANDIDATE_SUCCESS = `${CERTIFICATE} Create certificate success from candidate`
const CREATE_CERTIFICATE_FROM_CANDIDATE_ERROR = `${CERTIFICATE} Create certificate error from candidate`

const CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE = `${CERTIFICATE} Create certificate from candidate with message`
const CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE_STARTED = `${CERTIFICATE} Create certificate started from candidate with message`
const CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE_SUCCESS = `${CERTIFICATE} Create certificate success from candidate with message`
const CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE_ERROR = `${CERTIFICATE} Create certificate error from candidate with message`

const CREATE_CERTIFICATE_FROM_TEMPLATE = `${CERTIFICATE} Create certificate from template`
const CREATE_CERTIFICATE_FROM_TEMPLATE_STARTED = `${CERTIFICATE} Create certificate started from template`
const CREATE_CERTIFICATE_FROM_TEMPLATE_SUCCESS = `${CERTIFICATE} Create certificate success from template`
const CREATE_CERTIFICATE_FROM_TEMPLATE_ERROR = `${CERTIFICATE} Create certificate error from template`

const COPY_CERTIFICATE = `${CERTIFICATE} Copy certificate`
const COPY_CERTIFICATE_STARTED = `${CERTIFICATE} Copy certificate started`
const COPY_CERTIFICATE_SUCCESS = `${CERTIFICATE} Copy certificate success`
const COPY_CERTIFICATE_ERROR = `${CERTIFICATE} Copy certificate error`
const COPY_CERTIFICATE_COMPLETED = `${CERTIFICATE} Copy certificate completed`

const VALIDATE_CERTIFICATE = `${CERTIFICATE} Validate certificate`
const VALIDATE_CERTIFICATE_STARTED = `${CERTIFICATE} Validate certificate started`
const VALIDATE_CERTIFICATE_COMPLETED = `${CERTIFICATE} Validate certificate completed`
const VALIDATE_CERTIFICATE_SUCCESS = `${CERTIFICATE} Validate certificate success`
const VALIDATE_CERTIFICATE_ERROR = `${CERTIFICATE} Validate certificate error`

const UPDATE_CERTIFICATE_STATUS = `${CERTIFICATE} Update certificate status`
const UPDATE_CERTIFICATE_UNIT = `${CERTIFICATE} Update certificate unit`
const UPDATE_CERTIFICATE_PATIENT = `${CERTIFICATE} Update certificate patient`

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
const UPDATE_CERTIFICATE_COMPLEMENTS = `${CERTIFICATE} Update certificate complements`
const UPDATE_GOTO_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Update goto certificate data element`
const CLEAR_GOTO_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Clear goto certificate data element`

const SET_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Set certificate data element`
const SET_CERTIFICATE_UNIT_DATA = `${CERTIFICATE} Set certificate unit data`
const SET_CERTIFICATE_PATIENT_DATA = `${CERTIFICATE} Set certificate patient data`

const SHOW_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Show data element`
const HIDE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Hide data element`
const UNHIDE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Unhide data element`

const SHOW_CERTIFICATE_DATA_ELEMENT_MANDATORY = `${CERTIFICATE} Show mandatory on data element`
const HIDE_CERTIFICATE_DATA_ELEMENT_MANDATORY = `${CERTIFICATE} Hide mandatory on data element`

const SHOW_CERTIFICATE_LOADING_SPINNER = `${CERTIFICATE} Show spinner`
const HIDE_CERTIFICATE_LOADING_SPINNER = `${CERTIFICATE} Hide spinner`

const SHOW_CERTIFICATE_VALIDATION_ERRORS = `${CERTIFICATE} Show validation errors`
const HIDE_CERTIFICATE_VALIDATION_ERRORS = `${CERTIFICATE} Hide validation errors`

const PRINT_CERTIFICATE = `${CERTIFICATE} Print certificate`

const SET_DISABLED_CERTIFICATE_DATA_CHILD = `${CERTIFICATE} Set certificate child element to disabled or not`
const ENABLE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Enable certificate data element`
const DISABLE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Disable certificate data element`

const SET_CERTIFICATE_SIGNING = `${CERTIFICATE} Set certificate signing`

const HIGHLIGHT_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Highlight data element`
const UNSTYLE_CERTIFICATE_DATA_ELEMENT = `${CERTIFICATE} Unstyle data element`
const APPLY_CERTIFICATE_DATAELEMENT_AUTO_FILL = `${CERTIFICATE} Apply data element auto fill`
const API_CERTIFICATE_GENERIC_ERROR = `${CERTIFICATE} Api certificate generic error`

const SET_VALIDATION_ERRORS_FOR_QUESTION = `${CERTIFICATE} Set validation errors for question`

const SHOW_RELATED_CERTIFICATE = `${CERTIFICATE} Show related certificate`
const SHOW_RELATED_CERTIFICATE_STARTED = `${CERTIFICATE} Show related certificate started`
const SHOW_RELATED_CERTIFICATE_SUCCESS = `${CERTIFICATE} Show related certificate success`
const SHOW_RELATED_CERTIFICATE_ERROR = `${CERTIFICATE} Show related certificate error`
const SHOW_RELATED_CERTIFICATE_COMPLETED = `${CERTIFICATE} Show related certificate completed`

export interface CreateCertificateResponse {
  certificateId: string
}

export interface CreateCertificate {
  certificateType: string
  patientId: string
}

export const createNewCertificate = createAction<CreateCertificate>(CREATE_NEW_CERTIFICATE)
export const createNewCertificateStarted = createAction(CREATE_NEW_CERTIFICATE_STARTED)
export const createNewCertificateSuccess = createAction<CreateCertificateResponse>(CREATE_NEW_CERTIFICATE_SUCCESS)
export const createNewCertificateError = createAction<string>(CREATE_NEW_CERTIFICATE_ERROR)
export const updateCreatedCertificateId = createAction<string>(UPDATE_CERTIFICATE_ID)

export const getCertificate = createAction<string>(GET_CERTIFICATE)

export const getCertificateStarted = createAction(GET_CERTIFICATE_STARTED)

export interface GetCertificateSuccess {
  certificate: Certificate
}

export const getCertificateSuccess = createAction<GetCertificateSuccess>(GET_CERTIFICATE_SUCCESS)

export const getCertificateError = createAction<CertificateApiGenericError>(GET_CERTIFICATE_ERROR)

export const getCertificateCompleted = createAction(GET_CERTIFICATE_COMPLETED)

export const getCertificateEvents = createAction<string>(GET_CERTIFICATE_EVENTS)

export const getCertificateEventsStarted = createAction(GET_CERTIFICATE_EVENTS_STARTED)

export interface GetCertificateEventsSuccess {
  certificateEvents: CertificateEvent[]
}

export const getCertificateEventsSuccess = createAction<GetCertificateEventsSuccess>(GET_CERTIFICATE_EVENTS_SUCCESS)

export const getCertificateEventsError = createAction<string>(GET_CERTIFICATE_EVENTS_ERROR)

export const getCertificateEventsCompleted = createAction(GET_CERTIFICATE_EVENTS_COMPLETED)

export interface DeleteCertificate {
  certificateId: string
}

export const deleteCertificate = createAction<DeleteCertificate>(DELETE_CERTIFICATE)

export const deleteCertificateStarted = createAction(DELETE_CERTIFICATE_STARTED)

export interface DeleteCertificateSuccess {
  parentCertificateId: string
}

export const deleteCertificateSuccess = createAction<DeleteCertificateSuccess>(DELETE_CERTIFICATE_SUCCESS)

export const deleteCertificateError = createAction<string>(DELETE_CERTIFICATE_ERROR)

export const deleteCertificateCompleted = createAction(DELETE_CERTIFICATE_COMPLETED)

export const updateRoutedFromDeletedCertificate = createAction<boolean>(UPDATE_ROUTED_FROM_DELETED_CERTIFICATE)

export const forwardCertificate = createAction<ForwardCertificateRequest>(FORWARD_CERTIFICATE)

export const forwardCertificateStarted = createAction(FORWARD_CERTIFICATE_STARTED)

export interface ForwardCertificateRequest {
  certificateId: string
  forward: boolean
}

export interface ForwardCertificateSuccess {
  certificate: Certificate
}

export const forwardCertificateSuccess = createAction<ForwardCertificateSuccess>(FORWARD_CERTIFICATE_SUCCESS)

export const forwardCertificateError = createAction<string>(FORWARD_CERTIFICATE_ERROR)

export const forwardCertificateCompleted = createAction(FORWARD_CERTIFICATE_COMPLETED)

export const readyForSign = createAction(READY_FOR_SIGN)

export const readyForSignStarted = createAction(READY_FOR_SIGN_STARTED)

export interface ReadyForSignSuccess {
  certificate: Certificate
}

export const readyForSignSuccess = createAction<ReadyForSignSuccess>(READY_FOR_SIGN_SUCCESS)

export const readyForSignError = createAction<string>(READY_FOR_SIGN_ERROR)

export const readyForSignCompleted = createAction(READY_FOR_SIGN_COMPLETED)

export const setReadyForSign = createAction<string>(SET_READY_FOR_SIGN)

export const sendCertificate = createAction<string>(SEND_CERTIFICATE)
export const sendCertificateSuccess = createAction<SendCertificateSuccess>(SEND_CERTIFICATE_SUCCESS)
export const sendCertificateError = createAction<string>(SEND_CERTIFICATE_ERROR)

export interface SendCertificateSuccess {
  certificateId: string
  result: string
}

export const startSignCertificate = createAction(SIGN_CERTIFICATE)

export const signCertificateStarted = createAction(SIGN_CERTIFICATE_STARTED)

export interface FakeSignCertificateSuccess {
  certificate: Certificate
}

export const fakeSignCertificateSuccess = createAction<FakeSignCertificateSuccess>(FAKE_SIGN_CERTIFICATE_SUCCESS)

export const startSignCertificateSuccess = createAction<SigningData>(SIGN_CERTIFICATE_SUCCESS)

export const fakeSignCertificate = createAction(FAKE_SIGN_CERTIFICATE)

export const signCertificateError = createAction<string>(SIGN_CERTIFICATE_ERROR)

export const signCertificateCompleted = createAction(SIGN_CERTIFICATE_COMPLETED)

export const updateCertificateSignStatus = createAction<CertificateSignStatus>(UPDATE_SIGN_CERTIFICATE_STATUS)

export const signCertificateStatusSuccess = createAction(SIGN_CERTIFICATE_STATUS_SUCCESS)

export const signCertificateStatusError = createAction<CertificateApiGenericError>(SIGN_CERTIFICATE_STATUS_ERROR)

export interface RevokeCertificateReason {
  reason: string
  message: string
  title: string
}

export const revokeCertificate = createAction<RevokeCertificateReason>(REVOKE_CERTIFICATE)

export const revokeCertificateStarted = createAction(REVOKE_CERTIFICATE_STARTED)

export interface RevokeCertificateSuccess {
  certificate: Certificate
}

export const revokeCertificateSuccess = createAction<RevokeCertificateSuccess>(REVOKE_CERTIFICATE_SUCCESS)

export const revokeCertificateError = createAction<string>(REVOKE_CERTIFICATE_ERROR)

export const revokeCertificateCompleted = createAction(REVOKE_CERTIFICATE_COMPLETED)

export const replaceCertificate = createAction(REPLACE_CERTIFICATE)

export const replaceCertificateStarted = createAction(REPLACE_CERTIFICATE_STARTED)

export interface ReplaceCertificateSuccess {
  certificateId: string
}

export const replaceCertificateSuccess = createAction<ReplaceCertificateSuccess>(REPLACE_CERTIFICATE_SUCCESS)

export const replaceCertificateError = createAction<string>(REPLACE_CERTIFICATE_ERROR)

export const replaceCertificateCompleted = createAction(REPLACE_CERTIFICATE_COMPLETED)

export interface ComplementCertificate {
  message: string
}

export const complementCertificate = createAction<ComplementCertificate>(COMPLEMENT_CERTIFICATE)

export const complementCertificateStarted = createAction(COMPLEMENT_CERTIFICATE_STARTED)

export interface ComplementCertificateSuccess {
  certificate: Certificate
}

export const complementCertificateSuccess = createAction<ComplementCertificateSuccess>(COMPLEMENT_CERTIFICATE_SUCCESS)

export const complementCertificateError = createAction<string>(COMPLEMENT_CERTIFICATE_ERROR)

export const complementCertificateCompleted = createAction(COMPLEMENT_CERTIFICATE_COMPLETED)

export const answerComplementCertificate = createAction<string>(ANSWER_COMPLEMENT_CERTIFICATE)

export const answerComplementCertificateStarted = createAction(ANSWER_COMPLEMENT_CERTIFICATE_STARTED)

export const answerComplementCertificateSuccess = createAction<ComplementCertificateSuccess>(ANSWER_COMPLEMENT_CERTIFICATE_SUCCESS)

export const answerComplementCertificateError = createAction<string>(ANSWER_COMPLEMENT_CERTIFICATE_ERROR)

export const renewCertificate = createAction<RenewCertificate>(RENEW_CERTIFICATE)

export const renewCertificateStarted = createAction(RENEW_CERTIFICATE_STARTED)

export interface RenewCertificate {
  certificateId: string
}

export const renewCertificateSuccess = createAction<RenewCertificate>(RENEW_CERTIFICATE_SUCCESS)

export const renewCertificateError = createAction<string>(RENEW_CERTIFICATE_ERROR)

export const renewCertificateCompleted = createAction(RENEW_CERTIFICATE_COMPLETED)

export const showRelatedCertificate = createAction<ShowRelatedCertificate>(SHOW_RELATED_CERTIFICATE)

export const showRelatedCertificateStarted = createAction(SHOW_RELATED_CERTIFICATE_STARTED)

export interface ShowRelatedCertificate {
  certificateId: string
}

export const showRelatedCertificateSuccess = createAction<ShowRelatedCertificate>(SHOW_RELATED_CERTIFICATE_SUCCESS)

export const showRelatedCertificateError = createAction<string>(SHOW_RELATED_CERTIFICATE_ERROR)

export const showRelatedCertificateCompleted = createAction(SHOW_RELATED_CERTIFICATE_COMPLETED)

export const copyCertificate = createAction(COPY_CERTIFICATE)

export const copyCertificateStarted = createAction(COPY_CERTIFICATE_STARTED)

export const createCertificateFromTemplate = createAction(CREATE_CERTIFICATE_FROM_TEMPLATE)

export const createCertificateFromTemplateStarted = createAction(CREATE_CERTIFICATE_FROM_TEMPLATE_STARTED)

export const createCertificateFromTemplateSuccess = createAction<CreateCertificateFromTemplateSuccess>(
  CREATE_CERTIFICATE_FROM_TEMPLATE_SUCCESS
)

export const createCertificateFromTemplateError = createAction<string>(CREATE_CERTIFICATE_FROM_TEMPLATE_ERROR)

export interface CreateCertificateFromTemplateSuccess {
  certificateId: string
}

export const createCertificateFromCandidate = createAction(CREATE_CERTIFICATE_FROM_CANDIDATE)

export const createCertificateFromCandidateStarted = createAction(CREATE_CERTIFICATE_FROM_CANDIDATE_STARTED)

export const createCertificateFromCandidateSuccess = createAction<CreateCertificateFromCandidateSuccess>(
  CREATE_CERTIFICATE_FROM_CANDIDATE_SUCCESS
)

export const createCertificateFromCandidateError = createAction<string>(CREATE_CERTIFICATE_FROM_CANDIDATE_ERROR)

export interface CreateCertificateFromCandidateSuccess {
  certificateId: string
}

export const createCertificateFromCandidateWithMessage = createAction(CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE)

export const createCertificateFromCandidateWithMessageStarted = createAction(CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE_STARTED)

export const createCertificateFromCandidateWithMessageSuccess = createAction<CreateCertificateFromCandidateWithMessageSuccess>(
  CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE_SUCCESS
)

export const createCertificateFromCandidateWithMessageError = createAction<string>(CREATE_CERTIFICATE_FROM_CANDIDATE_WITH_MESSAGE_ERROR)

export interface CreateCertificateFromCandidateWithMessageSuccess {
  modal: ModalData
}

export interface CopyCertificateSuccess {
  certificateId: string
}

export const copyCertificateSuccess = createAction<CopyCertificateSuccess>(COPY_CERTIFICATE_SUCCESS)

export const copyCertificateError = createAction<string>(COPY_CERTIFICATE_ERROR)

export const copyCertificateCompleted = createAction(COPY_CERTIFICATE_COMPLETED)

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

interface AutoSaveCertificateError {
  error: ApiError
}

export const autoSaveCertificateError = createAction<AutoSaveCertificateError>(AUTO_SAVE_ERROR)

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

export const unhideCertificateDataElement = createAction<string>(UNHIDE_CERTIFICATE_DATA_ELEMENT)

export const showCertificateDataElementMandatory = createAction<string>(SHOW_CERTIFICATE_DATA_ELEMENT_MANDATORY)

export const hideCertificateDataElementMandatory = createAction<string>(HIDE_CERTIFICATE_DATA_ELEMENT_MANDATORY)

export const setDisabledCertificateDataChild = createAction<ValidationResult>(SET_DISABLED_CERTIFICATE_DATA_CHILD)

export const enableCertificateDataElement = createAction<string>(ENABLE_CERTIFICATE_DATA_ELEMENT)

export const disableCertificateDataElement = createAction<string>(DISABLE_CERTIFICATE_DATA_ELEMENT)

export const setCertificateDataElement = createAction<CertificateDataElement>(SET_CERTIFICATE_DATA_ELEMENT)

export const showSpinner = createAction<string>(SHOW_CERTIFICATE_LOADING_SPINNER)

export const hideSpinner = createAction(HIDE_CERTIFICATE_LOADING_SPINNER)

export const updateValidationErrors = createAction<ValidationError[]>(UPDATE_VALIDATION_ERRORS)

export const showValidationErrors = createAction(SHOW_CERTIFICATE_VALIDATION_ERRORS)

export const hideValidationErrors = createAction(HIDE_CERTIFICATE_VALIDATION_ERRORS)

export const updateCertificateUnit = createAction<Unit>(UPDATE_CERTIFICATE_UNIT)

export const setCertificateUnitData = createAction<Unit>(SET_CERTIFICATE_UNIT_DATA)

export const updateCertificatePatient = createAction<Patient>(UPDATE_CERTIFICATE_PATIENT)

export const setCertificatePatientData = createAction<Patient>(SET_CERTIFICATE_PATIENT_DATA)

export const printCertificate = createAction<CertificateMetadata & { iframe: HTMLIFrameElement }>(PRINT_CERTIFICATE)

export const updateCertificateComplements = createAction<Complement[]>(UPDATE_CERTIFICATE_COMPLEMENTS)

export interface GotoCertificateDataElement {
  questionId: string
  valueId: string
}

export const updateGotoCertificateDataElement = createAction<GotoCertificateDataElement>(UPDATE_GOTO_CERTIFICATE_DATA_ELEMENT)

export const clearGotoCertificateDataElement = createAction(CLEAR_GOTO_CERTIFICATE_DATA_ELEMENT)

export interface SigningData {
  actionUrl: string
  id: string
  signRequest: string
}

export const updateCertificateSigningData = createAction<SigningData>(SET_CERTIFICATE_SIGNING)
export const highlightCertificateDataElement = createAction<string>(HIGHLIGHT_CERTIFICATE_DATA_ELEMENT)

export const unstyleCertificateDataElement = createAction<string>(UNSTYLE_CERTIFICATE_DATA_ELEMENT)

export const applyCertificateDataElementAutoFill = createAction<ValidationResult>(APPLY_CERTIFICATE_DATAELEMENT_AUTO_FILL)

export interface CertificateApiGenericError {
  error: ApiError
  certificateId: string
}

export const certificateApiGenericError = createAction<CertificateApiGenericError>(API_CERTIFICATE_GENERIC_ERROR)

export interface ModifyValidationErrors {
  questionId: string
  validationErrors: ValidationError[]
}

export interface UpdateValidationError {
  shouldBeRemoved: boolean
  validationError: ValidationError
}

export const toggleCertificateFunctionDisabler = createAction<FunctionDisabler>(`${CERTIFICATE} ${TOGGLE_FUNCTION_DISABLER}`)

export const setValidationErrorsForQuestion = createAction<ModifyValidationErrors>(SET_VALIDATION_ERRORS_FOR_QUESTION)

export const updateIsDeleted = createAction<boolean>(`${CERTIFICATE} Update is deleted`)

export const updateShouldRouteAfterDelete = createAction<boolean>(`${CERTIFICATE} Update should route after delete`)

export const resetCertificateState = createAction(`${CERTIFICATE} Reset certificate state`)

export const updateModalData = createAction<ModalData>(`${CERTIFICATE} Update Modal data`)
