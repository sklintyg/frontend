import { TimePeriodMetric } from '../../../../schemas/timePeriodOptionSchema'

export const convertSelectedValue = (value: number | null, metric: TimePeriodMetric) =>
  value && value >= 365 && metric === TimePeriodMetric.YEARS ? value / 365 : value
