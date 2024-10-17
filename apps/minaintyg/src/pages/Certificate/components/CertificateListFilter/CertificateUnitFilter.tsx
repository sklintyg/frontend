import { Select } from 'components'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateUnitFilter({
  options,
}: {
  options: {
    id: string
    name: string
  }[]
}) {
  const units = useAppSelector((state) => state.certificateFilter.units)
  const dispatch = useAppDispatch()

  return (
    <Select
      label="Mottagning"
      value={units ?? ''}
      onChange={(event) => dispatch(update({ key: 'units', value: event.target.value }))}
      options={[{ value: '', label: 'Välj mottagning' }, ...options.map((option) => ({ value: option.id, label: option.name }))]}
    />
  )
}
