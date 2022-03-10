import { createAction } from '@reduxjs/toolkit'
import { Patient } from '@frontend/common'
import { PatientStatus } from '@frontend/common/src/types/patient'

const PATIENT = '[Patient]'

export const setPatient = createAction<Patient>(`${PATIENT} Set patient`)
export const getPatient = createAction<string>(`${PATIENT} Get patient`)
export const getPatientStarted = createAction(`${PATIENT} Get patient started`)

export interface GetPatientSuccess {
  patient: Patient
  status: PatientStatus
}

export const getPatientSuccess = createAction<GetPatientSuccess>(`${PATIENT} Get patient success`)
export const getPatientError = createAction(`${PATIENT} Get patient error`)
