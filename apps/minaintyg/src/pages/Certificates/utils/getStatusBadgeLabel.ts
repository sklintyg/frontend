import { CertificateStatus, CertificateStatusEnum } from '../../../schema/certificateList.schema'

export function getStatusBadgeLabel(status: CertificateStatus) {
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
