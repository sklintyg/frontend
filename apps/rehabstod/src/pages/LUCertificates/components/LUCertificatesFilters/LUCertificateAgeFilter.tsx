import { RangeFilter } from '../../../../components/Table/filter/RangeFilter'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/luCertificatesFilter.slice'

export function LUCertificateAgeFilter() {
  const fromAge = useAppSelector((state) => state.luCertificatesFilter.filter.fromAge)
  const toAge = useAppSelector((state) => state.luCertificatesFilter.filter.toAge)
  const dispatch = useAppDispatch()

  return (
    <RangeFilter
      title="Åldersspann"
      description="Filtrerar på patientens nuvarande ålder."
      onFromChange={(value) => dispatch(update({ fromAge: Number(value) }))}
      onToChange={(value) => dispatch(update({ toAge: Number(value) }))}
      to={toAge.toString()}
      from={fromAge.toString()}
      max="150"
      min="1"
    />
  )
}
