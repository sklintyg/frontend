import { RootState } from '../store'

export const getIcfData = (id: string) => (state: RootState) => {
  return id === 'aktivitetsbegransning' ? state.ui.uiIcf.activityLimitation : state.ui.uiIcf.disability
}

export const getIsLoadingIcfData = () => (state: RootState): boolean => state.ui.uiIcf.loading

export const isIcfFunctionDisabled = (state: RootState): boolean => state.ui.uiIcf.functionBlockers.length > 0
