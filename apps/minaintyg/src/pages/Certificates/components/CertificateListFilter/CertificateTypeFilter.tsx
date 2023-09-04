import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateTypeFilter({ options }: { options: string[] }) {
  const id = useId()
  const { certificateTypes } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <IDSSelect>
      <label htmlFor={id}>Intygstyp</label>
      <select id={id} onChange={(event) => dispatch(update({ certificateTypes: event.target.value }))}>
        <option value="">Välj intygstyp</option>
        {options.map((option) => (
          <option key={option} selected={certificateTypes === option}>
            {option}
          </option>
        ))}
      </select>
    </IDSSelect>
  )
}
