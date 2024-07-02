import faker from 'faker'
import type { CertificateEvent } from '../../types/certificate'
import { CertificateEventType, CertificateStatus } from '../../types/certificate'
import { fakeId } from '../fakeId'

export function fakeCertificateEvent(data?: Partial<CertificateEvent>): CertificateEvent {
  return {
    certificateId: fakeId(),
    type: faker.helpers.randomize(Object.values(CertificateEventType)),
    timestamp: faker.date.recent().toISOString(),
    relatedCertificateId: null,
    relatedCertificateStatus: faker.helpers.randomize(Object.values(CertificateStatus)),
    ...data,
  }
}
