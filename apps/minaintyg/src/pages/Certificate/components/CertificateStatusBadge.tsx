import { IDSBadge } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'
import { CertificateStatus, CertificateStatusEnum } from '../../../schema/certificate.schema'
import { getStatusBadgeLabel } from '../utils/getStatusBadgeLabel'

export function getBadgeType(status: CertificateStatus): ComponentProps<typeof IDSBadge>['type'] {
  switch (status) {
    case CertificateStatusEnum.enum.NEW:
      return 'primary'
    case CertificateStatusEnum.enum.SENT:
      return 'success'
    case CertificateStatusEnum.enum.NOT_SENT:
      return 'error'
    default:
      return 'secondary'
  }
}

export function CertificateStatusBadge({ status }: { status: CertificateStatus }) {
  const label = getStatusBadgeLabel(status)

  if (!label) {
    return null
  }

  return (
    <IDSBadge className="whitespace-nowrap" type={getBadgeType(status)}>
      {label}
    </IDSBadge>
  )
}
