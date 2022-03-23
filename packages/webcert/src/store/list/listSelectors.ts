import { RootState } from '../store'
import { CertificateListItem, ListConfig, ListFilter, ListFilterValue } from '@frontend/common/src/types/list'

export const getActiveListFilter = (state: RootState): ListFilter | undefined => state.ui.uiList.activeListFilter

export const getActiveList = (state: RootState): CertificateListItem[] => state.ui.uiList.activeList

export const getActiveListConfig = (state: RootState): ListConfig | undefined => state.ui.uiList.activeListConfig

export const getActiveListFilterValue = (id: string) => (state: RootState): ListFilterValue | undefined =>
  state.ui.uiList.activeListFilter?.values.find((value) => value.id === id)
