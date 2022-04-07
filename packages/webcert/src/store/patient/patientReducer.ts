import { createReducer } from '@reduxjs/toolkit'
import { Patient, PatientStatus } from '@frontend/common'
import { clearPatientError, setPatient, setPatientError, setStatus } from './patientActions'
import { ErrorRequest } from '../error/errorReducer'

interface PatientState {
  patient: Patient | undefined
  status: PatientStatus | undefined
  error: ErrorRequest | undefined
}

const getInitialState = (): PatientState => {
  return {
    patient: undefined,
    status: undefined,
    error: undefined,
  }
}

const errorReducer = createReducer(getInitialState(), (builder) => [
  builder.addCase(setPatient, (state, action) => {
    state.patient = action.payload
  }),
  builder.addCase(setStatus, (state, action) => {
    state.status = action.payload
  }),
  builder.addCase(setPatientError, (state, action) => {
    state.error = action.payload
  }),
  builder.addCase(clearPatientError, (state) => {
    state.error = undefined
  }),
])

export default errorReducer
