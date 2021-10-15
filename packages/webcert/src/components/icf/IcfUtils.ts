import { AvailableIcfCodes } from '../../store/icf/icfReducer'

export const getIcfValueList = (icfData: AvailableIcfCodes | undefined): string[] => {
  if (!icfData || (!icfData.uniqueCodes && !icfData.commonCodes)) return []

  const uniqueCodes = icfData.uniqueCodes?.map((code) => code.icfCodes?.map((icfCode) => icfCode.title)).flat()
  const commonCodes = icfData.commonCodes?.icfCodes?.map((icfCode) => icfCode.title)

  let result: string[] = []

  if (uniqueCodes) {
    result = [...uniqueCodes]
  }
  if (commonCodes) {
    result = result.concat(commonCodes)
  }
  return result
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

export const isOldListIncludedInNewList = (oldList?: string[], newList?: string[]): boolean => {
  if (!oldList || !newList) return false
  return oldList.some((oldVal) => !newList.includes(oldVal))
}
