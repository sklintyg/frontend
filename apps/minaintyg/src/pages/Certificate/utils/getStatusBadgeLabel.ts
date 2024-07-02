import type { CertificateStatus} from '../../../schema/certificate.schema';
import { CertificateStatusEnum } from '../../../schema/certificate.schema'

export function getStatusBadgeLabel(status: CertificateStatus) {
  switch (status) {
    case CertificateStatusEnum.enum.NEW:
      return 'Nytt'
    case CertificateStatusEnum.enum.REPLACED:
      return 'Ersatt'
    case CertificateStatusEnum.enum.SENT:
      return 'Skickat'
    case CertificateStatusEnum.enum.NOT_SENT:
      return 'Ej skickat'
    default:
      return undefined
  }
}
