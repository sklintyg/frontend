import { createAction } from '@reduxjs/toolkit'
import { CertificateListItem, ListConfig, ListDraftFilter, ListFilter, ListFilterValue } from '@frontend/common/src/types/list'

const LIST = '[List]'

export const getDrafts = createAction<ListDraftFilter>(`${LIST} Get drafts`)
export const getDraftsStarted = createAction(`${LIST} Get drafts started`)
export const getDraftsSuccess = createAction(`${LIST} Get drafts success`)
export const getDraftsError = createAction(`${LIST} Get drafts error`)

export const getDraftListConfig = createAction(`${LIST} Get draft list config`)
export const getDraftListConfigStarted = createAction(`${LIST} Get draft list config started`)
export const getDraftListConfigSuccess = createAction(`${LIST} Get draft list config success`)
export const getDraftListConfigError = createAction(`${LIST} Get draft list config error`)

export const updateDraftListConfig = createAction<ListConfig>(`${LIST} Update draft config`)
export const updateDraftList = createAction<CertificateListItem[]>(`${LIST} Update draft list`)

export const updateActiveListFilter = createAction<ListFilter>(`${LIST} Update active list filter`)
export const clearActiveListFilter = createAction(`${LIST} Clear active list filter`)
export const addValueToActiveListFilter = createAction<ListFilterValue>(`${LIST} Add value to active list filter`)
