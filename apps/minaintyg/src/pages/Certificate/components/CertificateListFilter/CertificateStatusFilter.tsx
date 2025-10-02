import { IDSSelect } from '@inera/ids-react'
import type { CertificateStatus } from '../../../../schema/certificate.schema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'
import { getStatusBadgeLabel } from '../../utils/getStatusBadgeLabel'

export function CertificateStatusFilter({ options }: { options: CertificateStatus[] }) {
  const statuses = useAppSelector((state) => state.certificateFilter.statuses)
  const dispatch = useAppDispatch()

  return (
    <IDSSelect
      label="Status"
      value={statuses ?? ''}
      onChange={(event) => dispatch(update({ key: 'statuses', value: event.target.value as CertificateStatus }))}
    >
      <option disabled value="">
        Välj status
      </option>
      {...options.map((option) => (
        <option key={option} value={option}>
          {getStatusBadgeLabel(option) ?? option}
        </option>
      ))}
    </IDSSelect>
  )
}
