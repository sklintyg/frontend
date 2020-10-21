import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import ReplacedStatus from './ReplacedStatus'
import { CertificateStatus } from '@frontend/common'

it('displays that the certificate is replaced by a signed certificate', () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')

  isReplacedSpy.mockReturnValue(true)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.SIGNED)

  // @ts-expect-error we don't need to send all props
  render(<ReplacedStatus />)
  expect(screen.getByText(/Intyget har ersatts av/i)).toBeInTheDocument()
})

it('displays that the certificate is replaced by an unsigned certificate', async () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')

  isReplacedSpy.mockReturnValue(true)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.UNSIGNED)

  // @ts-expect-error we don't need to send all props
  render(<ReplacedStatus />)
  expect(screen.getByText(/Det finns redan ett påbörjat utkast som ska ersätta detta intyg/i)).toBeInTheDocument()
})

it('displays that the certificate is replaced by a revoked certificate', async () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')

  isReplacedSpy.mockReturnValue(true)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.REVOKED)

  // @ts-expect-error we don't need to send all props
  render(<ReplacedStatus />)
  expect(screen.getByText(/Intyget ersattes av ett intyg som nu är makulerat./i)).toBeInTheDocument()
})

it('doesnt render anything', async () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')

  isReplacedSpy.mockReturnValue(false)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.SIGNED)

  // @ts-expect-error we don't need to send all props
  render(<ReplacedStatus />)
  expect(screen.queryByText(/Intyget har ersatts av/i)).not.toBeInTheDocument()
})
