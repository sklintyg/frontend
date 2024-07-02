import type { TimePeriodOption } from '../../../../schemas/timePeriodOptionSchema';
import { TimePeriodMetric } from '../../../../schemas/timePeriodOptionSchema'

export const getSickLeaveLengthLabel = ({ from, to, metric }: TimePeriodOption) => {
  const label = metric === TimePeriodMetric.DAYS ? 'dagar' : 'år'

  if (to && from !== null) {
    return `${from}-${to} ${label}`
  }

  return `${!to ? `Över ${from}` : `Under ${to}`} ${label}`
}

export const getSickLeaveLengthPlaceholder = (selected: TimePeriodOption[]) => {
  if (selected.length === 0 || !selected) {
    return 'Alla valda'
  }

  if (selected.length === 1) {
    return getSickLeaveLengthLabel(selected[0])
  }

  return `${selected.length} valda`
}
