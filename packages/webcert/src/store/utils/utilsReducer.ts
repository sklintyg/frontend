import { createReducer } from '@reduxjs/toolkit'
import {
  resetDiagnosisTypeahead,
  updateConfig,
  updateDiagnosisTypeahead,
  updateDynamicLinks,
  updateIsLoadingConfig,
  updateStatistics,
  updateIsLoadingDynamicLinks,
} from './utilsActions'
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
  cgiFunktionstjansterIdpUrl: string
  sakerhetstjanstIdpUrl: string
}

interface UtilsState {
  dynamicLinks: DynamicLinkMap
  diagnosisTypeahead: DiagnosisTypeahead | null
  config: Configuration
  unitStatistics: UnitStatistics | null
  isLoadingConfig: boolean
  isLoadingDynamicLinks: boolean
}

const initialState: UtilsState = {
  dynamicLinks: {},
  diagnosisTypeahead: null,
  config: { version: '', banners: [], cgiFunktionstjansterIdpUrl: '', sakerhetstjanstIdpUrl: '' },
  isLoadingConfig: false,
  unitStatistics: null,
  isLoadingDynamicLinks: false,
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
    .addCase(updateIsLoadingConfig, (state, action) => {
      state.isLoadingConfig = action.payload
    })
    .addCase(updateIsLoadingDynamicLinks, (state, action) => {
      state.isLoadingDynamicLinks = action.payload
    })
)

export default utilsReducer
