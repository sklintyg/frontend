import { createReducer } from '@reduxjs/toolkit'
import {
  clearActiveListType,
  clearListError,
  setListError,
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
  listError: boolean
}

const initialState: ListState = {
  activeListConfig: undefined,
  activeList: [],
  activeListType: ListType.UNKOWN,
  activeListFilter: {},
  listError: false,
}

const listReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateActiveListConfig, (state, action) => {
      state.activeListConfig = action.payload
    })
    .addCase(updateActiveList, (state, action) => {
      state.activeList = action.payload
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
    .addCase(clearActiveListType, (state) => {
      state.activeListType = ListType.UNKOWN
    })
    .addCase(setListError, (state, action) => {
      state.listError = true
    })
    .addCase(clearListError, (state, action) => {
      state.listError = false
    })
)

export default listReducer
