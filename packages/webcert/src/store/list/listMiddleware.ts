import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import {
  clearActiveListFilter,
  getDraftListConfig,
  getDraftListConfigStarted,
  getDraftListConfigSuccess,
  getDrafts,
  getDraftsStarted,
  getDraftsSuccess,
  performListSearch,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilterValue,
  updateActiveListType,
  updateDefaultListFilterValues,
} from './listActions'
import {
  ListFilterBooleanConfig,
  ListFilterConfig,
  ListFilterOrderConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValueBoolean,
  ListFilterValueDateRange,
  ListFilterValuePersonId,
  ListFilterValueSelect,
  ListFilterValueText,
  ListType,
} from '@frontend/common/src/types/list'

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
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetDraftsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateActiveList(Object.values(action.payload)))
  dispatch(updateActiveListType(ListType.DRAFTS))
}

const handleGetDraftListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/config/draft',
      method: 'GET',
      onStart: getDraftListConfigStarted.type,
      onSuccess: getDraftListConfigSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

const handleGetDraftListConfigSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateActiveListConfig(action.payload))
  dispatch(updateActiveListType(ListType.DRAFTS))
  dispatch(updateDefaultListFilterValues(action.payload.filters))
  dispatch(performListSearch)
}

const handleUpdateDefaultFilterValues = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  const filters = action.payload
  filters.forEach((filter: ListFilterConfig) => {
    let defaultValue = { type: ListFilterType.UNKOWN }
    if (filter.type === ListFilterType.TEXT) {
      defaultValue = { type: filter.type, value: '' } as ListFilterValueText
    } else if (filter.type === ListFilterType.PERSON_ID) {
      defaultValue = { type: filter.type, value: '' } as ListFilterValuePersonId
    } else if (filter.type === ListFilterType.SELECT) {
      const defaultSelectValue = (filter as ListFilterSelectConfig).values.find((v) => v.defaultValue)
      defaultValue = { type: filter.type, value: defaultSelectValue ? defaultSelectValue.id : '' } as ListFilterValueSelect
    } else if (filter.type === ListFilterType.DATE_RANGE) {
      defaultValue = { type: filter.type, to: null, from: null } as ListFilterValueDateRange
    } else if (filter.type === ListFilterType.ORDER) {
      defaultValue = { type: filter.type, value: (filter as ListFilterOrderConfig).defaultValue } as ListFilterValueText
    } else if (filter.type === ListFilterType.BOOLEAN) {
      defaultValue = { type: filter.type, value: (filter as ListFilterBooleanConfig).defaultValue } as ListFilterValueBoolean
    }
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
}

export const listMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
