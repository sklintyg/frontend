import { RootState } from '../store'
import { Banner, DiagnosisTypeahead, DynamicLinkData } from '@frontend/common'
import { Configuration } from './utilsReducer'

export const getDynamicLink = (key: string) => (state: RootState): DynamicLinkData => state.ui.uiUtils.dynamicLinks[key]

export const getDiagnosisTypeaheadResult = () => (state: RootState): DiagnosisTypeahead | null => state.ui.uiUtils.diagnosisTypeahead

export const getConfig = (state: RootState): Configuration => state.ui.uiUtils.config

export const getBanners = (state: RootState): Banner[] => state.ui.uiUtils.config.banners

export const getNumberOfDraftsOnUnit = (state: RootState): number | undefined => state.ui.uiUtils.unitStatistics?.intygValdEnhet

export const selectIsLoadingConfig = (state: RootState): boolean => state.ui.uiUtils.isLoadingConfig

export const selectIsLoadingInitialState = (state: RootState): boolean =>
  state.ui.uiUtils.isLoadingConfig && state.ui.uiUtils.isLoadingDynamicLinks
