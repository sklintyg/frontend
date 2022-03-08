import { RootState } from '../store'
import { DiagnosisTypeahead, DynamicLinkData } from '@frontend/common'
import { Banner, Configuration } from './utilsReducer'

export const getDynamicLink = (key: string) => (state: RootState): DynamicLinkData => state.ui.uiUtils.dynamicLinks[key]

export const getDiagnosisTypeaheadResult = () => (state: RootState): DiagnosisTypeahead | null => state.ui.uiUtils.diagnosisTypeahead

export const getConfig = (state: RootState): Configuration => state.ui.uiUtils.config

export const getBanners = (state: RootState): Banner[] => state.ui.uiUtils.config.banners
