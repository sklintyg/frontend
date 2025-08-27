import { IcfCodesPropertyEnum } from '../../types'
import type { RootState } from '../reducer'
import type { AvailableIcfCodes } from './icfReducer'

export const getIcfData =
  (icfCodesPropertyName: keyof typeof IcfCodesPropertyEnum) =>
  (state: RootState): AvailableIcfCodes | undefined => {
    return state.ui.uiIcf[IcfCodesPropertyEnum[icfCodesPropertyName]]
  }

export const isIcfFunctionDisabled = (state: RootState): boolean => state.ui.uiIcf.functionDisablers.length > 0

export const getOriginalIcd10Codes = (state: RootState): string[] => state.ui.uiIcf.originalIcd10Codes
