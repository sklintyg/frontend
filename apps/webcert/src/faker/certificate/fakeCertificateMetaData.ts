import faker from 'faker'
import type { PartialDeep } from 'type-fest'
import type { CertificateMetadata, CertificateRelations, MessageType } from '../../types'
import { CertificateStatus, QuestionType } from '../../types'
import { fakePatient } from '../fakePatient'
import { fakeStaff } from '../fakeStaff'
import { fakeUnit } from '../user/fakeUnit'
import { fakeCertificateConfirmationModal } from './fakeCertificateConfirmationModal'
import { fakeCertificateValidationError } from './fakeCertificateDataValidation'
import { fakeCertificateRelation } from './fakeCertificateRelation'

export const fakeCertificateRelations = (data?: PartialDeep<CertificateRelations>): CertificateRelations => {
  return {
    parent: data?.parent ? fakeCertificateRelation(data.parent) : null,
    children: data?.children ? data?.children.map(fakeCertificateRelation) : [],
  }
}

export function fakeCertifiaMessageType(data?: Partial<MessageType>): MessageType {
  return {
    type: QuestionType.CONTACT,
    subject: 'Kontakt',
    ...data,
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
    messageTypes: data?.messageTypes?.map(fakeCertifiaMessageType) ?? undefined,
    confirmationModal: data?.confirmationModal ? fakeCertificateConfirmationModal({ ...data.confirmationModal }) : null,
    availableForCitizen: data?.availableForCitizen ?? true,
  }
}
