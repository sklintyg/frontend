import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateYearFilter({ options }: { options: string[] }) {
  const id = useId()
  const { years } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <IDSSelect>
      <label htmlFor={id}>År</label>
      <select id={id} onChange={(event) => dispatch(update({ years: event.target.value }))}>
        <option value="">Välj år</option>
        {options.map((option) => (
          <option key={option} selected={years === option}>
            {option}
          </option>
        ))}
      </select>
    </IDSSelect>
  )
}
