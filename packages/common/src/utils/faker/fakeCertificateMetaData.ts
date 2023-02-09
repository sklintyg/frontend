import faker from 'faker'
import { CertificateMetadata, CertificateStatus } from '../../types/certificate'
import { fakePatient } from './fakePatient'
import { fakeStaff } from './fakeStaff'
import { fakeUnit } from './fakeUnit'

export const fakeCertificateMetaData = (data?: Partial<CertificateMetadata>): CertificateMetadata => {
  return {
    id: '1',
    description: faker.lorem.sentence(),
    type: faker.random.alpha({ count: 6 }),
    name: faker.lorem.words(),
    typeVersion: faker.random.alphaNumeric(),
    status: CertificateStatus.UNSIGNED,
    sent: false,
    created: faker.date.recent().toString(),
    testCertificate: true,
    forwarded: false,
    relations: {
      parent: null,
      children: [],
    },
    unit: fakeUnit(),
    careUnit: fakeUnit(),
    careProvider: fakeUnit(),
    patient: fakePatient(),
    issuedBy: fakeStaff(),
    version: Math.random() * 9 + 1,
    latestMajorVersion: true,
    responsibleHospName: faker.random.alpha({ count: 6 }),
    ...data,
  }
}
