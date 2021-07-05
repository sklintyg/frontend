import { createReducer } from '@reduxjs/toolkit'
import { removeFMBDiagnosisCodes, updateFMBDiagnosisCodeInfo, updateFMBPanelActive } from './fmbActions'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

interface FMBState {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo[]
  fmbPanelActive: boolean
}

const initialState: FMBState = {
  fmbDiagnosisCodeInfo: [],
  fmbPanelActive: false,
}

const fmbReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateFMBDiagnosisCodeInfo, (state, action) => {
      state.fmbDiagnosisCodeInfo.push(action.payload)
      state.fmbDiagnosisCodeInfo.sort((a, b) => a.index - b.index)
    })
    .addCase(updateFMBPanelActive, (state, action) => {
      state.fmbPanelActive = action.payload
    })
    .addCase(removeFMBDiagnosisCodes, (state, action) => {
      const index = state.fmbDiagnosisCodeInfo.findIndex((value) => value.icd10Code === action.payload.icd10Code)
      if (index > -1) {
        state.fmbDiagnosisCodeInfo.splice(index, 1)
      }
    })
)

export default fmbReducer
