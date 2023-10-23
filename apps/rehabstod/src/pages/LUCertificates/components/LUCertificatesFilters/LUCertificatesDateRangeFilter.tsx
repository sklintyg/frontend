import { DateRangeFilter } from '../../../../components/Table/filter/DateRangeFilter'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/luCertificatesFilter.slice'

export function LUCertificatesDateRangeFilter() {
  const dispatch = useAppDispatch()
  const fromDate = useAppSelector((state) => state.luCertificatesFilter.filter.fromDate)
  const toDate = useAppSelector((state) => state.luCertificatesFilter.filter.toDate)
  const isValidDateRange = useAppSelector((state) => state.luCertificatesFilter.isValidDateRange)
  const displayValidationErrors = useAppSelector((state) => state.luCertificatesFilter.displayValidationErrors)

  return (
    <DateRangeFilter
      fromDate={fromDate}
      toDate={toDate}
      onDataChanged={(value) => {
        dispatch(
          update({
            fromDate: value.start,
            toDate: value.end,
          })
        )
      }}
      error={displayValidationErrors && !isValidDateRange}
      label="Signeringsdatum"
      description="Filtrerar på signeringsdatum. Det är möjligt att välja ett intervall genom att klicka på två olika datum, eller ett enskilt datum genom att klicka på samma datum två gånger."
    />
  )
}
