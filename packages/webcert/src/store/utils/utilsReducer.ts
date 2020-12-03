import { createReducer } from '@reduxjs/toolkit'
import { updateDynamicLinks } from './utilsActions'
import { DynamicLinkData } from '@frontend/common'

export interface DynamicLinkMap {
  [key: string]: DynamicLinkData
}

interface UtilsState {
  dynamicLinks: DynamicLinkMap
}

const initialState: UtilsState = {
  dynamicLinks: {},
}

const utilsReducer = createReducer(initialState, (builder) =>
  builder.addCase(updateDynamicLinks, (state, action) => {
    state.dynamicLinks = action.payload
  })
)

export default utilsReducer
