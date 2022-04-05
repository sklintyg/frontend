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

export const getDraftListConfig = createAction(`${LIST} Get draft list config`)
export const getDraftListConfigStarted = createAction(`${LIST} Get draft list config started`)
export const getDraftListConfigSuccess = createAction(`${LIST} Get draft list config success`)
export const getDraftListConfigError = createAction(`${LIST} Get draft list config error`)

export const updateActiveListConfig = createAction<ListConfig>(`${LIST} Update active list config`)
export const clearActiveListConfig = createAction(`${LIST} Clear active list config`)
export const updateActiveList = createAction<CertificateListItem[]>(`${LIST} Update active list`)
export const clearActiveList = createAction(`${LIST} Clear active list`)

export const updateTotalCount = createAction<number>(`${LIST} Update total count for list`)

export interface UpdateListFilterValue {
  id: string
  filterValue: ListFilterValue
}
export const updateActiveListFilterValue = createAction<UpdateListFilterValue>(`${LIST} Update active list filter value`)
export const updateDefaultListFilterValues = createAction(`${LIST} Update default list filter values`)
export const clearActiveListFilter = createAction(`${LIST} Clear active list filter`)
export const updateActiveListType = createAction<ListType>(`${LIST} Update active list type`)
export const clearActiveListType = createAction(`${LIST} Clear active list type`)

export const setListError = createAction(`${LIST} Set list error`)
export const clearListError = createAction(`${LIST} Clear list error`)
