import faker from 'faker'
import type { CertificateMetadata, CertificateRelations, MessageType } from '../../types'
import { CertificateStatus, QuestionType } from '../../types'
import { fakePatient } from '../fakePatient'
import { fakeStaff } from '../fakeStaff'
import { fakeUnit } from '../user/fakeUnit'

export const fakeCertificateRelations = (data?: Partial<CertificateRelations>): CertificateRelations => {
  return {
    parent: data?.parent ?? null,
    children: data?.children ?? [],
  }
}

export function fakeCertifiaMessageType(data?: Partial<MessageType>): MessageType {
  return {
    type: QuestionType.CONTACT,
    subject: 'Kontakt',
    ...data,
  }
}

export const fakeCertificateMetaData = (data?: Partial<CertificateMetadata>): CertificateMetadata => {
  return {
    id: '1',
    availableForCitizen: data?.availableForCitizen ?? true,
    careProvider: fakeUnit(data?.careProvider),
    careUnit: fakeUnit(data?.careUnit),
    // careUnitValidationErrors: data?.careUnitValidationErrors ?? [],
    confirmationModal: data?.confirmationModal ?? null,
    created: faker.date.recent().toString(),
    description: faker.lorem.sentence(),
    forwarded: false,
    issuedBy: fakeStaff(data?.issuedBy),
    latestMajorVersion: true,
    messageTypes: data?.messageTypes ?? undefined,
    name: faker.lorem.words(),
    patient: fakePatient(data?.patient),
    // patientValidationErrors: data?.patientValidationErrors ?? [],
    relations: fakeCertificateRelations(data?.relations),
    responsibleHospName: faker.random.alpha({ count: 6 }),
    sent: false,
    status: CertificateStatus.UNSIGNED,
    testCertificate: true,
    type: faker.random.alpha({ count: 6 }),
    typeVersion: faker.random.alphaNumeric(),
    unit: fakeUnit(data?.unit),
    version: Math.random() * 9 + 1,
    ...data,
  }
}
