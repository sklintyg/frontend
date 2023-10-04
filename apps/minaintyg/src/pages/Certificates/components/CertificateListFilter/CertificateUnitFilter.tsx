import { Select } from '@frontend/components'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateUnitFilter({ options }: { options: string[] }) {
  const { units } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <Select
      label="Mottagning"
      value={units ?? ''}
      onChange={(event) => dispatch(update({ units: event.target.value }))}
      options={[{ value: '', label: 'Välj mottagning' }, ...options.map((option) => ({ value: option, label: option }))]}
    />
  )
}
