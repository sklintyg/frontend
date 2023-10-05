import { Select } from '@frontend/components'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateTypeFilter({
  options,
}: {
  options: {
    id: string
    name: string
  }[]
}) {
  const { certificateTypes } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <Select
      label="Intygstyp"
      value={certificateTypes ?? ''}
      onChange={(event) => dispatch(update({ key: 'certificateTypes', value: event.target.value }))}
      options={[{ value: '', label: 'Välj intygstyp' }, ...options.map((option) => ({ value: option.id, label: option.name }))]}
    />
  )
}
