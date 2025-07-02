import { IDSSelect } from '@inera/ids-react'
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
    <IDSSelect label="Mottagning" value={units ?? ''} onChange={(event) => dispatch(update({ key: 'units', value: event.target.value }))}>
      <option disabled value="">
        Välj mottagning
      </option>
      {...options.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </IDSSelect>
  )
}
