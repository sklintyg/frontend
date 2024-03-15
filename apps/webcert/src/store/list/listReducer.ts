import { createReducer } from '@reduxjs/toolkit'
import { ErrorData } from '../error/errorReducer'
import {
  clearActiveList,
  clearActiveListConfig,
  clearActiveListFilter,
  clearActiveListType,
  clearListError,
  resetListState,
  setListError,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilter,
  updateActiveListFilterValue,
  updateActiveListType,
  updateHasUpdatedConfig,
  updateIsLoadingList,
  updateIsLoadingListConfig,
  updateIsSortingList,
  updateListItemAsForwarded,
  updateTotalCount,
  updateValidationError,
} from './listActions'
import { CertificateListItem, ListConfig, ListFilter, ListType } from '../../types'

export interface ListState {
  activeList: CertificateListItem[]
  activeListConfig: ListConfig | undefined
  activeListFilter: ListFilter
  activeListType: ListType
  listError: ErrorData | undefined
  totalCount: number | undefined
  isLoadingList: boolean
  isSortingList: boolean
  isLoadingListConfig: boolean
  validationErrors: { [filterId: string]: boolean }
  hasUpdatedConfig: boolean
}

const getInitialState = (): ListState => {
  return {
    activeListConfig: undefined,
    activeList: [],
    activeListType: ListType.UNKOWN,
    activeListFilter: { type: ListType.UNKOWN },
    listError: undefined,
    totalCount: undefined,
    isLoadingList: true,
    isSortingList: false,
    isLoadingListConfig: true,
    validationErrors: {},
    hasUpdatedConfig: false,
  }
}

const listReducer = createReducer(getInitialState(), (builder) =>
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
    .addCase(updateActiveListFilter, (state, action) => {
      state.activeListFilter = action.payload
    })
    .addCase(updateActiveListType, (state, action) => {
      state.activeListType = action.payload
    })
    .addCase(clearActiveListType, (state) => {
      state.activeListType = ListType.UNKOWN
    })
    .addCase(setListError, (state, action) => {
      state.listError = action.payload
    })
    .addCase(clearListError, (state) => {
      state.listError = undefined
    })
    .addCase(updateTotalCount, (state, action) => {
      state.totalCount = action.payload
    })
    .addCase(updateIsLoadingList, (state, action) => {
      state.isLoadingList = action.payload
    })
    .addCase(updateIsSortingList, (state, action) => {
      state.isSortingList = action.payload
    })
    .addCase(updateIsLoadingListConfig, (state, action) => {
      state.isLoadingListConfig = action.payload
    })
    .addCase(updateValidationError, (state, action) => {
      state.validationErrors[action.payload.id] = action.payload.value
    })
    .addCase(updateListItemAsForwarded, (state, action) => {
      state.activeList.forEach((item) => {
        if (item.values['CERTIFICATE_ID'] === action.payload) {
          item.values['FORWARDED'] = true
        }
      })
    })
    .addCase(updateHasUpdatedConfig, (state, action) => {
      state.hasUpdatedConfig = action.payload
    })
    .addCase(resetListState, () => getInitialState())
)

export default listReducer
