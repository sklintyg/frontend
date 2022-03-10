import { createReducer } from '@reduxjs/toolkit'
import { Patient, PatientStatus } from '@frontend/common'
import { clearPatient, setPatient, setStatus } from './patientActions'

interface PatientState {
  patient: Patient | undefined
  status: PatientStatus | undefined
}

const getInitialState = (): PatientState => {
  return {
    patient: undefined,
    status: undefined,
  }
}

const errorReducer = createReducer(getInitialState(), (builder) => [
  builder.addCase(setPatient, (state, action) => {
    state.patient = action.payload
  }),
  builder.addCase(setStatus, (state, action) => {
    state.status = action.payload
  }),
  builder.addCase(clearPatient, (state) => {
    state.patient = undefined
  }),
])

export default errorReducer
