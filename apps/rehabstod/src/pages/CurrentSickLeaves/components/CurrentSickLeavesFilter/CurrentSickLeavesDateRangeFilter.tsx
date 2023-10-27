import { DateRangeFilter } from '../../../../components/Table/filter/DateRangeFilter'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesDateRangeFilter() {
  const dispatch = useAppDispatch()
  const fromSickLeaveEndDate = useAppSelector((state) => state.sickLeaveFilter.filter.fromSickLeaveEndDate)
  const toSickLeaveEndDate = useAppSelector((state) => state.sickLeaveFilter.filter.toSickLeaveEndDate)
  const isValidDateRange = useAppSelector((state) => state.sickLeaveFilter.isValidDateRange)
  const displayValidationErrors = useAppSelector((state) => state.sickLeaveFilter.displayValidationErrors)

  return (
    <DateRangeFilter
      fromDate={fromSickLeaveEndDate}
      toDate={toSickLeaveEndDate}
      error={displayValidationErrors && !isValidDateRange}
      onDataChanged={({ start, end }) => {
        dispatch(
          update({
            fromSickLeaveEndDate: start,
            toSickLeaveEndDate: end,
          })
        )
      }}
      label="Slutdatum"
      description="Filtrerar på slutdatum för det sjukfall som det aktiva intyget ingår i."
    />
  )
}
