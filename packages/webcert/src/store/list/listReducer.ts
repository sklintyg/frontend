import { createReducer } from '@reduxjs/toolkit'
import {
  clearActiveListFilter,
  clearActiveListType,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilterValue,
  updateActiveListType,
} from './listActions'
import { CertificateListItem, ListConfig, ListFilter, ListType } from '@frontend/common/src/types/list'

interface ListState {
  activeList: CertificateListItem[]
  activeListConfig: ListConfig | undefined
  activeListFilter: ListFilter
  activeListType: ListType
}

const initialState: ListState = {
  activeListConfig: undefined,
  activeList: [],
  activeListType: ListType.UNKOWN,
  activeListFilter: {},
}

const listReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateActiveListConfig, (state, action) => {
      state.activeListConfig = action.payload
    })
    .addCase(updateActiveList, (state, action) => {
      state.activeList = action.payload
    })
    .addCase(clearActiveListFilter, (state, action) => {
      //state.activeListFilter.values = []
    })
    .addCase(updateActiveListFilterValue, (state, action) => {
      if (!state.activeListFilter.values) {
        state.activeListFilter.values = {}
      }

      state.activeListFilter.values[action.payload.id] = action.payload.filterValue
    })
    .addCase(updateActiveListType, (state, action) => {
      state.activeListType = action.payload
    })
    .addCase(clearActiveListType, (state, action) => {
      state.activeListType = ListType.UNKOWN
    })
)

export default listReducer
