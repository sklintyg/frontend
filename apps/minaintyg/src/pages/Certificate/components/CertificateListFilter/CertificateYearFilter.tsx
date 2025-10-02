import { IDSSelect } from '@inera/ids-react'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateYearFilter({ options }: { options: string[] }) {
  const years = useAppSelector((state) => state.certificateFilter.years)
  const dispatch = useAppDispatch()

  return (
    <IDSSelect label="År" value={years ?? ''} onChange={(event) => dispatch(update({ key: 'years', value: event.target.value }))}>
      <option disabled value="">
        Välj år
      </option>
      {...options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </IDSSelect>
  )
}
