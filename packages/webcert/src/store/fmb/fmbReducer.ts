import { createReducer } from '@reduxjs/toolkit'
import { updateFMBDiagnosisCodeInfo, updateFMBDiagnosisCodeInfoList } from '../fmb/fmbActions'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

interface FMBState {
  fmbDiagnosisCodes: FMBDiagnosisCodeInfo[]
}

const initialState: FMBState = {
  fmbDiagnosisCodes: [],
}

const fmbReducer = createReducer(initialState, (builder) =>
  builder
  .addCase(updateFMBDiagnosisCodeInfo, (state, action) => {

    if (action.payload.index >= state.fmbDiagnosisCodes.length) {
      state.fmbDiagnosisCodes.push(action.payload)
    } else {
      state.fmbDiagnosisCodes.splice(action.payload.index, 0, action.payload);
    }

  })
  .addCase(updateFMBDiagnosisCodeInfoList, (state, action) => {

    state.fmbDiagnosisCodes = action.payload

  })
)

export default fmbReducer
