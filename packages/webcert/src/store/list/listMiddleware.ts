import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  clearActiveList,
  clearActiveListConfig,
  clearActiveListFilter,
  clearActiveListType,
  clearListError,
  getCertificateList,
  getCertificateListConfig,
  getCertificateListConfigStarted,
  getCertificateListConfigSuccess,
  getCertificateListStarted,
  getCertificateListSuccess,
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
  updateDefaultListFilterValues,
  updateIsLoadingList,
  updateIsLoadingListConfig,
  updateTotalCount,
} from './listActions'
import { ListFilterConfig, ListType } from '@frontend/common/src/types/list'
import { getListFilterDefaultValue } from '../../feature/list/listUtils'
import { getCertificateError } from '../certificate/certificateActions'

const handlePerformListSearch: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  const listType = getState().ui.uiList.activeListType
  const listFilter = getState().ui.uiList.activeListFilter
  if (listType === ListType.DRAFTS) {
    dispatch(getDrafts(listFilter))
  } else if (listType === ListType.CERTIFICATES) {
    dispatch(getCertificateList(listFilter))
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

const handleGetCertificateList: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/certificate',
      method: 'POST',
      data: { filter: action.payload },
      onStart: getCertificateListStarted.type,
      onSuccess: getCertificateListSuccess.type,
      onError: getCertificateError.type,
    })
  )
}

const handleGetListStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateIsLoadingList(true))
}

const handleGetListSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateActiveList(Object.values(action.payload.list)))
  dispatch(updateTotalCount(action.payload.totalCount))
  dispatch(clearListError)
  dispatch(updateIsLoadingList(false))
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

const handleGetCertificateListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/config/certificate',
      method: 'GET',
      onStart: getCertificateListConfigStarted.type,
      onSuccess: getCertificateListConfigSuccess.type,
      onError: setListError.type,
    })
  )
}

const handleGetListConfigStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateIsLoadingListConfig(true))
}

const handleGetListConfigSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateActiveListConfig(action.payload))
  dispatch(updateDefaultListFilterValues)
  dispatch(clearListError)
  dispatch(updateIsLoadingListConfig(false))
}

const clearListState = (dispatch: Dispatch<AnyAction>) => {
  dispatch(clearActiveListType)
  dispatch(clearActiveListFilter)
  dispatch(clearActiveList)
  dispatch(clearActiveListConfig)
  dispatch(updateTotalCount(undefined))
}

const handleGetDraftsError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  clearListState(dispatch)
  dispatch(setListError)
}

const handleUpdateDefaultFilterValues = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  const filters = getState().ui.uiList.activeListConfig?.filters
  if (filters) {
    filters.forEach((filter: ListFilterConfig) => {
      const defaultValue = getListFilterDefaultValue(filter)
      dispatch(updateActiveListFilterValue({ filterValue: defaultValue, id: filter.id }))
    })
  }
}

const handleClearActiveListFilter: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateDefaultListFilterValues)
  dispatch(performListSearch)
}

const middlewareMethods = {
  [performListSearch.type]: handlePerformListSearch,
  [getDrafts.type]: handleGetDrafts,
  [getDraftsSuccess.type]: handleGetListSuccess,
  [getDraftListConfig.type]: handleGetDraftListConfig,
  [getDraftListConfigSuccess.type]: handleGetListConfigSuccess,
  [updateDefaultListFilterValues.type]: handleUpdateDefaultFilterValues,
  [clearActiveListFilter.type]: handleClearActiveListFilter,
  [getDraftsError.type]: handleGetDraftsError,
  [getDraftsStarted.type]: handleGetListStarted,
  [getDraftListConfigStarted.type]: handleGetListConfigStarted,
  [getCertificateList.type]: handleGetCertificateList,
  [getCertificateListSuccess.type]: handleGetListSuccess,
  [getCertificateListStarted.type]: handleGetListStarted,
  [getCertificateListConfig.type]: handleGetCertificateListConfig,
  [getCertificateListConfigStarted.type]: handleGetListConfigStarted,
  [getCertificateListConfigSuccess.type]: handleGetListConfigSuccess,
}

export const listMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
