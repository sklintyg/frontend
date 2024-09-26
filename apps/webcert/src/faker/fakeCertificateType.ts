import fake from 'faker'
import type { CertificateType } from '../types'
import { fakeId } from './fakeId'

export function fakeCertificateType(data?: Partial<CertificateType>): CertificateType {
  return {
    description: fake.lorem.sentence(),
    detailedDescription: fake.lorem.sentence(),
    id: fakeId(),
    issuerTypeId: fakeId(),
    label: fake.lorem.word(),
    links: [],
    message: fake.lorem.sentence(),
    confirmationModal: null,
    ...data,
  }
}
