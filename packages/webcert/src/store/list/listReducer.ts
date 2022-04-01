import { createReducer } from '@reduxjs/toolkit'
import {
  clearActiveList,
  clearActiveListConfig,
  clearActiveListFilter,
  clearActiveListType,
  clearListError,
  setListError,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilterValue,
  updateActiveListType,
  updateTotalCount,
} from './listActions'
import { CertificateListItem, ListConfig, ListFilter, ListType } from '@frontend/common/src/types/list'

interface ListState {
  activeList: CertificateListItem[]
  activeListConfig: ListConfig | undefined
  activeListFilter: ListFilter
  activeListType: ListType
  listError: boolean
  totalCount: number
}

const initialState: ListState = {
  activeListConfig: undefined,
  activeList: [],
  activeListType: ListType.UNKOWN,
  activeListFilter: {},
  listError: false,
  totalCount: 0,
}

const listReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateActiveListConfig, (state, action) => {
      state.activeListConfig = action.payload
    })
    .addCase(clearActiveListConfig, (state) => {
      state.activeListConfig = undefined
    })
    .addCase(updateActiveList, (state, action) => {
      state.activeList = action.payload
    })
    .addCase(clearActiveList, (state) => {
      state.activeList = []
    })
    .addCase(updateActiveListFilterValue, (state, action) => {
      if (!state.activeListFilter.values) {
        state.activeListFilter.values = {}
      }

      state.activeListFilter.values[action.payload.id] = action.payload.filterValue
    })
    .addCase(clearActiveListFilter, (state) => {
      state.activeListFilter.values = {}
    })
    .addCase(updateActiveListType, (state, action) => {
      state.activeListType = action.payload
    })
    .addCase(clearActiveListType, (state) => {
      state.activeListType = ListType.UNKOWN
    })
    .addCase(setListError, (state) => {
      state.listError = true
    })
    .addCase(clearListError, (state) => {
      state.listError = false
    })
    .addCase(updateTotalCount, (state, action) => {
      state.totalCount = action.payload
    })
)

export default listReducer
