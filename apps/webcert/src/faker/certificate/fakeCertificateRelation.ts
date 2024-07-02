import faker from 'faker'
import type { PartialDeep } from 'type-fest'
import type { CertificateRelation} from '../../types';
import { CertificateRelationType, CertificateStatus } from '../../types'
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
