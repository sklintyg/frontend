import { createReducer } from '@reduxjs/toolkit'
import { updateDiagnosisTypeahead, updateDynamicLinks } from './utilsActions'
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
)

export default utilsReducer
