import { Select } from '@frontend/components'
import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateStatusFilter({ options }: { options: CertificateStatus[] }) {
  const { statuses } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <Select
      label="Status"
      value={statuses ?? ''}
      onChange={(event) => dispatch(update({ key: 'statuses', value: event.target.value as CertificateStatus }))}
      options={[{ value: '', label: 'Välj status' }, ...options.map((option) => ({ value: option, label: option }))]}
    />
  )
}
