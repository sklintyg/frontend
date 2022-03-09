import { createAction } from '@reduxjs/toolkit'
import { Patient } from '@frontend/common'

const PATIENT = '[Patient]'

export const setPatient = createAction<Patient>(`${PATIENT} Set patient`)
export const searchPatient = createAction<string>(`${PATIENT} Search patient`)
export const searchPatientStarted = createAction(`${PATIENT} Search patient started`)
export const searchPatientSuccess = createAction<Patient>(`${PATIENT} Search patient success`)
export const searchPatientError = createAction(`${PATIENT} Search patient error`)
