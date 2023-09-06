import { IDSBadge } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'
import { CertificateStatus } from '../../../schema/certificateList.schema'

export const getBadgeType = (status: CertificateStatus): ComponentProps<typeof IDSBadge>['type'] => {
  switch (status) {
    case CertificateStatus.NEW:
      return 'primary'
    case CertificateStatus.SENT:
      return 'success'
    case CertificateStatus.NOT_SENT:
      return 'error'
    default:
      return 'secondary'
  }
}

export function CertificateStatusBadge({ status }: { status: CertificateStatus }) {
  return (
    <IDSBadge className="[&:not(:last-child)]:mb-2.5" type={getBadgeType(status)}>
      {status}
    </IDSBadge>
  )
}
