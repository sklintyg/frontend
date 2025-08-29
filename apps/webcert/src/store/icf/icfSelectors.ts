import { IcfCodesPropertyEnum } from '../../types'
import { isFunctionDisabled } from '../api/requestSlice'
import type { RootState } from '../reducer'
import { toggleIcfFunctionDisabler } from './icfActions'
import type { AvailableIcfCodes } from './icfReducer'

export const getIcfData =
  (icfCodesPropertyName: keyof typeof IcfCodesPropertyEnum) =>
  (state: RootState): AvailableIcfCodes | undefined => {
    return state.ui.uiIcf[IcfCodesPropertyEnum[icfCodesPropertyName]]
  }

export const isIcfFunctionDisabled = isFunctionDisabled(toggleIcfFunctionDisabler.type)

export const getOriginalIcd10Codes = (state: RootState): string[] => state.ui.uiIcf.originalIcd10Codes
