import { CertificateStatusEnum } from '../../../schema/certificateList.schema'
import { getStatusBadgeLabel } from './getStatusBadgeLabel'

it.each([
  [CertificateStatusEnum.enum.NEW, 'Nytt'],
  [CertificateStatusEnum.enum.REPLACED, 'Ersätter intyg'],
  [CertificateStatusEnum.enum.SENT, 'Skickat'],
  [CertificateStatusEnum.enum.NOT_SENT, 'Ej skickat'],
])('Should print %s for status %s', (status, expected) => {
  expect(getStatusBadgeLabel(status)).toBe(expected)
})
