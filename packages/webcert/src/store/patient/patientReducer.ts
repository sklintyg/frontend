import { createReducer } from '@reduxjs/toolkit'
import { CertificateType, Patient, PatientStatus } from '@frontend/common'
import { clearPatient, clearPatientError, setPatient, setPatientError, setStatus, updateCertificateTypes } from './patientActions'
import { ErrorRequest } from '../error/errorReducer'

interface PatientState {
  patient: Patient | undefined
  status: PatientStatus | undefined
  error: ErrorRequest | undefined
  certificateTypes: CertificateType[]
}

const getInitialState = (): PatientState => {
  return {
    patient: undefined,
    status: undefined,
    error: undefined,
    certificateTypes: [],
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
  builder.addCase(clearPatient, (state) => {
    state.patient = undefined
  }),
  builder.addCase(updateCertificateTypes, (state, action) => {
    state.certificateTypes = Object.values(action.payload)
  }),
])

export default errorReducer
