import { CertificateEvent, CertificateEventType } from '@frontend/common'
import { CertificateStatus } from '@frontend/common/src'

export const createEvent = (
  certificateId: string,
  type: CertificateEventType,
  relatedCertificateId: string | null,
  relatedCertificateStatus: CertificateStatus | null
): CertificateEvent => ({
  certificateId,
  type,
  timestamp: new Date().toISOString(),
  relatedCertificateId,
  relatedCertificateStatus,
})
