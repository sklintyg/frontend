import { createReducer } from '@reduxjs/toolkit'
import { resetDiagnosisTypeahead, updateDiagnosisTypeahead, updateDynamicLinks, updateConfig } from './utilsActions'
import { DiagnosisTypeahead, DynamicLinkData } from '@frontend/common'

export interface DynamicLinkMap {
  [key: string]: DynamicLinkData
}

export interface Configuration {
  version: string
}

interface UtilsState {
  dynamicLinks: DynamicLinkMap
  diagnosisTypeahead: DiagnosisTypeahead | null
  config: Configuration
}

const initialState: UtilsState = {
  dynamicLinks: {},
  diagnosisTypeahead: null,
  config: { version: '' },
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
    .addCase(updateConfig, (state, action) => {
      state.config = action.payload
    })
)

export default utilsReducer
