import { IDSBadge } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'
import { CertificateStatus, CertificateStatusEnum } from '../../../schema/certificateList.schema'

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

function getBadgeLabel(status: CertificateStatus) {
  switch (status) {
    case CertificateStatusEnum.enum.NEW:
      return 'Nytt'
    case CertificateStatusEnum.enum.REPLACED:
      return 'Ersätter intyg'
    case CertificateStatusEnum.enum.SENT:
      return 'Skickat'
    case CertificateStatusEnum.enum.NOT_SENT:
      return 'Ej skickat'
    default:
      return undefined
  }
}

export function CertificateStatusBadge({ status }: { status: CertificateStatus }) {
  const label = getBadgeLabel(status)

  if (!label) {
    return null
  }

  return (
    <IDSBadge className="whitespace-nowrap" type={getBadgeType(status)}>
      {label}
    </IDSBadge>
  )
}
