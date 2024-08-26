import { createReducer } from '@reduxjs/toolkit'
import type { CertificateType, Patient, PatientStatus } from '../../types'
import type { ErrorRequest } from '../error/errorReducer'
import {
  clearPatient,
  clearPatientError,
  isLoadingCertificateTypes,
  resetPatientState,
  setPatient,
  setPatientError,
  setStatus,
  updateCertificateTypes,
} from './patientActions'

export interface PatientState {
  patient: Patient | undefined
  status: PatientStatus | undefined
  error: ErrorRequest | undefined
  certificateTypes: CertificateType[]
  loadingCertificateTypes: boolean
}

const getInitialState = (): PatientState => {
  return {
    patient: undefined,
    status: undefined,
    error: undefined,
    certificateTypes: [],
    loadingCertificateTypes: false,
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
  builder.addCase(resetPatientState, () => getInitialState()),
  builder.addCase(isLoadingCertificateTypes, (state, action) => {
    state.loadingCertificateTypes = action.payload
  }),
])

export default errorReducer
