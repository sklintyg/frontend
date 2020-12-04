import { createReducer } from '@reduxjs/toolkit'
import { removeFMBDiagnosisCodeInfo, updateFMBDiagnosisCodeInfo } from '../fmb/fmbActions'
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

    state.fmbDiagnosisCodes.forEach((diagnosisCodeInfo: FMBDiagnosisCodeInfo, index: number) => {
      if (diagnosisCodeInfo.icd10Code === action.payload.icd10Code) {
        state.fmbDiagnosisCodes.splice(index, 1)
      }
    })

    if (action.payload.index >= state.fmbDiagnosisCodes.length) {
      state.fmbDiagnosisCodes.push(action.payload)
    } else {
      state.fmbDiagnosisCodes.splice(action.payload.index, 0, action.payload);
    }

  })
  .addCase(removeFMBDiagnosisCodeInfo, (state, action) => {

    state.fmbDiagnosisCodes.forEach((diagnosisCodeInfo: FMBDiagnosisCodeInfo, index: number) => {
      if (diagnosisCodeInfo.icd10Code === action.payload) {
        state.fmbDiagnosisCodes.splice(index, 1)
      }
    })

  })
)

export default fmbReducer
