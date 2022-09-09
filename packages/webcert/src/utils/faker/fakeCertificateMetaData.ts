import { faker } from '@faker-js/faker'
import { CertificateMetadata, CertificateStatus } from '@frontend/common'
import { fakePatient } from './fakePatient'
import { fakeStaff } from './fakeStaff'
import { fakeUnit } from './fakeUnit'

export const fakeCertificateMetaData = (data?: Partial<CertificateMetadata>): CertificateMetadata => {
  return {
    id: '1',
    description: faker.lorem.sentence(),
    type: faker.random.alpha(6),
    name: faker.lorem.words(),
    typeVersion: faker.random.numeric(),
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
    version: faker.mersenne.rand(1, 10),
    latestMajorVersion: true,
    responsibleHospName: faker.random.alpha(6),
    ...data,
  }
}
