import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  clearActiveList,
  clearActiveListConfig,
  clearActiveListFilter,
  clearActiveListType,
  clearListError,
  getDraftListConfig,
  getDraftListConfigStarted,
  getDraftListConfigSuccess,
  getDrafts,
  getDraftsError,
  getDraftsStarted,
  getDraftsSuccess,
  performListSearch,
  setListError,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilterValue,
  updateActiveListType,
  updateDefaultListFilterValues,
  updateTotalCount,
} from './listActions'
import { ListFilterConfig, ListType } from '@frontend/common/src/types/list'
import { getListFilterDefaultValue } from '../../feature/list/listUtils'

const handlePerformListSearch: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  const listType = getState().ui.uiList.activeListType
  const listFilter = getState().ui.uiList.activeListFilter
  if (listType === ListType.DRAFTS) {
    dispatch(getDrafts(listFilter))
  }
}

const handleGetDrafts: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/draft',
      method: 'POST',
      data: { filter: action.payload },
      onStart: getDraftsStarted.type,
      onSuccess: getDraftsSuccess.type,
      onError: getDraftsError.type,
    })
  )
}

const handleGetDraftsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateActiveList(Object.values(action.payload.list)))
  dispatch(updateTotalCount(action.payload.totalCount))
  dispatch(updateActiveListType(ListType.DRAFTS))
  dispatch(clearListError)
}

const handleGetDraftListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/config/draft',
      method: 'GET',
      onStart: getDraftListConfigStarted.type,
      onSuccess: getDraftListConfigSuccess.type,
      onError: setListError.type,
    })
  )
}

const handleGetDraftListConfigSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateActiveListConfig(action.payload))
  dispatch(updateActiveListType(ListType.DRAFTS))
  dispatch(updateDefaultListFilterValues(action.payload.filters))
  dispatch(performListSearch)
  dispatch(clearListError)
}

const clearListState = (dispatch: Dispatch<AnyAction>) => {
  dispatch(clearActiveListType)
  dispatch(clearActiveListFilter)
  dispatch(clearActiveList)
  dispatch(clearActiveListConfig)
  dispatch(updateTotalCount(0))
}

const handleGetDraftsError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  clearListState(dispatch)
  dispatch(setListError)
}

const handleUpdateDefaultFilterValues = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  const filters = action.payload
  filters.forEach((filter: ListFilterConfig) => {
    const defaultValue = getListFilterDefaultValue(filter)
    dispatch(updateActiveListFilterValue({ filterValue: defaultValue, id: filter.id }))
  })
}

const handleClearActiveListFilter: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateDefaultListFilterValues(action.payload))
  dispatch(performListSearch)
}

const middlewareMethods = {
  [performListSearch.type]: handlePerformListSearch,
  [getDrafts.type]: handleGetDrafts,
  [getDraftsSuccess.type]: handleGetDraftsSuccess,
  [getDraftListConfig.type]: handleGetDraftListConfig,
  [getDraftListConfigSuccess.type]: handleGetDraftListConfigSuccess,
  [updateDefaultListFilterValues.type]: handleUpdateDefaultFilterValues,
  [clearActiveListFilter.type]: handleClearActiveListFilter,
  [getDraftsError.type]: handleGetDraftsError,
}

export const listMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
