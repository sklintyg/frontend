import { createReducer } from '@reduxjs/toolkit'
import { resetDiagnosisTypeahead, updateConfig, updateDiagnosisTypeahead, updateDynamicLinks, updateStatistics } from './utilsActions'
import { Banner, DiagnosisTypeahead, DynamicLinkData } from '@frontend/common'

export interface DynamicLinkMap {
  [key: string]: DynamicLinkData
}

export interface UnitStatistics {
  fragaSvarValdEnhet: number
  fragaSvarAndraEnheter: number
  intygAndraEnheter: number
  intygValdEnhet: number
  vardgivare: number
}

export interface Configuration {
  version: string
  banners: Banner[]
}

interface UtilsState {
  dynamicLinks: DynamicLinkMap
  diagnosisTypeahead: DiagnosisTypeahead | null
  config: Configuration
  unitStatistics: UnitStatistics | null
}

const initialState: UtilsState = {
  dynamicLinks: {},
  diagnosisTypeahead: null,
  config: { version: '', banners: [] },
  unitStatistics: null,
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
    .addCase(updateStatistics, (state, action) => {
      state.unitStatistics = action.payload
    })
)

export default utilsReducer
