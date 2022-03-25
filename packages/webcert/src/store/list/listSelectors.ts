import { RootState } from '../store'
import { CertificateListItem, ListConfig, ListFilter, ListType } from '@frontend/common/src/types/list'

export const getActiveListFilter = (state: RootState): ListFilter | undefined => state.ui.uiList.activeListFilter

export const getActiveList = (state: RootState): CertificateListItem[] => state.ui.uiList.activeList

export const getActiveListConfig = (state: RootState): ListConfig | undefined => state.ui.uiList.activeListConfig

export const getActiveListFilterValue = (id: string) => (state: RootState): unknown =>
  state.ui.uiList.activeListFilter?.values ? state.ui.uiList.activeListFilter?.values[id] : undefined

export const getActiveListType = (state: RootState): ListType => state.ui.uiList.activeListType
