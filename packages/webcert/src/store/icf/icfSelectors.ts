import { RootState } from '../store'
import { AvailableIcfCodes } from './icfReducer'

export const getIcfData = (id: string) => (state: RootState): AvailableIcfCodes | undefined => {
  return id === 'aktivitetsbegransning' ? state.ui.uiIcf.activityLimitation : state.ui.uiIcf.disability
}

export const isIcfFunctionDisabled = (state: RootState): boolean => state.ui.uiIcf.functionDisablers.length > 0
