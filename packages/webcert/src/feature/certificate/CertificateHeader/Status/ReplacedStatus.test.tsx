import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import ReplacedStatus from './ReplacedStatus'
import { CertificateMetadata, CertificateStatus } from '@frontend/common'
import { BrowserRouter } from 'react-router-dom'

const mockMetadata: CertificateMetadata = {
  relations: { children: [{ certificateId: 'test' }] },
}

it('displays that the certificate is replaced by a signed certificate', () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const isLockedSpy = jest.spyOn(utils, 'isLocked')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')

  isReplacedSpy.mockReturnValue(true)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.SIGNED)
  isLockedSpy.mockReturnValue(false)

  render(
    <BrowserRouter>
      <ReplacedStatus certificateMetadata={mockMetadata} />
    </BrowserRouter>
  )
  expect(screen.getByText(/Intyget har ersatts av/i)).toBeInTheDocument()
})

it('displays that the certificate is replaced by an unsigned certificate', async () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')
  const isLockedSpy = jest.spyOn(utils, 'isLocked')

  isReplacedSpy.mockReturnValue(true)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.UNSIGNED)
  isLockedSpy.mockReturnValue(false)

  render(
    <BrowserRouter>
      <ReplacedStatus certificateMetadata={mockMetadata} />
    </BrowserRouter>
  )
  expect(screen.getByText(/Det finns redan ett påbörjat utkast som ska ersätta detta intyg/i)).toBeInTheDocument()
})

it('displays that the certificate is replaced by a revoked certificate', async () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')
  const isLockedSpy = jest.spyOn(utils, 'isLocked')

  isReplacedSpy.mockReturnValue(true)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.REVOKED)
  isLockedSpy.mockReturnValue(false)

  render(
    <BrowserRouter>
      <ReplacedStatus certificateMetadata={mockMetadata} />
    </BrowserRouter>
  )
  expect(screen.getByText(/Intyget ersattes av ett intyg som nu är makulerat./i)).toBeInTheDocument()
})

it('doesnt render anything', async () => {
  const isReplacedSpy = jest.spyOn(utils, 'isReplaced')
  const getReplacedCertificateStatusSpy = jest.spyOn(utils, 'getReplacedCertificateStatus')
  const isLockedSpy = jest.spyOn(utils, 'isLocked')

  isReplacedSpy.mockReturnValue(false)
  getReplacedCertificateStatusSpy.mockReturnValue(CertificateStatus.SIGNED)
  isLockedSpy.mockReturnValue(false)

  render(
    <BrowserRouter>
      <ReplacedStatus certificateMetadata={mockMetadata} />
    </BrowserRouter>
  )
  expect(screen.queryByText(/Intyget har ersatts av/i)).not.toBeInTheDocument()
})
