import { createAction } from '@reduxjs/toolkit'
import { Patient } from '@frontend/common'
import { PatientStatus } from '@frontend/common/src/types/patient'
import { History, LocationState } from 'history'

const PATIENT = '[Patient]'

export const setPatient = createAction<Patient>(`${PATIENT} Set patient`)

export interface GetPatient {
  patientId: string
  history: History<LocationState>
}

export const getPatient = createAction<GetPatient>(`${PATIENT} Get patient`)
export const getPatientStarted = createAction(`${PATIENT} Get patient started`)

export interface GetPatientSuccess {
  patient: Patient
  status: PatientStatus
  history: History<LocationState>
}

export const getPatientSuccess = createAction<GetPatientSuccess>(`${PATIENT} Get patient success`)
export const getPatientError = createAction(`${PATIENT} Get patient error`)

export const setStatus = createAction<PatientStatus>(`${PATIENT} Set status`)

export const clearPatient = createAction(`${PATIENT} Clear patient`)
export const changePatient = createAction<History<LocationState>>(`${PATIENT} Change patient`)
