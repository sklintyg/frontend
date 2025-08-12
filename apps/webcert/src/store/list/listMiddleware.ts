import type { AnyAction } from '@reduxjs/toolkit'
import type { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { getListFilterDefaultValue } from '../../feature/list/listUtils'
import type { ListFilterConfig } from '../../types'
import { ListFilterType, ListType } from '../../types'
import { apiCallBegan } from '../api/apiActions'
import { forwardCertificateSuccess } from '../certificate/certificateActions'
import { getActivePatient } from '../patient/patientSelectors'
import {
  clearActiveList,
  clearListError,
  getCertificateList,
  getCertificateListConfig,
  getCertificateListConfigError,
  getCertificateListConfigStarted,
  getCertificateListConfigSuccess,
  getCertificateListError,
  getCertificateListStarted,
  getCertificateListSuccess,
  getDraftListConfig,
  getDraftListConfigError,
  getDraftListConfigStarted,
  getDraftListConfigSuccess,
  getDrafts,
  getDraftsError,
  getDraftsStarted,
  getDraftsSuccess,
  getListConfig,
  getPreviousCertificatesList,
  getPreviousCertificatesListConfig,
  getPreviousCertificatesListConfigError,
  getPreviousCertificatesListConfigStarted,
  getPreviousCertificatesListConfigSuccess,
  getPreviousCertificatesListError,
  getPreviousCertificatesListStarted,
  getPreviousCertificatesListSuccess,
  getUnhandledCertificates,
  getUnhandledCertificatesError,
  getUnhandledCertificatesListConfig,
  getUnhandledCertificatesListConfigError,
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
import { getIsLoadingList } from './listSelectors'

const handlePerformListSearch: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (): void => {
    const listType = getState().ui.uiList.activeListType
    const listFilter = getState().ui.uiList.activeListFilter

    dispatch(setListError(undefined))

    if (listType === listFilter.type && !getIsLoadingList(getState())) {
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
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    const patient = getActivePatient(getState())
    if (!patient) {
      throw Error('Missing patient')
    }
    dispatch(
      apiCallBegan({
        url: '/api/list/previous',
        method: 'POST',
        data: {
          filter: {
            ...action.payload,
            values: {
              ...action.payload.values,
              PATIENT_ID: {
                type: ListFilterType.PERSON_ID,
                value: patient.personId.id,
              },
            },
          },
        },
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

      if (config?.shouldUpdateConfigAfterListSearch) {
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
        onError: getDraftListConfigError.type,
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
        onError: getCertificateListConfigError.type,
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
        onError: getPreviousCertificatesListConfigError.type,
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
        onError: getUnhandledCertificatesListConfigError.type,
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
      if (getState().ui.uiList.hasUpdatedConfig === true) {
        dispatch(updateListConfig())
      }
    }
  }

const handleGetListConfigError =
  (listType: ListType): Middleware<Dispatch> =>
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (getState().ui.uiList.activeListType === listType) {
      dispatch(updateIsLoadingListConfig(false))
      dispatch(setListError(action.payload.error))
    }
  }

const handleGetListError =
  (listType: ListType): Middleware<Dispatch> =>
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (getState().ui.uiList.activeListType === listType) {
      dispatch(clearActiveList())
      dispatch(updateTotalCount(undefined))
      dispatch(setListError(action.payload.error))
    }
  }

const handleUpdateDefaultFilterValues =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    const filters = action.payload.filters
    dispatch(updateActiveListFilter({ type: getState().ui.uiList.activeListType, values: {} }))
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
  [getCertificateListConfigError.type]: handleGetListConfigError(ListType.CERTIFICATES),
  [getCertificateListError.type]: handleGetListError(ListType.CERTIFICATES),
  [getCertificateListStarted.type]: handleGetListStarted(ListType.CERTIFICATES),
  [getCertificateListSuccess.type]: handleGetListSuccess(ListType.CERTIFICATES),
  [getDraftListConfig.type]: handleGetDraftListConfig,
  [getDraftListConfigStarted.type]: handleGetListConfigStarted(ListType.DRAFTS),
  [getDraftListConfigSuccess.type]: handleGetListConfigSuccess(ListType.DRAFTS),
  [getDraftListConfigError.type]: handleGetListConfigError(ListType.DRAFTS),
  [getDrafts.type]: handleGetDrafts,
  [getDraftsError.type]: handleGetListError(ListType.DRAFTS),
  [getDraftsStarted.type]: handleGetListStarted(ListType.DRAFTS),
  [getDraftsSuccess.type]: handleGetListSuccess(ListType.DRAFTS),
  [getListConfig.type]: handleGetListConfig,
  [getPreviousCertificatesList.type]: handleGetPreviousCertificatesList,
  [getPreviousCertificatesListConfig.type]: handleGetPreviousCertificatesListConfig,
  [getPreviousCertificatesListConfigStarted.type]: handleGetListConfigStarted(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListConfigSuccess.type]: handleGetListConfigSuccess(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListConfigError.type]: handleGetListConfigError(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListError.type]: handleGetListError(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListStarted.type]: handleGetListStarted(ListType.PREVIOUS_CERTIFICATES),
  [getPreviousCertificatesListSuccess.type]: handleGetListSuccess(ListType.PREVIOUS_CERTIFICATES),
  [getUnhandledCertificatesListConfig.type]: handleGetUnhandledCertificatesListConfig,
  [getUnhandledCertificatesListConfigStarted.type]: handleGetListConfigStarted(ListType.UNHANDLED_CERTIFICATES),
  [getUnhandledCertificatesListConfigSuccess.type]: handleGetListConfigSuccess(ListType.UNHANDLED_CERTIFICATES),
  [getUnhandledCertificatesListConfigError.type]: handleGetListConfigError(ListType.UNHANDLED_CERTIFICATES),
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
