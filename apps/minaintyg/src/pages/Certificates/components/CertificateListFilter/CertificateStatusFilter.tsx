import { IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateStatusFilter({ options }: { options: CertificateStatus[] }) {
  const id = useId()
  const { statuses } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <IDSSelect>
      <label htmlFor={id}>Status</label>
      <select id={id} onChange={(event) => dispatch(update({ statuses: event.target.value as CertificateStatus }))}>
        <option value="">Välj status</option>
        {options.map((option) => (
          <option key={option} selected={statuses === option}>
            {option}
          </option>
        ))}
      </select>
    </IDSSelect>
  )
}
