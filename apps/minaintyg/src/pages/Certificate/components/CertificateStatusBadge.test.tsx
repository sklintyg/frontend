import { render, screen } from '@testing-library/react'
import { CertificateStatus, CertificateStatusEnum } from '../../../schema/certificate.schema'
import { CertificateStatusBadge, getBadgeType } from './CertificateStatusBadge'

it('Should render component', () => {
  const { baseElement } = render(<CertificateStatusBadge status={CertificateStatusEnum.enum.NEW} />)
  expect(baseElement).toMatchSnapshot()
})

it.each([
  [CertificateStatusEnum.enum.NEW, 'primary'],
  [CertificateStatusEnum.enum.SENT, 'success'],
  [CertificateStatusEnum.enum.NOT_SENT, 'error'],
  [CertificateStatusEnum.enum.REPLACED, 'secondary'],
])('Should return %s for certificate status %s', (status, expected) => {
  expect(getBadgeType(status)).toBe(expected)
})

it.each([
  [CertificateStatusEnum.enum.NEW, 'Nytt'],
  [CertificateStatusEnum.enum.REPLACED, 'Ersätter intyg'],
  [CertificateStatusEnum.enum.SENT, 'Skickat'],
  [CertificateStatusEnum.enum.NOT_SENT, 'Ej skickat'],
])('Should print %s for status %s', (status, expected) => {
  render(<CertificateStatusBadge status={status} />)
  expect(screen.getByText(expected)).toBeInTheDocument()
})

it('Should not return a badge for unknown status', () => {
  const { container } = render(<CertificateStatusBadge status={'FOASDASD' as CertificateStatus} />)
  expect(container).toBeEmptyDOMElement()
})
