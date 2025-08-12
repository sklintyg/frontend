import type { RootState } from '../store'
import type { AvailableIcfCodes } from './icfReducer'
import { IcfCodesPropertyEnum } from '../../types'

export const getIcfData =
  (icfCodesPropertyName: keyof typeof IcfCodesPropertyEnum) =>
    (state: RootState): AvailableIcfCodes | undefined => {
      return state.ui.uiIcf[IcfCodesPropertyEnum[icfCodesPropertyName]]
    }

export const isIcfFunctionDisabled = (state: RootState): boolean => state.ui.uiIcf.functionDisablers.length > 0

export const getOriginalIcd10Codes = (state: RootState): string[] => state.ui.uiIcf.originalIcd10Codes
