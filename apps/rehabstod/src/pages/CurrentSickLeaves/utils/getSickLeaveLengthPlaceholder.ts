import { TimePeriodMetric, TimePeriodOption } from '../../../schemas/timePeriodOptionSchema'

export const getSickLeaveLengthLabel = ({ from, to, metric }: TimePeriodOption) => {
  const label = metric === TimePeriodMetric.DAYS ? 'dagar' : 'år'

  if (to && from) {
    return `${from}-${to} ${label}`
  }

  return `${!to ? `Över ${from}` : `Under ${to}`} ${label}`
}

export const getSickLeaveLengthPlaceholder = (selected: TimePeriodOption[]) => {
  if (selected.length === 0) {
    return undefined
  }

  if (selected.length === 1) {
    return getSickLeaveLengthLabel(selected[0])
  }

  return `${selected.length} valda`
}
