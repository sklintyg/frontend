import { Icf } from '../../store/icf/icfReducer'

export const getIcfValueList = (icfData: Icf | undefined): string[] => {
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
  const removedIcfValues = oldValues.filter((oldValue) => !newValues.some((newValue) => oldValue === newValue))
  return chosenIcfValues?.filter((val) => !removedIcfValues.includes(val))
}

export const getHasNewIcfValues = (oldIcfValues: string[], newIcfValues: string[]): boolean => {
  return oldIcfValues.some((oldVal) => !newIcfValues.includes(oldVal))
}
