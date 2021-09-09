import { RootState } from '../store'
import { Icf } from './icfReducer'

export const getIcfDisability = (state: RootState): Icf | undefined => state.ui.uiIcf.disability

export const getIcfActivityLimitation = (state: RootState): Icf | undefined => state.ui.uiIcf.activityLimitation

export const getIcfData = (id: string) => (state: RootState) => {
  return id === 'funktionsnedsattning' ? state.ui.uiIcf.activityLimitation : state.ui.uiIcf.disability
}
