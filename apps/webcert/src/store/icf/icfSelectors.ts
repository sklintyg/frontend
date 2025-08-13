import type { RootState } from '../store'
import type { AvailableIcfCodes } from './icfReducer'

export const getIcfData =
  (id: string) =>
  (state: RootState): AvailableIcfCodes | undefined => {
    return id === 'aktivitetsbegransning' ? state.ui.uiIcf.activityLimitation : state.ui.uiIcf.disability
  }

export const isIcfFunctionDisabled = (state: RootState): boolean => state.ui.uiIcf.functionDisablers.length > 0

export const getOriginalIcd10Codes = (state: RootState): string[] => state.ui.uiIcf.originalIcd10Codes
