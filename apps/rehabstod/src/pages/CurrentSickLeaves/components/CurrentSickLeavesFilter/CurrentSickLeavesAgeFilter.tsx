import { RangeFilter } from '../../../../components/Table/filter/RangeFilter'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesAgeFilter() {
  const fromPatientAge = useAppSelector((state) => state.sickLeaveFilter.filter.fromPatientAge)
  const toPatientAge = useAppSelector((state) => state.sickLeaveFilter.filter.toPatientAge)
  const dispatch = useAppDispatch()

  return (
    <RangeFilter
      title="Åldersspann"
      description="Filtrerar på patientens nuvarande ålder."
      onFromChange={(value) => dispatch(update({ fromPatientAge: Number(value) }))}
      onToChange={(value) => dispatch(update({ toPatientAge: Number(value) }))}
      to={toPatientAge.toString()}
      from={fromPatientAge.toString()}
      max="150"
      min="1"
    />
  )
}
