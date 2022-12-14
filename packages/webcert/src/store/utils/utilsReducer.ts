import { Banner, DiagnosisTypeahead, DynamicLinkData, ModalData } from '@frontend/common'
import { createReducer } from '@reduxjs/toolkit'
import {
  resetDiagnosisTypeahead,
  updateConfig,
  updateDiagnosisTypeahead,
  updateDynamicLinks,
  updateIsLoadingConfig,
  updateIsLoadingDynamicLinks,
  updateModalData,
} from './utilsActions'

export interface DynamicLinkMap {
  [key: string]: DynamicLinkData
}

export interface Configuration {
  version: string
  banners: Banner[]
  cgiFunktionstjansterIdpUrl: string
  sakerhetstjanstIdpUrl: string
  ppHost: string
}

interface UtilsState {
  dynamicLinks: DynamicLinkMap
  diagnosisTypeahead: DiagnosisTypeahead | null
  modalData: ModalData | null
  config: Configuration
  isLoadingConfig: boolean
  isLoadingDynamicLinks: boolean
}

const initialState: UtilsState = {
  dynamicLinks: {},
  diagnosisTypeahead: null,
  modalData: null,
  config: { version: '', banners: [], cgiFunktionstjansterIdpUrl: '', sakerhetstjanstIdpUrl: '', ppHost: '' },
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
    .addCase(updateModalData, (state, action) => {
      state.modalData = action.payload
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
