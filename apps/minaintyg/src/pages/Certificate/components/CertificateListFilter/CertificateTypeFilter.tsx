import { IDSSelect } from '@inera/ids-react'
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
  const certificateTypes = useAppSelector((state) => state.certificateFilter.certificateTypes)
  const dispatch = useAppDispatch()

  return (
    <IDSSelect
      label="Intygstyp"
      value={certificateTypes ?? ''}
      onChange={(event) => dispatch(update({ key: 'certificateTypes', value: event.target.value }))}
    >
      <option disabled value="">
        Välj intygstyp
      </option>
      {...options.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </IDSSelect>
  )
}
