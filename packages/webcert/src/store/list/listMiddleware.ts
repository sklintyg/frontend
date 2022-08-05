import { ListFilterConfig, ListType } from '@frontend/common/src/types/list'
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
  getQuestionListConfig,
  getQuestionListConfigStarted,
  getQuestionListConfigSuccess,
  getQuestions,
  getQuestionsError,
  getQuestionsStarted,
  getQuestionsSuccess,
  performListSearch,
  setListError,
  updateActiveList,
  updateActiveListConfig,
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
  updateQuestionListConfig,
  updateTotalCount,
} from './listActions'

const handlePerformListSearch: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  const listType = getState().ui.uiList.activeListType
  const listFilter = getState().ui.uiList.activeListFilter
  if (listType === ListType.DRAFTS) {
    dispatch(getDrafts(listFilter))
  } else if (listType === ListType.CERTIFICATES) {
    dispatch(getCertificateList(listFilter))
  } else if (listType === ListType.PREVIOUS_CERTIFICATES) {
    dispatch(getPreviousCertificatesList(listFilter))
  } else if (listType === ListType.QUESTIONS) {
    dispatch(getQuestions(listFilter))
  }
}

const handleGetListConfig: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  const listType = getState().ui.uiList.activeListType
  const filter = getState().ui.uiList.activeListFilter
  if (listType === ListType.DRAFTS) {
    dispatch(getDraftListConfig())
  } else if (listType === ListType.CERTIFICATES) {
    dispatch(getCertificateListConfig())
  } else if (listType === ListType.PREVIOUS_CERTIFICATES) {
    dispatch(getPreviousCertificatesListConfig())
  } else if (listType === ListType.QUESTIONS) {
    const chosenUnit = filter.values && filter.values['UNIT'] ? filter.values['UNIT'].value : ''
    dispatch(getQuestionListConfig(chosenUnit))
  }
}

const handleUpdateListConfig: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  const listType = getState().ui.uiList.activeListType
  const filter = getState().ui.uiList.activeListFilter
  const config = getState().ui.uiList.activeListConfig
  if (listType === ListType.QUESTIONS) {
    const chosenUnit = filter.values ? filter.values['UNIT'].value : ''
    dispatch(updateQuestionListConfig({ config: config, unitId: chosenUnit }))
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
      onError: getCertificateListError.type,
    })
  )
}

const handleGetPreviousCertificatesList: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
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

const handleGetQuestions: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/question',
      method: 'POST',
      data: { filter: action.payload },
      onStart: getQuestionsStarted.type,
      onSuccess: getQuestionsSuccess.type,
      onError: getQuestionsError.type,
    })
  )
}

const handleGetListStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateIsLoadingList(true))
}

const handleGetListSuccess: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (action: AnyAction): void => {
  const config = getState().ui.uiList.activeListConfig

  dispatch(updateActiveList(Object.values(action.payload.list)))
  dispatch(updateTotalCount(action.payload.totalCount))
  dispatch(clearListError)
  dispatch(updateIsLoadingList(false))
  dispatch(updateIsSortingList(false))

  if (config.shouldUpdateConfigAfterListSearch) {
    dispatch(updateHasUpdatedConfig(true))
  }
}

const handleGetDraftListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
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

const handleGetCertificateListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
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

const handleGetPreviousCertificatesListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
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

const handleGetQuestionListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/list/config/question',
      method: 'POST',
      data: action.payload,
      onStart: getQuestionListConfigStarted.type,
      onSuccess: getQuestionListConfigSuccess.type,
      onError: setListError.type,
    })
  )
}

const handleUpdateQuestionListConfig: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
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

const handleUpdateListConfigSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateActiveListConfig(action.payload))
  dispatch(updateHasUpdatedConfig(false))
}
const handleGetListConfigStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
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

const handleGetListError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  clearListState(dispatch)
  dispatch(setListError())
}

const handleUpdateDefaultFilterValues = ({ dispatch, getState }: MiddlewareAPI) => () => (): void => {
  const filters = getState().ui.uiList.activeListConfig?.filters
  if (filters) {
    filters.forEach((filter: ListFilterConfig) => {
      const defaultValue = getListFilterDefaultValue(filter)
      dispatch(updateActiveListFilterValue({ filterValue: defaultValue, id: filter.id }))
    })
  }
}

const handleClearActiveListFilter: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateDefaultListFilterValues)
  dispatch(performListSearch)
}

const handleForwardCertificateSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(updateListItemAsForwarded(action.payload.certificate.metadata.id))
}

const middlewareMethods = {
  [performListSearch.type]: handlePerformListSearch,
  [getListConfig.type]: handleGetListConfig,
  [getDrafts.type]: handleGetDrafts,
  [getDraftsSuccess.type]: handleGetListSuccess,
  [getDraftListConfig.type]: handleGetDraftListConfig,
  [getDraftListConfigSuccess.type]: handleGetListConfigSuccess,
  [updateDefaultListFilterValues.type]: handleUpdateDefaultFilterValues,
  [clearActiveListFilter.type]: handleClearActiveListFilter,
  [getDraftsError.type]: handleGetListError,
  [getDraftsStarted.type]: handleGetListStarted,
  [getDraftListConfigStarted.type]: handleGetListConfigStarted,
  [getCertificateList.type]: handleGetCertificateList,
  [getCertificateListSuccess.type]: handleGetListSuccess,
  [getCertificateListStarted.type]: handleGetListStarted,
  [getCertificateListError.type]: handleGetListError,
  [getPreviousCertificatesList.type]: handleGetPreviousCertificatesList,
  [getPreviousCertificatesListSuccess.type]: handleGetListSuccess,
  [getPreviousCertificatesListStarted.type]: handleGetListStarted,
  [getPreviousCertificatesListError.type]: handleGetListError,
  [getCertificateListConfig.type]: handleGetCertificateListConfig,
  [getCertificateListConfigStarted.type]: handleGetListConfigStarted,
  [getCertificateListConfigSuccess.type]: handleGetListConfigSuccess,
  [getPreviousCertificatesListConfig.type]: handleGetPreviousCertificatesListConfig,
  [getPreviousCertificatesListConfigSuccess.type]: handleGetListConfigSuccess,
  [forwardCertificateSuccess.type]: handleForwardCertificateSuccess,
  [getPreviousCertificatesListConfigStarted.type]: handleGetListConfigStarted,
  [getQuestions.type]: handleGetQuestions,
  [getQuestionsSuccess.type]: handleGetListSuccess,
  [getQuestionsError.type]: handleGetListError,
  [getQuestionsStarted.type]: handleGetListStarted,
  [getQuestionListConfig.type]: handleGetQuestionListConfig,
  [getQuestionListConfigSuccess.type]: handleGetListConfigSuccess,
  [getQuestionListConfigStarted.type]: handleGetListConfigStarted,
  [updateQuestionListConfig.type]: handleUpdateQuestionListConfig,
  [updateListConfig.type]: handleUpdateListConfig,
  [updateListConfigSuccess.type]: handleUpdateListConfigSuccess,
}

export const listMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
