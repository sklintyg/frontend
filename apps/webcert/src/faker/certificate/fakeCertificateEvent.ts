import faker from 'faker'
import { CertificateEvent, CertificateEventType, CertificateStatus } from '../../types/certificate'

export function fakeCertificateEvent(data?: Partial<CertificateEvent>): CertificateEvent {
  return {
    certificateId: faker.random.alpha({ count: 5 }),
    type: faker.helpers.randomize(Object.values(CertificateEventType)),
    timestamp: faker.date.recent().toISOString(),
    relatedCertificateId: null,
    relatedCertificateStatus: faker.helpers.randomize(Object.values(CertificateStatus)),
    ...data,
  }
}
