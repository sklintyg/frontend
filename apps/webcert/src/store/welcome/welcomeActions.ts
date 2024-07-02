import { createAction } from '@reduxjs/toolkit'
import type { Patient } from '../../types'
import type { CertificateType, CreateCertificate, IntegrationParameters, IntegrationParametersDisablers } from './welcomeReducer'

export const getCertificateTypes = createAction('[Welcome] Get certificate types')
export const getCertificateTypesStarted = createAction('[Welcome] Get certificate types started')

interface CertificateTypesResponse {
  certificateTypes: CertificateType[]
}

export const getCertificateTypesSuccess = createAction<CertificateTypesResponse>('[Welcome] Get certificate types success')
export const getCertificateTypesError = createAction<string>('[Welcome] Get certificate types error')

export const updateCertificateTypes = createAction<CertificateType[]>('[Welcome] Update certificate types')

export const getPatients = createAction('[Welcome] Get patients')
export const getPatientsStarted = createAction('[Welcome] Get patients started')

interface CertificatePatientsResponse {
  patients: Patient[]
}

export const getPatientsSuccess = createAction<CertificatePatientsResponse>('[Welcome] Get patients success')
export const getPatientsError = createAction<string>('[Welcome] Get patients error')

export const updatePatients = createAction<Patient[]>('[Welcome] Update patients')

export const updateCreateCertificate = createAction<CreateCertificate>('[Welcome] Update create certificate')

export const createNewCertificate = createAction<CreateCertificate>('[Welcome] Create certificate')
export const createNewCertificateStarted = createAction('[Welcome] Create certificate started')

interface CreateCertificateResponse {
  certificateId: string
}

export const createNewCertificateSuccess = createAction<CreateCertificateResponse>('[Welcome] Create certificate success')
export const createNewCertificateError = createAction<string>('[Welcome] Create certificate error')
export const updateCertificateId = createAction<string>('[Welcome] Update certificate id')

export const loginUser = createAction<string>('[Welcome] Login user')
export const loginUserStarted = createAction('[Welcome] Login user started')
export const loginUserSuccess = createAction('[Welcome] Login user success')
export const loginUserError = createAction('[Welcome] Login user error')
export const loginUserCompleted = createAction('[Welcome] Login user completed')

export const updateNavigateToCertificate = createAction<boolean>('[Welcome] NavigateToCertificate')
export const clearWelcome = createAction('[Welcome] Clear Welcome')
export const updateIntegrationParameters = createAction<IntegrationParameters>('[Welcome] Update integration parameters')
export const updateIntegrationParametersDisablers = createAction<IntegrationParametersDisablers>(
  '[Welcome] Update integration parameters disablers'
)

export const populateFmb = createAction('[Welcome] Populate FMB')
export const populateFmbStarted = createAction('[Welcome] Populate FMB started')
export const populateFmbSuccess = createAction('[Welcome] Populate FMB success')

export const initateApplication = createAction('[Welcome] Initiate application')
