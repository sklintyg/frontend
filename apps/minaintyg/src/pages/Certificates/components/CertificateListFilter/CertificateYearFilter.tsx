import { Select } from '@frontend/components'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateYearFilter({ options }: { options: string[] }) {
  const { years } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <Select
      label="År"
      value={years ?? ''}
      onChange={(event) => dispatch(update({ years: event.target.value }))}
      options={[{ value: '', label: 'Välj år' }, ...options.map((option) => ({ value: option, label: option }))]}
    />
  )
}
