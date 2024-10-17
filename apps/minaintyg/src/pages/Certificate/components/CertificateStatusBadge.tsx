import { IDSBadge } from 'ids-react-ts'
import type { ComponentProps } from 'react'
import type { CertificateStatus } from '../../../schema/certificate.schema'
import { CertificateStatusEnum } from '../../../schema/certificate.schema'
import { getStatusBadgeLabel } from '../utils/getStatusBadgeLabel'

export function getBadgeType(status: CertificateStatus): ComponentProps<typeof IDSBadge>['type'] {
  switch (status) {
    case CertificateStatusEnum.enum.NEW:
      return 'primary'
    case CertificateStatusEnum.enum.SENT:
      return 'success'
    case CertificateStatusEnum.enum.NOT_SENT:
      return 'error'
    case CertificateStatusEnum.enum.REPLACED:
      return 'neutral'
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
