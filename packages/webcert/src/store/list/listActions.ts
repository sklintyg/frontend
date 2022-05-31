import { createAction } from '@reduxjs/toolkit'
import { CertificateListItem, ListConfig, ListFilter, ListFilterValue, ListType } from '@frontend/common/src/types/list'

const LIST = '[List]'

export const performListSearch = createAction(`${LIST} Perform list search`)

export interface ListResponse {
  list: CertificateListItem[]
  totalCount: number
}

export const getDrafts = createAction<ListFilter>(`${LIST} Get drafts`)
export const getDraftsStarted = createAction(`${LIST} Get drafts started`)
export const getDraftsSuccess = createAction<ListResponse>(`${LIST} Get drafts success`)
export const getDraftsError = createAction(`${LIST} Get drafts error`)

export const getCertificateList = createAction<ListFilter>(`${LIST} Get certificate list`)
export const getCertificateListStarted = createAction(`${LIST} Get certificate list started`)
export const getCertificateListSuccess = createAction<ListResponse>(`${LIST} Get certificate list success`)
export const getCertificateListError = createAction(`${LIST} Get certificate list error`)

export const getPreviousCertificatesList = createAction<ListFilter>(`${LIST} Get previous certificates list`)
export const getPreviousCertificatesListStarted = createAction(`${LIST} Get previous certificates list started`)
export const getPreviousCertificatesListSuccess = createAction<ListResponse>(`${LIST} Get previous certificates list success`)
export const getPreviousCertificatesListError = createAction(`${LIST} Get  previous certificates list error`)

export const getDraftListConfig = createAction(`${LIST} Get draft list config`)
export const getDraftListConfigStarted = createAction(`${LIST} Get draft list config started`)
export const getDraftListConfigSuccess = createAction(`${LIST} Get draft list config success`)
export const getDraftListConfigError = createAction(`${LIST} Get draft list config error`)

export const getCertificateListConfig = createAction(`${LIST} Get certificate list config`)
export const getCertificateListConfigStarted = createAction(`${LIST} Get certificate list config started`)
export const getCertificateListConfigSuccess = createAction(`${LIST} Get certificate list config success`)
export const getCertificateListConfigError = createAction(`${LIST} Get certificate list config error`)

export const getPreviousCertificatesListConfig = createAction(`${LIST} Get previous certificates list config`)
export const getPreviousCertificatesListConfigStarted = createAction(`${LIST} Get previous certificates list config started`)
export const getPreviousCertificatesListConfigSuccess = createAction(`${LIST} Get previous certificates list config success`)
export const getPreviousCertificatesListConfigError = createAction(`${LIST} Get previous certificates list config error`)

export const updateActiveListConfig = createAction<ListConfig>(`${LIST} Update active list config`)
export const clearActiveListConfig = createAction(`${LIST} Clear active list config`)
export const updateActiveList = createAction<CertificateListItem[]>(`${LIST} Update active list`)
export const clearActiveList = createAction(`${LIST} Clear active list`)
export const updateIsLoadingList = createAction<boolean>(`${LIST} Update is loading list`)
export const updateIsLoadingListConfig = createAction<boolean>(`${LIST} Update is loading list config`)
export const updateIsSortingList = createAction<boolean>(`${LIST} Update is sorting list`)

export const updateTotalCount = createAction<number | undefined>(`${LIST} Update total count for list`)

export interface UpdateListFilterValue {
  id: string
  filterValue: ListFilterValue
}
export const updateActiveListFilterValue = createAction<UpdateListFilterValue>(`${LIST} Update active list filter value`)
export const updateActiveListFilter = createAction<ListFilter>(`${LIST} Update active list filter`)
export const updateDefaultListFilterValues = createAction(`${LIST} Update default list filter values`)
export const clearActiveListFilter = createAction(`${LIST} Clear active list filter`)
export const updateActiveListType = createAction<ListType>(`${LIST} Update active list type`)
export const clearActiveListType = createAction(`${LIST} Clear active list type`)

export const setListError = createAction(`${LIST} Set list error`)
export const clearListError = createAction(`${LIST} Clear list error`)
export const updateHasValidationError = createAction<boolean>(`${LIST} Update has validation error`)

export const resetListState = createAction(`${LIST} Reset state`)
