import { CertificateEvent, CertificateEventType } from '@frontend/common'

export const createEvent = (certificateId: string, type: CertificateEventType, relatedCertificateId: string | null): CertificateEvent => ({
  certificateId,
  userId: 'TSTNMT2321000156-1079',
  type,
  timestamp: new Date().toISOString(),
  relatedCertificateId,
})
