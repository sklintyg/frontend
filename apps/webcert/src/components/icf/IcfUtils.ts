import { IcfCode } from '@frontend/common'
import { AvailableIcfCodes } from '../../store/icf/icfReducer'

export const getIcfValueList = (icfData?: AvailableIcfCodes): string[] => {
  return [
    ...(icfData?.uniqueCodes ?? []).map((code) => code.icfCodes?.map((icfCode) => icfCode.title)).flat(),
    ...(icfData?.commonCodes?.icfCodes ?? []).map((icfCode: IcfCode) => icfCode.title),
  ]
}

export const getFilteredIcfValues = (
  chosenIcfValues: string[] | undefined,
  oldValues: string[],
  newValues: string[]
): string[] | undefined => {
  if (newValues.length === 0) return []

  const removedIcfValues = oldValues.filter((oldValue) => !newValues.some((newValue) => oldValue === newValue))
  return chosenIcfValues?.filter((val) => !removedIcfValues.includes(val))
}
