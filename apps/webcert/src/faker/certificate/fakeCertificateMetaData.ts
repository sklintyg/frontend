import faker from 'faker'
import { PartialDeep } from 'type-fest'
import { CertificateMetadata, CertificateRelations, CertificateStatus } from '../../types'
import { fakePatient } from '../fakePatient'
import { fakeStaff } from '../fakeStaff'
import { fakeUnit } from '../fakeUnit'
import { fakeCertificateValidationError } from './fakeCertificateDataValidation'
import { fakeCertificateRelation } from './fakeCertificateRelation'

export const fakeCertificateRelations = (data?: PartialDeep<CertificateRelations>): CertificateRelations => {
  return {
    parent: data?.parent ? fakeCertificateRelation(data.parent) : null,
    children: data?.children ? data?.children.map(fakeCertificateRelation) : [],
  }
}

export const fakeCertificateMetaData = (data?: PartialDeep<CertificateMetadata>): CertificateMetadata => {
  return {
    created: faker.date.recent().toString(),
    description: faker.lorem.sentence(),
    forwarded: false,
    id: '1',
    latestMajorVersion: true,
    name: faker.lorem.words(),
    responsibleHospName: faker.random.alpha({ count: 6 }),
    sent: false,
    status: CertificateStatus.UNSIGNED,
    testCertificate: true,
    type: faker.random.alpha({ count: 6 }),
    typeVersion: faker.random.alphaNumeric(),
    version: Math.random() * 9 + 1,
    ...data,
    careUnitValidationErrors: data?.careUnitValidationErrors?.map(fakeCertificateValidationError) ?? [],
    patientValidationErrors: data?.patientValidationErrors?.map(fakeCertificateValidationError) ?? [],
    relations: fakeCertificateRelations(data?.relations),
    unit: fakeUnit(data?.unit),
    patient: fakePatient(data?.patient),
    issuedBy: fakeStaff(data?.issuedBy),
    careUnit: fakeUnit(data?.careUnit),
    careProvider: fakeUnit(data?.careProvider),
  }
}
