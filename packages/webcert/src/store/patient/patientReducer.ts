import { createReducer } from '@reduxjs/toolkit'
import { Patient } from '@frontend/common'
import { setPatient } from './patientActions'

interface PatientState {
  patient: Patient | undefined
}

const getInitialState = (): PatientState => {
  return {
    patient: undefined,
  }
}

const errorReducer = createReducer(getInitialState(), (builder) =>
  builder.addCase(setPatient, (state, action) => {
    state.patient = action.payload
  })
)

export default errorReducer
