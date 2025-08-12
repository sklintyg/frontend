import type { RootState } from '../store'
import type { AvailableIcfCodes } from './icfReducer'
import { IcfCodesPropertyEnum } from '../../types'

const IcfCodesProperty = {
  FUNKTIONSNEDSETTNINGAR: 'disability',
  AKTIVITETSBEGRANSNINGAR: 'activityLimitation',
} as const

export const getIcfData =
  (icfCodesPropertyName: keyof typeof IcfCodesProperty) =>
    (state: RootState): AvailableIcfCodes | undefined => {
      return state.ui.uiIcf[IcfCodesProperty[icfCodesPropertyName]]
    }

export const isIcfFunctionDisabled = (state: RootState): boolean => state.ui.uiIcf.functionDisablers.length > 0

export const getOriginalIcd10Codes = (state: RootState): string[] => state.ui.uiIcf.originalIcd10Codes
