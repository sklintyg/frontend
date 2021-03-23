import { RootState } from '../store'

export const getDynamicLink = (key: string) => (state: RootState) => state.ui.uiUtils.dynamicLinks[key]

export const getDiagnosisTypeaheadResult = () => (state: RootState) => state.ui.uiUtils.diagnosisTypeahead
