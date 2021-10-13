import { RootState } from '../store'
import { AvailableIcfCodes } from './icfReducer'

export const getIcfDisability = (state: RootState): AvailableIcfCodes | undefined => state.ui.uiIcf.disability

export const getIcfActivityLimitation = (state: RootState): AvailableIcfCodes | undefined => state.ui.uiIcf.activityLimitation

export const getIcfData = (id: string) => (state: RootState) => {
  return id === 'funktionsnedsattning' ? state.ui.uiIcf.activityLimitation : state.ui.uiIcf.disability
}

export const getIsLoadingIcfData = () => (state: RootState): boolean => state.ui.uiIcf.loading
