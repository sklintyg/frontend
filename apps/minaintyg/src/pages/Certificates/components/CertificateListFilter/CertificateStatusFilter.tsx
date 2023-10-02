import { Select } from '@frontend/components'
import { useId } from 'react'
import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slice/certificateFilter.slice'

export function CertificateStatusFilter({ options }: { options: CertificateStatus[] }) {
  const id = useId()
  const { statuses } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  return (
    <Select
      id={id}
      label="Status"
      value={statuses ?? ''}
      onChange={(event) => dispatch(update({ statuses: event.target.value as CertificateStatus }))}
      options={[{ value: '', label: 'Välj status' }, ...options.map((option) => ({ value: option, label: option }))]}
    />
  )
}
