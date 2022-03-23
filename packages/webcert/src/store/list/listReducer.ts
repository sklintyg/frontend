import { createReducer } from '@reduxjs/toolkit'
import {
  addValueToActiveListFilter,
  clearActiveListFilter,
  updateActiveListFilter,
  updateDraftList,
  updateDraftListConfig,
} from './listActions'
import { CertificateListItem, ListConfig, ListFilter, ListFilterValue, ListType } from '@frontend/common/src/types/list'

interface ListState {
  activeList: CertificateListItem[]
  activeListConfig: ListConfig | undefined
  activeListFilter: ListFilter
}

const initialState: ListState = {
  activeListConfig: undefined,
  activeList: [],
  activeListFilter: {
    type: ListType.UNKOWN,
    values: [],
  },
}

const listReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateDraftListConfig, (state, action) => {
      state.activeListConfig = action.payload
    })
    .addCase(updateDraftList, (state, action) => {
      state.activeList = action.payload
    })
    .addCase(updateActiveListFilter, (state, action) => {
      state.activeListFilter = action.payload
    })
    .addCase(clearActiveListFilter, (state, action) => {
      state.activeListFilter.values = []
      state.activeListFilter.type = ListType.UNKOWN
    })
    .addCase(addValueToActiveListFilter, (state, action) => {
      const index = state.activeListFilter.values.findIndex((value: ListFilterValue) => value.id === action.payload.id)
      if (index !== -1) {
        state.activeListFilter.values[index] = action.payload
      }
      state.activeListFilter.values = [...state.activeListFilter.values, action.payload]
    })
)

export default listReducer
