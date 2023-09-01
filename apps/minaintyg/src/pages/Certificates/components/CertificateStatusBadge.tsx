import { IDSBadge } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'
import { CertificateStatus } from '../../../schema/certificateList.schema'

type BadgeTypes = ComponentProps<typeof IDSBadge>['type']

const getBadgeType = (status: CertificateStatus): BadgeTypes => {
  switch (status) {
    case CertificateStatus.NEW:
      return 'primary'
    case CertificateStatus.SENT:
      return 'success'
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
