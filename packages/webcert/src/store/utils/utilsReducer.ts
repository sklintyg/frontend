import { createReducer } from '@reduxjs/toolkit'
import { updateDiagnosisTypeahead, updateDynamicLinks, resetDiagnosisTypeahead } from './utilsActions'
import { DiagnosisTypeahead, DynamicLinkData } from '@frontend/common'

export interface DynamicLinkMap {
  [key: string]: DynamicLinkData
}

interface UtilsState {
  dynamicLinks: DynamicLinkMap
  diagnosisTypeahead: DiagnosisTypeahead | null
}

const initialState: UtilsState = {
  dynamicLinks: {},
  diagnosisTypeahead: null,
}

const utilsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateDynamicLinks, (state, action) => {
      state.dynamicLinks = action.payload
    })
    .addCase(updateDiagnosisTypeahead, (state, action) => {
      state.diagnosisTypeahead = action.payload
    })
    .addCase(resetDiagnosisTypeahead, (state, action) => {
      state.diagnosisTypeahead = null
    })
)

export default utilsReducer
