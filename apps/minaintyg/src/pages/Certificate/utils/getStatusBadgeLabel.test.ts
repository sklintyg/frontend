import { CertificateStatusEnum } from '../../../schema/certificate.schema'
import { getStatusBadgeLabel } from './getStatusBadgeLabel'

it.each([
  [CertificateStatusEnum.enum.NEW, 'Nytt'],
  [CertificateStatusEnum.enum.REPLACED, 'Ersatt'],
  [CertificateStatusEnum.enum.SENT, 'Skickat'],
  [CertificateStatusEnum.enum.NOT_SENT, 'Ej skickat'],
])('Should print %s for status %s', (status, expected) => {
  expect(getStatusBadgeLabel(status)).toBe(expected)
})
