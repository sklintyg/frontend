import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { getListFilterDefaultValue } from '../../feature/list/listUtils'
import { apiCallBegan } from '../api/apiActions'
import { forwardCertificateSuccess } from '../certificate/certificateActions'
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
  getCertificateListError,
  getCertificateListStarted,
  getCertificateListSuccess,
  getDraftListConfig,
  getDraftListConfigStarted,
  getDraftListConfigSuccess,
  getDrafts,
  getDraftsError,
  getDraftsStarted,
  getDraftsSuccess,
  getListConfig,
  getPreviousCertificatesList,
  getPreviousCertificatesListConfig,
  getPreviousCertificatesListConfigStarted,
  getPreviousCertificatesListConfigSuccess,
  getPreviousCertificatesListError,
  getPreviousCertificatesListStarted,
  getPreviousCertificatesListSuccess,
  getUnhandledCertificates,
  getUnhandledCertificatesError,
  getUnhandledCertificatesListConfig,
  getUnhandledCertificatesListConfigStarted,
  getUnhandledCertificatesListConfigSuccess,
  getUnhandledCertificatesStarted,
  getUnhandledCertificatesSuccess,
  performListSearch,
  setListError,
  updateActiveList,
  updateActiveListConfig,
  updateActiveListFilter,
  updateActiveListFilterValue,
  updateDefaultListFilterValues,
  updateHasUpdatedConfig,
  updateIsLoadingList,
  updateIsLoadingListConfig,
  updateIsSortingList,
  updateListConfig,
  updateListConfigStarted,
  updateListConfigSuccess,
  updateListItemAsForwarded,
  updateTotalCount,
  updateUnhandledCertificatesListConfig,
} from './listActions'
import { ListType, ListFilterConfig } from '../../types'

const handlePerformListSearch: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (): void => {
    const listType = getState().ui.uiList.activeListType
    const listFilter = getState().ui.uiList.activeListFilter
    if (listType === listFilter.type) {
      if (listType === ListType.DRAFTS) {
        dispatch(getDrafts(listFilter))
      } else if (listType === ListType.CERTIFICATES) {
        dispatch(getCertificateList(listFilter))
      } else if (listType === ListType.PREVIOUS_CERTIFICATES) {
        dispatch(getPreviousCertificatesList(listFilter))
      } else if (listType === ListType.UNHANDLED_CERTIFICATES) {
        dispatch(getUnhandledCertificates(listFilter))
      }
    }
  }

const handleGetListConfig: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (): void => {
    const listType = getState().ui.uiList.activeListType
    const filter = getState().ui.uiList.activeListFilter
    if (listType === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
    } else if (listType === ListType.CERTIFICATES) {
      dispatch(getCertificateListConfig())
    } else if (listType === ListType.PREVIOUS_CERTIFICATES) {
      dispatch(getPreviousCertificatesListConfig())
    } else if (listType === ListType.UNHANDLED_CERTIFICATES) {
      const chosenUnit = filter.values?.UNIT?.value ?? ''
      dispatch(getUnhandledCertificatesListConfig(chosenUnit))
    }
  }

const handleUpdateListConfig: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (): void => {
    const filter = getState().ui.uiList.activeListFilter
    const config = getState().ui.uiList.activeListConfig
    const chosenUnit = filter.values?.UNIT?.value ?? ''
    dispatch(updateUnhandledCertificatesListConfig({ config: config, unitId: chosenUnit }))
  }

const handleGetDrafts: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
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

const handleGetCertificateList: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/list/certificate',
        method: 'POST',
        data: { filter: action.payload },
        onStart: getCertificateListStarted.type,
        onSuccess: getCertificateListSuccess.type,
        onError: getCertificateListError.type,
      })
    )
  }

const handleGetPreviousCertificatesList: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/list/previous',
        method: 'POST',
        data: { filter: action.payload },
        onStart: getPreviousCertificatesListStarted.type,
        onSuccess: getPreviousCertificatesListSuccess.type,
        onError: getPreviousCertificatesListError.type,
      })
    )
  }

const handleGetUnhandledCertificates: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/list/question',
        method: 'POST',
        data: { filter: action.payload },
        onStart: getUnhandledCertificatesStarted.type,
        onSuccess: getUnhandledCertificatesSuccess.type,
        onError: getUnhandledCertificatesError.type,
      })
    )
  }

const handleGetListStarted =
  (listType: ListType): Middleware<Dispatch> =>
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (): void => {
    if (getState().ui.uiList.activeListType === listType) {
      dispatch(updateIsLoadingList(true))
    }
  }

const handleGetListSuccess =
  (listType: ListType): Middleware<Dispatch> =>
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    const config = getState().ui.uiList.activeListConfig

    if (getState().ui.uiList.activeListType === listType) {
      dispatch(updateActiveList(Object.values(action.payload.list)))
      dispatch(updateTotalCount(action.payload.totalCount))
      dispatch(clearListError())
      dispatch(updateIsLoadingList(false))
      dispatch(updateIsSortingList(false))

      if (config.shouldUpdateConfigAfterListSearch) {
        dispatch(updateHasUpdatedConfig(true))
      }
    }
  }

const handleGetDraftListConfig: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
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

const handleGetCertificateListConfig: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
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

const handleGetPreviousCertificatesListConfig: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(
      apiCallBegan({
        url: '/api/list/config/previous',
        method: 'GET',
        onStart: getPreviousCertificatesListConfigStarted.type,
        onSuccess: getPreviousCertificatesListConfigSuccess.type,
        onError: setListError.type,
      })
    )
  }

const handleGetUnhandledCertificatesListConfig: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/list/config/question',
        method: 'POST',
        data: action.payload,
        onStart: getUnhandledCertificatesListConfigStarted.type,
        onSuccess: getUnhandledCertificatesListConfigSuccess.type,
        onError: setListError.type,
      })
    )
  }

const handleUpdateUnhandledCertificatesListConfig: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/list/config/question/update',
        method: 'POST',
        data: action.payload,
        onStart: updateListConfigStarted.type,
        onSuccess: updateListConfigSuccess.type,
        onError: setListError.type,
      })
    )
  }

const handleUpdateListConfigSuccess: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (getState().ui.uiList.activeListType === ListType.UNHANDLED_CERTIFICATES) {
      dispatch(updateActiveListConfig(action.payload))
      dispatch(updateHasUpdatedConfig(false))
    }
  }
const handleGetListConfigStarted =
  (listType: ListType): Middleware<Dispatch> =>
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (): void => {
    if (getState().ui.uiList.activeListType === listType) {
      dispatch(updateIsLoadingListConfig(true))
    }
  }

const handleGetListConfigSuccess =
  (listType: ListType): Middleware<Dispatch> =>
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (getState().ui.uiList.activeListType === listType) {
      dispatch(updateActiveListConfig(action.payload))
      dispatch(updateDefaultListFilterValues(action.payload))
      dispatch(clearListError())
      dispatch(updateIsLoadingListConfig(false))
      dispatch(performListSearch)
    }
  }

const clearListState = (dispatch: Dispatch<AnyAction>) => {
  dispatch(clearActiveListType())
  dispatch(clearActiveListConfig())
  dispatch(clearActiveListFilter())
  dispatch(clearActiveList())
  dispatch(updateTotalCount(undefined))
}

const handleGetListError =
  (listType: ListType): Middleware<Dispatch> =>
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (getState().ui.uiList.activeListType === listType) {
      clearListState(dispatch)
      dispatch(setListError(action.payload.error))
    }
  }

const handleUpdateDefaultFilterValues =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    const filters = action.payload.filters
    dispatch(updateActiveListFilter({ type: getState().ui.uiList.activeListType }))
    if (filters) {
      filters.forEach((filter: ListFilterConfig) => {
        const defaultValue = getListFilterDefaultValue(filter)
        dispatch(updateActiveListFilterValue({ filterValue: defaultValue, id: filter.id }))
      })
    }
  }

const handleForwardCertificateSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateListItemAsForwarded(action.payload.certificate.metadata.id))
  }

const middlewareMethods = {
  [forwardCertificateSuccess.type]: handleForwardCertificateSuccess,
  [getCertificateList.type]: handleGetCertificateList,
  [getCertificateListConfig.type]: handleGetCertificateListConfig,
  [getCertificateListConfigStarted.type]: handleGetListConfigStarted(ListType.CERTIFICATES),
  [getCertificateListConfigSuccess.type]: handleGetListConfigSuccess(ListType.CERTIFICATES),
  [getCertificateListError.type]: handleGetListError(ListType.CERTIFICATES),
  [getCertificateListStarted.type]: handleGetListStarted(ListType.CERTIFICATES),
  [getCertificateListSuccess.type]: handleGetListSuccess(ListType.CERTIFICATES),
  [getDraftListConfig.type]: handleGetDraftListConfig,
  [getDraftListConfigStarted.type]: handleGetListConfigStarted(ListType.DRAFTS),
  [getDraftListConfigSuccess.type]: handleGetListConfigSuccess(ListType.DRAFTS),
  [getDrafts.type]: handleGetDrafts,
  [getDraftsError.type]: handleGetListError(ListType.DRAFTS),
  [getDraftsStarted.type]: handleGetListStarted(ListType.DRAFTS),
  [getDraftsSuccess.type]: handleGetListSuccess(ListType.DRAFTS),
  [getListConfig.type]: handleGetListConfig,
  [getPreviousCertificatesList.type]: handleGetPreviousCertificatesList,
  [getPreviousCertificatesListConfig.type]: handleGetPreviousCertificatesListConfig,
  [getPreviousCertificatesListConfigStarted.type]: handleGetListConfigStarted(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListConfigSuccess.type]: handleGetListConfigSuccess(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListError.type]: handleGetListError(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListStarted.type]: handleGetListStarted(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListSuccess.type]: handleGetListSuccess(ListType.PREVIOUS_CERTIFICATES),
  [getUnhandledCertificatesListConfig.type]: handleGetUnhandledCertificatesListConfig,
  [getUnhandledCertificatesListConfigStarted.type]: handleGetListConfigStarted(ListType.UNHANDLED_CERTIFICATES),
  [getUnhandledCertificatesListConfigSuccess.type]: handleGetListConfigSuccess(ListType.UNHANDLED_CERTIFICATES),
  [getUnhandledCertificates.type]: handleGetUnhandledCertificates,
  [getUnhandledCertificatesError.type]: handleGetListError(ListType.UNHANDLED_CERTIFICATES),
  [getUnhandledCertificatesStarted.type]: handleGetListStarted(ListType.UNHANDLED_CERTIFICATES),
  [getUnhandledCertificatesSuccess.type]: handleGetListSuccess(ListType.UNHANDLED_CERTIFICATES),
  [performListSearch.type]: handlePerformListSearch,
  [updateDefaultListFilterValues.type]: handleUpdateDefaultFilterValues,
  [updateListConfig.type]: handleUpdateListConfig,
  [updateListConfigSuccess.type]: handleUpdateListConfigSuccess,
  [updateUnhandledCertificatesListConfig.type]: handleUpdateUnhandledCertificatesListConfig,
}

export const listMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
