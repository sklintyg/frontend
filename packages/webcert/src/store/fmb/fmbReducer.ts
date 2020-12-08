import { createReducer } from '@reduxjs/toolkit'
import { updateFMBDiagnosisCodeInfo, updateFMBDiagnosisCodeInfoList, updateFMBPanelActive } from '../fmb/fmbActions'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

interface FMBState {
  fmbDiagnosisCodes: FMBDiagnosisCodeInfo[]
  fmbPanelActive: boolean
}

const initialState: FMBState = {
  fmbDiagnosisCodes: [],
  fmbPanelActive: false,
}

const fmbReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateFMBDiagnosisCodeInfo, (state, action) => {
      if (action.payload.index >= state.fmbDiagnosisCodes.length) {
        state.fmbDiagnosisCodes.push(action.payload)
      } else {
        state.fmbDiagnosisCodes.splice(action.payload.index, 0, action.payload)
      }
    })
    .addCase(updateFMBDiagnosisCodeInfoList, (state, action) => {
      state.fmbDiagnosisCodes = action.payload
    })
    .addCase(updateFMBPanelActive, (state, action) => {
      state.fmbPanelActive = action.payload
    })
)

export default fmbReducer
