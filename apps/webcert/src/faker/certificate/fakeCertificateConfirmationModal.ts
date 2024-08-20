import faker from 'faker'
import { CertificateConfirmationModal } from '../../types/confirmModal'

export function fakeCertificateConfirmationModal(value?: Partial<CertificateConfirmationModal>): CertificateConfirmationModal {
  return {
    title: faker.lorem.sentence(),
    text: faker.lorem.paragraphs(),
    alert: faker.lorem.paragraph(),
    checkboxText: faker.lorem.paragraph(),
    primaryAction: 'READ',
    secondaryAction: 'CANCEL',
    ...value,
  }
}
