import { createReducer } from '@reduxjs/toolkit'
import { updateFMBDiagnosisCodeInfo } from '../fmb/fmbActions'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

interface FMBState {
  fmbDiagnosisCodes: FMBDiagnosisCodeInfo[]
}

const initialState: FMBState = {
  fmbDiagnosisCodes: [],
}

const fmbReducer = createReducer(initialState, (builder) =>
  builder.addCase(updateFMBDiagnosisCodeInfo, (state, action) => {
    state.fmbDiagnosisCodes.push(action.payload)
  })
)

export default fmbReducer
