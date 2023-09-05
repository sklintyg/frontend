import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateUnitFilter({ options }: { options: string[] }) {
  const id = useId()
  const { units } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <IDSSelect>
      <label htmlFor={id}>Mottagning</label>
      <select id={id} value={units ?? ''} onChange={(event) => dispatch(update({ units: event.target.value }))}>
        <option value="">Välj mottagning</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </IDSSelect>
  )
}
