import { render } from '@testing-library/react'
import { CertificateStatus } from '../../../schema/certificateList.schema'
import { CertificateStatusBadge, getBadgeType } from './CertificateStatusBadge'

it('Should render component', () => {
  const { baseElement } = render(<CertificateStatusBadge status={CertificateStatus.NEW} />)
  expect(baseElement).toMatchSnapshot()
})

it('Should return primary for certificate status "new"', () => {
  expect(getBadgeType(CertificateStatus.NEW)).toBe('primary')
})

it('Should return success for certificate status "sent"', () => {
  expect(getBadgeType(CertificateStatus.SENT)).toBe('success')
})

it('Should return error for certificate status "not sent"', () => {
  expect(getBadgeType(CertificateStatus.NOT_SENT)).toBe('error')
})

it('Should return secondary for certificate status "replace"', () => {
  expect(getBadgeType(CertificateStatus.REPLACE)).toBe('secondary')
})
