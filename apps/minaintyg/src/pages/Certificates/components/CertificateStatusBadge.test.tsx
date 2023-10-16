import { render } from '@testing-library/react'
import { CertificateStatus, CertificateStatusEnum } from '../../../schema/certificateList.schema'
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

it('Should not return a badge for unknown status', () => {
  const { container } = render(<CertificateStatusBadge status={'FOASDASD' as CertificateStatus} />)
  expect(container).toBeEmptyDOMElement()
})
