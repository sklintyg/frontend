import { createReducer } from '@reduxjs/toolkit'
import { Banner, DiagnosisTypeahead, DynamicLinkData } from '../../types'
import {
  resetDiagnosisTypeahead,
  updateConfig,
  updateDiagnosisTypeahead,
  updateDynamicLinks,
  updateIsLoadingConfig,
  updateIsLoadingDynamicLinks,
} from './utilsActions'

export type DynamicLinkMap = Record<string, DynamicLinkData>

export interface Configuration {
  version: string
  banners: Banner[]
  cgiFunktionstjansterIdpUrl: string
  sakerhetstjanstIdpUrl: string
  ppHost: string
  forwardDraftOrQuestionUrl: string
}

export interface UtilsState {
  dynamicLinks: DynamicLinkMap
  diagnosisTypeahead: DiagnosisTypeahead | null
  config: Configuration
  isLoadingConfig: boolean
  isLoadingDynamicLinks: boolean
}

const initialState: UtilsState = {
  dynamicLinks: {},
  diagnosisTypeahead: null,
  config: {
    version: '',
    banners: [],
    cgiFunktionstjansterIdpUrl: '',
    sakerhetstjanstIdpUrl: '',
    ppHost: '',
    forwardDraftOrQuestionUrl: '',
  },
  isLoadingConfig: false,
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
    .addCase(resetDiagnosisTypeahead, (state) => {
      state.diagnosisTypeahead = null
    })
    .addCase(updateConfig, (state, action) => {
      state.config = action.payload
    })
    .addCase(updateIsLoadingConfig, (state, action) => {
      state.isLoadingConfig = action.payload
    })
    .addCase(updateIsLoadingDynamicLinks, (state, action) => {
      state.isLoadingDynamicLinks = action.payload
    })
)

export default utilsReducer
