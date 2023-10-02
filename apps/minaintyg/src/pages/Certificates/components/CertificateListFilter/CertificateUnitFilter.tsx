import { Select } from '@frontend/components'
import { useId } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateUnitFilter({ options }: { options: string[] }) {
  const id = useId()
  const { units } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <Select id={id} label="Mottagning" value={units ?? ''} onChange={(event) => dispatch(update({ units: event.target.value }))}>
      <option value="">Välj mottagning</option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Select>
  )
}
