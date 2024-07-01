import { CertificateListItem, ListConfig, ListFilter, ListType } from '../../types'
import { ErrorData } from '../error/types'
import { RootState } from '../store'

export const getActiveListFilter = (state: RootState): ListFilter | undefined => state.ui.uiList.activeListFilter

export const getActiveList = (state: RootState): CertificateListItem[] => state.ui.uiList.activeList

export const getActiveListConfig = (state: RootState): ListConfig | undefined => state.ui.uiList.activeListConfig

export const getActiveListFilterValue =
  (id: string) =>
  (state: RootState): unknown =>
    state.ui.uiList.activeListFilter?.values ? state.ui.uiList.activeListFilter?.values[id] : undefined

export const getActiveListType = (state: RootState): ListType => state.ui.uiList.activeListType

export const getListError = (state: RootState): ErrorData | undefined => state.ui.uiList.listError

export const getListTotalCount = (state: RootState): number | undefined => state.ui.uiList.totalCount

export const getIsLoadingList = (state: RootState): boolean => state.ui.uiList.isLoadingList

export const getIsLoadingListConfig = (state: RootState): boolean => state.ui.uiList.isLoadingListConfig

export const getIsSortingList = (state: RootState): boolean => state.ui.uiList.isSortingList

export const getHasValidationErrors = (state: RootState): boolean =>
  !!Object.values(state.ui.uiList.validationErrors).find((value) => value)

export const getHasUpdatedConfig = (state: RootState): boolean => state.ui.uiList.hasUpdatedConfig
