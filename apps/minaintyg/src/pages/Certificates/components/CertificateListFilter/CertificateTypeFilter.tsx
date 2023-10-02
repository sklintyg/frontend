import { Select } from '@frontend/components'
import { useId } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateTypeFilter({ options }: { options: string[] }) {
  const id = useId()
  const { certificateTypes } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <Select
      id={id}
      label="Intygstyp"
      value={certificateTypes ?? ''}
      onChange={(event) => dispatch(update({ certificateTypes: event.target.value }))}
    >
      <option value="">Välj intygstyp</option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Select>
  )
}
