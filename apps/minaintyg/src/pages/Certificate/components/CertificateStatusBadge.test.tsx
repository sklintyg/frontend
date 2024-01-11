import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CertificateStatusBadge, getBadgeType } from './CertificateStatusBadge'
import { CertificateStatus, CertificateStatusEnum } from '../../../schema/certificate.schema'

it('Should render component', () => {
  const { container } = render(<CertificateStatusBadge status={CertificateStatusEnum.enum.NEW} />)
  expect(container).toMatchSnapshot()
})

it.each([
  [CertificateStatusEnum.enum.NEW, 'primary'],
  [CertificateStatusEnum.enum.SENT, 'success'],
  [CertificateStatusEnum.enum.NOT_SENT, 'error'],
  [CertificateStatusEnum.enum.REPLACED, 'neutral'],
])('Should return %s for certificate status %s', (status, expected) => {
  expect(getBadgeType(status)).toBe(expected)
})

it('Should not return a badge for unknown status', () => {
  const { container } = render(<CertificateStatusBadge status={'FOASDASD' as CertificateStatus} />)
  expect(container).toBeEmptyDOMElement()
})
