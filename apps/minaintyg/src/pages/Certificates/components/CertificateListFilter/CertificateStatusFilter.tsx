import { Select } from '@frontend/components'
import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'
import { getStatusBadgeLabel } from '../../utils/getStatusBadgeLabel'

export function CertificateStatusFilter({ options }: { options: CertificateStatus[] }) {
  const statuses = useAppSelector((state) => state.certificateFilter.statuses)
  const dispatch = useAppDispatch()

  return (
    <Select
      label="Status"
      value={statuses ?? ''}
      onChange={(event) => dispatch(update({ key: 'statuses', value: event.target.value as CertificateStatus }))}
      options={[
        { value: '', label: 'Välj status' },
        ...options.map((option) => ({ value: option, label: getStatusBadgeLabel(option) ?? option })),
      ]}
    />
  )
}
