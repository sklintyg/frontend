import { TimePeriodFilter } from '../../../../components/Table/filter/TimePeriodFilter'
import { SickLeaveLengthInterval } from '../../../../schemas/sickLeaveSchema'
import { TimePeriodMetric } from '../../../../schemas/timePeriodOptionSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

const options = [
  { from: 0, to: 14, metric: TimePeriodMetric.DAYS, id: 1 },
  { from: 15, to: 30, metric: TimePeriodMetric.DAYS, id: 2 },
  { from: 31, to: 60, metric: TimePeriodMetric.DAYS, id: 3 },
  { from: 61, to: 90, metric: TimePeriodMetric.DAYS, id: 4 },
  { from: 91, to: 180, metric: TimePeriodMetric.DAYS, id: 5 },
  { from: 181, to: 365, metric: TimePeriodMetric.DAYS, id: 6 },
  { from: 1, to: 2, metric: TimePeriodMetric.YEARS, id: 7 },
  { from: 2, to: null, metric: TimePeriodMetric.YEARS, id: 8 },
]

export function CurrentSickLeavesTimePeriodFilter() {
  const sickLeaveLengthIntervals = useAppSelector((state) => state.sickLeaveFilter.filter.sickLeaveLengthIntervals)
  const dispatch = useAppDispatch()

  return (
    <TimePeriodFilter
      label="Sjukskrivningslängd"
      description="Filtrerar på total längd för det sjukfall som det aktiva intyget ingår i."
      onChange={(intervals: SickLeaveLengthInterval[]) => {
        dispatch(update({ sickLeaveLengthIntervals: intervals }))
      }}
      availableOptions={options}
      selectedOptions={sickLeaveLengthIntervals}
    />
  )
}
