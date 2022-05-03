import { createAction } from '@reduxjs/toolkit'
import { CertificateType, Patient } from '@frontend/common'
import { PatientStatus } from '@frontend/common/src/types/patient'
import { ErrorRequest } from '../error/errorReducer'

const PATIENT = '[Patient]'

export const setPatient = createAction<Patient | undefined>(`${PATIENT} Set patient`)

export const getPatient = createAction<string>(`${PATIENT} Get patient`)
export const getPatientStarted = createAction(`${PATIENT} Get patient started`)

export interface GetPatientResponse {
  patient: Patient | null
  status: PatientStatus
}

export const getPatientSuccess = createAction<GetPatientResponse>(`${PATIENT} Get patient success`)
export const getPatientError = createAction<GetPatientResponse>(`${PATIENT} Get patient error`)
export const setPatientError = createAction<ErrorRequest>(`${PATIENT} Set patient error`)
export const clearPatientError = createAction(`${PATIENT} Clear patient error`)

export const setStatus = createAction<PatientStatus>(`${PATIENT} Set status`)

export const clearPatient = createAction(`${PATIENT} Clear patient`)

export const getCertificateTypes = createAction<string>(`${PATIENT} Get certificate types`)
export const getCertificateTypesStarted = createAction(`${PATIENT} Get certificate started`)
export const getCertificateTypesSuccess = createAction(`${PATIENT} Get certificate success`)
export const getCertificateTypesError = createAction<string>(`${PATIENT} Get certificate error`)

export const updateCertificateTypes = createAction<CertificateType[]>(`${PATIENT} Update certificate types`)
