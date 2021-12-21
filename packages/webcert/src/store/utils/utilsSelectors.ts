import { RootState } from '../store'
import { DiagnosisTypeahead, DynamicLinkData } from '@frontend/common'

export const getDynamicLink = (key: string) => (state: RootState): DynamicLinkData => state.ui.uiUtils.dynamicLinks[key]

export const getDiagnosisTypeaheadResult = () => (state: RootState): DiagnosisTypeahead | null => state.ui.uiUtils.diagnosisTypeahead
