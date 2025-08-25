import faker from 'faker'
import type { Alert, CertificateConfirmationModal } from '../../types/confirmModal'

export function fakeCertificateConfirmationModal(value?: Partial<CertificateConfirmationModal>): CertificateConfirmationModal {
  return {
    title: faker.lorem.sentence(),
    text: faker.lorem.paragraphs(),
    alert: fakeAlert(value?.alert),
    checkboxText: faker.lorem.paragraph(),
    primaryAction: 'READ',
    secondaryAction: 'CANCEL',
    ...value,
  }
}

export function fakeAlert(value?: Partial<Alert>): Alert {
  return {
    text: faker.lorem.sentence(),
    type: 'INFO',
    ...value,
  }
}
