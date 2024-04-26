import faker from 'faker'
import { PartialDeep } from 'type-fest'
import { CertificateRelation, CertificateRelationType, CertificateStatus } from '../../types'
import { fakeId } from '../fakeId'

export const fakeCertificateRelation = (data?: PartialDeep<CertificateRelation>): CertificateRelation => {
  return {
    certificateId: fakeId(),
    created: faker.date.recent().toString(),
    status: CertificateStatus.UNSIGNED,
    type: CertificateRelationType.RENEW,
    ...data,
  }
}
