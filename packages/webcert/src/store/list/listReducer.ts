import { createReducer } from '@reduxjs/toolkit'
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
import { CertificateListItem, ListConfig, ListFilter, ListType } from '@frontend/common/src/types/list'

interface ListState {
  activeList: CertificateListItem[]
  activeListConfig: ListConfig | undefined
  activeListFilter: ListFilter
  activeListType: ListType
  listError: boolean
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
    activeListFilter: {},
    listError: false,
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
    .addCase(setListError, (state) => {
      state.listError = true
    })
    .addCase(clearListError, (state) => {
      state.listError = false
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
      const index = state.activeList.findIndex((item) => item.values['CERTIFICATE_ID'] === action.payload)
      if (index > -1) {
        const updatedValue = state.activeList[index]
        updatedValue.values['FORWARDED'] = true
        state.activeList[index] = updatedValue
      }
    })
    .addCase(updateHasUpdatedConfig, (state, action) => {
      state.hasUpdatedConfig = action.payload
    })
    .addCase(resetListState, () => getInitialState())
)

export default listReducer
