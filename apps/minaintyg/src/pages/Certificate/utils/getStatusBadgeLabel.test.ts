import { expect, it } from 'vitest'
import { getStatusBadgeLabel } from './getStatusBadgeLabel'
import { CertificateStatusEnum } from '../../../schema/certificate.schema'

it.each([
  [CertificateStatusEnum.enum.NEW, 'Nytt'],
  [CertificateStatusEnum.enum.REPLACED, 'Ersatt'],
  [CertificateStatusEnum.enum.SENT, 'Skickat'],
  [CertificateStatusEnum.enum.NOT_SENT, 'Ej skickat'],
])('Should print %s for status %s', (status, expected) => {
  expect(getStatusBadgeLabel(status)).toBe(expected)
})
